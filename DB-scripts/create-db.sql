CREATE TABLE login_info(id INT PRIMARY KEY, user_pass TEXT, username TEXT UNIQUE, salt TEXT, access_lvl TEXT, expire_date TIMESTAMP, token TEXT UNIQUE);
CREATE TABLE staff(id INT PRIMARY KEY REFERENCES login_info(id), first_name TEXT, middle_name TEXT, last_name TEXT, email TEXT, address1 TEXT, address2 TEXT, phone TEXT, picture_url TEXT);
CREATE TABLE programme(name TEXT, code TEXT PRIMARY KEY, UCAS_code TEXT, duration INT, manager INT REFERENCES staff(id), attendance TEXT, school TEXT); 
CREATE TABLE module(code TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT, syllabus TEXT, semester INT NOT NULL, year_of_study INT NOT NULL, credits INT NOT NULL);
CREATE TABLE student(id INT PRIMARY KEY REFERENCES login_info(id), first_name TEXT, middle_name TEXT, last_name TEXT, email TEXT, current_level INT, programme_code TEXT REFERENCES programme(code), picture_url TEXT, gender TEXT, dob DATE, entry_year DATE, home_phone TEXT, home_address TEXT, local_phone TEXT, local_address TEXT);
CREATE TABLE timetable(module_code TEXT REFERENCES module(code), meeting_type TEXT, meeting_time DATE, room TEXT);
CREATE TABLE prerequisites(module_code TEXT REFERENCES module(code), prerequisite_code TEXT REFERENCES module(code));
CREATE TABLE coursework(module_code TEXT REFERENCES module(code), id INT PRIMARY KEY, cwk_name TEXT, posted_on DATE, deadline DATE, percentage INT, marks INT, description TEXT);
CREATE TABLE teaching(staff_id INT REFERENCES staff(id), module_code TEXT REFERENCES module(code), staff_role TEXT);
CREATE TABLE project(student_id INT REFERENCES student(id), supervisor_id INT REFERENCES staff(id), assessor INT REFERENCES staff(id), project_year DATE, title TEXT);
CREATE TABLE tutor(staff_id INT REFERENCES staff(id), student_id INT REFERENCES student(id), suppervision_year DATE);
CREATE TABLE student_modules(module_code TEXT REFERENCES module(code), student_id INT REFERENCES student(id), study_year DATE, result INT);
CREATE TABLE coursework_result(coursework_id INT REFERENCES coursework(id), student_id INT REFERENCES student(id), result INT, handed_in DATE);
CREATE TABLE programme_modules(module_code TEXT REFERENCES module(code), programme_code TEXT REFERENCES programme(code), year_of_study INT, PFP BOOLEAN NOT NULL);
CREATE TABLE exam(code TEXT PRIMARY KEY, module_code TEXT REFERENCES module(code), percentage INT, type TEXT, description TEXT);
CREATE TABLE questions(question TEXT, number INT, marks INT, weight INT, exam_code TEXT REFERENCES exam(code));

-- Place students on coursework once they are placed on a module 
CREATE OR REPLACE FUNCTION student_coursework() RETURNS TRIGGER AS $$ 
BEGIN
  INSERT INTO coursework_result(coursework_id, student_id) 
  SELECT id, NEW.student_id FROM coursework WHERE module_code = NEW.module_code;
  RETURN NULL;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER place_on_cwk AFTER INSERT ON student_modules
FOR ROW EXECUTE PROCEDURE student_coursework();