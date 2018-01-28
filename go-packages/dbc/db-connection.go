package dbc

import (
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha512"
	"database/sql"
	"encoding/hex"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/Shonei/student-information-system/go-packages/dba"
)

// TokenError will be used as a message for http request containing a http code
// a mostly human readable message.
type TokenError struct {
	HttpCode int
	Message  string
}

func (t *TokenError) Error() string {
	return string(t.HttpCode)
}

// SingleParamQuery will execute a predefined sql query that takes a single
// paramater and returns a single paramater with no additional modification to the data.
// If it returns an empty string it would mean the query failed.
func SingleParamQuery(db dba.DBAbstraction, query, param string) (string, error) {
	switch query {
	case "salt":
		return db.Select("Select salt from login_info where username = $1", param)
	}
	return "", &TokenError{404, "No such query"}
}

// GenAuthToken will return the token for a given user and save the
// token in the database. If there is an error the function will
// return an error value and an empty string.
func GenAuthToken(db dba.DBAbstraction, user, hash string) (map[string]string, error) {
	id, err := db.Select("SELECT id FROM login_info WHERE username = $1 AND user_pass = $2", user, hash)

	// No id was found, assume they gave wrong password or username
	if err != nil {
		return nil, &TokenError{403, "Wrong username or password"}
	}

	// get random bytes to generate hmac
	key := make([]byte, 32)
	_, err = rand.Read(key)
	if err != nil {
		return nil, &TokenError{500, "We encountered a problem generating the token. Please try again."}
	}

	// compute token
	hashFunc := hmac.New(sha512.New, key)
	_, _ = hashFunc.Write([]byte(user + ":" + hash + ":" + id))
	b := hashFunc.Sum(nil)
	token := hex.EncodeToString(b)
	token = user + ":" + token

	lvl, _ := db.Select("SELECT access_lvl FROM login_info WHERE username = $1;", user)
	j := map[string]string{"token": token, "level": lvl}

	err = db.PreparedStmt("UPDATE login_info SET token = $1, expire_date = NOW() WHERE  username = $2 AND user_pass = $3", token, user, hash)
	if err != nil {
		return nil, &TokenError{500, "We encountered a problem generating the token. Please try again."}
	}

	return j, nil
}

// CheckToken checks if the user has given a valid token and
// returns the access level for that user
// if the token doesn't exist it returns a TokenError
func CheckToken(db dba.DBAbstraction, token string) (int, error) {
	user := strings.Split(token, ":")[0]

	username, err := db.Select("SELECT username FROM login_info WHERE token = $1", token)
	fmt.Println(token)
	if err != nil {
		if err == sql.ErrNoRows {
			return -1, &TokenError{http.StatusGatewayTimeout, "Token timed out."}
		}
		return -1, err
	}

	if user != username {
		return -1, &TokenError{http.StatusForbidden, "token doesn't match username"}
	}

	lvl, err := db.Select("SELECT access_lvl FROM login_info WHERE token = $1 AND username = $2", token, user)

	i, err := strconv.Atoi(lvl)
	if err != nil {
		return 0, err
	}
	return i, nil
}

// TokenCleanUp will delete the tokens from the database
// that have expired. Each token has 2 hours to live after creation.
func TokenCleanUp(db dba.DBAbstraction) {
	// UPDATE login_info SET token = random()::text, expire_date = NOW();
	query := "UPDATE login_info SET token = null, expire_date = null WHERE expire_date + '2 hours' < NOW();"
	db.PreparedStmt(query)
}

// GetStudentPro returns a map containing relevant information for a students profile.
func GetStudentPro(db dba.DBAbstraction, user string) (map[string]string, error) {
	query := "SELECT student.id, first_name, middle_name, last_name, email, current_level, picture_url, entry_year FROM student INNER JOIN login_info ON (student.id = login_info.id) WHERE login_info.username = $1;"

	m, err := db.SelectMulti(query, user)
	if err != nil {
		return nil, err
	}

	return m[0], nil
}

// GetStudentModules returns an array of key/value pairs of the modules for a student
func GetStudentModules(db dba.DBAbstraction, t, user string) ([]map[string]string, error) {
	now := "SELECT module.code, module.name, student_modules.study_year, student_modules.result FROM student_modules INNER JOIN module ON module.code = student_modules.module_code INNER JOIN student ON student.id = student_modules.student_id INNER JOIN login_info ON student_modules.student_id = login_info.id WHERE login_info.username = $1 AND to_char(student_modules.study_year, 'YYYY') = $2;"
	past := "SELECT module.code, module.name, student_modules.study_year, student_modules.result FROM student_modules INNER JOIN module ON module.code = student_modules.module_code INNER JOIN student ON student.id = student_modules.student_id INNER JOIN login_info ON student_modules.student_id = login_info.id WHERE login_info.username = $1 AND NOT to_char(student_modules.study_year, 'YYYY') = $2;"
	year := time.Now()

	switch t {
	case "now":
		return db.SelectMulti(now, user, year.Year())
	case "past":
		return db.SelectMulti(past, user, string(year.Year()))
	default:
		return nil, &TokenError{404, "Wrong parameters"}
	}
}

// GetStudentCwk will retrive the cwk table for a given student by a given name.
// It can return both cwk results and cwk schedule based on the t(type) paramater.
// It only accepts a timetable or results as input.
func GetStudentCwk(db dba.DBAbstraction, t, user string) ([]map[string]string, error) {
	result := "SELECT coursework.module_code, coursework.cwk_name, coursework.percentage, coursework.marks, coursework_result.result FROM coursework INNER JOIN coursework_result ON coursework_result.coursework_id = coursework.id INNER JOIN student ON coursework_result.student_id = student.id INNER JOIN login_info ON student.id = login_info.id INNER JOIN student_modules ON student_modules.student_id = student.id WHERE login_info.username = $1 AND to_char(student_modules.study_year, 'YYYY') = to_char(NOW(), 'YYYY');"
	timetable := "SELECT coursework.cwk_name, coursework.posted_on, coursework.deadline FROM coursework INNER JOIN coursework_result ON coursework_result.coursework_id = coursework.id INNER JOIN student ON coursework_result.student_id = student.id INNER JOIN login_info ON student.id = login_info.id INNER JOIN student_modules ON student_modules.student_id = student.id  WHERE login_info.username = $1 AND to_char(student_modules.study_year, 'YYYY') = to_char(NOW(), 'YYYY');"

	switch t {
	case "timetable":
		return db.SelectMulti(timetable, user)
	case "results":
		return db.SelectMulti(result, user)
	default:
		return nil, &TokenError{404, "Wrong parameters"}
	}
}
