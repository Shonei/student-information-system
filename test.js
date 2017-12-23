const fetch = require('node-fetch');

fetch('http://localhost:8080/get/token/shyl5', {
  method: 'POST',
  credentials: 'same-origin',
  headers: {
    'Authorization': '248c5022a815e55c50c853029206ef7bd0a0d45cbf39ab5ec8e66eb30613ddf76a9d6e1e1ba7f8d63aa3e0298d8cae54b25624213edae62747fdd627b7e2bbe1'
  }
})
  .then(res => res.text())
  .then(res => console.log(res))
  .catch(console.log);
