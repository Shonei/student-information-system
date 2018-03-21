package dbc

import (
	"database/sql"
	"encoding/json"
	"log"
	"reflect"
	"regexp"

	"github.com/Shonei/student-information-system/go-packages/utils"
)

// Validas input such as descriptions that allow for punctuation
var punctuationParser = regexp.MustCompile(`^[[:alnum:][:space:],.!?%(){}';:]+$`)

// NewModule is the data that is needed to create a new module.
// It includes the information about the module.
// In addition thi struct will hold the information to create a
// coursework and exam and assotiate it with the module.
type NewModule struct {
	Code          string     `json:"code"`
	Name          string     `json:"name"`
	Description   string     `json:"description"`
	Syllabus      string     `json:"syllabus"`
	Semester      int        `json:"semester"`
	YearOfStudy   int        `json:"year_of_study"`
	Credit        int        `json:"credit"`
	Exam          NewExam    `json:"exam"`
	Cwks          []NewCwk   `json:"cwks"`
	TeachingStaff []AddStaff `json:"teaching_staff"`
}

// Decode reads in the the data from the json object
func (module *NewModule) Decode(j *json.Decoder) error {
	return j.Decode(module)
}

// Create is used to add the newmodule to the databse.
// It must be called after Decode or there won't be any data to add.
func (module *NewModule) Create(tx *sql.Tx) error {
	if err := moduleSecurityCheck(module); err != nil {
		log.Println(err)
		return utils.ErrSuspiciousInput
	}

	createModule := `
		INSERT INTO module(code, name, description, syllabus, semester, year_of_study, credits) 
		VALUES($1, $2, $3, $4, $5, $6, $7);`

	// We try to create the new module
	_, err := tx.Exec(
		createModule,
		module.Code,
		module.Name,
		module.Description,
		module.Syllabus,
		module.Semester,
		module.YearOfStudy,
		module.Credit)

	if err != nil {
		log.Println(err)
		return utils.ErrSQLFailed
	}

	// Crete the exam
	if err := module.Exam.AddExam(tx, module.Code); err != nil {
		log.Println(err)
		return err
	}

	// create all the courseworks assosiated with the module
	for _, val := range module.Cwks {
		if err := val.AddCwk(tx, module.Code); err != nil {
			log.Println(err)
			return err
		}
	}

	// add all the staff that teach on the module
	for _, val := range module.TeachingStaff {
		if err := val.AddStaff(tx, module.Code); err != nil {
			log.Println(err)
			return err
		}
	}

	return nil
}

// NewExam has all the information for creating an exam in the database.
// It relieas on hte  user to set the relation with a module
type NewExam struct {
	Code        string `json:"code"`
	Percentage  int    `json:"percentage"`
	Type        string `json:"type"`
	Description string `json:"description"`
}

// AddExam is used to add a new exam in assosiation with a module.
func (e *NewExam) AddExam(tx *sql.Tx, moduleCode string) error {
	if err := examSecurityCheck(e); err != nil {
		log.Println(err)
		if err == utils.ErrEmptyStruct {
			// there is no data so we don't do anything
			return nil
		}
		return err
	}

	createExam := `
		INSERT INTO exam(code , module_code, percentage, type, description) 
		VALUES($1, $2, $3, $4, $5);`

	_, err := tx.Exec(
		createExam,
		e.Code,
		moduleCode,
		e.Percentage,
		e.Type,
		e.Description)

	if err != nil {
		log.Println(err)
		return utils.ErrSQLFailed
	}
	return nil
}

// NewCwk holds all the data for creating a new coursework
// it is up to the user to make sure it is linked with a module
type NewCwk struct {
	Id          int    `json:"id"`
	Name        string `json:"name"`
	PostedOn    string `json:"posted_on"`
	Deadline    string `json:"deadline"`
	Percentage  int    `json:"percentage"`
	Description string `json:"description"`
	Marks       int    `json:"marks"`
}

// AddCwk adds a new cwk to the given transaction and check for validity of data
func (c *NewCwk) AddCwk(tx *sql.Tx, moduleCode string) error {
	if err := cwkSecurityCheck(c); err != nil {
		log.Println(err)
		if err == utils.ErrEmptyStruct {
			// there is no data so we don't do anything
			return nil
		}
		return err
	}

	createCwk := `
		INSERT INTO coursework(module_code, id, cwk_name, posted_on, deadline, percentage, marks, description) 
		VALUES($1, $2, $3, $4, $5, $6, $7, $8);`

	_, err := tx.Exec(
		createCwk,
		moduleCode,
		c.Id,
		c.Name,
		c.PostedOn,
		c.Deadline,
		c.Percentage,
		c.Marks,
		c.Description)

	if err != nil {
		log.Println(err)
		return utils.ErrSQLFailed
	}

	return nil
}

// AddStaff provides the data needed to assosiate staff with a module
type AddStaff struct {
	Id   int    `json:"id"`
	Role string `json:"role"`
}

// AddStaff links existing staff to the passed module
func (s *AddStaff) AddStaff(tx *sql.Tx, moduleCode string) error {
	if reflect.DeepEqual(s, &AddStaff{}) {
		return nil
	}

	if !punctuationParser.MatchString(s.Role) {
		return utils.ErrSuspiciousInput
	}

	addStaff := `
	INSERT INTO teaching(staff_id, module_code, staff_role) 
	VALUES($1, $2, $3);`

	_, err := tx.Exec(
		addStaff,
		s.Id,
		moduleCode,
		s.Role)

	if err != nil {
		log.Println(err)
		return utils.ErrSQLFailed
	}

	return nil
}

// moduleSecurityChek can be used to determine if a module struct is afe to use
// It expects to find some information in all the fields containing a string
func moduleSecurityCheck(m *NewModule) error {
	// make checks for general text input
	if !punctuationParser.MatchString(m.Name) ||
		!punctuationParser.MatchString(m.Description) ||
		!punctuationParser.MatchString(m.Syllabus) {
		return utils.ErrSuspiciousInput
	}

	// The year has only 2 semesters so we make sure to check that
	if !(m.Semester == 1 || m.Semester == 2) {
		return utils.ErrSuspiciousInput
	}

	// check for negative credits
	if m.Credit < 0 {
		return utils.ErrSuspiciousInput
	}

	return nil
}

// makes sure the exam is safe to put into the database
func examSecurityCheck(e *NewExam) error {
	// check if struct is empty
	if reflect.DeepEqual(e, &NewExam{}) {
		return utils.ErrEmptyStruct
	}

	// Check if input is valid
	if !punctuationParser.MatchString(e.Code) ||
		!punctuationParser.MatchString(e.Description) ||
		!punctuationParser.MatchString(e.Type) {
		return utils.ErrSuspiciousInput
	}

	// we cant have more then 100%
	if e.Percentage > 100 || e.Percentage < 0 {
		return utils.ErrSuspiciousInput
	}

	return nil
}

// makes sure the cwk has only valid data
func cwkSecurityCheck(c *NewCwk) error {
	if reflect.DeepEqual(c, &NewCwk{}) {
		return utils.ErrEmptyStruct
	}

	if c.Percentage > 100 || c.Percentage < 0 {
		return utils.ErrSuspiciousInput
	}

	if !punctuationParser.MatchString(c.Description) ||
		!punctuationParser.MatchString(c.Name) {
		return utils.ErrSuspiciousInput
	}

	return nil
}
