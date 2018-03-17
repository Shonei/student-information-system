# student-information-system

[Backlog](https://shonei.github.io/student-information-system/)

### GoDocs
[![GoDoc](https://godoc.org/github.com/Shonei/student-information-system/go-packages/dbc?status.svg)](https://godoc.org/github.com/Shonei/student-information-system/go-packages/dbc)

### Prerequisites

We will assume you have Golang, NodeJS, NPM and PostgreSQL installed as well as knowledge of how to run basic commands in these enviourments. Furthermore Go requires you to have git installed and linked with it. This is used to download go packages.

### Running the user interface

Clone the repository and cd into the root of it.

- To install the node packages run `npm install`. It will install all the required packages. 

- To run the development server run `npm start`. This will start the server and open a browser window once the server has started.

- After making changes and want to redeploy type `npm run build`. This creates an optimised version of the source code as well transpile it to be browser compatible.

- If you want to run the unit tests for the UI run `npm test`. This starts an interactive command promt that runs the tests on each change on the source code. 

For more information check [create-react-app](https://github.com/facebookincubator/create-react-app). This is the package used to set up the enviourment and it has more documentation about the commands. 

### Running the server

- To run the server all you have to do is type `go run main.go`. This will start the server.

- You might have to download the gorilla/mux, jwt-go packages and the postgreSQL drivers. Luckily go has a nice way of doing that. All you have to do is run   <br />`go get github.com/gorilla/mux` <br /> `go get github.com/lib/pq` <br /> `go get github.com/dgrijalva/jwt-go`<br />
These commands will install all the external dependencies of the server.  

- To install the go packages that come with this repository go into the go-packages folder. There will be a nummber of subfolders. You have to visit each one and type `go install`. This is a one time step which will create the binaries for the packages.

### Creating the database

All scripts that are needed to create the database are lacated in DB-scrippts.

- Use the create-db.sql to create the database. This will create the tables and all the triggeres required.

- To put data in the database run `node populate-db.js`. This will create fake data using fakerjs. All the users will have the username `shyl0-15` and password `password`.

- Alternatively you can use the  insert-into-db.sql script that will put predefined data into your database.


## TODO
- STOP JUST CONSOL LOGGING ERRORS
- Module prerequisite not displayed after successful add
