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
	connStr := os.Getenv("DATABASE_URL")
	port := os.Getenv("PORT")

	temp, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}

	db := &dba.DB{temp}
	defer db.Close()

	checkToken := func(str string) (int, error) { return dbc.CheckToken(db, str) }
	singleParamQuery := func(user string) (string, error) { return dbc.SingleParamQuery(db, "salt", user) }
	genAuthtoken := func(user, hash string) (map[string]string, error) { return dbc.GenAuthToken(db, user, hash) }
	getStudentPro := func(str string) (map[string]string, error) { return dbc.GetStudentPro(db, str) }
	getStudentModules := func(time, user string) ([]map[string]string, error) { return dbc.GetStudentModules(db, time, user) }
	getStudentCwk := func(t, user string) ([]map[string]string, error) { return dbc.GetStudentCwk(db, t, user) }

	r := mux.NewRouter()
	r.Handle("/", http.FileServer(http.Dir("build")))
	r.Handle("/get/salt/{user}", hand.GetSalt(singleParamQuery)).Methods("GET", "POST")
	r.Handle("/get/token/{user}", hand.GetToken(genAuthtoken)).Methods("GET", "POST")
	r.Handle("/get/student/profile/{user}", mw.BasicAuth(checkToken, hand.GetStudentPro(getStudentPro))).Methods("GET", "POST")
	r.Handle("/get/student/modules/{time}/{user}", mw.BasicAuth(checkToken, hand.GetStudentModules(getStudentModules))).Methods("GET", "POST")
	r.Handle("/get/student/cwk/{type}/{user}", mw.BasicAuth(checkToken, hand.GetStudentCwk(getStudentCwk))).Methods("GET", "POST")

	// Routes in place for testing purposes
	r.Handle("/test/auth/{user}", mw.BasicAuth(checkToken, test()))
	r.Handle("/ping", test())

	// Cron timed command to clean the timedout tokes
	c := cron.New()
	c.AddFunc("@every 10m", func() {
		dbc.TokenCleanUp(db)
		fmt.Println("cron ran")
	})
	c.Start()

	http.Handle("/", r)

	log.Println(http.ListenAndServe(":"+port, nil))
}

func test() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("ok"))
	})
}
