const { Client } = require('pg');
const fetch = require('node-fetch');
const crypto = require('crypto');

const client = new Client({
  user: 'postgres',
  database: 'sis',
});

beforeAll(() => {
  return client.connect();
});


afterAll(() => {
  return client.end();
});

describe('Creates new module', () => {
  const user = 'shyl3';
  let testCookie;

  beforeAll(async () => {
    try {
      let data = await fetch('http://localhost:54656/get/salt/' + user);
      data = await data.json();
      let hash = crypto.createHmac('sha512', data.salt);
      hash.update('password');
      const pass = hash.digest('hex');
      data = await fetch('http://localhost:54656/get/token/' + user, {
        credentials: 'same-origin',
        headers: {
          'Authorization': pass
        }
      });
      data = await data.json();
      testCookie = 'token=' + data.token + ";" + ";path=/";
    } catch (err) {
      // for our information to know if the authentication has failed
      console.log(err);
      throw err;
    }
  });

  afterEach(() => {
    return client.query('DELETE FROM module WHERE code = $1', [2552])
    .then("Remove create module OK")
    .catch(console.log);
  });

  it('makes sure we have a cookie set', () => {
    expect.assertions(1);
    return fetch('http://localhost:54656/test/auth/' + user, {
      headers: {
        cookie: testCookie,
      }
    }).then(res => expect(res.ok).toBe(true));
  });

  it('We successfully create a module', () => {
    expect.assertions(9);

    const obj = {
      code: '2552',
      name: 'name',
      description: 'hello description',
      syllabus: 'syllabus',
      semester: 1,
      year_of_study: 2,
      credit: 20
    };

    return fetch('http://localhost:54656/add/module', {
      credentials: 'same-origin',
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        cookie: testCookie,
      }
    }).then(res => {
      expect(res.ok).toBe(true);
      return client.query('SELECT * FROM module WHERE code = $1', [2552])
        .then(data => {
          expect(data.rowCount).toBe(1);
          expect(data.rows[0].code).toBe(obj.code);
          expect(data.rows[0].credits).toBe(obj.credit);
          expect(data.rows[0].description).toBe(obj.description);
          expect(data.rows[0].syllabus).toBe(obj.syllabus);
          expect(data.rows[0].semester).toBe(obj.semester);
          expect(data.rows[0].year_of_study).toBe(obj.year_of_study);
          expect(data.rows[0].name).toBe(obj.name);
        });
    });
  });
});