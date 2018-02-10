package dbc

import (
	"errors"
	"reflect"
	"testing"

	"github.com/Shonei/student-information-system/go-packages/utils"
)

type OkStruct struct{}

func (t *OkStruct) Select(s string, args ...interface{}) (string, error) {
	return "1", nil
}

func (t *OkStruct) SelectMulti(s string, args ...interface{}) ([]map[string]string, error) {
	return []map[string]string{{"OK": "1"}}, nil
}

func (t *OkStruct) PreparedStmt(s string, args ...interface{}) error {
	return nil
}

type ErrorStruct struct{}

var errTest = errors.New("not ok")

func (t *ErrorStruct) Select(s string, args ...interface{}) (string, error) {
	return "", errTest
}

func (t *ErrorStruct) SelectMulti(s string, args ...interface{}) ([]map[string]string, error) {
	return nil, errTest
}

func (t *ErrorStruct) PreparedStmt(s string, args ...interface{}) error {
	return errTest
}

func TestSingleParamQuery(t *testing.T) {
	t.Run("No error", func(t *testing.T) {
		got, err := SingleParamQuery(&OkStruct{}, "salt", "")
		if err != nil {
			t.Error("Didn't want an error")
		}

		if got != "1" {
			t.Errorf("Got %s - wanted ok", got)
		}
	})

	t.Run("Returns error", func(t *testing.T) {
		_, err := SingleParamQuery(&ErrorStruct{}, "salt", "")
		if err == nil {
			t.Error("Didn't want an error")
		}

		_, err = SingleParamQuery(&ErrorStruct{}, "", "")
		if err != utils.ErrUnexpectedChoice {
			t.Error("Expecting a TokenError")
		}
	})
}

func TestGenAuthToken(t *testing.T) {
	t.Run("No error", func(t *testing.T) {
		got, err := GenAuthToken(&OkStruct{}, "Shyl", "")
		if err != nil {
			t.Errorf("Got error we don't want error - %v", err)
		}

		if len(got["token"]) != 207 {
			t.Errorf("Want 207 - %v", len(got["token"]))
		}
	})

	t.Run("Returning an error", func(t *testing.T) {
		_, err := GenAuthToken(&ErrorStruct{}, "Shyl", "")
		if err == nil {
			t.Errorf("Got error don't want error")
		}
	})
}

func TestGetStudentCwk(t *testing.T) {
	t.Run("All go wells", func(t *testing.T) {
		m, err := GetStudentCwk(&OkStruct{}, "timetable", "")

		if m[0]["OK"] != "1" {
			t.Errorf("Wanted 1 - got %v.", m)
		}

		if err != nil {
			t.Error("Wanted no errors")
		}
	})

	t.Run("All go wells with past", func(t *testing.T) {
		m, err := GetStudentCwk(&OkStruct{}, "results", "")

		if m[0]["OK"] != "1" {
			t.Errorf("Wanted 1 - got %v.", m)
		}

		if err != nil {
			t.Error("Wanted no errors")
		}
	})

	t.Run("Failes", func(t *testing.T) {
		_, err := GetStudentCwk(&OkStruct{}, "nosw", "")

		if err == nil {
			t.Error("Wanted no errors")
		}
	})
}

func TestGetProfile(t *testing.T) {
	tests := []struct {
		db           utils.DBAbstraction
		choice, user string
		val          map[string]string
		err          error
	}{
		{&OkStruct{}, "staff", "", map[string]string{}, utils.ErrSuspiciousInput},
		{&OkStruct{}, "staff", "dafh", map[string]string{}, nil},
		{&OkStruct{}, "staff", "1fasdf", map[string]string{}, nil},
		{&OkStruct{}, "staff", "\n", map[string]string{}, utils.ErrSuspiciousInput},
		{&OkStruct{}, "staff", "sdfh\vsdgs", map[string]string{}, utils.ErrSuspiciousInput},
		{&OkStruct{}, "student", "", map[string]string{}, utils.ErrSuspiciousInput},
		{&OkStruct{}, "studnet", "dgfj", map[string]string{}, utils.ErrUnexpectedChoice},
		{&OkStruct{}, "student", "sdggsd", map[string]string{}, nil},
		{&ErrorStruct{}, "student", "sdggsd", map[string]string{}, errTest},
		{&ErrorStruct{}, "staff", "sdggsd", map[string]string{}, errTest},
	}

	for _, tt := range tests {
		val, err := GetProfile(tt.db, tt.choice, tt.user)

		if reflect.DeepEqual(val, tt.val) {
			t.Errorf("Wanted %v - Got %v", tt.val, val)
		}

		if err != tt.err {
			t.Errorf("Wanted %v - Got %v", tt.err, err)
		}
	}
}

func TestGetModulesList(t *testing.T) {
	tests := []struct {
		db           utils.DBAbstraction
		choice, user string
		val          []map[string]string
		err          error
	}{
		{&OkStruct{}, "", "", []map[string]string{}, utils.ErrSuspiciousInput},
		{&OkStruct{}, "past", "dafh", []map[string]string{}, nil},
		{&OkStruct{}, "staff", "1fasdf", []map[string]string{}, nil},
		{&OkStruct{}, "staff", "\n", []map[string]string{}, utils.ErrSuspiciousInput},
		{&OkStruct{}, "gdfhg", "sdfh", []map[string]string{}, utils.ErrUnexpectedChoice},
		{&OkStruct{}, "now", "sdfh\vsdgs", []map[string]string{}, utils.ErrSuspiciousInput},
		{&OkStruct{}, "past", "sdfh", []map[string]string{}, nil},
		{&OkStruct{}, "now", "sdfh", []map[string]string{}, nil},
		{&OkStruct{}, "staff", "sdfh", []map[string]string{}, nil},
		{&ErrorStruct{}, "past", "sdfh", []map[string]string{}, errTest},
		{&ErrorStruct{}, "now", "sdfh", []map[string]string{}, errTest},
		{&ErrorStruct{}, "staff", "sdfh", []map[string]string{}, errTest},
	}

	for _, tt := range tests {
		val, err := GetModulesList(tt.db, tt.choice, tt.user)

		if reflect.DeepEqual(val, tt.val) {
			t.Errorf("Wanted %v - Got %v", tt.val, val)
		}

		if err != tt.err {
			t.Errorf("Wanted %v - Got %v", tt.err, err)
		}
	}
}
