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

	// All users closures
	singleParamQuery := func(user string) (string, error) {
		return dbc.SingleParamQuery(db, "salt", user)
	}
	genAuthtoken := func(user, hash string) (map[string]string, error) {
		return dbc.GenAuthToken(db, user, hash)
	}

	// Student closures
	getStudentPro := func(str string) (map[string]string, error) {
		return dbc.RunSingleRowQuery(db, "SELECT * FROM get_student_profile($1);", str)
	}
	getCwkResults := func(user string) ([]map[string]string, error) {
		return dbc.RunMultyRowQuery(db, "SELECT * FROM get_student_cwk_results($1);", user)
	}
	getCwkTimetable := func(user string) ([]map[string]string, error) {
		return dbc.RunMultyRowQuery(db, "SELECT * FROM get_student_cwk_timetable($1);", user)
	}
	getNowModules := func(user string) ([]map[string]string, error) {
		return dbc.RunMultyRowQuery(db, "SELECT * FROM get_student_current_modules($1);", user)
	}
	getPastModules := func(user string) ([]map[string]string, error) {
		return dbc.RunMultyRowQuery(db, "SELECT * FROM get_student_past_modules($1);", user)
	}

	// Staff closures
	getStaffPro := func(str string) (map[string]string, error) {
		return dbc.RunSingleRowQuery(db, "SELECT * FROM get_staff_profile($1);", str)
	}
	getStaffModules := func(str string) ([]map[string]string, error) {
		return dbc.RunMultyRowQuery(db, "SELECT * FROM get_staff_modules($1);", str)
	}
	getStaffTutees := func(str string) ([]map[string]string, error) {
		return dbc.RunMultyRowQuery(db, "SELECT * FROM get_staff_tutees($1);", str)
	}
	getModuleDetails := func(str string) (utils.Module, error) {
		return dbc.GetModuleDetails(db, "SELECT * FROM get_module_details($1);", str)
	}
	getCourseworkDetails := func(str string) ([]map[string]string, error) {
		return dbc.RunMultyRowQuery(db, "SELECT * FROM get_cwk_details($1);", str)
	}
	getStudentsOnCwk := func(str string) ([]map[string]string, error) {
		return dbc.RunMultyRowQuery(db, "SELECT * FROM get_cwk_students($1);", str)
	}
	search := func(str string) (map[string][]map[string]string, error) {
		return dbc.Search(db, str)
	}
	updateCwk := func(cwk utils.CwkUpdate) error {
		return dbc.UpdateCwkResults(db, cwk)
	}

	r := mux.NewRouter()
	// Universal routes
	r.Handle("/get/salt/{user}", hand.GetSalt(singleParamQuery)).Methods("GET")
	r.Handle("/get/token/{user}", hand.GetToken(genAuthtoken)).Methods("GET")

	// Student part of the API
	r.Handle("/get/student/profile/{user}", mw.BasicAuth(hand.GetProfile(getStudentPro))).Methods("GET")
	r.Handle("/get/student/cwk/timetable/{user}", mw.BasicAuth(hand.BasicGet(getCwkTimetable))).Methods("GET")
	r.Handle("/get/student/cwk/results/{user}", mw.BasicAuth(hand.BasicGet(getCwkResults))).Methods("GET")
	r.Handle("/get/student/modules/now/{user}", mw.BasicAuth(hand.BasicGet(getNowModules))).Methods("GET")
	r.Handle("/get/student/modules/past/{user}", mw.BasicAuth(hand.BasicGet(getPastModules))).Methods("GET")

	// Staff API
	r.Handle("/get/staff/profile/{user}", mw.StaffOnly(hand.GetProfile(getStaffPro))).Methods("GET")
	r.Handle("/get/staff/modules/{user}", mw.StaffOnly(hand.BasicGet(getStaffModules))).Methods("GET")
	r.Handle("/get/staff/tutees/{user}", mw.StaffOnly(hand.BasicGet(getStaffTutees))).Methods("GET")
	r.Handle("/get/module/{code}", hand.GetForModule(getModuleDetails)).Methods("GET")
	r.Handle("/get/cwk/{code}", hand.GetForCode(getCourseworkDetails)).Methods("GET")
	r.Handle("/get/cwk/students/{code}", hand.GetForCode(getStudentsOnCwk)).Methods("GET")
	r.Handle("/search/{query}", hand.GetSearch(search)).Methods("GET")
	r.Handle("/update/cwk/results", hand.Update(updateCwk)).Methods("POST")

	// Routes in place for testing purposes
	r.Handle("/test/auth/{user}", mw.BasicAuth(test()))
	r.Handle("/ping", test())

	// static file server
	r.PathPrefix("/student").Handler(http.StripPrefix("/student", http.FileServer(http.Dir("build/")))).Methods("GET")
	r.PathPrefix("/staff").Handler(http.StripPrefix("/staff", http.FileServer(http.Dir("build/")))).Methods("GET")
	r.PathPrefix("/search").Handler(http.StripPrefix("/search", http.FileServer(http.Dir("build/")))).Methods("GET")
	r.PathPrefix("/module").Handler(http.StripPrefix("/module", http.FileServer(http.Dir("build/")))).Methods("GET")
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
