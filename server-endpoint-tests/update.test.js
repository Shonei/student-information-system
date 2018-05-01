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

describe('Updates a cwk results', () => {
  const id = 21939;
  const student_id = 44148;
  const user = 'shyl4';
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
          expect(data.rows[0].handed_in).toEqual(new Date('2018-12-12T00:00:00.000Z'));
        });
    });
  });

  it('Fails to update cwk result with wrong id', () => {
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
          expect(data.rows[0].handed_in).toEqual(new Date('2018-12-12T00:00:00.000Z'));
        });
    });
  });
});

describe('Updates exam percentage', () => {
  const code = '245652';
  const student_id = 44148;
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

  it('makes sure we have a cookie set', () => {
    expect.assertions(1);
    return fetch('http://localhost:54656/test/auth/' + user, {
      headers: {
        cookie: testCookie,
      }
    }).then(res => expect(res.ok).toBe(true));
  });

  it('Updates a cwk result', () => {
    expect.assertions(3);
    return fetch('http://localhost:54656/update/exam/percentage', {
      credentials: 'same-origin',
      method: "POST",
      body: JSON.stringify({
        code: code,
        percentage: 66,
      }),
      headers: {
        cookie: testCookie,
      }
    }).then(res => {
      expect(res.ok).toBe(false);
      return client.query('SELECT percentage FROM exam WHERE code = $1', [code])
        .then(data => {
          expect(data.rows.length).toBe(1);
          expect(data.rows[0].percentage).toEqual(75);
        });
    });
  });

  it('we try to give exam a weigth of more then 100%', () => {
    expect.assertions(3);
    return fetch('http://localhost:54656/update/exam/percentage', {
      credentials: 'same-origin',
      method: "POST",
      body: JSON.stringify({
        code: code,
        percentage: 101,
      }),
      headers: {
        cookie: testCookie,
      }
    }).then(res => {
      expect(res.ok).toBe(false);
      return client.query('SELECT percentage FROM exam WHERE code = $1', [code])
        .then(data => {
          expect(data.rows.length).toBe(1);
          expect(data.rows[0].percentage).toEqual(75);
        });
    });
  });

  it('we try to update exam with wrong exam code', () => {
    expect.assertions(3);
    return fetch('http://localhost:54656/update/exam/percentage', {
      credentials: 'same-origin',
      method: "POST",
      body: JSON.stringify({
        code: '2462342',
        percentage: 55,
      }),
      headers: {
        cookie: testCookie,
      }
    }).then(res => {
      expect(res.ok).toBe(false);
      return client.query('SELECT percentage FROM exam WHERE code = $1', [code])
        .then(data => {
          expect(data.rows.length).toBe(1);
          expect(data.rows[0].percentage).toEqual(75);
        });
    });
  });
});

describe('Updates cwk percentage and marks', () => {
  const cwk_id = 42037;
  const student_id = 44148;
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

  it('makes sure we have a cookie set', () => {
    expect.assertions(1);
    return fetch('http://localhost:54656/test/auth/' + user, {
      headers: {
        cookie: testCookie,
      }
    }).then(res => expect(res.ok).toBe(true));
  });

  it('Updates a cwk marks and percentage', () => {
    expect.assertions(4);
    return fetch('http://localhost:54656/update/cwk/percentage', {
      credentials: 'same-origin',
      method: "POST",
      body: JSON.stringify({
        id: cwk_id,
        percentage: 66,
        marks: 76,
      }),
      headers: {
        cookie: testCookie,
      }
    }).then(res => {
      expect(res.ok).toBe(false);
      return client.query('SELECT percentage, marks FROM coursework WHERE id = $1', [cwk_id])
        .then(data => {
          expect(data.rows.length).toBe(1);
          expect(data.rows[0].percentage).toEqual(10);
          expect(data.rows[0].marks).toEqual(100);
        });
    });
  });

  it('we try to give cwk a weigth of more then 100%', () => {
    expect.assertions(4);
    return fetch('http://localhost:54656/update/cwk/percentage', {
      credentials: 'same-origin',
      method: "POST",
      body: JSON.stringify({
        id: cwk_id,
        percentage: 101,
        marks: 55,
      }),
      headers: {
        cookie: testCookie,
      }
    }).then(res => {
      expect(res.ok).toBe(false);
      return client.query('SELECT percentage, marks FROM coursework WHERE id = $1', [cwk_id])
        .then(data => {
          expect(data.rows.length).toBe(1);
          expect(data.rows[0].percentage).toEqual(10);
          expect(data.rows[0].marks).toEqual(100);
        });
    });
  });
});