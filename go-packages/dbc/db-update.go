package dbc

import (
	"encoding/json"

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

// Execute updates the database and performs necessary security checks
func (e *ExamPercent) Execute(db utils.Execute) error {
	if e.Percentage > 100 || e.Percentage < 0 {
		return utils.ErrSuspiciousInput
	}

	if !basicParser.MatchString(e.Code) {
		return utils.ErrSuspiciousInput
	}

	return db.Execute(
		"SELECT * FROM change_exam_percentage($1, $2);",
		e.Percentage,
		e.Code)
}

// CwkMarks is the data needed to update the marks or the percentage of a cwk.
type CwkMarks struct {
	Id         int `json:"id,omitempty"`
	Marks      int `json:"marks,omitempty"`
	Percentage int `json:"percentage,omitempty"`
}

// Decode reads in data from a json Decoder
func (c *CwkMarks) Decode(d *json.Decoder) error {
	return d.Decode(c)
}

// Execute updates the database and performs necessary security checks
func (c *CwkMarks) Execute(db utils.Execute) error {
	if c.Percentage > 100 || c.Percentage < 0 {
		return utils.ErrSuspiciousInput
	}

	if c.Marks < 0 {
		return utils.ErrSuspiciousInput
	}

	return db.Execute(
		"SELECT * FROM change_cwk_marks_and_percent($1, $2, $3);",
		c.Percentage,
		c.Marks,
		c.Id)
}

// CwkResult is the data needed to update a students cwk results
type CwkResult struct {
	StudentID int    `json:"student_id"`
	CwkID     int    `json:"cwk_id"`
	Result    int    `json:"result"`
	HandedIn  string `json:"handed_in"`
}

// Decode reads in data from a json Decoder
func (c *CwkResult) Decode(d *json.Decoder) error {
	return d.Decode(c)
}

// Execute updates the database and performs necessary security checks
func (c *CwkResult) Execute(db utils.Execute) error {
	if c.Result < 0 {
		return utils.ErrSuspiciousInput
	}

	return db.Execute(
		"SELECT * FROM update_student_cwk($1, $2, $3, $4);",
		c.Result,
		c.HandedIn,
		c.CwkID,
		c.StudentID)
}
