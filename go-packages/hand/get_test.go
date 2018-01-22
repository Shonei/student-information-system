package hand

import (
	"bytes"
	"errors"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/Shonei/student-information-system/go-packages/dbc"
)

func TestGetSalt(t *testing.T) {
	tests := []struct {
		name   string
		f      func(string) (string, error)
		status int
		want   string
	}{
		{"Passes", func(s string) (string, error) { return "hello", nil }, 200, `{"salt":"hello"}`},
		{"unknown fail", func(s string) (string, error) { return "", errors.New("sgd") }, 500, `We encountered an error. Please try again.`},
		{"token error", func(s string) (string, error) { return "", &dbc.TokenError{404, "No"} }, 404, `No`},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			ts := httptest.NewServer(GetSalt(tt.f))
			defer ts.Close()
			var u bytes.Buffer
			u.WriteString(string(ts.URL))

			req, _ := http.NewRequest("GET", u.String(), nil)

			res, err := http.DefaultClient.Do(req)
			if err != nil {
				t.Error("Error in http.Get")
			}

			if res != nil {
				defer res.Body.Close()
			}

			if res.StatusCode != tt.status {
				t.Error("Status is not internalservarerror as expected")
			}

			b, err := ioutil.ReadAll(res.Body)
			if err != nil {
				t.Error("Error in ReadAll")
			}

			str := string(b)
			if !strings.Contains(str, tt.want) {
				t.Errorf("Expected '%v' - got '%v'", tt.want, str)
			}
		})
	}
}

func TestGetToken(t *testing.T) {
	tests := []struct {
		name   string
		f      func(string, string) (string, error)
		status int
		want   string
	}{
		{"Passes", func(s1, s2 string) (string, error) { return "hello", nil }, 200, `{"token":"hello"}`},
		{"unknown fail", func(s1, s2 string) (string, error) { return "", errors.New("sgd") }, 500, `We encountered an error. Please try again.`},
		{"token error", func(s1, s2 string) (string, error) { return "", &dbc.TokenError{404, "No"} }, 404, `No`},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			ts := httptest.NewServer(GetToken(tt.f))
			defer ts.Close()
			var u bytes.Buffer
			u.WriteString(string(ts.URL))

			req, _ := http.NewRequest("GET", u.String(), nil)

			res, err := http.DefaultClient.Do(req)
			if err != nil {
				t.Error("Error in http.Get")
			}

			if res != nil {
				defer res.Body.Close()
			}

			if res.StatusCode != tt.status {
				t.Error("Status is not internalservarerror as expected")
			}

			b, err := ioutil.ReadAll(res.Body)
			if err != nil {
				t.Error("Error in ReadAll")
			}

			str := string(b)
			if !strings.Contains(str, tt.want) {
				t.Errorf("Expected '%v' - got '%v'", tt.want, str)
			}
		})
	}
}

func TestGetStudentPro(t *testing.T) {
	tests := []struct {
		name   string
		f      func(string) (map[string]string, error)
		status int
		want   string
	}{
		{"Passes", func(s string) (map[string]string, error) { return map[string]string{"hello": "test"}, nil }, 200, `{"hello":"test"}`},
		{"fails", func(s string) (map[string]string, error) { return nil, errors.New("sgd") }, 500, `We were unable to retrieve the profile`},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			ts := httptest.NewServer(GetStudentPro(tt.f))
			defer ts.Close()
			var u bytes.Buffer
			u.WriteString(string(ts.URL))

			req, _ := http.NewRequest("GET", u.String(), nil)

			res, err := http.DefaultClient.Do(req)
			if err != nil {
				t.Error("Error in http.Get")
			}

			if res != nil {
				defer res.Body.Close()
			}

			if res.StatusCode != tt.status {
				t.Error("Status is not internalservarerror as expected")
			}

			b, err := ioutil.ReadAll(res.Body)
			if err != nil {
				t.Error("Error in ReadAll")
			}

			str := string(b)
			if !strings.Contains(str, tt.want) {
				t.Errorf("Expected '%v' - got '%v'", tt.want, str)
			}
		})
	}
}
