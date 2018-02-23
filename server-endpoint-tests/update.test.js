const { Client } = require('pg');
const fetch = require('node-fetch');
const crypto = require('crypto');

const client = new Client({
  user: 'postgres',
  database: 'sis',
});

describe('Updates a cwk results', () => {
  const id = 21939;
  const student_id = 44148;
  const user = 'shyl3';
  let testCookie;

  beforeAll(() => {
    return client.connect().then(async () => {
      // we authenticate and create the test cookie
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
  });

  it('makes sure we have a cookie set', () => {
    expect.assertions(1);
    return fetch('http://localhost:54656/test/auth/' + user, {
      headers: {
        cookie: testCookie,
      }
    }).then(res => expect(res.ok).toBe(true));
  });

  it('Updates a cwk result', () => {
    expect.assertions(4);
    return fetch('http://localhost:54656/update/cwk/results', {
      credentials: 'same-origin',
      method: "POST",
      body: JSON.stringify({
        student_id: student_id,
        cwk_id: id,
        result: 55,
        handed_in: '2018-12-12'
      }),
      headers: {
        cookie: testCookie,
      }
    }).then(res => {
      expect(res.ok).toBe(true);
      return client.query('SELECT result, handed_in FROM coursework_result WHERE coursework_id = $1 AND student_id = $2', [id, student_id])
        .then(data => {
          expect(data.rows.length).toBe(1);
          expect(data.rows[0].result).toEqual(55);
          expect(data.rows[0].handed_in).toBe('2018-12-12T00:00:00.000Z');
        });
    });
  });

  it('Updates a cwk result', () => {
    expect.assertions(4);
    return fetch('http://localhost:54656/update/cwk/results', {
      credentials: 'same-origin',
      method: "POST",
      body: JSON.stringify({
        student_id: 345,
        cwk_id: id,
        result: 587458765,
        handed_in: '2018-12-12'
      }),
      headers: {
        cookie: testCookie,
      }
    }).then(res => {
      expect(res.ok).toBe(false);
      return client.query('SELECT result, handed_in FROM coursework_result WHERE coursework_id = $1 AND student_id = $2', [id, student_id])
        .then(data => {
          expect(data.rows.length).toBe(1);
          expect(data.rows[0].result).toEqual(55);
          expect(data.rows[0].handed_in).toEqual('2018-12-12T00:00:00.000Z');
        });
    });
  });

  afterAll(() => {
    client.end();
  });
});