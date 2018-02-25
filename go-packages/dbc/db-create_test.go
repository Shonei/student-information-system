package dbc

import "testing"

func TestCwkSecurityCheck(t *testing.T) {
	tests := []struct {
		name string
		want error
		cwk  *NewCwk
	}{
		{"Valid data", nil,
			&NewCwk{
				Id:          114453,
				Name:        "sldgljh&/?",
				PostedOn:    "sdg",
				Deadline:    "sgd",
				Percentage:  45,
				Description: "sdgh2345!()*",
				Marks:       2345}},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := cwkSecurityCheck(tt.cwk)

			if err != tt.want {
				t.Errorf("Want %v - Got %v", tt.want, err)
			}
		})
	}
}
