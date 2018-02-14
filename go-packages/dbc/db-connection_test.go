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

func TestRunSingleRowQuery(t *testing.T) {
	tests := []struct {
		name  string
		db    utils.DBAbstraction
		query string
		user  string
		want  map[string]string
		err   error
	}{
		{"empty string for user", &OkStruct{}, "", "", nil, utils.ErrSuspiciousInput},
		{"escape character in user", &OkStruct{}, "", "asdg\"", nil, utils.ErrSuspiciousInput},
		{"unexpected character in user", &OkStruct{}, "", "sdf%", nil, utils.ErrSuspiciousInput},
		{"empty string for user", &ErrorStruct{}, "", "sdg", nil, errTest},
		{"empty string for user", &OkStruct{}, "", "sdf", map[string]string{"OK": "1"}, nil},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := RunSingleRowQuery(tt.db, tt.query, tt.user)

			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("Want %v - Got %v.", tt.want, got)
			}

			if err != tt.err {
				t.Errorf("Want %v - Got %v.", tt.err, err)
			}
		})
	}
}
