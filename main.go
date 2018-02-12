package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"

	"github.com/Shonei/student-information-system/go-packages/dbc"
	"github.com/Shonei/student-information-system/go-packages/utils"

	"github.com/Shonei/student-information-system/go-packages/mw"

	"github.com/Shonei/student-information-system/go-packages/hand"

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

	db := &utils.DB{temp}
	defer db.Close()

	singleParamQuery := func(user string) (string, error) { return dbc.SingleParamQuery(db, "salt", user) }
	genAuthtoken := func(user, hash string) (map[string]string, error) { return dbc.GenAuthToken(db, user, hash) }

	getStudentPro := func(str string) (map[string]string, error) { return dbc.GetProfile(db, "student", str) }
	getCwkResults := func(user string) ([]map[string]string, error) { return dbc.GetStudentCwk(db, "results", user) }
	getCwkTimetable := func(user string) ([]map[string]string, error) { return dbc.GetStudentCwk(db, "timetable", user) }
	getNowModules := func(user string) ([]map[string]string, error) { return dbc.GetModulesList(db, "now", user) }
	getPastModules := func(user string) ([]map[string]string, error) { return dbc.GetModulesList(db, "past", user) }

	getStaffPro := func(str string) (map[string]string, error) { return dbc.GetProfile(db, "staff", str) }
	getStaffModules := func(str string) ([]map[string]string, error) { return dbc.GetStaffModules(db, str) }
	getStaffTutees := func(str string) ([]map[string]string, error) { return dbc.GetStaffTutees(db, str) }

	r := mux.NewRouter()
	// Universal routes
	r.Handle("/get/salt/{user}", hand.GetSalt(singleParamQuery)).Methods("GET")
	r.Handle("/get/token/{user}", hand.GetToken(genAuthtoken)).Methods("GET")

	// Studetn part of the API
	r.Handle("/get/student/profile/{user}", mw.BasicAuth(hand.GetProfile(getStudentPro))).Methods("GET")
	r.Handle("/get/student/cwk/timetable/{user}", mw.BasicAuth(hand.BasicGet(getCwkTimetable))).Methods("GET")
	r.Handle("/get/student/cwk/results/{user}", mw.BasicAuth(hand.BasicGet(getCwkResults))).Methods("GET")
	r.Handle("/get/student/modules/now/{user}", mw.BasicAuth(hand.BasicGet(getNowModules))).Methods("GET")
	r.Handle("/get/student/modules/past/{user}", mw.BasicAuth(hand.BasicGet(getPastModules))).Methods("GET")

	// Staff API
	r.Handle("/get/staff/profile/{user}", mw.BasicAuth(hand.GetProfile(getStaffPro))).Methods("GET")
	r.Handle("/get/staff/modules/{user}", mw.BasicAuth(hand.BasicGet(getStaffModules))).Methods("GET")
	r.Handle("/get/staff/tutees/{user}", mw.BasicAuth(hand.BasicGet(getStaffTutees))).Methods("GET")

	// Routes in place for testing purposes
	r.Handle("/test/auth/{user}", mw.BasicAuth(test()))
	r.Handle("/ping", test())

	// static file server
	r.PathPrefix("/student").Handler(http.StripPrefix("/student", http.FileServer(http.Dir("build/")))).Methods("GET")
	r.PathPrefix("/staff").Handler(http.StripPrefix("/staff", http.FileServer(http.Dir("build/")))).Methods("GET")
	r.PathPrefix("/").Handler(http.FileServer(http.Dir("build/"))).Methods("GET")

	// listen on the router
	http.Handle("/", r)

	log.Println(http.ListenAndServe(":"+port, nil))
}

func test() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("ok"))
	})
}
