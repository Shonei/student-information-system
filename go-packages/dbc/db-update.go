package dbc

import (
	"github.com/Shonei/student-information-system/go-packages/utils"
)

// UpdateCwkResults updates a students cwk results based on the data send.
// This function is also used to insert the date when the coursework was submitted.
// This can be done by omiting the 'result' from ht eJSON object.
func UpdateCwkResults(db utils.Execute, exec utils.DecoderExecuter) error {
	return exec.Execute(db, "SELECT * FROM update_student_cwk($1, $2, $3, $4);")
}

// UpdateExamPercentage is used to modify the weight of the exam as a whole
func UpdateExamPercentage(db utils.Execute, exec utils.DecoderExecuter) error {
	return exec.Execute(db, "SELECT * FROM change_exam_percentage($1, $2);")
}

// UpdateCwkPercentage is used to modify the weight of the cwk asw ell as the total marks
func UpdateCwkPercentage(db utils.Execute, exec utils.DecoderExecuter) error {
	return exec.Execute(db, "SELECT * FROM change_cwk_marks_and_percent($1, $2, $3);")
}
