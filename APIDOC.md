# API Documentation

[Live Demo](https://sis-shonei.herokuapp.com/)

## /get/salt/{user} [GET]
Provided a valid username this endpoint will return the salt that needs to be used to hash the users password for validation later on.

## /get/token/{user} [GET]
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

## /get/student/profile/{user} [GET]
This endpoint returns the personal information of the student. This is only accessible if you are student or part of the School of computing staff.

### Sample output
```json
{
  "current_level": "3",
  "email": "Karson29@yahoo.com",
  "entry_year": "2018-01-18T00:00:00Z",
  "first_name": "Sid","id":"44148",
  "last_name": "Kuhic",
  "middle_name": "Rafael",
  "picture_url": "http://zella.biz"
}
```

## get/student/modules/now/{user} [GET]
This endpoint returns a list of the studetns modules he is taking in his current year. If results are available they are returned as well.

### Sample outpur 
```json
[
  {
    "code": "25509",
    "name": "JBOD firewall!",
    "result": "66",
    "study_year": "2014-01-17T00:00:00Z"
  },
  {
    "code": "86583",
    "name": "SCSI circuit!",
    "result": "",
    "study_year": "2012-01-15T00:00:00Z"
  }
]
```
## get/student/modules/past/{user} [GET]
This endpoint returns a list of the studetns modules that he has taken in past years and the results he has achieved. 


## /get/student/cwk/timetable/{user} [GET]
This will return a list of coursewowks for a given student. The courseworks returned are the ones that he has not submitted yet and it will show the deadline and the date posted for a coursework.

### Sample output
```json
[
  {
    "cwk_name": "withdrawal",
    "deadline": "2018-02-15T00:00:00Z",
    "posted_on": "2018-01-25T00:00:00Z"
  },
  {
    "cwk_name": "withdrawal",
    "deadline": "2018-02-27T00:00:00Z",
    "posted_on": "2018-01-25T00:00:00Z"
  }
]
```
## /get/student/cwk/results/{user} [GET]
This will return a list of coursewowks for a given student. The courseworks returned are the ones that he has submitted and they have been marked. This endpoint will retrieve those marks as well. 

## /get/staff/profile/{user} [GET]
This endpoint retrieves the profile af a staff member. It is only accessible bymembers of staff or an admin. This only returns their personal information. The user param must be their id.

### Sample output
``` json
{
  "address1": "10489",
  "address2": "4447 Kaylee Station",
  "email": "Myra.Klein7@yahoo.com",
  "first_name": "Christian",
  "id": "44148",
  "last_name": "Rohan",
  "middle_name": "Dimitri",
  "phone": "(512) 029-5237 x41235"
}
```

## /get/staff/modules/{user} [GET]
This endpoint returns a list of modules the staff is involved in. It includes the name and code of the module as well as the staffs role. The user param is the staff id.

### Sample outpur
```json
[
  {
    "code": "25351",
    "name": "XML driver!",
    "staff_role": "leading"
  }
]
```

## /get/staff/tutees/{user} [GET]
This endpoint returns a array of the students the staff is a tutor of. It includes their username and student number as well as the year he is/was theur tutor. The user param must be their id.

## /get/module/{code} [GET]
Retrieves all the information for a module. It includes the details of the module as well as the exam. The responce also includes array of the coursework for the module. the optional param must be the module code. 

### Sample output
```json
{
  "code": "25351",
  "name": "XML driver!",
  "description": "Lorem ipsum dolor...",
  "syllabus": "Lorem ipsum dolor...",
  "semester": "2",
  "year": "2",
  "credits": "72",
  "cwks":[
    {
      "id": 88157,
      "cwk_name": "Grenada",
      "marks": 100,
      "percentage": 20
    }
  ],
  "exam":[
    {
      "code": "2456",
      "percentage": 75,
      "type": "open book"
    }
  ]
}
```

## /get/cwk/{code} [GET]
This endpoint returns a array with a single element that contains the information about the coursework. 

```json
[
  {
    "deadline": "2018-03-15T00:00:00Z",
    "description": "Lorem ipsum dolor...",
    "id": "88157",
    "marks": "100",
    "module_code": "25351",
    "name": "Grenada",
    "percentage": "20",
    "posted_on": "2018-03-11T00:00:00Z"
  }
]
```

## /get/cwk/students/{code} [GET]
This endpoint returns a list of student assisiated with a courseworkand the result hey have achieved as well the date they handed in the coursework. The code must be the code of the coursework. 

## /search/{query} [GET]
The endpoint for the search option of the API. The query takes a string that is used as the search parameter. It returns a JSON with arrays for the staff, students, modules and programmes that matched the query.

### Sample output
```json
{
  "programmes":[
    {
      "name": "SQL matrix!", 
      "code":10684
    }
 	],
  
  "staff":[
 	  {
      "name": "Otha Clinton Dooley", 
      "username": "shyl4",
      "id": 62540
    }
  ],
  
  "modules":[
    {
      "name": "SQL", 
      "code": "maiores", 
      "ucas_code": 18950
    }
  ],
  
  "students":[
 	{
    "name": "Tianna Rosella Hettinger",
    "username": "shyl0", 
    "id": 72862}
  ]
}
```
## /update/cwk/results [POST]
Endpoint used to update a students coursework results. This endpoint can also set the date the student handed in the coursework as well. You need to include the student id and the coursework id. Both result and handed_in params are optional but they will overwrite the existing data.

### Example request

```javascript
fetch('/update/cwk/results', {
  credentials: 'same-origin',
  method: "POST",
  data: JSON.stringify({
    student_id: 2553,
    cwk_id: 235523,
    result: 23,
    handed_in: "12-12-2014"
  })
})
```

## /update/exam/percentage [POST]
This endpoint is used to edit the exam overall % and change from oben book to essay and other exam types. The percentage will be restricted between 0 and 100.

### Example request 

```javascript
fetch('/update/cwk/results', {
  credentials: 'same-origin',
  method: "POST",
  data: JSON.stringify({
    "code": "45762456",
    "percentage": 63,
    "type": "open book"
  })
})
```

## /add/module [POST]
This endpoint is used to create a new module. It also provides the ability to add an exam and any number of courseworks assosiated with the module. 

### Data sample
This shows the organasation of the json that the server expects. Both the exam and cwks are optional but the data for the exam is required. Each percentage param is limited between 0  and 100. 

```json
{
  "code": "",
  "name": "",
  "description": "",
  "syllabus": "",
  "semester": 1,
  "year_of_study": 1,
  "credit": 0,
  "exam": {
    "code": "",
    "percentage": 0,
    "type": "",
    "description": ""
  },
  "cwks":[
    {
      "id": 0,
      "name": "",
      "posted_on": "",
      "deadline": "",
      "percentage": 0,
      "marks": 0,
      "description": ""
    }
  ]
}
```

## Experimental or temporary endpoints

### /test/auth/{user} [All methods]
Used to test if you were able to generate a valid access token. Should return an 'Ok' on valid respons.

### /ping [All methods]
Ping to see if the server is alive. Should always respond with and 'Ok'.
