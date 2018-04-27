-- PLPGSQL VERSION OF A FUNCTION
-- CREATE OR REPLACE FUNCTION get_student_profile(TEXT) 
-- RETURNS TABLE(id INT, first_name TEXT, middle_name TEXT, last_name TEXT, email TEXT, current_level INT, picture_url TEXT, entry_year DATE) AS $$
--     BEGIN
-- 	RETURN query
--       SELECT  student.id, student.first_name, student.middle_name, student.last_name, student.email, student.current_level, student.picture_url, student.entry_year
--       FROM student 
--       INNER JOIN login_info ON (student.id = login_info.id) 
--       WHERE login_info.username = $1;
--     END;
--     $$
--   LANGUAGE plpgsql;

-- SQL VERSION OF A FUNCTION

-- GET STUDENT PROFILE
-- DROP FUNCTION get_student_profile(TEXT);
CREATE OR REPLACE FUNCTION get_student_profile(TEXT) 
RETURNS TABLE(id INT, first_name TEXT, middle_name TEXT, last_name TEXT, email TEXT, current_level INT, picture_url TEXT, entry_year DATE) 
AS $$
  SELECT  student.id, student.first_name, student.middle_name, student.last_name, student.email, student.current_level, student.picture_url, student.entry_year
  FROM student 
  INNER JOIN login_info ON (student.id = login_info.id) 
  WHERE login_info.username = $1 $$
LANGUAGE SQL;

-- GET STAFF PROFILE
-- DROP FUNCTION get_staff_profile(TEXT);
CREATE OR REPLACE FUNCTION get_staff_profile(TEXT) 
RETURNS TABLE(id INT, first_name TEXT, middle_name TEXT, last_name TEXT, email TEXT, address1 TEXT, address2 TEXT, phone TEXT) 
AS $$
  SELECT login_info.id, staff.first_name, staff.middle_name, staff.last_name, staff.email, staff.address1, staff.address2, staff.phone 
  FROM staff 
  INNER JOIN login_info ON login_info.id = staff.id 
  WHERE login_info.username = $1 $$
LANGUAGE SQL;

-- GET STUDENT CURRENT MODULES
-- DROP FUNCTION get_student_current_modules(TEXT);
CREATE OR REPLACE FUNCTION get_student_current_modules(TEXT) 
RETURNS TABLE(code TEXT, name TEXT, study_year DATE, result INT) 
AS $$
  SELECT module.code, module.name, student_modules.study_year, student_modules.result 
  FROM student_modules 
  INNER JOIN module ON module.code = student_modules.module_code 
  INNER JOIN student ON student.id = student_modules.student_id 
  INNER JOIN login_info ON student_modules.student_id = login_info.id 
  WHERE login_info.username = $1 
  AND to_char(student_modules.study_year, 'YYYY') = to_char(NOW(), 'YYYY') $$
LANGUAGE SQL;

-- GET STUDENT PAST MODULES
-- DROP FUNCTION get_student_past_modules(TEXT);
CREATE OR REPLACE FUNCTION get_student_past_modules(TEXT) 
RETURNS TABLE(code TEXT, name TEXT, stude_year DATE, result INT) 
AS $$
  SELECT module.code, module.name, student_modules.study_year, student_modules.result 
  FROM student_modules 
  INNER JOIN module ON module.code = student_modules.module_code 
  INNER JOIN student ON student.id = student_modules.student_id 
  INNER JOIN login_info ON student_modules.student_id = login_info.id 
  WHERE login_info.username = $1 
  AND NOT to_char(student_modules.study_year, 'YYYY') = to_char(NOW(), 'YYYY') $$
LANGUAGE SQL;

-- GET STRUDENT CWK RESULTS
-- DROP FUNCTION get_student_cwk_results(TEXT);
CREATE OR REPLACE FUNCTION get_student_cwk_results(TEXT) 
RETURNS TABLE(module_code TEXT, cwk_name TEXT, percentage INT, marks INT, result INT) 
  AS $$
  SELECT coursework.module_code, coursework.cwk_name, coursework.percentage, coursework.marks, coursework_result.result 
  FROM coursework 
  INNER JOIN coursework_result ON coursework_result.coursework_id = coursework.id 
  INNER JOIN student ON coursework_result.student_id = student.id 
  INNER JOIN login_info ON student.id = login_info.id 
  WHERE login_info.username = $1 
  AND coursework_result.result IS NOT NULL $$
LANGUAGE SQL;

