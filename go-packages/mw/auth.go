package mw

import (
	"errors"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"

	jwt "github.com/dgrijalva/jwt-go"
)

// These are the claims that the JWT expects to find in the token
// package dbc must make sure it sends the same claims for the json
type customToken struct {
	User        string `json:"user"`
	AccessLevel int    `json:"access_level"`
	jwt.StandardClaims
}

var errTokenExpired = errors.New("jwt expired")
var errInvalidToken = errors.New("the jwt is not valid")

// BasicAuth is the authorization middleware for get routes that provide information
// about a specific student. It will make sure that the studetn can only view their own results
// and not another students personal information. Inaddition this function will give
// staff access to the API so they can see student information as well.
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
			if err == errTokenExpired {
				http.Error(w, "The token has expired", http.StatusUnauthorized)
			}
			if err == errInvalidToken {
				http.Error(w, "Invalid JWT", http.StatusUnauthorized)
			}
			http.Error(w, "We were unable to validate your token.", http.StatusUnauthorized)
			return
		}

		switch claims.AccessLevel {
		// student can only view their own data
		case 1:
			vars := mux.Vars(r)
			if claims.User == vars["user"] {
				next.ServeHTTP(w, r)
			} else {
				http.Error(w, "You don't have the authority to access that resource", http.StatusUnauthorized)
				return
			}
		// staff can view all data
		case 2, 3:
			next.ServeHTTP(w, r)
			return
		}
	})
}

// Uses the JWT package to validate the token.
// It makes sure that the token was created using the method we have chosen.
// In our case it must be an HMAC.
// It also makes usre we can parse the claims that were made in the token.
// If an error is encountered it will return an empty token.
func validateJWT(token string) (customToken, error) {
	t, err := jwt.ParseWithClaims(token, &customToken{}, func(token *jwt.Token) (interface{}, error) {
		// Make sure we have the same method as when signing the token
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}
		return []byte("AllYourBase"), nil
	})

	if err != nil {
		if val, ok := err.(jwt.ValidationError); ok {
			if val.Errors == jwt.ValidationErrorExpired {
				return customToken{}, errTokenExpired
			}
		}
		return customToken{}, err
	}

	// Parse and check claims validity
	if claims, ok := t.Claims.(*customToken); ok && t.Valid {
		return *claims, nil
	}

	return customToken{}, errors.New("we encountered an unexpected problem")
}
