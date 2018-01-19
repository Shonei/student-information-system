const fetch = require('node-fetch');
const crypto = require('crypto');

describe('Tests the get/salt/{user} endpoint', () => {
  it('Using valid input', () => {
    expect.assertions(1);
    return fetch('http://localhost:8080/get/salt/shyl2')
      .then(res => res.json())
      .then(data => expect(data.salt.length).toBeGreaterThan(0));
  });

  it('Using invalid username', () => {
    expect.assertions(1);
    return fetch('http://localhost:8080/get/salt/user')
      .then(res => res.json())
      .then(data => expect(data).toEqual({ salt: '' }));
  });

  it('Ommiting the user completely', () => {
    expect.assertions(1);
    return fetch('http://localhost:8080/get/salt/')
      .then(data => expect(data.status).toEqual(404));
  });
});

describe('Tests the whole authentication process', () => {
  it('Authenticates successfully', () => {
    expect.assertions(1);
    return fetch('http://localhost:8080/get/salt/shyl2')
      .then(res => res.json())
      .then(data => {
        let hash = crypto.createHmac('sha512', data.salt);
        hash.update('password');
        const pass = hash.digest('hex');
        return fetch('http://localhost:8080/get/token/shyl2', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Authorization': pass
          }
        });
      }).then(res => res.json())
      .then(data => expect(data.token.length).toEqual(134));
  });

  it('Authenticate fails succesfully', () => {
    expect.assertions(2);
    return fetch('http://localhost:8080/get/salt/shyl2')
      .then(res => res.json())
      .then(data => {
        let hash = crypto.createHmac('sha512', data.salt);
        hash.update('password');
        const pass = hash.digest('hex');
        return fetch('http://localhost:8080/get/token/shyl2', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Authorization': pass + '1'
          }
        });
      }).then(res => {
        expect(res.ok).toEqual(false);
        expect(res.status).toEqual(403);
      });
  });

  it('Authenticate fails successfully', () => {
    expect.assertions(2);
    return fetch('http://localhost:8080/get/salt/shyl2')
      .then(res => res.json())
      .then(data => {
        let hash = crypto.createHmac('sha512', data.salt);
        hash.update('password');
        const pass = hash.digest('hex');
        return fetch('http://localhost:8080/get/token/shyl5', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Authorization': pass
          }
        });
      }).then(res => {
        expect(res.ok).toEqual(false);
        expect(res.status).toEqual(403);
      });
  });
});