-- GET STUDENT CWK TIMETABLE
-- DROP FUNCTION get_student_cwk_timetable(TEXT); 
CREATE OR REPLACE FUNCTION get_student_cwk_timetable(TEXT) 
RETURNS TABLE(cwk_name TEXT, posted_on DATE, deadline DATE) 
  AS $$
  SELECT coursework.cwk_name, coursework.posted_on, coursework.deadline 
  FROM coursework 
  INNER JOIN coursework_result ON coursework_result.coursework_id = coursework.id 
  INNER JOIN student ON coursework_result.student_id = student.id 
  INNER JOIN login_info ON student.id = login_info.id  
  WHERE login_info.username = $1 
  AND coursework_result.result IS NULL $$
LANGUAGE SQL;

-- GET STAFF MODULES
-- DROP FUNCTION get_staff_modules(TEXT);
CREATE OR REPLACE FUNCTION get_staff_modules(TEXT) 
RETURNS TABLE(code TEXT, name TEXT, staff_role TEXT) 
AS $$
  SELECT module.code, module.name, teaching.staff_role 
  FROM module 
  INNER JOIN teaching ON teaching.module_code = module.code 
  INNER JOIN staff ON staff.id = teaching.staff_id 
  INNER JOIN login_info ON login_info.id = staff.id 
  WHERE login_info.username = $1 $$
LANGUAGE SQL;

-- GET STAFF TUTEES
-- DROP FUNCTION get_staff_tutees(TEXT);
CREATE OR REPLACE FUNCTION get_staff_tutees(TEXT) 
RETURNS TABLE(username TEXT, id INT, programme_code TEXT, year TEXT) 
AS $$
  SELECT login_info.username, student.id, student.programme_code, to_char(tutor.suppervision_year, 'YYYY') AS year 
  FROM tutor 
  INNER JOIN student ON student.id = tutor.student_id 
  INNER JOIN staff ON staff.id = tutor.staff_id 
  INNER JOIN login_info ON login_info.id = student.id 
  WHERE tutor.staff_id = (SELECT id FROM login_info WHERE username = $1) $$
LANGUAGE SQL;

-- DROP FUNCTION make_name(TEXT, TEXT, TEXT);
CREATE OR REPLACE FUNCTION make_name(TEXT, TEXT, TEXT) RETURNS TEXT AS $$
SELECT ($1::TEXT || ' '::TEXT || $2::TEXT || ' '::TEXT || $3::TEXT) $$
LANGUAGE SQL;

CREATE OR REPLACE FUNCTION search_staff(TEXT) 
RETURNS TABLE(name TEXT, username TEXT, id INT)
AS $$
  SELECT make_name(staff.first_name, staff.middle_name, staff.last_name) AS name, login_info.username, login_info.id
  FROM staff
  INNER JOIN login_info ON staff.id = login_info.id
  WHERE login_info.username ~* $1
  OR login_info.id::TEXT ~* $1
  OR make_name(staff.first_name, staff.middle_name, staff.last_name) ~* $1 $$
LANGUAGE SQL;


CREATE OR REPLACE FUNCTION search_student(TEXT) 
RETURNS TABLE(name TEXT, username TEXT, id INT)
AS $$
  SELECT make_name(student.first_name, student.middle_name, student.last_name) AS name, login_info.username, login_info.id
  FROM student
  INNER JOIN login_info ON student.id = login_info.id
  WHERE login_info.username ~* $1
  OR login_info.id::TEXT ~* $1
  OR make_name(student.first_name, student.middle_name, student.last_name) ~* $1 $$
LANGUAGE SQL;

CREATE OR REPLACE FUNCTION search_programme(TEXT) 
RETURNS TABLE(name TEXT, code TEXT, UCAS_code TEXT)
AS $$
  SELECT  programme.name, programme.code, programme.UCAS_code
  FROM programme
  WHERE programme.name ~* $1
  OR programme.code ~* $1
  OR programme.UCAS_code ~* $1 $$
LANGUAGE SQL;

CREATE OR REPLACE FUNCTION search_module(TEXT) 
RETURNS TABLE(name TEXT, code TEXT)
AS $$
  SELECT  module.name, module.code
  FROM module
  WHERE module.name ~* $1
  OR module.code ~* $1 $$
LANGUAGE SQL;

-- get module details
CREATE OR REPLACE FUNCTION get_module_details(TEXT) 
RETURNS TABLE(code TEXT, name TEXT, description TEXT, syllabus TEXT, semester INT, year INT, credits INT, cwks JSON, exam JSON, prerequisites JSON)
AS $$
  SELECT module.code , module.name , module.description , module.syllabus , module.semester , module.year_of_study AS year , module.credits,
  to_json(ARRAY(SELECT row_to_json(r) FROM (SELECT id, cwk_name, marks, percentage FROM coursework WHERE module_code = $1) r)) as cwks,
  to_json(ARRAY(SELECT row_to_json(r) FROM (SELECT code, percentage, type FROM exam WHERE module_code = $1) r)) as exam,
  to_json(ARRAY(SELECT row_to_json(r) FROM (SELECT code, name FROM module WHERE code in (SELECT prerequisite_code FROM prerequisites WHERE module_code = $1)) r)) as prerequisites
  FROM module
  WHERE module.code = $1 $$
