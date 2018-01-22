package mw

import (
	"bytes"
	"errors"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func GetTestHandler() http.HandlerFunc {
	fn := func(rw http.ResponseWriter, req *http.Request) {}
	return http.HandlerFunc(fn)
}

func TestBasicAuth(t *testing.T) {
	tests := []struct {
		name   string
		f      func(string) (int, error)
		status int
		auth   string
		want   string
	}{
		{"Passes", func(s string) (int, error) { return 1, nil }, 200, "", ""},
		{"Passes", func(s string) (int, error) { return 1, errors.New("sgd") }, 500, "", `We encountered an error authenticating you`},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			ts := httptest.NewServer(BasicAuth(tt.f, GetTestHandler()))
			defer ts.Close()
			var u bytes.Buffer
			u.WriteString(string(ts.URL))

			req, _ := http.NewRequest("GET", u.String(), nil)
			req.Header.Set("Authorization", tt.auth)

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
