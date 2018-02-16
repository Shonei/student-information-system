package mw

import (
	"bytes"
	"io/ioutil"
	"log"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
)

func GetTestHandler() http.HandlerFunc {
	fn := func(rw http.ResponseWriter, req *http.Request) {}
	return http.HandlerFunc(fn)
}

func getCookie(lvl int, t int64) http.Cookie {
	claims := customToken{
		"user", lvl,
		jwt.StandardClaims{
			ExpiresAt: t,
			Issuer:    "test",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS512, claims)
	ss, err := token.SignedString([]byte("AllYourBase"))
	if err != nil {
		log.Fatal("Can't make cookie so we crash")
	}

	return http.Cookie{Name: "token", Value: ss, Expires: time.Now().Add(3 * time.Minute)}
}

func TestBasicAuth(t *testing.T) {
	tests := []struct {
		name   string
		status int
		want   string
		cookie http.Cookie
	}{
		{"Invalid cookie", 401, "", http.Cookie{Name: "token"}},
		{"No token", 401, "We were unable to validate your token.", http.Cookie{Name: "token"}},
		{"Student reading staff data", 401, "You don't have the authority to access that resource.",
			getCookie(1, time.Now().Add(2*time.Hour).Unix())},
		{"Passes", 200, "", getCookie(3, time.Now().Add(2*time.Hour).Unix())},
		{"Expired token", 401, "We were unable to validate your token.", getCookie(3, time.Now().Add(-2*time.Hour).Unix())},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			ts := httptest.NewServer(BasicAuth(GetTestHandler()))
			defer ts.Close()
			var u bytes.Buffer
			u.WriteString(string(ts.URL))

			req, _ := http.NewRequest("GET", u.String(), nil)
			req.AddCookie(&tt.cookie)

			res, err := http.DefaultClient.Do(req)
			if err != nil {
				t.Error("Error in http.Get")
			}

			if res != nil {
				defer res.Body.Close()
			}

			if res.StatusCode != tt.status {
				t.Errorf("Want %v - Got %v", tt.status, res.StatusCode)
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

func TestStaffOnly(t *testing.T) {
	tests := []struct {
		name   string
		status int
		want   string
		cookie http.Cookie
	}{
		{"Invalid cookie", 401, "", http.Cookie{Name: "token"}},
		{"No token", 401, "We were unable to validate your token.", http.Cookie{Name: "token"}},
		{"Student reading staff data", 401, "You don't have the authority to access that resource.",
			getCookie(1, time.Now().Add(2*time.Hour).Unix())},
		{"Passes", 200, "", getCookie(3, time.Now().Add(2*time.Hour).Unix())},
		{"Expired token", 401, "We were unable to validate your token.", getCookie(3, time.Now().Add(-2*time.Hour).Unix())},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			ts := httptest.NewServer(StaffOnly(GetTestHandler()))
			defer ts.Close()
			var u bytes.Buffer
			u.WriteString(string(ts.URL))

			req, _ := http.NewRequest("GET", u.String(), nil)
			req.AddCookie(&tt.cookie)

			res, err := http.DefaultClient.Do(req)
			if err != nil {
				t.Error("Error in http.Get")
			}

			if res != nil {
				defer res.Body.Close()
			}

			if res.StatusCode != tt.status {
				t.Errorf("Want %v - Got %v", tt.status, res.StatusCode)
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
