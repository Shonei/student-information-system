package mw

import (
	"errors"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"

	jwt "github.com/dgrijalva/jwt-go"
)

type CustomToken struct {
	User        string `json:"user"`
	AccessLevel int    `json:"access_level"`
	jwt.StandardClaims
}

// BasicAuth is the authorization middleware for get routes
// that accept a /{user} in the url. It compares the user from the url and the
// user in the token and data in the database. It grants access to people that
// have a hign enought level or are the owner of that information.
func BasicAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		token, err := r.Cookie("token")
		if err != nil {
			log.Println(err)
			http.Error(w, "Cookie missing.", http.StatusBadRequest)
			return
		}

		claims, err := validateJWT(token.Value)
		if err != nil {
			log.Println(err)
			http.Error(w, "Invalid JWT", http.StatusUnauthorized)
			return
		}

		switch claims.AccessLevel {
		case 1:
			vars := mux.Vars(r)
			if claims.User == vars["user"] {
				next.ServeHTTP(w, r)
			} else {
				http.Error(w, "You don't have the authority to access that resource", http.StatusUnauthorized)
				return
			}
		case 2, 3:
			next.ServeHTTP(w, r)
			return
		}
	})
}

func validateJWT(token string) (CustomToken, error) {
	t, err := jwt.ParseWithClaims(token, &CustomToken{}, func(token *jwt.Token) (interface{}, error) {

		// Make sure we have the same method as when signing the token
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}
		return []byte("AllYourBase"), nil
	})

	if err != nil {
		return CustomToken{}, err
	}

	if claims, ok := t.Claims.(*CustomToken); ok && t.Valid {
		return *claims, nil
	}

	return CustomToken{}, errors.New("we encountered an unexpected problem")
}
