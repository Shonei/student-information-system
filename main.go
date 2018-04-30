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
	getModuleStudents := func(str string) ([]map[string]string, error) {
		return dbc.RunMultyRowQuery(db, "SELECT * FROM get_module_students($1);", str)
	}
	getModuleStaff := func(str string) ([]map[string]string, error) {
		return dbc.RunMultyRowQuery(db, "SELECT * FROM get_module_staff($1);", str)
	}
	getModuleDetails := func(str string) (utils.Module, error) {
		return dbc.GetModuleDetails(db, str)
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
	update := func(v utils.DecoderExecuter) error {
		return v.Execute(db)
	}

	// This function is used for the creation of the module.
	// it makes sure the transaction is commited or rolled back as needed.
	create := func(v utils.DecoderCreator) error {
		tx, err := db.Begin()
		if err != nil {
			return utils.ErrSQLFailed
		}

		if err := v.Create(tx); err != nil {
			tx.Rollback()
			return utils.ErrSQLFailed
		}

		tx.Commit()
		return nil
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

	// ADD AUTH MIDLLEWARE
	r.Handle("/get/module/{code}", hand.GetForModule(getModuleDetails)).Methods("GET")
	r.Handle("/get/module/students/{code}", hand.GetForCode(getModuleStudents)).Methods("GET")
	r.Handle("/get/module/staff/{code}", hand.GetForCode(getModuleStaff)).Methods("GET")
	r.Handle("/get/cwk/{code}", hand.GetForCode(getCourseworkDetails)).Methods("GET")
	r.Handle("/get/cwk/students/{code}", hand.GetForCode(getStudentsOnCwk)).Methods("GET")
	r.Handle("/search/{query}", hand.GetSearch(search)).Methods("GET")

	r.Handle("/remove/prerequisite", hand.Update(&dbc.RemovePrerequisite{}, update)).Methods("POST")
	r.Handle("/remove/module/staff", hand.Update(&dbc.RemoveTeachingStaff{}, update)).Methods("POST")
	r.Handle("/remove/module/student", hand.Update(&dbc.RemoveStudentModule{}, update)).Methods("POST")

	r.Handle("/update/cwk/results", hand.Update(&dbc.CwkResult{}, update)).Methods("POST")
	r.Handle("/update/exam/percentage", hand.Update(&dbc.ExamPercent{}, update)).Methods("POST")
	r.Handle("/update/cwk/percentage", hand.Update(&dbc.CwkMarks{}, update)).Methods("POST")
	r.Handle("/update/module", hand.Update(&dbc.EditModule{}, update)).Methods("POST")
	r.Handle("/update/coursework/timetable", hand.Update(&dbc.UpdateCwkTimetable{}, update)).Methods("POST")

	r.Handle("/add/prerequisite", hand.Update(&dbc.AddPrerequsite{}, update)).Methods("POST")
	r.Handle("/add/module", hand.Create(&dbc.NewModule{}, create)).Methods("POST")
	r.Handle("/add/module/student", hand.Update(&dbc.AddStudentModule{}, update)).Methods("POST")
	r.Handle("/add/staff/tutee", hand.Update(&dbc.AddTutee{}, update)).Methods("POST")
	r.Handle("/add/module/staff", hand.Update(&dbc.AddTeachingStaff{}, update)).Methods("POST")

	// Routes in place for testing purposes
	r.Handle("/test/auth/{user}", mw.BasicAuth(test()))
	r.Handle("/ping", test())

	// static file server
	// r.PathPrefix("/student").Handler(http.StripPrefix("/student", http.FileServer(http.Dir("build/")))).Methods("GET")
	// r.PathPrefix("/staff").Handler(http.StripPrefix("/staff", http.FileServer(http.Dir("build/")))).Methods("GET")
	// r.PathPrefix("/search").Handler(http.StripPrefix("/search", http.FileServer(http.Dir("build/")))).Methods("GET")
	// r.PathPrefix("/module").Handler(http.StripPrefix("/module", http.FileServer(http.Dir("build/")))).Methods("GET")
	// r.PathPrefix("/coursework").Handler(http.StripPrefix("/coursework", http.FileServer(http.Dir("build/")))).Methods("GET")
	// r.PathPrefix("/create/module").Handler(http.StripPrefix("/create/module", http.FileServer(http.Dir("build/")))).Methods("GET")
	r.PathPrefix("/").Handler(http.FileServer(http.Dir("build/"))).Methods("GET")

	// listen on the router
	http.Handle("/", r)

	log.Println(http.ListenAndServe(":"+port, nil))
}

func test() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Golang with hot reloadi"))
	})
}
