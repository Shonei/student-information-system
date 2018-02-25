package dbc

import (
	"database/sql"
	"log"
	"os"
	"testing"

	"github.com/Shonei/student-information-system/go-packages/utils"
	_ "github.com/lib/pq"
)

var DB *sql.DB

func getDB() {
	connStr := os.Getenv("DATABASE_URL")
	var err error

	DB, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
}

func TestCwkSecurityCheck(t *testing.T) {
	tests := []struct {
		name string
		want error
		cwk  *NewCwk
	}{
		{"Valid data", nil,
			&NewCwk{
				Id:          114453,
				Name:        "sldgl jh&?",
				PostedOn:    "sdg",
				Deadline:    "sgd",
				Percentage:  45,
				Description: "sdgh2345!()*",
				Marks:       2345}},
		{"invalid character", utils.ErrSuspiciousInput,
			&NewCwk{
				Id:          114453,
				Name:        "sldgl |jh&?",
				PostedOn:    "sdg",
				Deadline:    "sgd",
				Percentage:  45,
				Description: "sdgh2345!()*",
				Marks:       2345}},
		{"percent over 100", utils.ErrSuspiciousInput,
			&NewCwk{
				Id:          114453,
				Name:        "sldgl jh&?",
				PostedOn:    "sdg",
				Deadline:    "sgd",
				Percentage:  101,
				Description: "sdgh2345!()*",
				Marks:       2345}},
		{"Empty struct", utils.ErrEmptyStruct,
			&NewCwk{}},
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

func TestExamSecurityCheck(t *testing.T) {
	tests := []struct {
		name string
		want error
		cwk  *NewExam
	}{
		{"Valid data", nil,
			&NewExam{
				Code:        "sdg25gdf",
				Percentage:  34,
				Type:        "2354sdg'@",
				Description: "*%%s '\"!?,.dfg"}},
		{"invalid character", utils.ErrSuspiciousInput,
			&NewExam{
				Code:        "sdg25@gdf",
				Percentage:  34,
				Type:        "2354sdg'@",
				Description: "*%$$%s '\"!?,.dfg"}},
		{"percent over 100", utils.ErrSuspiciousInput,
			&NewExam{
				Code:        "sdg25gdf",
				Percentage:  555,
				Type:        "2354sdg'@",
				Description: "*%$%s '\"!?,.dfg"}},
		{"Empty struct", utils.ErrEmptyStruct,
			&NewExam{}},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := examSecurityCheck(tt.cwk)

			if err != tt.want {
				t.Errorf("Want %v - Got %v", tt.want, err)
			}
		})
	}
}

func TestModuleSecurityCheck(t *testing.T) {
	tests := []struct {
		name string
		want error
		cwk  *NewModule
	}{
		{"Valid data", nil,
			&NewModule{
				Name:        "sdg25gdf",
				Semester:    1,
				Syllabus:    "2354sdg'@",
				Description: "*%%s '\"!?,.dfg"}},
		{"invalid character", utils.ErrSuspiciousInput,
			&NewModule{
				Name:        "sdg25@gdf",
				Semester:    34,
				Syllabus:    "2354sdg'@",
				Description: "*%$$%s '\"!?,.dfg"}},
		{"invalid semester", utils.ErrSuspiciousInput,
			&NewModule{
				Name:        "sdg25gdf",
				Semester:    3,
				Syllabus:    "2354sdg'@",
				Description: "*%$%s '\"!?,.dfg"}},
		{"invalid semester", utils.ErrSuspiciousInput,
			&NewModule{
				Name:        "sdg25gdf",
				Semester:    0,
				Syllabus:    "2354sdg'@",
				Description: "*%$%s '\"!?,.dfg"}},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := moduleSecurityCheck(tt.cwk)

			if err != tt.want {
				t.Errorf("Want %v - Got %v", tt.want, err)
			}
		})
	}
}

