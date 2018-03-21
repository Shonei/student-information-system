package dbc

import (
	"testing"

	"github.com/Shonei/student-information-system/go-packages/utils"
)

type FakeDB struct{}

// Execute always return nil because we want to test the security checks of the data
func (f *FakeDB) Execute(s string, args ...interface{}) error {
	return nil
}

func TestExamPercentExecute(t *testing.T) {
	tests := []struct {
		name string
		want error
		val  ExamPercent
	}{
		{"All goes well", nil, ExamPercent{"sghfsa", 55}},
		{"Code has a .", utils.ErrSuspiciousInput, ExamPercent{"a.", 55}},
		{"Exam has negative %", utils.ErrSuspiciousInput, ExamPercent{"asdg", -1}},
		{"Exam has over 100%", utils.ErrSuspiciousInput, ExamPercent{"asdg", 101}},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := tt.val.Execute(&FakeDB{})

			if err != tt.want {
				t.Errorf("Want %v - Got %v", tt.want, err)
			}
		})
	}
}

func TestCwkMarksExecute(t *testing.T) {
	tests := []struct {
		name string
		want error
		val  CwkMarks
	}{
		{"All goes well", nil, CwkMarks{1, 23, 55}},
		{"Cwk has negative marks", utils.ErrSuspiciousInput, CwkMarks{1, -1, 55}},
		{"Cwk has negative %", utils.ErrSuspiciousInput, CwkMarks{1, 34, -1}},
		{"Cwk has over 100%", utils.ErrSuspiciousInput, CwkMarks{1, 23, 101}},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := tt.val.Execute(&FakeDB{})

			if err != tt.want {
				t.Errorf("Want %v - Got %v", tt.want, err)
			}
		})
	}
}

func TestCwkResultExecute(t *testing.T) {
	tests := []struct {
		name string
		want error
		val  CwkResult
	}{
		{"All goes well", nil, CwkResult{1, 23, 55, "sdg"}},
		{"Cwk has negative marks", utils.ErrSuspiciousInput, CwkResult{1, 1, -1, "dsfg"}},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := tt.val.Execute(&FakeDB{})

			if err != tt.want {
				t.Errorf("Want %v - Got %v", tt.want, err)
			}
		})
	}
}

func TestAddPrerequsiteExecute(t *testing.T) {
	tests := []struct {
		name string
		want error
		val  AddPrerequsite
	}{
		{"All goes well", nil, AddPrerequsite{"(435)dfgh;:{sdf})", ",.234?!dfg'"}},
		{"We have some suspicious characters", utils.ErrSuspiciousInput, AddPrerequsite{"1/", "dsfg"}},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := tt.val.Execute(&FakeDB{})

			if err != tt.want {
				t.Errorf("Want %v - Got %v", tt.want, err)
			}
		})
	}
}

func TestRemovePrerequisiteExecute(t *testing.T) {
	tests := []struct {
		name string
		want error
		val  RemovePrerequisite
	}{
		{"All goes well", nil, RemovePrerequisite{"(435)dfgh;:{sdf})", ",.234?!dfg'"}},
		{"Code has unaccepted characters", utils.ErrSuspiciousInput, RemovePrerequisite{"1/", "dsfg"}},
		{"toBeRemoved has unaccepted characters", utils.ErrSuspiciousInput, RemovePrerequisite{"1sdg", "dsfg+"}},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := tt.val.Execute(&FakeDB{})

			if err != tt.want {
				t.Errorf("Want %v - Got %v", tt.want, err)
			}
		})
	}
}

func TestEditModuleExecute(t *testing.T) {
	tests := []struct {
		name string
		want error
		val  EditModule
	}{
		{"All goes well", nil, EditModule{"", ",.234?!dfg'", "(435)dfgh;:{sdf})", 2, 5, 55}},
		{"Code has unaccepted characters", utils.ErrSuspiciousInput, EditModule{"", "1/", "sgd", 1, 1, 1}},
		{"Description has unaccepted characters", utils.ErrSuspiciousInput, EditModule{"", "dsfg+", "sadf", 1, 1, 1}},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := tt.val.Execute(&FakeDB{})

			if err != tt.want {
				t.Errorf("Want %v - Got %v", tt.want, err)
			}
		})
	}
}
