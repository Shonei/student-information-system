package mw

import (
	"bytes"
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
		status int
		auth   string
		want   string
	}{
		{"Passes", 401, "", ""},
		{"Passes", 401, "", "Invalid JWT"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			ts := httptest.NewServer(BasicAuth(GetTestHandler()))
			defer ts.Close()
			var u bytes.Buffer
			u.WriteString(string(ts.URL))

			req, _ := http.NewRequest("GET", u.String(), nil)
			req.Header.Set("Authorization", tt.auth)
			req.AddCookie(&http.Cookie{Name: "token"})

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
