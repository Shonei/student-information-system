package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/Shonei/student-information-system/go-packages/dbc"

	"github.com/robfig/cron"

	"github.com/Shonei/student-information-system/go-packages/mw"

	"github.com/Shonei/student-information-system/go-packages/hand"

	"github.com/Shonei/student-information-system/go-packages/dba"

	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
)

func main() {
	connStr := os.Getenv("POSTGRES_CONNECTION")
	temp, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}

	db := &dba.DB{temp}
	defer db.Close()

	r := mux.NewRouter()
	r.Handle("/", http.FileServer(http.Dir("build")))
	r.Handle("/get/salt/{user}", hand.GetSalt(db)).Methods("GET", "POST")
	r.Handle("/get/token/{user}", hand.GetToken(db)).Methods("POST")

	r.Handle("/test/auth/{user}", mw.BasicAuth(func(str string) (int, error) {
		return dbc.CheckToken(db, str)
	}, test()))

	c := cron.New()
	c.AddFunc("@every 10m", func() {
		dbc.TokenCleanUp(db)
		fmt.Println("cron ran")
	})
	c.Start()
	http.Handle("/", r)
	http.ListenAndServe(":8080", nil)
	// http.ListenAndServeTLS(":8080", "cert.pem", "key.pem", nil)
}

func test() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("ok"))
	})
}
