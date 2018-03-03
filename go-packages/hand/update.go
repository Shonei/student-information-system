package hand

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/Shonei/student-information-system/go-packages/utils"
)

// Update handles update request for the Databse.
// It handles creating a JSON decoder and passing it to the DecoderExecuter
// and then calling the f function to write the data to the databse
func Update(d utils.DecoderExecuter, f func(utils.DecoderExecuter) error) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if err := d.Decode(json.NewDecoder(r.Body)); err != nil {
			log.Println("Decode err - ", err)
			http.Error(w, "We couldn't read the data.", http.StatusBadRequest)
			return
		}

		if err := f(d); err != nil {
			log.Println(err)
			http.Error(w, "We were unable to update the databse at this moment.", http.StatusInternalServerError)
			return
		}
	})
}
