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
			writeError(w, err)
			return
		}

		writeJOSN(w, m)
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
			writeError(w, err)
			return
		}

		writeJOSN(w, m)
	})
}

// GetSearch is the search endpoint matching /search/{query} endpoint.
// The succesful output of this will be a JSON object containing 4 properties for
// staff, students, modules and programmes.
func GetSearch(f func(string) (map[string][]map[string]string, error)) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)

		m, err := f(vars["query"])
		if err != nil {
			writeError(w, err)
			return
		}

		writeJOSN(w, m)
	})
}

// GetForModule might be removed later on
func GetForModule(f func(string) (utils.Module, error)) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)

		m, err := f(vars["code"])
		if err != nil {
			writeError(w, err)
			return
		}

		writeJOSN(w, m)
	})
}

// GetForCode is the same as BasicGet but it reads a different parameter
// GetForCode expects to find a {code} parameter in the URL.
func GetForCode(f func(string) ([]map[string]string, error)) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)

		m, err := f(vars["code"])
		if err != nil {
			writeError(w, err)
			return
		}

		writeJOSN(w, m)
	})
}

// Writes the interface as a json encoded string to the http responce.
// if the JSON couldn't be parsed it writes a http 500
// Internal Server Error to the responce.
// Developers have to make sure to call this function last.
func writeJOSN(w http.ResponseWriter, v interface{}) {
	if err := json.NewEncoder(w).Encode(v); err != nil {
		http.Error(w, "We cound't encode the retrieved information.", http.StatusInternalServerError)
		return
	}
}

// writes the error recieved from the function that interacts with a database
// it write the error to the http.ResponseWrite and because of that
// you have to make sure to not write anything elso to it after that
func writeError(w http.ResponseWriter, err error) {
	log.Println(err)
	// check error type and return
	switch err {
	case utils.ErrSuspiciousInput:
		http.Error(w, "Input contains special characters.", http.StatusBadRequest)
	case utils.ErrToManyRows:
		// confuse attacker with misleading messeges.
		http.Error(w, "No matches for input.", http.StatusBadRequest)
	default:
		http.Error(w, "We encountered an unexpected error retrieving the data.", http.StatusInternalServerError)
	}
}
