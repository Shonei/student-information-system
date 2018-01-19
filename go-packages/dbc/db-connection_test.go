package dbc

import (
	"errors"
	"fmt"
	"testing"
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

func (t *ErrorStruct) Select(s string, args ...interface{}) (string, error) {
	return "", errors.New("not ok")
}

func (t *ErrorStruct) SelectMulti(s string, args ...interface{}) ([]map[string]string, error) {
	return nil, errors.New("not ok")
}

func (t *ErrorStruct) PreparedStmt(s string, args ...interface{}) error {
	return errors.New("not ok")
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
		if err != nil {
			if _, ok := err.(*TokenError); !ok {
				t.Error("Expecting a TokenError")
			}
		}
	})
}

func TestGenAuthToken(t *testing.T) {
	t.Run("No error", func(t *testing.T) {
		got, err := GenAuthToken(&OkStruct{}, "Shyl", "")
		if err != nil {
			t.Errorf("Got error we don't want error - %v", err)
		}
		fmt.Println(len(got))
		if len(got) != 133 {
			t.Errorf("Hash was not generated - %v", got)
		}
	})

	t.Run("Returning an error", func(t *testing.T) {
		_, err := GenAuthToken(&ErrorStruct{}, "Shyl", "")
		if err == nil {
			t.Errorf("Got erro don't want error")
		}
	})
}

func TestCheckToken(t *testing.T) {
	t.Run("Valid token", func(t *testing.T) {
		got, err := CheckToken(&OkStruct{}, "1:")
		if err != nil {
			t.Error("Got an error when we didn't want one")
		}

		if got != 1 {
			t.Errorf("Got %v - wanted 1")
		}
	})

	t.Run("We get an error", func(t *testing.T) {
		_, err := CheckToken(&ErrorStruct{}, "1:")
		if err == nil {
			t.Error("We din't get an error.")
		}
	})
}
