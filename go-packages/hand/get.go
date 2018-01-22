package hand

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/Shonei/student-information-system/go-packages/dbc"

	"github.com/gorilla/mux"
)

// GetSalt will match the /get/salt/{user} route.
// It will be providing the salt for the password of a user.
func GetSalt(f func(string) (string, error)) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)

		// salt, err := dbc.SingleParamQuery(db, "salt", vars["user"])
		salt, err := f(vars["user"])
		if err != nil {
			if val, ok := err.(*dbc.TokenError); ok {
				http.Error(w, val.Message, val.HttpCode)
				return
			}
			http.Error(w, "We encountered an error. Please try again.", http.StatusInternalServerError)
			return
		}

		m := map[string]string{"salt": salt}
		err = json.NewEncoder(w).Encode(m)
		if err != nil {
			http.Error(w, "We were unable to parse the salt.", http.StatusBadRequest)
		}
	})
}

// GetToken will match the /get/token/{user} route.
// It will authenticate a user and send him the authorizaton token
// that he will need to use for future requests.
// The route will expect the header Authorization: {password}.
// The password should be the hash value using sha512
func GetToken(f func(string, string) (string, error)) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)

		hash := r.Header.Get("Authorization")
		// token, err := dbc.GenAuthToken(db, vars["user"], hash)
		token, err := f(vars["user"], hash)
		if err != nil {
			if val, ok := err.(*dbc.TokenError); ok {
				http.Error(w, val.Message, val.HttpCode)
				return
			}
			http.Error(w, "We encountered an error. Please try again.", http.StatusInternalServerError)
			return
		}

		// Create and write json responce sending the token
		m := map[string]string{"token": token}
		err = json.NewEncoder(w).Encode(m)
		if err != nil {
			http.Error(w, "We were unable to parse the token.", http.StatusInternalServerError)
			return
		}
	})
}

// GetStudentPro will match the /get/student/profile/{user} path.
// It will return the information about a given student.
// This will include only his personal information(e.g. email, usernmae) and
// not information about his studies.
func GetStudentPro(f func(string) (map[string]string, error)) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		fmt.Println(vars)
		m, err := f(vars["user"])
		if err != nil {
			http.Error(w, "We were unable to retrieve the profile.", http.StatusInternalServerError)
			return
		}

		err = json.NewEncoder(w).Encode(m)
		if err != nil {
			http.Error(w, "We encountered an error parsing the students profile", http.StatusInternalServerError)
			return
		}
	})
}
