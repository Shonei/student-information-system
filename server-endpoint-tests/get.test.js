const fetch = require('node-fetch');
const crypto = require('crypto');

describe('Tests the get/salt/{user} endpoint', () => {
  it('Using valid input', () => {
    expect.assertions(1);
    return fetch('http://localhost:54656/get/salt/shyl2')
      .then(res => res.json())
      .then(data => expect(data.salt.length).toBeGreaterThan(0));
  });

  it('Using invalid username', () => {
    expect.assertions(1);
    return fetch('http://localhost:54656/get/salt/user')
      .then(data => expect(data.status).toEqual(500));
  });

  it('Ommiting the user completely', () => {
    expect.assertions(1);
    return fetch('http://localhost:54656/get/salt/')
      .then(data => expect(data.status).toEqual(404));
  });
});

describe('Tests the whole authentication process', () => {
  it('Authenticates successfully', () => {
    expect.assertions(1);
    return fetch('http://localhost:54656/get/salt/shyl2')
      .then(res => res.json())
      .then(data => {
        let hash = crypto.createHmac('sha512', data.salt);
        hash.update('password');
        const pass = hash.digest('hex');
        return fetch('http://localhost:54656/get/token/shyl2', {
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
    return fetch('http://localhost:54656/get/salt/shyl2')
      .then(res => res.json())
      .then(data => {
        let hash = crypto.createHmac('sha512', data.salt);
        hash.update('password');
        const pass = hash.digest('hex');
        return fetch('http://localhost:54656/get/token/shyl2', {
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
    return fetch('http://localhost:54656/get/salt/shyl2')
      .then(res => res.json())
      .then(data => {
        let hash = crypto.createHmac('sha512', data.salt);
        hash.update('password');
        const pass = hash.digest('hex');
        return fetch('http://localhost:54656/get/token/shyl5', {
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

describe('Tests the /get/studet/profile/{user} endpoint', () => {
  const user = 'shyl1';
  let testCookie;

  beforeAll(() => {
    return fetch('http://localhost:54656/get/salt/' + user)
      .then(res => res.json())
      .then(data => {
        let hash = crypto.createHmac('sha512', data.salt);
        hash.update('password');
        const pass = hash.digest('hex');
        return fetch('http://localhost:54656/get/token/' + user, {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Authorization': pass
          }
        });
      }).then(res => res.json())
      .then(data => testCookie = 'token=' + data.token + ";" + ";path=/");
  });

  it('makes sure we have a cookie set', () => {
    expect.assertions(1);
    return fetch('http://localhost:54656/test/auth/' + user, {
      headers: {
        cookie: testCookie,
      }
    }).then(res => expect(res.ok).toBe(true));
  });

  it('Get valid profile', () => {
    expect.assertions(4);
    return fetch('http://localhost:54656/get/student/profile/' + user, {
      headers: {
        cookie: testCookie,
      }
    }).then(res => {
      expect(res.ok).toBe(true);
      expect(res.status).toEqual(200);
      return res.json();
    }).then(data => {
      expect(data.email).not.toBe(undefined);
      expect(data.id).not.toBe(undefined);
    });
  });

  it('fail to get profile', () => {
    expect.assertions(2);
    return fetch('http://localhost:54656/get/student/profile/shyl', {
      headers: {
        cookie: testCookie,
      }
    }).then(res => {
      expect(res.ok).toBe(false);
      expect(res.status).toEqual(401);
    });
  });

  it('No user send', () => {
    expect.assertions(2);
    return fetch('http://localhost:54656/get/student/profile/', {
      headers: {
        cookie: testCookie,
      }
    }).then(res => {
      expect(res.ok).toBe(false);
      expect(res.status).toEqual(404);
    });
  });
});

describe('Tests the /get/studet/modules/{time}/{user} endpoint', () => {
  const user = 'shyl1';
  let testCookie;

  beforeAll(() => {
    return fetch('http://localhost:54656/get/salt/' + user)
      .then(res => res.json())
      .then(data => {
        let hash = crypto.createHmac('sha512', data.salt);
        hash.update('password');
        const pass = hash.digest('hex');
        return fetch('http://localhost:54656/get/token/' + user, {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Authorization': pass
          }
        });
      }).then(res => res.json())
      .then(data => testCookie = 'token=' + data.token + ";" + ";path=/");
  });

  it('makes sure we have a cookie set', () => {
    expect.assertions(1);
    return fetch('http://localhost:54656/test/auth/' + user, {
      headers: {
        cookie: testCookie,
      }
    }).then(res => expect(res.ok).toBe(true));
  });

  it('Get valid past modules', () => {
    expect.assertions(3);
    return fetch('http://localhost:54656/get/student/modules/past/' + user, {
      headers: {
        cookie: testCookie,
      }
    }).then(res => {
      expect(res.ok).toBe(true);
      expect(res.status).toEqual(200);
      return res.json();
    }).then(data => {
      expect(typeof data).toBe('object');
    });
  });

  it('fail to get modules', () => {
    expect.assertions(2);
    return fetch('http://localhost:54656/get/student/modules/past/shyl', {
      headers: {
        cookie: testCookie,
      }
    }).then(res => {
      expect(res.ok).toBe(false);
      expect(res.status).toEqual(401);
    });
  });

  it('No user send and fails to get modules', () => {
    expect.assertions(2);
    return fetch('http://localhost:54656/get/student/modules/past/', {
      headers: {
        cookie: testCookie,
      }
    }).then(res => {
      expect(res.ok).toBe(false);
      expect(res.status).toEqual(404);
    });
  });

  it('Get valid past modules', () => {
    expect.assertions(3);
    return fetch('http://localhost:54656/get/student/modules/now/' + user, {
      headers: {
        cookie: testCookie,
      }
    }).then(res => {
      expect(res.ok).toBe(true);
      expect(res.status).toEqual(200);
      return res.json();
    }).then(data => {
      expect(typeof data).toBe('object');
    });
  });

  it('fail to get modules', () => {
    expect.assertions(2);
    return fetch('http://localhost:54656/get/student/modules/now/shyl', {
      headers: {
        cookie: testCookie,
      }
    }).then(res => {
      expect(res.ok).toBe(false);
      expect(res.status).toEqual(401);
    });
  });

  it('No user send and fails to get modules', () => {
    expect.assertions(2);
    return fetch('http://localhost:54656/get/student/modules/now/', {
      headers: {
        cookie: testCookie,
      }
    }).then(res => {
      expect(res.ok).toBe(false);
      expect(res.status).toEqual(404);
    });
  });
});