package utils

import (
	"encoding/json"
)

type Decoder interface {
	Decode(*json.Decoder) error
}

type Executer interface {
	Execute(Execute, string) error
}

type DecoderExecuter interface {
	Decoder
	Executer
}

// Module respresents all the information about a given module.
type Module struct {
	Code        string `json:"code,omitempty"`
	Name        string `json:"name,omitempty"`
	Description string `json:"description,omitempty"`
	Syllabus    string `json:"syllabus,omitempty"`
	Semester    string `json:"semester,omitempty"`
	Year        string `json:"year,omitempty"`
	Credits     string `json:"credits,omitempty"`
	Cwks        []Cwk  `json:"cwks,omitempty"`
	Exam        []Exam `json:"exam,omitempty"`
}

// Exam is the needed information to connect it to a module
type Exam struct {
	Code       string `json:"code,omitempty"`
	Percentage int    `json:"percentage,omitempty"`
	Type       string `json:"type,omitempty"`
}

func (e *Exam) Decode(d *json.Decoder) error {
	return d.Decode(e)
}

func (e *Exam) Execute(db Execute, query string) error {
	return db.Execute(query, e.Percentage, e.Code)
}

// Cwk is the basic list representation of a coursework for a given module
type Cwk struct {
	Id         int    `json:"id,omitempty"`
	Name       string `json:"cwk_name,omitempty"`
	Marks      int    `json:"marks,omitempty"`
	Percentage int    `json:"percentage,omitempty"`
}

func (c *Cwk) Decode(d *json.Decoder) error {
	return d.Decode(c)
}

func (c *Cwk) Execute(db Execute, query string) error {
	return db.Execute(query, c.Percentage, c.Marks, c.Id)
}

// CwkUpdate is the data needed to update a students cwk results
type CwkUpdate struct {
	StudentID int    `json:"student_id"`
	CwkID     int    `json:"cwk_id"`
	Result    int    `json:"result"`
	HandedIn  string `json:"handed_in"`
}

func (c *CwkUpdate) Decode(d *json.Decoder) error {
	return d.Decode(c)
}

func (c *CwkUpdate) Execute(db Execute, query string) error {
	return db.Execute(query, c.Result, c.HandedIn, c.CwkID, c.StudentID)
}
