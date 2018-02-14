package hand

import (
	"bytes"
	"errors"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/Shonei/student-information-system/go-packages/utils"
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
		f      func(string, string) (map[string]string, error)
		status int
		want   string
	}{
		{"Passes", func(s1, s2 string) (map[string]string, error) { return map[string]string{"token": "token"}, nil }, 200, `{"token":"token"}`},
		{"unknown fail", func(s1, s2 string) (map[string]string, error) { return nil, errors.New("sgd") }, 500, `We encountered an error. Please try again.`},
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

func TestGetProfile(t *testing.T) {
	tests := []struct {
		name   string
		f      func(string) (map[string]string, error)
		status int
		want   string
	}{
		{"Passes", func(s string) (map[string]string, error) { return map[string]string{"hello": "test"}, nil }, 200, `{"hello":"test"}`},
		{"fails", func(s string) (map[string]string, error) { return nil, errors.New("sgd") }, 500, `We were unable to retrieve the profile`},
		{"no rows returned", func(s string) (map[string]string, error) { return nil, utils.ErrEmptySQLSet }, 200, `{}`},
		{"Suspicious input", func(s string) (map[string]string, error) { return nil, utils.ErrSuspiciousInput }, 400, `Input contains special characters.`},
		{"too many rows", func(s string) (map[string]string, error) { return nil, utils.ErrToManyRows }, 400, `No matches for input.`},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			ts := httptest.NewServer(GetProfile(tt.f))
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
				t.Error("Expected '%v' - got '%v'", tt.status, res.StatusCode)
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

func TestBasicGet(t *testing.T) {
	tests := []struct {
		name   string
		f      func(string) ([]map[string]string, error)
		status int
		want   string
	}{
		{"Passes", func(s string) ([]map[string]string, error) { return []map[string]string{{"hello": "test"}}, nil }, 200, `[{"hello":"test"}]`},
		{"fails", func(s string) ([]map[string]string, error) { return nil, errors.New("sgd") }, 500, `We encountered an unexpected error retrieving the data.`},
		{"no rows returned", func(s string) ([]map[string]string, error) { return nil, utils.ErrEmptySQLSet }, 200, `[]`},
		{"Suspicious input", func(s string) ([]map[string]string, error) { return nil, utils.ErrSuspiciousInput }, 400, `Input contains special characters.`},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			ts := httptest.NewServer(BasicGet(tt.f))
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
