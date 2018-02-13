CREATE TABLE login_info(id INT PRIMARY KEY, user_pass TEXT, username TEXT UNIQUE, salt TEXT, access_lvl TEXT, expire_date TIMESTAMP, token TEXT UNIQUE);
CREATE TABLE staff(id INT PRIMARY KEY REFERENCES login_info(id), first_name TEXT, middle_name TEXT, last_name TEXT, email TEXT, address1 TEXT, address2 TEXT, phone TEXT, picture_url TEXT);
CREATE TABLE programme(code TEXT PRIMARY KEY, UCAS_code TEXT, duration INT, manager INT REFERENCES staff(id), attendance TEXT, school TEXT); 
CREATE TABLE module(code TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT, syllabus TEXT, semester INT NOT NULL, year_of_study INT NOT NULL, credits INT NOT NULL);
-- Place student automatically on mendaroty modules depending on the programme they are taking
CREATE TABLE student(id INT PRIMARY KEY REFERENCES login_info(id), first_name TEXT, middle_name TEXT, last_name TEXT, email TEXT, current_level INT, programme_code TEXT REFERENCES programme(code), picture_url TEXT, gender TEXT, dob DATE, entry_year DATE, home_phone TEXT, home_address TEXT, local_phone TEXT, local_address TEXT);
CREATE TABLE timetable(module_code TEXT REFERENCES module(code), meeting_type TEXT, meeting_time DATE, room TEXT);
CREATE TABLE prerequisites(module_code TEXT REFERENCES module(code), prerequisite_code TEXT REFERENCES module(code));
CREATE TABLE coursework(module_code TEXT REFERENCES module(code), id INT PRIMARY KEY, cwk_name TEXT, posted_on DATE, deadline DATE, percentage INT, marks INT);
CREATE TABLE teaching(staff_id INT REFERENCES staff(id), module_code TEXT REFERENCES module(code), staff_role TEXT);
CREATE TABLE project(student_id INT REFERENCES student(id), supervisor_id INT REFERENCES staff(id), assessor INT REFERENCES staff(id), project_year DATE, title TEXT);
CREATE TABLE tutor(staff_id INT REFERENCES staff(id), student_id INT REFERENCES student(id), suppervision_year DATE);
CREATE TABLE student_modules(module_code TEXT REFERENCES module(code), student_id INT REFERENCES student(id), study_year DATE, result INT);

-- Students should be placed here automatically once they are placed on a module
CREATE TABLE coursework_result(coursework_id INT REFERENCES coursework(id), student_id INT REFERENCES student(id), result INT, handed_in DATE);
-- If the module added is mendatory(must_take) place all students onrolled in the programme on the module
CREATE TABLE programme_modules(module_code TEXT REFERENCES module(code), programme_code TEXT REFERENCES programme(code), year_of_study INT, PFP BOOLEAN NOT NULL, must_take BOOLEAN DEFAULT FALSE);


-- TRIGGERS EXAMPLE
-- CREATE OR REPLACE FUNCTION t() RETURNS TRIGGER AS $tree_stamp$ 
-- BEGIN
--     UPDATE login_info SET NEW.expire_date = NOW();
--     RETURN NEW;
-- END;
-- $tree_stamp$
-- LANGUAGE plpgsql;

-- CREATE TIGGER tt AFTER UPDATE ON login_info
-- FOR ROW EXECUTE PROCEDURE t();

-- SELECT module.code, module.name, student_modules.study_year
-- FROM student_modules
-- INNER JOIN module ON module.code = student_modules.module_code
-- INNER JOIN student ON student.id = student_modules.student_id
-- INNER JOIN login_info ON student_modules.student.id = login_info.username
-- WHERE login_info.username = 'shyl1';