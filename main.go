package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"

	"github.com/Shonei/student-information-system/go-packages/go-middleware"

	"github.com/Shonei/student-information-system/go-packages/go-handlers"

	dba "github.com/Shonei/student-information-system/go-packages/go-DB-abstraction"

	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
)

func main() {
	connStr := os.Getenv("POSTGRES_CONNECTION")
	// connStr := "user=shyl password=rz9h19cg dbname=sis sslmode=disable"
	temp, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}

	db := dba.DB{temp}
	defer db.Close()

	r := mux.NewRouter()
	r.Handle("/", http.FileServer(http.Dir("build")))
	r.Handle("/get/salt/{user}", hand.GetSalt(db)).Methods("GET", "POST")
	r.Handle("/get/token/{user}", hand.GetToken(db)).Methods("POST")

	r.Handle("/test/auth/{user}", mdw.BasicAuth(db, test()))

	http.Handle("/", r)
	http.ListenAndServe(":8080", nil)
	// http.ListenAndServeTLS(":8080", "cert.pem", "key.pem", nil)
}

func test() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("ok"))
	})
}