func TestCreateFunctions(t *testing.T) {
	getDB()
	defer DB.Close()

	t.Run("testing AddStaff", func(t *testing.T) {
		tests := []struct {
			name  string
			code  int
			want  error
			staff *AddStaff
		}{
			{"all goes well", 10684, nil,
				&AddStaff{37362, "hello"}},
			{"syspicious input", 10684, utils.ErrSuspiciousInput,
				&AddStaff{37362, "hello$"}},
			{"no staff", 10684, nil,
				&AddStaff{}},
			{"Wrong module code", 1684, utils.ErrSQLFailed,
				&AddStaff{37362, "hello"}},
		}

		for _, tt := range tests {
			t.Run(tt.name, func(t *testing.T) {
				tx, err := DB.Begin()
				if err != nil {
					t.Error("Can't crete transaction")
				}

				err = tt.staff.AddStaff(tx, tt.code)
				if err != tt.want {
					t.Errorf("Want %v - Got %v", tt.want, err)
				}

				tx.Rollback()
			})
		}
	})

	t.Run("testing AddCwk", func(t *testing.T) {
		tests := []struct {
			name string
			code int
			want error
			cwk  *NewCwk
		}{
			{"all goes well", 10684, nil,
				&NewCwk{
					Id:          39141,
					Name:        "sgds",
					PostedOn:    "2017-12-12",
					Deadline:    "2018-12-12",
					Percentage:  30,
					Description: "slkjdhgsdlkghds",
					Marks:       40}},
			{"same cwk code", 10684, utils.ErrSQLFailed,
				&NewCwk{
					Id:          39041,
					Name:        "sgds",
					PostedOn:    "2017-12-12",
					Deadline:    "2018-12-12",
					Percentage:  30,
					Description: "slkjdhgsdlkghds",
					Marks:       40}},
			{"wrong date", 10684, utils.ErrSQLFailed,
				&NewCwk{
					Id:          39141,
					Name:        "sgds",
					PostedOn:    "2017-12-12",
					Deadline:    "2018-129-12",
					Percentage:  30,
					Description: "slkjdhgsdlkghds",
					Marks:       40}},
			{"empty struct", 10684, nil,
				&NewCwk{}},
		}

		for _, tt := range tests {
			t.Run(tt.name, func(t *testing.T) {
				tx, err := DB.Begin()
				if err != nil {
					t.Error("Can't crete transaction")
				}

				err = tt.cwk.AddCwk(tx, tt.code)
				if err != tt.want {
					t.Errorf("Want %v - Got %v", tt.want, err)
				}

				tx.Rollback()
			})
		}
	})

	t.Run("testing AddExam", func(t *testing.T) {
		tests := []struct {
			name string
			code int
			want error
			exam *NewExam
		}{
			{"all goes well", 10684, nil,
				&NewExam{
					Code:        "sdgf",
					Type:        "sdgsdgd",
					Percentage:  30,
					Description: "slkjdhgsdlkghds"}},
			{"No data provided", 10684, nil,
				&NewExam{}},
			{"use already existing code", 10684, utils.ErrSQLFailed,
				&NewExam{
					Code:        "34633",
					Type:        "sdgsdgd",
					Percentage:  30,
					Description: "slkjdhgsdlkghds"}},
		}

		for _, tt := range tests {
			t.Run(tt.name, func(t *testing.T) {
				tx, err := DB.Begin()
				if err != nil {
					t.Error("Can't crete transaction")
				}

				err = tt.exam.AddExam(tx, tt.code)
				if err != tt.want {
					t.Errorf("Want %v - Got %v", tt.want, err)
				}

				tx.Rollback()
			})
		}
	})

	t.Run("testing AddModule", func(t *testing.T) {
		tests := []struct {
			name   string
			want   error
			module *NewModule
		}{
			{"all goes well", nil,
				&NewModule{
					Code:        235235,
					Name:        "sdgsdgd",
					Syllabus:    "sdgsg46dfg",
					Description: "slkjdhgsdlkghds",
					Semester:    1,
					YearOfStudy: 3,
					Credit:      20}},
			{"same code", utils.ErrSQLFailed,
				&NewModule{
					Code:        86583,
					Name:        "sdgsdgd",
					Syllabus:    "sdgsg46dfg",
					Description: "slkjdhgsdlkghds",
					Semester:    1,
					YearOfStudy: 3,
					Credit:      20}},
		}

		for _, tt := range tests {
			t.Run(tt.name, func(t *testing.T) {
				tx, err := DB.Begin()
				if err != nil {
					t.Error("Can't crete transaction")
				}

				err = tt.module.AddModule(tx)
				if err != tt.want {
					t.Errorf("Want %v - Got %v", tt.want, err)
				}

				tx.Rollback()
			})
		}
	})
}
