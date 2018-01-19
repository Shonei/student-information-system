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
	t.Run("Auth pass", func(t *testing.T) {
		ts := httptest.NewServer(BasicAuth(func(str string) (int, error) {
			return 1, nil
		}, GetTestHandler()))
		defer ts.Close()
		var u bytes.Buffer
		u.WriteString(string(ts.URL))
		u.WriteString("/get/salt/shyl1")
		u.WriteString("Authorization: 1:")

		res, err := http.Get(u.String())
		if err != nil {
			t.Error("Error in http.Get")
		}

		if res != nil {
			defer res.Body.Close()
		}

		if res.StatusCode != 200 {
			t.Error("Status is not 200 as expected")
		}
	})

	t.Run("Auth failes", func(t *testing.T) {
		ts := httptest.NewServer(BasicAuth(func(str string) (int, error) {
			return 1, errors.New("")
		}, GetTestHandler()))
		defer ts.Close()
		var u bytes.Buffer
		u.WriteString(string(ts.URL))

		res, err := http.Get(u.String())
		if err != nil {
			t.Error("Error in http.Get")
		}

		if res != nil {
			defer res.Body.Close()
		}

		if res.StatusCode != http.StatusInternalServerError {
			t.Error("Status is not internalservarerror as expected")
		}

		b, err := ioutil.ReadAll(res.Body)
		if err != nil {
			t.Error("Error in ReadAll")
		}

		str := string(b)
		want := "We encountered an error authenticating you"
		if !strings.Contains(str, want) {
			t.Errorf("Expected '%v' - got '%v'", want, str)
		}
	})
}
