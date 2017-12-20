const fetch = require('node-fetch');

fetch('http://localhost:8080/get/token/shyl7', {
  method: 'POST',
  credentials: 'same-origin',
  headers: {
    'Authorization': 'c7a44d75d51f9356d66f992bb26fafd86f3b7624365b7a2c60bf1d0c8ae585eb5f9edcc2327616baaaf6cfae2dfeec89a90cf5e906892e93bdfc42cc2bef7a86'}
  })
  // .then(e => e.json())
  .then(res => res.json())
  .then(console.log)
  .catch(console.log);