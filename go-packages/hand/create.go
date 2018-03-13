package hand

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/Shonei/student-information-system/go-packages/utils"
)

// Create handles request that create new data in the database.
// It reads in the data from the request and calls the function that makes use of it.
func Create(d utils.DecoderCreator, f func(utils.DecoderCreator) error) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if err := d.Decode(json.NewDecoder(r.Body)); err != nil {
			log.Println("Decode err - ", err)
			http.Error(w, "We couldn't read the data.", http.StatusBadRequest)
			return
		}

		if err := f(d); err != nil {
			log.Println(err)
			http.Error(w, "We were unable to update the exam percentage.", http.StatusInternalServerError)
			return
		}
	})
}