LANGUAGE SQL;

-- Get coursework details
CREATE OR REPLACE FUNCTION get_cwk_details(INT) 
RETURNS TABLE(module_code TEXT, id INT, name TEXT, posted_on DATE, deadline DATE, percentage INT, marks INT, description TEXT)
AS $$
  SELECT module_code, id, cwk_name, posted_on, deadline, percentage, marks, description
  FROM coursework
  WHERE id = $1 $$
LANGUAGE SQL;

-- get students taking coursework
-- STUDENT.ID IS DUPLICATED
CREATE OR REPLACE FUNCTION get_cwk_students(INT) 
RETURNS TABLE(student_id INT, result INT, username TEXT, handed_in DATE)
AS $$
  SELECT coursework_result.student_id, coursework_result.result, login_info.username, coursework_result.handed_in
  FROM coursework
  INNER JOIN coursework_result ON coursework_result.coursework_id = coursework.id
  INNER JOIN student ON student.id = coursework_result.student_id
  INNER JOIN login_info ON login_info.id = student.id
  WHERE coursework.id = $1 $$ 
LANGUAGE SQL;

-- update students cwk result
-- CREATE OR REPLACE FUNCTION update_student_cwk(INT, DATE, INT, INT)
-- RETURNS BOOLEAN AS $$
-- BEGIN 
--   UPDATE coursework_result
--   SET result = $1, handed_in = $2
--   WHERE coursework_id = $3
--   AND student_id = $4;
--   RETURN TRUE;
-- END;
-- $$
-- LANGUAGE plpgsql;

-- Creates the update exam % query
-- CREATE OR REPLACE FUNCTION change_exam_percentage(INT, TEXT) 
-- RETURNS BOOLEAN AS $$
-- BEGIN 
--   UPDATE exam SET percentage = $1 WHERE code = $2;
--   RETURN TRUE;
-- END;
-- $$
-- LANGUAGE plpgsql;

-- creates function to update cwk marks and %
-- CREATE OR REPLACE FUNCTION change_cwk_marks_and_percent(INT, INT, INT) 
-- RETURNS BOOLEAN AS $$
-- BEGIN 
--   UPDATE coursework SET percentage = $1, marks = $2 WHERE id = $3;
--   RETURN TRUE;
-- END;
-- $$
-- LANGUAGE plpgsql;

-- CREATE OR REPLACE FUNCTION lorem() RETURNS TEXT AS $$
-- LANGUAGE SQL;

-- gets all the studetns enrolled on a module
CREATE OR REPLACE FUNCTION get_module_students(TEXT) 
RETURNS TABLE(id INT, username TEXT) 
AS $$
	SELECT student_modules.student_id, login_info.username FROM student_modules
	INNER JOIN module ON module.code = student_modules.module_code
	INNER JOIN student ON student.id = student_modules.student_id
	INNER JOIN login_info ON login_info.id = student.id
	WHERE module.code = $1
	AND to_char(student_modules.study_year, 'YYYY') = to_char(NOW(), 'YYYY') $$
LANGUAGE SQL;

CREATE OR REPLACE FUNCTION lorem() RETURNS TEXT AS $$ 
BEGIN 
  RETURN 'Lorem ipsum dolor sit amet, tincidunt vel massa in eu fermentum, leo tortor nec, nec tellus ut dictum in et urna. Sollicitudin rhoncus mi eros mauris magna nisl, dis lorem tincidunt, maecenas nec vestibulum non at, posuere justo placerat velit sed. Et sapien a, mus feugiat nunc. In id vel, vitae ipsum vitae maecenas ante vel. Mi eu, non vulputate, urna facilisis volutpat, sed malesuada id adipiscing placerat posuere donec, iaculis natus rhoncus sed. Leo est ac proin nulla aliquam fermentum, amet donec ornare, a conubia semper, id montes tellus. Et sagittis risus, sollicitudin at sem risus, quis ultricies dictum et tempus, vestibulum augue velit vehicula nec, massa felis vel. Fames porta, ultrices urna etiam quis, in justo sit, proin ac nam, ipsum vitae. Sem augue wisi nec quam, nulla augue eros et egestas integer lectus.';
END;
$$
LANGUAGE plpgsql;