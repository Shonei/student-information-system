package mdw

import (
	"log"
	"net/http"
)

// Log provides console logging information for
// http request. It displayes the information that was requested.
func Log(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("- request to - '%v' made by - '%s'", r.URL.Path, r.Host)
		next.ServeHTTP(w, r)
	})
}
