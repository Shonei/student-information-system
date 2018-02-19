package hand

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/Shonei/student-information-system/go-packages/utils"
)

func Update(f func(utils.CwkUpdate) error) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cwk := utils.CwkUpdate{}
		if err := json.NewDecoder(r.Body).Decode(&cwk); err != nil {
			log.Println(err)
			http.Error(w, "We couldn't read the data.", http.StatusBadRequest)
			return
		}

		if err := f(cwk); err != nil {
			log.Println(err)
			http.Error(w, "We were unable to update the students cwk results.", http.StatusInternalServerError)
			return
		}
	})
}

func UpdateExam(f func(utils.Exam) error) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		exam := utils.Exam{}
		if err := json.NewDecoder(r.Body).Decode(&exam); err != nil {
			log.Println(err)
			http.Error(w, "We couldn't read the data.", http.StatusBadRequest)
			return
		}

		if err := f(exam); err != nil {
			log.Println(err)
			http.Error(w, "We were unable to update the exam percentage.", http.StatusInternalServerError)
			return
		}
	})
}

func UpdateCwk(f func(utils.Cwk) error) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cwk := utils.Cwk{}
		if err := json.NewDecoder(r.Body).Decode(&cwk); err != nil {
			log.Println(err)
			http.Error(w, "We couldn't read the data.", http.StatusBadRequest)
			return
		}

		if err := f(cwk); err != nil {
			log.Println(err)
			http.Error(w, "We were unable to update the exam percentage.", http.StatusInternalServerError)
			return
		}
	})
}
