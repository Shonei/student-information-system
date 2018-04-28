package dbc

import (
	"encoding/json"
	"log"

	"github.com/Shonei/student-information-system/go-packages/utils"
)

// ExamPercent is the type that represents the data needed to
// update the oercentage of an exam.
type ExamPercent struct {
	Code       string `json:"code,omitempty"`
	Percentage int    `json:"percentage,omitempty"`
}

// Decode reads in data from a json Decoder
func (e *ExamPercent) Decode(d *json.Decoder) error {
	return d.Decode(e)
}

// Execute updates the database and performs necessary security checks.
func (e *ExamPercent) Execute(db utils.Execute) error {
	if e.Percentage > 100 || e.Percentage < 0 {
		return utils.ErrSuspiciousInput
	}

	if !basicParser.MatchString(e.Code) {
		return utils.ErrSuspiciousInput
	}

	return db.Execute(
		"UPDATE exam SET percentage = $1 WHERE code = $2;",
		e.Percentage,
		e.Code)
}

// CwkMarks is the data needed to update the marks or the percentage of a cwk.
type CwkMarks struct {
	Id         int `json:"id,omitempty"`
	Marks      int `json:"marks,omitempty"`
	Percentage int `json:"percentage,omitempty"`
}

// Decode reads in data from a json Decoder.
func (c *CwkMarks) Decode(d *json.Decoder) error {
	return d.Decode(c)
}

// Execute updates the database and performs necessary security checks.
func (c *CwkMarks) Execute(db utils.Execute) error {
	if c.Percentage > 100 || c.Percentage < 0 {
		return utils.ErrSuspiciousInput
	}

	if c.Marks < 0 {
		return utils.ErrSuspiciousInput
	}

	return db.Execute(
		"UPDATE coursework SET percentage = $1, marks = $2 WHERE id = $3;",
		c.Percentage,
		c.Marks,
		c.Id)
}

// CwkResult is the data needed to update a students cwk results.
type CwkResult struct {
	StudentID int    `json:"student_id"`
	CwkID     int    `json:"cwk_id"`
	Result    int    `json:"result"`
	HandedIn  string `json:"handed_in"`
}

// Decode reads in data from a json Decoder.
func (c *CwkResult) Decode(d *json.Decoder) error {
	return d.Decode(c)
}

// Execute updates the database and performs necessary security checks.
func (c *CwkResult) Execute(db utils.Execute) error {
	if c.Result < 0 {
		return utils.ErrSuspiciousInput
	}

	return db.Execute(
		"UPDATE coursework_result SET result = $1, handed_in = $2 WHERE coursework_id = $3 AND student_id = $4;",
		c.Result,
		c.HandedIn,
		c.CwkID,
		c.StudentID)
}

// AddPrerequsite is the data needed to add a prerequisite to a module.
type AddPrerequsite struct {
	Code         string `json:"code"`
	Prerequisite string `json:"prerequisites"`
}

// Decode reads the data into the struct
func (p *AddPrerequsite) Decode(d *json.Decoder) error {
	return d.Decode(p)
}

// Execute updates the database and performs necessary security checks.
func (p *AddPrerequsite) Execute(db utils.Execute) error {
	if !punctuationParser.MatchString(p.Code) ||
		!punctuationParser.MatchString(p.Prerequisite) {
		return utils.ErrSuspiciousInput
	}

	return db.Execute(
		"INSERT INTO prerequisites(module_code, prerequisite_code) VALUES($1, $2);",
		p.Code,
		p.Prerequisite)
}

// RemovePrerequisite is the data needed to remove a exisitng prerequisite of a module.
type RemovePrerequisite struct {
	Code        string `json:"code"`
	ToBeRemoved string `json:"to_be_removed"`
}

// Decode reads the data into the struct
func (p *RemovePrerequisite) Decode(d *json.Decoder) error {
	return d.Decode(p)
}

// Execute updates the database and performs necessary security checks.
func (p *RemovePrerequisite) Execute(db utils.Execute) error {
	if !punctuationParser.MatchString(p.Code) ||
		!punctuationParser.MatchString(p.ToBeRemoved) {
		return utils.ErrSuspiciousInput
	}

	return db.Execute(
		"DELETE FROM prerequisites WHERE module_code = $1 AND prerequisite_code = $2",
		p.Code,
		p.ToBeRemoved)
}

// EditModule is the data type that is used when editing a modules information.
type EditModule struct {
	Code        string `json:"code"`
	Description string `json:"description"`
	Syllabus    string `json:"syllabus"`
	Semester    int    `json:"semester"`
	YearOfStudy int    `json:"year_of_study"`
	Credit      int    `json:"credit"`
}

// Decode takes a json decoder and reads in the data from it into the struct.
func (m *EditModule) Decode(d *json.Decoder) error {
	return d.Decode(m)
}

// Execute performes security checks on the data and updates the database.
func (m *EditModule) Execute(db utils.Execute) error {
	if m.Credit < 0 || m.YearOfStudy < 0 {
		return utils.ErrSuspiciousInput
	}

	if !(m.Semester == 1 || m.Semester == 2) {
		return utils.ErrSuspiciousInput
	}

	if !punctuationParser.MatchString(m.Description) ||
		!punctuationParser.MatchString(m.Syllabus) {
		return utils.ErrSuspiciousInput
	}

	return db.Execute(
		"UPDATE module SET description = $1, syllabus = $2, semester = $3, year_of_study = $4, credits = $5 WHERE code = $6;",
		m.Description,
		m.Syllabus,
		m.Semester,
		m.YearOfStudy,
		m.Credit,
		m.Code)
}

