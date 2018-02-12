package hand

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/Shonei/student-information-system/go-packages/utils"

	"github.com/gorilla/mux"
)

// GetSalt will match the /get/salt/{user} route.
// It will be providing the salt for the password of a user.
func GetSalt(f func(string) (string, error)) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)

		salt, err := f(vars["user"])
		if err != nil {
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

// GetToken will match the /get/token/{user} route. It will authenticate a user
// and send him the authorizaton token that he will need to use for future requests.
// The route will expect the header Authorization: {password}. The password should
// be the hash value using sha512. The function arguments needs to be a function that
// validates the password and username and sends back a token that will be send over.
func GetToken(f func(string, string) (map[string]string, error)) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)

		hash := r.Header.Get("Authorization")
		// token, err := dbc.GenAuthToken(db, vars["user"], hash)
		token, err := f(vars["user"], hash)
		if err != nil {
			log.Println(err)
			http.Error(w, "We encountered an error. Please try again.", http.StatusInternalServerError)
			return
		}

		// Create and write json responce sending the token
		// m := map[string]string{"token": token}
		err = json.NewEncoder(w).Encode(token)
		if err != nil {
			http.Error(w, "We were unable to parse the token.", http.StatusInternalServerError)
			return
		}
	})
}

// GetProfile matches the /get/student/profile/{user} and /get/staff/profile/{user}
// endpoints. It will read in a user and format the profile for that given user.
// The output will be a basic JSON responce containing a single object.
func GetProfile(f func(string) (map[string]string, error)) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)

		m, err := f(vars["user"])
		if err != nil {
			switch err {
			case utils.ErrSuspiciousInput:
				http.Error(w, "Input contains special characters.", http.StatusBadRequest)
			case utils.ErrUnexpectedChoice:
			default:
				http.Error(w, "We were unable to retrieve the profile.", http.StatusInternalServerError)
			}
			return
		}

		err = json.NewEncoder(w).Encode(m)
		if err != nil {
			http.Error(w, "We encountered an error parsing the students profile", http.StatusInternalServerError)
			return
		}
	})
}

// BasicGet will match endpoints where there is only a single parameter in the
// form of a user. All responces from this function are going to be in the forme of
// an array consisting of JSON objects or an http error and a text messagi
// giving more information about the error that was encountered.
func BasicGet(f func(string) ([]map[string]string, error)) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)

		m, err := f(vars["user"])
		if err != nil {
			log.Println(err)
			// check error type and return
			switch err {
			case utils.ErrSuspiciousInput:
				http.Error(w, "Input contains special characters.", http.StatusBadRequest)
			case utils.ErrUnexpectedChoice:
			default:
				http.Error(w, "We encountered an unexpected error retrieving the data.", http.StatusInternalServerError)
			}
			return
		}

		if err = json.NewEncoder(w).Encode(m); err != nil {
			http.Error(w, "We cound't encode the retrieved information.", http.StatusInternalServerError)
			return
		}
	})
}
