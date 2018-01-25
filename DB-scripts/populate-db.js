// const { Client } = require('pg');
const faker = require('faker');
const crypto = require('crypto');

// const client = new Client({
//   user: 'shyl',
//   password: '',             // TYPE THE PASSWORD
//   database: 'sis',          // DONT UPLOAD YOUR PASSWORD AGAIN
// });

// client.connect().then(console.log).catch(console.log);

// faker.seed(123);

const id = [
  faker.random.number(),
  faker.random.number(),
  faker.random.number(),
  faker.random.number(),
  faker.random.number(),
  faker.random.number(),
  faker.random.number(),
  faker.random.number(),
  faker.random.number(),
  faker.random.number(),
  faker.random.number(),
  faker.random.number(),
  faker.random.number(),
  faker.random.number(),
  faker.random.number()];

const programmeId = [
  faker.lorem.word(),
  faker.lorem.word(),
  faker.lorem.word(),
  faker.lorem.word(),
  faker.lorem.word(),
  faker.lorem.word(),
  faker.lorem.word(),
  faker.lorem.word(),
  faker.lorem.word(),
  faker.lorem.word(),
  faker.lorem.word(),
  faker.lorem.word(),
  faker.lorem.word(),
  faker.lorem.word(),
  faker.lorem.word()];

const moduleCode = [
  faker.random.number(),
  faker.random.number(),
  faker.random.number(),
  faker.random.number(),
  faker.random.number(),
  faker.random.number(),
  faker.random.number(),
  faker.random.number(),
  faker.random.number(),
  faker.random.number(),
  faker.random.number(),
  faker.random.number(),
  faker.random.number(),
  faker.random.number(),
  faker.random.number()];

const cwkCode = [
  faker.random.number(),
  faker.random.number(),
  faker.random.number(),
  faker.random.number(),
  faker.random.number(),
  faker.random.number(),
  faker.random.number(),
  faker.random.number(),
  faker.random.number(),
  faker.random.number(),
  faker.random.number(),
  faker.random.number(),
  faker.random.number(),
  faker.random.number(),
  faker.random.number()];

let client = {};
client.query = (str, arr) => {
  console.log(str, arr);
  return Promise.resolve('ok');
};

function inserIntoLoginInfo(start, iterations, level) {
  const loginInfo = 'INSERT INTO login_info(id, username, user_pass, salt, access_lvl) VALUES($1, $2, $3, $4, $5)';

  for (let i = start; i < iterations; i++) {
    const salt = faker.random.word();
    let hash = crypto.createHmac('sha512', salt);
    hash.update('password');
    const value = hash.digest('hex');
    client.query(loginInfo, [id[i], 'shyl' + i, value, salt, level])
      .catch(console.log);
  }
}

function insertIntoStaff(start, iterations) {
  const staff = 'INSERT INTO staff(id, first_name, middle_name, last_name, email, address1, address2, phone) VALUES($1, $2, $3, $4, $5, $6, $7, $8)';
  for (let i = start; i < iterations; i++) {
    client.query(staff, [id[i], faker.name.firstName(), faker.name.firstName(), faker.name.lastName(), faker.internet.email(), faker.address.zipCode(), faker.address.streetAddress(), faker.phone.phoneNumber()])
      .catch(console.log);
  }
}

function insertIntoStudent(start, iterations) {
  const student = 'INSERT INTO student(id, first_name, middle_name, last_name, email, current_level, programme_code, picture_url, gender, dob, entry_year, home_phone, home_address, local_phone, local_address) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)';
  for (let i = start; i < iterations; i++) {
    client.query(student, [id[i], faker.name.firstName(), faker.name.firstName(), faker.name.lastName(), faker.internet.email(), Math.floor(Math.random() * 4) + 1, programmeId[i], faker.internet.url(), faker.lorem.word(), faker.date.past(), faker.date.recent(), faker.phone.phoneNumber(), faker.address.streetAddress(), faker.phone.phoneNumber(), faker.address.streetAddress()])
      .catch(console.log);
  }
}

function insertIntoModule(start, iterations) {
  const module = 'INSERT INTO module(code, name, description, syllabus, semester, year_of_study, credits) VALUES($1, $2, $3, $4, $5, $6, $7)';
  for (let i = start; i < iterations; i++) {
    client.query(module, [moduleCode[i], faker.hacker.phrase(), faker.hacker.phrase(), faker.hacker.phrase(), Math.floor(Math.random() * 2) + 1, Math.floor(Math.random() * 4) + 1, faker.random.number()])
      .catch(console.log);
  }
}

function insertIntoProgramme(start, iterations) {
  const programme = 'INSERT INTO programme(code, UCAS_code, duration, manager, attendance, school) VALUES($1, $2, $3, $4, $5, $6)';
  for (let i = start; i < iterations; i++) {
    client.query(programme, [programmeId[i], faker.random.number(), Math.floor(Math.random() * 4) + 1, id[6], faker.random.word(), 'School of Computing'])
      .catch(console.log);
  }
}

