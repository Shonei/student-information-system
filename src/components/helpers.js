// import fetch from 'node-fetch';

// a fetch wrapper to make using fetch easier
// it parses the imput and rejects the a promise if there was an error
// or returns the json responce as a promise
function wrapFetch(user, url, m ='GET') {
  const uname = window.sessionStorage.getItem(user);
  return fetch(url + uname, {
    method: m,
    credentials: 'same-origin',
  }).then(res => {
    if (!res.ok) {
      return Promise.reject(res);
    } else {
      return res.json();
    }
  });
}

export { wrapFetch};