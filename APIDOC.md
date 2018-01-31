# API Documentation

[Live Demo](https://sis-shonei.herokuapp.com/)

## /get/salt/{user} [POST, GET]
Provided a valid username this endpoint will return the salt that needs to be used to hash the users password for validation later on.

## /get/token/{user} [POST GET]
The endpoint that returns a token that is used to gain access to the API. After you have obtained the salt you need to create an HMAC using the salt as the key. The hashing algorith needs to be SHA512 and produce a hex encoded string. The hashed password needs to be send in the Authorization header.

Afte you optain the token you will have to send it as a cookie for each resource you try to access in the API. Addionally the token has a 2 hours time to live so after 2 hours you will need to create a new token.

### Example
```javascript
const hash = crypto.createHmac('sha512', salt);
hash.update(password);
const pass = hash.digest('hex');
return fetch('http://localhost:54656/get/token/shyl2',{
  headers: {
    'Authorization': pass
    }
  });
```

## /get/student/profile/{user} [POST GET]
This endpoint returns the personal information of the student. This is only accessible if you are student or part of the School of computing staff.

### Sample output
```json
{
  "current_level":"3",
  "email":"Karson29@yahoo.com",
  "entry_year":"2018-01-18T00:00:00Z",
  "first_name":"Sid","id":"44148",
  "last_name":"Kuhic",
  "middle_name":"Rafael",
  "picture_url":"http://zella.biz"
}
```

## get/student/modules/{time}/{user} [POST GET]
This endpoint returns a list of the studetns modules with results. The time parameter can be either 'now' to get the current year modules or 'past' to get the modules he has taken in past years. This is only accessible if you are student or part of the School of computing staff.

### Sample outpur 
```json
[
  {
    "code":"25509",
    "name":"JBOD firewall!",
    "result":"66",
    "study_year":"2014-01-17T00:00:00Z"
  },
  {
    "code":"86583",
    "name":"SCSI circuit!",
    "result":"",
    "study_year":"2012-01-15T00:00:00Z"
  }
]
```

## /get/student/cwk/{type}/{user} [POST GET]
This will return a list of coursewowks for aa given student. Based on the type parameter which can be either 'results' or 'timetable' it will return the coursework results for the current year modules or the timetable of coursework that the student needs to submit.

## Sample output
```json
[
  {
    "cwk_name":"withdrawal",
    "deadline":"2018-02-15T00:00:00Z",
    "posted_on":"2018-01-25T00:00:00Z"
  },
  {
    "cwk_name":"withdrawal",
    "deadline":"2018-02-27T00:00:00Z",
    "posted_on":"2018-01-25T00:00:00Z"
  }
]
```

### Experimental or temporary endpoints

## /test/auth/{user} [All methods]
Used to test if you were able to generate a valid access token. Should return an 'Ok' on valid respons.

## /ping [All methods]
Ping to see if the server is alive. Should always respond with and 'Ok'.
