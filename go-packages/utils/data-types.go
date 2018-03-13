package utils

import (
	"database/sql"
	"encoding/json"
)

// Decoder is given a json.Decoder with the data from an http request to be read
// into the fields of the data type implamenting the interface.
type Decoder interface {
	Decode(*json.Decoder) error
}

// Executer is the interface for updating the databse.
// Data types implamenting it need to define a sql query and give it all the
// data it needs as well as make checks to the data before hand.
type Executer interface {
	Execute(Execute) error
}

// Creator is theinterface for adding new data to the databse.
// Implamentations of it need to make sure to provide all the nessesary data
// and make security checks before creating the new entry.
type Creator interface {
	Create(*sql.Tx) error
}

// DecoderExecuter is the interface that a struct needs to implament in order to
// be able to use the Update http handler.
// The struct needs to provide valid json description because the Decoder uses
// the json.Decoder to read the data.
type DecoderExecuter interface {
	Decoder
	Executer
}

// DecoderCreator defines the functionality that is needed to create new
// entries in the databse.
type DecoderCreator interface {
	Decoder
	Creator
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
