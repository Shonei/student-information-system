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
    expect.assertions(2);
    return fetch('http://localhost:54656/get/salt/shyl1')
      .then(res => res.json())
      .then(data => {
        let hash = crypto.createHmac('sha512', data.salt);
        hash.update('password');
        const pass = hash.digest('hex');
        return fetch('http://localhost:54656/get/token/shyl1', {
          credentials: 'same-origin',
          headers: {
            'Authorization': pass
          }
        });
      }).then(res => res.json())
      .then(data => {
        expect(data.token.length).toEqual(208);
        expect(data.level).toEqual('1');
      });
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
          credentials: 'same-origin',
          headers: {
            'Authorization': pass + '1'
          }
        });
      }).then(res => {
        expect(res.ok).toEqual(false);
        expect(res.status).toEqual(500);
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
          credentials: 'same-origin',
          headers: {
            'Authorization': pass
          }
        });
      }).then(res => {
        expect(res.ok).toEqual(false);
        expect(res.status).toEqual(500);
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
        expect(res.status).toEqual(405);
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

describe('Tests the /get/student/cwk/{type}/{user} endpoint', () => {
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

  it('Get valid coursework timetable', () => {
    expect.assertions(3);
    return fetch('http://localhost:54656/get/student/cwk/timetable/' + user, {
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

  it('fail to get coursework with different username', () => {
    expect.assertions(2);
    return fetch('http://localhost:54656/get/student/cwk/timetable/shyl0', {
      headers: {
        cookie: testCookie,
      }
    }).then(res => {
      expect(res.ok).toBe(false);
      expect(res.status).toEqual(401);
    });
  });

  it('No user send and fails to get coursework', () => {
    expect.assertions(2);
    return fetch('http://localhost:54656/get/student/cwk/results/', {
      headers: {
        cookie: testCookie,
      }
    }).then(res => {
      expect(res.ok).toBe(false);
      expect(res.status).toEqual(404);
    });
  });

  it('fail to get cwk results with wrong username', () => {
    expect.assertions(2);
    return fetch('http://localhost:54656/get/student/cwk/results/shyl0', {
      headers: {
        cookie: testCookie,
      }
    }).then(res => {
      expect(res.ok).toBe(false);
      expect(res.status).toEqual(401);
    });
  });

  it('No user send and fails to get cwk results', () => {
    expect.assertions(2);
    return fetch('http://localhost:54656/get/student/cwk/results/', {
      headers: {
        cookie: testCookie,
      }
    }).then(res => {
      expect(res.ok).toBe(false);
      expect(res.status).toEqual(404);
    });
  });
});

describe('Tests a studetn trying to get staff only content', () => {
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

  it('fails to read content for staff only', () => {
    expect.assertions(2);
    return fetch('http://localhost:54656/get/staff/profile/' + user, {
      headers: {
        cookie: testCookie,
      }
    }).then(res => {
      expect(res.ok).toBe(false);
      expect(res.status).toEqual(500);
    });
  });

  it('request content for different user', () => {
    expect.assertions(2);
    return fetch('http://localhost:54656/get/staff/profile/shyl3', {
      headers: {
        cookie: testCookie,
      }
    }).then(res => {
      expect(res.ok).toBe(false);
      expect(res.status).toEqual(401);
    });
  });
});

describe('Tests the /get/staff/profile/{user} endpoint', () => {
  const user = 'shyl3';
  let testCookie;

  beforeAll(() => {
    return fetch('http://localhost:54656/get/salt/' + user)
      .then(res => res.json())
      .then(data => {
        let hash = crypto.createHmac('sha512', data.salt);
        hash.update('password');
        const pass = hash.digest('hex');
        return fetch('http://localhost:54656/get/token/' + user, {
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
    expect.assertions(3);
    return fetch('http://localhost:54656/get/staff/profile/' + user, {
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

  it('fail to get profile', () => {
    expect.assertions(2);
    return fetch('http://localhost:54656/get/staff/profile/', {
      headers: {
        cookie: testCookie,
      }
    }).then(res => {
      expect(res.ok).toBe(false);
      expect(res.status).toEqual(404);
    });
  });
});

describe('Tests the /get/staff/modules/{user} endpoint', () => {
  const user = 'shyl3';
  let testCookie;

  beforeAll(() => {
    return fetch('http://localhost:54656/get/salt/' + user)
      .then(res => res.json())
      .then(data => {
        let hash = crypto.createHmac('sha512', data.salt);
        hash.update('password');
        const pass = hash.digest('hex');
        return fetch('http://localhost:54656/get/token/' + user, {
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

  it('Get valid staff modules', () => {
    expect.assertions(3);
    return fetch('http://localhost:54656/get/staff/modules/' + user, {
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

  it('fail to get modules with missing user', () => {
    expect.assertions(2);
    return fetch('http://localhost:54656/get/staff/modules/', {
      headers: {
        cookie: testCookie,
      }
    }).then(res => {
      expect(res.ok).toBe(false);
      expect(res.status).toEqual(404);
    });
  });
});

describe('Tests the /get/staff/tutees/{user} endpoint', () => {
  const user = 'shyl3';
  let testCookie;

  beforeAll(() => {
    return fetch('http://localhost:54656/get/salt/' + user)
      .then(res => res.json())
      .then(data => {
        let hash = crypto.createHmac('sha512', data.salt);
        hash.update('password');
        const pass = hash.digest('hex');
        return fetch('http://localhost:54656/get/token/' + user, {
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

  it('Get valid tutees list', () => {
    expect.assertions(3);
    return fetch('http://localhost:54656/get/staff/tutees/' + user, {
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

  it('fail to get tutees with missing user', () => {
    expect.assertions(2);
    return fetch('http://localhost:54656/get/staff/tutees/', {
      headers: {
        cookie: testCookie,
      }
    }).then(res => {
      expect(res.ok).toBe(false);
      expect(res.status).toEqual(404);
    });
  });
});

describe('Staff have access to studetn information', () => {
  const user = 'shyl3';
  let testCookie;

  beforeAll(() => {
    return fetch('http://localhost:54656/get/salt/' + user)
      .then(res => res.json())
      .then(data => {
        let hash = crypto.createHmac('sha512', data.salt);
        hash.update('password');
        const pass = hash.digest('hex');
        return fetch('http://localhost:54656/get/token/' + user, {
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

  it('Staff can view a students profile', () => {
    expect.assertions(3);
    return fetch('http://localhost:54656/get/student/profile/shyl1', {
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

  it('Staff can view a students modules', () => {
    expect.assertions(3);
    return fetch('http://localhost:54656/get/student/modules/now/shyl1', {
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

  it('Staff can view a students coursework', () => {
    expect.assertions(3);
    return fetch('http://localhost:54656/get/student/cwk/timetable/shyl1', {
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
});