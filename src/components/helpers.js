function wrapFetch(url, m ='GET') {
  const uname = window.localStorage.getItem('user');
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