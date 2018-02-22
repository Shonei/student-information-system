package utils

import (
	"encoding/json"
)

type Decoder interface {
	Decode(*json.Decoder) error
}

type Executer interface {
	Execute(Execute) error
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

// Cwk is the basic list representation of a coursework for a given module
type Cwk struct {
	Id         int    `json:"id,omitempty"`
	Name       string `json:"cwk_name,omitempty"`
	Marks      int    `json:"marks,omitempty"`
	Percentage int    `json:"percentage,omitempty"`
}
