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
	getStudentModules := func(time, user string) ([]map[string]string, error) { return dbc.GetModulesList(db, time, user) }
	getStudentCwk := func(t, user string) ([]map[string]string, error) { return dbc.GetStudentCwk(db, t, user) }
	getStaffPro := func(str string) (map[string]string, error) { return dbc.GetProfile(db, "staff", str) }
	getStaffModules := func(str string) ([]map[string]string, error) { return dbc.GetModulesList(db, "staff", str) }
	getStaffTutees := func(str string) ([]map[string]string, error) { return dbc.GetStaffTutees(db, str) }

	r := mux.NewRouter()
	r.Handle("/get/salt/{user}", hand.GetSalt(singleParamQuery)).Methods("GET")
	r.Handle("/get/token/{user}", hand.GetToken(genAuthtoken)).Methods("GET")
	r.Handle("/get/student/profile/{user}", mw.BasicAuth(hand.GetProfile(getStudentPro))).Methods("GET")
	r.Handle("/get/student/modules/{time}/{user}", mw.BasicAuth(hand.GetStudentModules(getStudentModules))).Methods("GET")
	r.Handle("/get/student/cwk/{type}/{user}", mw.BasicAuth(hand.GetStudentCwk(getStudentCwk))).Methods("GET")

	r.Handle("/get/staff/profile/{user}", hand.GetProfile(getStaffPro)).Methods("GET")
	r.Handle("/get/staff/modules/{user}", hand.GetStaffModules(getStaffModules)).Methods("GET")
	r.Handle("/get/staff/tutees/{user}", hand.GetStaffTutees(getStaffTutees)).Methods("GET")

	// Routes in place for testing purposes
	r.Handle("/test/auth/{user}", mw.BasicAuth(test()))
	r.Handle("/ping", test())

	// static file server
	r.PathPrefix("/student").Handler(http.StripPrefix("/student", http.FileServer(http.Dir("build/")))).Methods("GET")
	r.PathPrefix("/staff").Handler(http.StripPrefix("/staff", http.FileServer(http.Dir("build/")))).Methods("GET")
	r.PathPrefix("/").Handler(http.FileServer(http.Dir("build/"))).Methods("GET")
	// r.PathPrefix("/").Handler(http.FileServer(http.Dir("build/")))

	// r.PathPrefix("/").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	// 	w.Write([]byte("sgjsfgjsfgjsgfj"))
	// })

	// listen on the router
	http.Handle("/", r)

	log.Println(http.ListenAndServe(":"+port, nil))
}

func test() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("ok"))
	})
}