function insertIntoTimetable(start, iterations) {
  const timetable = 'INSERT INTO timetable(module_code, m_type, l_time, room) VALUES($1, $2, $3, $4)';
  let index = 0;
  for (let i = start; i < iterations; i++) {
    client.query(timetable, [moduleCode[index], faker.random.word(), faker.date.future(), faker.random.word()])
      .catch(console.log);
    index++;
    if (index >= 15) {
      index = 0;
    }
  }
}

function insertIntoPrerequisites(start, iterations) {
  const prerequisites = 'INSERT INTO prerequisites(module_code, prerequisite_code) VALUES($1, $2)';
  for (let i = start; i < iterations; i++) {
    client.query(prerequisites, [moduleCode[Math.floor(Math.random() * 14)], moduleCode[Math.floor(Math.random() * 14)]])
      .catch(console.log);
  }
}

function insertIntoCoursework(start, iterations) {
  const cwk = 'INSERT INTO coursework(module_code, id, cwk_name, posted_on, deadline, percentage, marks) VALUES($1, $2, $3, $4, $5, $6, $7)';
  for (let i = start; i < iterations; i++) {
    client.query(cwk, [moduleCode[i], cwkCode[i], faker.random.word(), faker.date.past(), faker.date.future(), faker.random.number(), faker.random.number()])
      .catch(console.log);
  }
}

function insertIntoTeaching(start, iterations) {
  const teaching = 'INSERT INTO teaching(staff_id, module_code, staff_role) VALUES($1, $2, $3)';

  for (let i = start; i < iterations; i++) {
    let role = i % 2 == 0 ? 'leading' : 'helping';
    client.query(teaching, [id[i], moduleCode[i], role])
      .catch(console.log);
  }
}

function insertIntoProgrammeModules(start, iterations) {
  const programme_modules = 'INSERT INTO programme_modules(module_code, programme_code, year_of_study, PFP) VALUES($1, $2, $3, $4)';

  let index = 0;
  for (let i = start; i < iterations; i++) {
    client.query(programme_modules, [moduleCode[index], programmeId[i], Math.floor(Math.random() * 4) + 1, faker.random.boolean()])
      .catch(console.log);
    if (index >= 15) {
      index = 0;
    }
  }
}

function insertIntoProject(start, iterations) {
  const project = 'INSERT INTO project(student_id, supervisor_id, assessor, project_year, title) VALUES($1, $2, $3, $4, $5)';

  for (let i = start; i < iterations; i++) {
    client.query(project, [id[i], id[i + 5], id[i + 5], faker.date.future(), faker.random.word()])
      .catch(console.log);
  }
}

function insertIntoCwkResults(start, iterations) {
  const cwk_result = 'INSERT INTO coursework_result(coursework_id, student_id, result, handed_in) VALUES($1, $2, $3, $4)';

  let index = 0;
  for (let i = start; i < iterations; i++) {
    client.query(cwk_result, [cwkCode[i], id[index], faker.random.number(), faker.date.past()])
      .catch(console.log);
    if (index >= 15) {
      index = 0;
    }
  }
}

function insertIntoTutor() {
  const tutor = 'INSERT INTO tutor(staff_id, student_id, suppervision_year) VALUES($1, $2, $3)';

  for (let i = 0; i < 5; i++) {
    client.query(tutor, [id[i + 5], id[i], faker.date.future()])
      .catch(console.log);
  }
}

function insertIntoStudentModules() {
  const student_modules = 'INSERT INTO student_modules(module_code, studnet_id, study_year) VALUES($1, $2, $3)';

  let moduleIndex = 0;
  let studentIndex = 0;
  for (let i = 0; i < 100; i++) {
    client.query(student_modules, [moduleCode[moduleIndex], id[studentIndex], faker.date.recent()])
      .catch(console.log);
    if (studentIndex >= 5) {
      studentIndex = 0;
    }
    if (moduleIndex >= 15) {
      moduleIndex = 0;
    }
  }
}



inserIntoLoginInfo(0, 5, 1);
inserIntoLoginInfo(5, 10, 2);
inserIntoLoginInfo(10, 15, 3);
insertIntoStaff(5, 15);
insertIntoProgramme(0, 15);
insertIntoStudent(0, 5);
insertIntoModule(0, 15);
insertIntoTimetable(0, 100);
insertIntoPrerequisites(0, 10);
insertIntoCoursework(0, 15);
insertIntoTeaching(5, 15);
insertIntoTeaching(5, 15);
insertIntoTeaching(5, 15);
insertIntoProgrammeModules(0, 200);
insertIntoProject(0, 5);
insertIntoCwkResults(0, 15);
insertIntoTutor();
insertIntoStudentModules();
