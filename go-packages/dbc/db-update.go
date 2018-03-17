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
		"UPDATE coursework SET percentage = $1, marks = $2 WHERE id = $3;",
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
		"UPDATE coursework_result SET result = $1, handed_in = $2 WHERE coursework_id = $3 AND student_id = $4;",
		c.Result,
		c.HandedIn,
		c.CwkID,
		c.StudentID)
}

// AddPrerequsite is the data needed to add a prerequisite to a module
type AddPrerequsite struct {
	Code         string `json:"code"`
	Prerequisite string `json:"prerequisites"`
}

// Decode reads the data into the struct
func (p *AddPrerequsite) Decode(d *json.Decoder) error {
	return d.Decode(p)
}

// Execute updates the database and performs necessary security checks
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

// RemovePrerequisite is the data needed to remove a exisitng prerequisite of a module
type RemovePrerequisite struct {
	Code        string `json:"code"`
	ToBeRemoved string `json:"to_be_removed"`
}

// Decode reads the data into the struct
func (p *RemovePrerequisite) Decode(d *json.Decoder) error {
	return d.Decode(p)
}

// Execute updates the database and performs necessary security checks
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
