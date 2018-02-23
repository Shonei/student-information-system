package hand

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/Shonei/student-information-system/go-packages/utils"
)

type Test struct {
	Str string `json:"name"`
	I   int
	Err error
}

func (c *Test) Decode(d *json.Decoder) error {
	return d.Decode(c)
}

func (c *Test) Execute(db utils.Execute) error {
	c.I++
	return c.Err
}

type FakeDB struct{}

// just a place holder function.
// The reqal one is called from Execute on the utils.DecoderExecuter method
func (db *FakeDB) Execute(string, ...interface{}) error {
	return nil
}

func TestUpdate(t *testing.T) {
	tests := []struct {
		name   string
		body   string
		status int
		want   string
		calls  int
		dc     *Test
		f      func(utils.DecoderExecuter) error
	}{
		{"All goes well", `{"name":"Hello"}`, 200, "Hello", 1, &Test{},
			func(dc utils.DecoderExecuter) error { return dc.Execute(&FakeDB{}) }},
		{"Malformed JSON", `{"name":"Hello}`, 400, "", 0, &Test{},
			func(dc utils.DecoderExecuter) error { return dc.Execute(&FakeDB{}) }},
		{"Fail databse update", `{"name":"Hello"}`, 500, "Hello", 1, &Test{Err: utils.ErrSuspiciousInput},
			func(dc utils.DecoderExecuter) error { return dc.Execute(&FakeDB{}) }},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			ts := httptest.NewServer(Update(tt.dc, tt.f))
			defer ts.Close()
			var u bytes.Buffer
			u.WriteString(string(ts.URL))

			req, _ := http.NewRequest("POST", u.String(), strings.NewReader(tt.body))

			res, err := http.DefaultClient.Do(req)
			if err != nil {
				t.Error("Error in http.Post")
			}

			// clean memory after request
			if res != nil {
				defer res.Body.Close()
			}

			// check http status
			if res.StatusCode != tt.status {
				t.Errorf("Wanted %v - Got %v.", tt.status, res.StatusCode)
			}

			// check read data
			if tt.dc.Str != tt.want {
				t.Errorf("Wanted %v - Got %v.", tt.want, tt.dc.Str)
			}

			// check if callback was called
			if tt.dc.I != tt.calls {
				t.Errorf("The callback was not called %v", tt.dc.I)
			}
		})
	}
}
