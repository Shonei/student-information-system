package dbc

import (
	"errors"
	"fmt"
	"testing"

	"github.com/Shonei/student-information-system/go-packages/dba"
)

type TestStruct struct {
}

func (t *TestStruct) Select(s string, args ...interface{}) string {
	val, _ := args[0].(string)
	return val
}

func (t *TestStruct) SelectMulti(s string, args ...interface{}) ([]map[string]string, error) {
	if len(args) > 0 {
		return nil, errors.New("Fail")
	}
	arr := []map[string]string{}
	arr[0] = map[string]string{s: s}
	return arr, nil
}

func (t *TestStruct) PreparedStmt(s string, args ...interface{}) error {
	if len(args) > 0 {
		if args[0] == "err" {
			return errors.New("Fail")
		}
	}
	return nil
}

func TestSingleParamQuery(t *testing.T) {
	type args struct {
		db    dba.DBAbstraction
		query string
		param string
	}
	tests := []struct {
		name string
		args args
		want string
	}{
		{name: "No retun",
			args: args{&TestStruct{}, "not-salt", ""},
			want: ""},
		{name: "Valid return",
			args: args{&TestStruct{}, "salt", "value"},
			want: "value"},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := SingleParamQuery(tt.args.db, tt.args.query, tt.args.param); got != tt.want {
				t.Errorf("SingleParamQuery() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestGenAuthToken(t *testing.T) {
	t.Run("No error", func(t *testing.T) {
		got, err := GenAuthToken(&TestStruct{}, "Shyl", "")
		if err != nil {
			t.Errorf("Got error we don't want error - %v", err)
		}
		fmt.Println(len(got))
		if len(got) != 133 {
			t.Errorf("Hash was not generated - %v", got)
		}
	})

	t.Run("Returning an error", func(t *testing.T) {
		_, err := GenAuthToken(&TestStruct{}, "Shyl", "")
		if err == nil {
			t.Errorf("Got erro don't want error")
		}
	})
}
func TestCheckToken(t *testing.T) {
	type args struct {
		db    dba.DBAbstraction
		token string
	}
	tests := []struct {
		name string
		args args
		want int
	}{
		{name: "valid output",
			args: args{&TestStruct{}, "1:2"},
			want: 1},
		{name: "Error occured",
			args: args{&TestStruct{}, "sfh:2"},
			want: -1},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := CheckToken(tt.args.db, tt.args.token); got != tt.want {
				t.Errorf("CheckToken() = %v, want %v", got, tt.want)
			}
		})
	}
}