// UpdateCwkTimetable is used to change the deadline and the posted on time for a coursework.
type UpdateCwkTimetable struct {
	Code     string `json:"code"`
	PostedOn string `json:"posted_on"`
	Deadline string `json:"deadline"`
}

// Decode takes a json decoder and reads in the data from it into the struct.
func (c *UpdateCwkTimetable) Decode(d *json.Decoder) error {
	return d.Decode(c)
}

// Execute performes security checks on the data and updates the database.
func (c *UpdateCwkTimetable) Execute(db utils.Execute) error {
	if !punctuationParser.MatchString(c.Code) {
		return utils.ErrSuspiciousInput
	}

	return db.Execute(
		"UPDATE coursework SET posted_on = $1, deadline = $2 WHERE id = $3;",
		c.PostedOn,
		c.Deadline,
		c.Code)
}

// AddTeachingStaff is used to add a member of staff to the list of
// staff that are involved in a module.
type AddTeachingStaff struct {
	StaffId    int    `json:"staff_id"`
	ModuleCode string `json:"module_code"`
	StaffRole  string `json:"staff_role"`
}

// Decode takes a json decoder and reads in the data from it into the struct.
func (t *AddTeachingStaff) Decode(d *json.Decoder) error {
	return d.Decode(t)
}

// Execute chacks the data and adds a member of staff to a module assigning it the given role.
func (t *AddTeachingStaff) Execute(db utils.Execute) error {
	log.Println("m - ", punctuationParser.MatchString(t.ModuleCode))
	log.Println("s - ", punctuationParser.MatchString(t.StaffRole))

	if !punctuationParser.MatchString(t.ModuleCode) ||
		!punctuationParser.MatchString(t.StaffRole) {
		log.Println("sldkjghsgdkflhjsdf")
		return utils.ErrSuspiciousInput
	}

	return db.Execute(
		"INSERT INTO teaching(staff_id, module_code, staff_role) VALUES($1, $2, $3);",
		t.StaffId,
		t.ModuleCode,
		t.StaffRole)
}

// AddTutee is used to add a tutee to a staff member.
type AddTutee struct {
	StaffId          int `json:"staff_id"`
	StudentId        int `json:"student_id"`
	SuppervisionYear int `json:"suppervision_year"`
}

// Decode takes a json decoder and reads in the data from it into the struct.
func (t *AddTutee) Decode(d *json.Decoder) error {
	return d.Decode(t)
}

// Execute adds a student to the staffs list of tutees.
func (t *AddTutee) Execute(db utils.Execute) error {
	if t.SuppervisionYear < 0 {
		return utils.ErrSuspiciousInput
	}

	return db.Execute(
		"INSERT INTO tutor(staff_id, student_id, suppervision_year) VALUES($1, $2, $3);",
		t.StaffId,
		t.StudentId,
		t.SuppervisionYear)
}

// AddStudentModule is used when adding a student to a module.
type AddStudentModule struct {
	ModuleCode string `json:"module_code"`
	StudentId  int    `json:"student_id"`
}

// Decode takes a json decoder and reads in the data from it into the struct.
func (m *AddStudentModule) Decode(d *json.Decoder) error {
	return d.Decode(m)
}

// Execute performes checks on the data and adds a student to a module for the specifies year.
func (m *AddStudentModule) Execute(db utils.Execute) error {
	if !punctuationParser.MatchString(m.ModuleCode) {
		return utils.ErrSuspiciousInput
	}

	return db.Execute(
		"INSERT INTO student_modules(module_code, student_id, study_year) VALUES($1, $2, NOW());",
		m.ModuleCode,
		m.StudentId)
}

// RemoveStudentModule is used to remove a student from a module.
type RemoveStudentModule struct {
	StudentId  int    `json:"student_id"`
	ModuleCode string `json:"module_code"`
}

// Decode takes a json decoder and reads in the data from it into the struct.
func (m *RemoveStudentModule) Decode(d *json.Decoder) error {
	return d.Decode(m)
}

// Execute checks the data and then removes the student from the module.
func (m *RemoveStudentModule) Execute(db utils.Execute) error {
	if !punctuationParser.MatchString(m.ModuleCode) {
		return utils.ErrSuspiciousInput
	}

	return db.Execute(
		"DELETE FROM student_modules WHERE student_id = $1 AND module_code = $2;",
		m.StudentId,
		m.ModuleCode)
}

// RemoveTeachingStaff removes a staffs involvement from a module.
type RemoveTeachingStaff struct {
	ModuleCode string `json:"module_code"`
	StaffId    int    `json:"staff_id"`
}

// Decode takes a json decoder and reads in the data from it into the struct.
func (t *RemoveTeachingStaff) Decode(d *json.Decoder) error {
	return d.Decode(t)
}

// Execute will check if the data is secure to use and remove the
// member of staff from the module.
func (t *RemoveTeachingStaff) Execute(db utils.Execute) error {
	if !punctuationParser.MatchString(t.ModuleCode) {
		return utils.ErrSuspiciousInput
	}

	return db.Execute(
		"DELETE FROM teaching WHERE module_code = $1 AND staff_id = $2;",
		t.ModuleCode,
		t.StaffId)
}
