package dbc

import (
	"regexp"
	"strconv"
	"time"

	"github.com/Shonei/student-information-system/go-packages/utils"

	jwt "github.com/dgrijalva/jwt-go"
)

// Used to validate all the username that will be used when accessing the DB
var basicParser = regexp.MustCompile("^[a-zA-Z0-9]+$")

// the custom claims created in the JWT token
// those are the clasim expected by the authentication middleware
// and must match the JSON representation
type customToken struct {
	User        string `json:"user"`
	AccessLevel int    `json:"access_level"`
	jwt.StandardClaims
}

// SingleParamQuery will execute a predefined sql query that takes a single
// paramater and returns a single paramater with no additional modification to the data.
func SingleParamQuery(db utils.DBAbstraction, query, param string) (string, error) {
	switch query {
	case "salt":
		return db.Select("Select salt from login_info where username = $1", param)
	}
	return "", utils.ErrUnexpectedChoice
}

// GenAuthToken will authenticate the user based on the HMAC value fo the password
// and he username. If they match the database results a map will be generated containing a token and
// the access level for that user. The token will then be used for consecutive requests
// to the server removing the need for sending personal information agian.
func GenAuthToken(db utils.DBAbstraction, user, hash string) (map[string]string, error) {
	level, err := db.Select("SELECT access_lvl FROM login_info WHERE username = $1 AND user_pass = $2", user, hash)
	if err != nil {
		return nil, err
	}

	// No access_level was found, assume the worst case and exit
	if err != nil {
		return nil, utils.ErrUnothorized
	}

	mySigningKey := []byte("AllYourBase")

	lvl, err := strconv.Atoi(level)
	if err != nil {
		return nil, err
	}

	// Create the Claims
	claims := customToken{
		user, lvl,
		jwt.StandardClaims{
			ExpiresAt: time.Now().Add(2 * time.Hour).Unix(),
			Issuer:    "test",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS512, claims)
	ss, err := token.SignedString(mySigningKey)

	j := map[string]string{"token": ss, "level": level}

	return j, nil
}

// GetProfile returns a map containing relevant information about a persons profile.
func GetProfile(db utils.DBAbstraction, choice, user string) (map[string]string, error) {
	student := "SELECT student.id, first_name, middle_name, last_name, email, current_level, picture_url, entry_year FROM student INNER JOIN login_info ON (student.id = login_info.id) WHERE login_info.username = $1;"
	staff := "SELECT login_info.id, first_name, middle_name, last_name, email, address1, address2, phone FROM staff INNER JOIN login_info ON login_info.id = staff.id WHERE login_info.username = $1;"
	var err error
	var m []map[string]string

	if !basicParser.MatchString(user) {
		return nil, utils.ErrSuspiciousInput
	}

	switch choice {
	case "staff":
		m, err = db.SelectMulti(staff, user)
	case "student":
		m, err = db.SelectMulti(student, user)
	default:
		return nil, utils.ErrUnexpectedChoice
	}

	if err != nil {
		return nil, err
	}

	return m[0], nil
}

// GetModulesList returns an array containing information about the modules of a given person.
// It it gets a now or past parameter it returns the modules for a student either
// his current modules or the modules he has taken in the past.
// If it gets an unexpected parameter it will return a utils.ErrUnexpectedChoice.
func GetModulesList(db utils.DBAbstraction, choice, user string) ([]map[string]string, error) {
	now := "SELECT module.code, module.name, student_modules.study_year, student_modules.result FROM student_modules INNER JOIN module ON module.code = student_modules.module_code INNER JOIN student ON student.id = student_modules.student_id INNER JOIN login_info ON student_modules.student_id = login_info.id WHERE login_info.username = $1 AND to_char(student_modules.study_year, 'YYYY') = $2;"
	past := "SELECT module.code, module.name, student_modules.study_year, student_modules.result FROM student_modules INNER JOIN module ON module.code = student_modules.module_code INNER JOIN student ON student.id = student_modules.student_id INNER JOIN login_info ON student_modules.student_id = login_info.id WHERE login_info.username = $1 AND NOT to_char(student_modules.study_year, 'YYYY') = $2;"
	year := time.Now()

	if !basicParser.MatchString(user) || !basicParser.MatchString(choice) {
		return nil, utils.ErrSuspiciousInput
	}

	switch choice {
	case "now":
		return db.SelectMulti(now, user, year.Year())
	case "past":
		return db.SelectMulti(past, user, year.Year())
	default:
		return nil, utils.ErrUnexpectedChoice
	}
}

// GetStudentCwk will retrive the cwk table for a given student by a given name.
// It can return both cwk results and cwk schedule based on the t paramater.
// It only accepts a timetable or results as input.
// It will return a  utils.ErrUnexpectedChoice otherwise.
func GetStudentCwk(db utils.DBAbstraction, t, user string) ([]map[string]string, error) {
	result := "SELECT coursework.module_code, coursework.cwk_name, coursework.percentage, coursework.marks, coursework_result.result FROM coursework INNER JOIN coursework_result ON coursework_result.coursework_id = coursework.id INNER JOIN student ON coursework_result.student_id = student.id INNER JOIN login_info ON student.id = login_info.id INNER JOIN student_modules ON student_modules.student_id = student.id WHERE login_info.username = $1 AND coursework_result.result IS NOT NULL;"
	timetable := "SELECT coursework.cwk_name, coursework.posted_on, coursework.deadline FROM coursework INNER JOIN coursework_result ON coursework_result.coursework_id = coursework.id INNER JOIN student ON coursework_result.student_id = student.id INNER JOIN login_info ON student.id = login_info.id INNER JOIN student_modules ON student_modules.student_id = student.id  WHERE login_info.username = $1 AND coursework_result.result IS NULL;"

	if !basicParser.MatchString(user) {
		return nil, utils.ErrSuspiciousInput
	}

	switch t {
	case "timetable":
		return db.SelectMulti(timetable, user)
	case "results":
		return db.SelectMulti(result, user)
	default:
		return nil, utils.ErrUnexpectedChoice
	}
}

// GetStaffModules returns an array of the modules a staff is involved in.
// IT was seperated from the GetModulesList to limit the access to invormation
// that will require a higher level of access, like the details for a staff member.
func GetStaffModules(db utils.DBAbstraction, user string) ([]map[string]string, error) {
	staff := "SELECT module.code, module.name, teaching.staff_role FROM module INNER JOIN teaching ON teaching.module_code = module.code INNER JOIN staff ON staff.id = teaching.staff_id INNER JOIN login_info ON login_info.id = staff.id WHERE login_info.username = $1;"

	if !basicParser.MatchString(user) {
		return nil, utils.ErrSuspiciousInput
	}

	return db.SelectMulti(staff, user)
}

// GetStaffTutees returns a list of studetns that the given staff member tutors.
func GetStaffTutees(db utils.DBAbstraction, user string) ([]map[string]string, error) {
	tutoring := "SELECT login_info.username, student.id, student.programme_code, to_char(tutor.suppervision_year, 'YYYY') AS year FROM tutor INNER JOIN student ON student.id = tutor.student_id INNER JOIN staff ON staff.id = tutor.staff_id INNER JOIN login_info ON login_info.id = student.id WHERE tutor.staff_id = (SELECT id FROM login_info WHERE username = $1);"

	if !basicParser.MatchString(user) {
		return nil, utils.ErrSuspiciousInput
	}

	return db.SelectMulti(tutoring, user)
}

// GetInformation is a swwitch statement of the available queries.
// The query parameter is used to choose from one of the available queries.
// That choice should never be left to the end user but be done by the developers of the server.
// The available options are:
//  "staff_tutees", "staff_modules"
//  "student_current_modules", "student_past_modules"
//  "student_cwk_result", "student_cwk_timetable"
func GetInformation(db utils.DBAbstraction, query, user string) ([]map[string]string, error) {
	staffTutees := `
		SELECT login_info.username, student.id, student.programme_code, to_char(tutor.suppervision_year, 'YYYY') AS year 
		FROM tutor 
		INNER JOIN student ON student.id = tutor.student_id 
		INNER JOIN staff ON staff.id = tutor.staff_id 
		INNER JOIN login_info ON login_info.id = student.id 
		WHERE tutor.staff_id = (SELECT id FROM login_info WHERE username = $1);`

	staffModules := `
		SELECT module.code, module.name, teaching.staff_role 
		FROM module 
		INNER JOIN teaching ON teaching.module_code = module.code 
		INNER JOIN staff ON staff.id = teaching.staff_id 
		INNER JOIN login_info ON login_info.id = staff.id 
		WHERE login_info.username = $1;`

	studentCurrentModules := `
		SELECT module.code, module.name, student_modules.study_year, student_modules.result 
		FROM student_modules 
		INNER JOIN module ON module.code = student_modules.module_code 
		INNER JOIN student ON student.id = student_modules.student_id 
		INNER JOIN login_info ON student_modules.student_id = login_info.id 
		WHERE login_info.username = $1 
		AND to_char(student_modules.study_year, 'YYYY') = to_char(NOW(), 'YYYY');`

	studentPastModules := `
		SELECT module.code, module.name, student_modules.study_year, student_modules.result 
		FROM student_modules 
		INNER JOIN module ON module.code = student_modules.module_code 
		INNER JOIN student ON student.id = student_modules.student_id 
		INNER JOIN login_info ON student_modules.student_id = login_info.id 
		WHERE login_info.username = $1 
		AND NOT to_char(student_modules.study_year, 'YYYY') = to_char(NOW(), 'YYYY');`

	studentCwkResult := `
		SELECT coursework.module_code, coursework.cwk_name, coursework.percentage, coursework.marks, coursework_result.result 
		FROM coursework 
		INNER JOIN coursework_result ON coursework_result.coursework_id = coursework.id 
		INNER JOIN student ON coursework_result.student_id = student.id 
		INNER JOIN login_info ON student.id = login_info.id 
		INNER JOIN student_modules ON student_modules.student_id = student.id 
		WHERE login_info.username = $1 
		AND coursework_result.result IS NOT NULL;`

	studentCwkTimetable := `
		SELECT coursework.cwk_name, coursework.posted_on, coursework.deadline 
		FROM coursework 
		INNER JOIN coursework_result ON coursework_result.coursework_id = coursework.id 
		INNER JOIN student ON coursework_result.student_id = student.id 
		INNER JOIN login_info ON student.id = login_info.id 
		INNER JOIN student_modules ON student_modules.student_id = student.id  
		WHERE login_info.username = $1 AND coursework_result.result IS NULL;`

	if !basicParser.MatchString(query) || !basicParser.MatchString(user) {
		return nil, utils.ErrSuspiciousInput
	}

	switch query {
	case "staff_tutees":
		return db.SelectMulti(staffTutees, user)
	case "staff_modules":
		return db.SelectMulti(staffModules, user)
	case "student_current_modules":
		return db.SelectMulti(studentCurrentModules, user)
	case "student_cwk_result":
		return db.SelectMulti(studentCwkResult, user)
	case "student_cwk_timetable":
		return db.SelectMulti(studentCwkTimetable, user)
	case "student_past_modules":
		return db.SelectMulti(studentPastModules, user)
	default:
		return nil, utils.ErrUnexpectedChoice
	}
}
