function cookieCheck() {
  let token = window.document.cookie.match(/token=[a-z:0-9]{120,134}/g);
  if (token) {
    // Add this token to fetch Authentication header
    token = token[0].replace('token=', '');
    return token;
  }
  return '';
}

function wrapFetch(url, m ='GET') {
  const  token = cookieCheck();
  const uname = token.split(':')[0];
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

export {cookieCheck, wrapFetch};