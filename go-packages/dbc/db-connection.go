package dbc

import (
	"encoding/json"
	"log"
	"regexp"
	"strconv"
	"time"

	"github.com/Shonei/student-information-system/go-packages/utils"

	jwt "github.com/dgrijalva/jwt-go"
)

// Used to validate all the username that will be used when accessing the DB
var basicParser = regexp.MustCompile("^[a-zA-Z0-9]+$")

// the custom claims created in the JWT token
// those are the clasim expected by the authentication middleware
// and must match the JSON representation
type customToken struct {
	User        string `json:"user"`
	AccessLevel int    `json:"access_level"`
	jwt.StandardClaims
}

// SingleParamQuery will execute a predefined sql query that takes a single
// paramater and returns a single paramater with no additional modification to the data.
func SingleParamQuery(db utils.Select, query, param string) (string, error) {
	switch query {
	case "salt":
		return db.Select("Select salt from login_info where username = $1", param)
	}
	return "", utils.ErrSuspiciousInput
}

// GenAuthToken will authenticate the user based on the HMAC value fo the password
// and he username. If they match the database results a map will be generated containing a token and
// the access level for that user. The token will then be used for consecutive requests
// to the server removing the need for sending personal information agian.
func GenAuthToken(db utils.Select, user, hash string) (map[string]string, error) {
	level, err := db.Select("SELECT access_lvl FROM login_info WHERE username = $1 AND user_pass = $2", user, hash)
	if err != nil {
		return nil, err
	}

	// No access_level was found, assume the worst case and exit
	if err != nil {
		return nil, utils.ErrUnothorized
	}

	mySigningKey := []byte("AllYourBase")

	lvl, err := strconv.Atoi(level)
	if err != nil {
		return nil, err
	}

	// Create the Claims
	claims := customToken{
		user, lvl,
		jwt.StandardClaims{
			ExpiresAt: time.Now().Add(2 * time.Hour).Unix(),
			Issuer:    "test",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS512, claims)
	ss, err := token.SignedString(mySigningKey)

	j := map[string]string{"token": ss, "level": level}

	return j, nil
}

// RunMultyRowQuery executes a query that is expected to return multiple rows.
// It return a ErrSuspiciousInput if the user has unexpected characters.
func RunMultyRowQuery(db utils.SelectMulti, query, user string) ([]map[string]string, error) {
	if !basicParser.MatchString(user) {
		return nil, utils.ErrSuspiciousInput
	}

	m, err := db.SelectMulti(query, user)

	// we only care if there is no data
	if err == utils.ErrEmptySQLSet {
		return []map[string]string{}, nil
	}

	return m, err
}

// RunSingleRowQuery executes a query that is expected to return a single row.
// It returns a ErrSuspiciousInput if the user contains unexpected characters.
// In addition if the responce from the query contains more the 1 row
// it will return a ErrToManyRows.
func RunSingleRowQuery(db utils.SelectMulti, query, user string) (map[string]string, error) {
	if !basicParser.MatchString(user) {
		return nil, utils.ErrSuspiciousInput
	}

	m, err := db.SelectMulti(query, user)

	if err != nil {
		if err == utils.ErrEmptySQLSet {
			return map[string]string{}, nil
		}
		return nil, err
	}

	if len(m) > 1 {
		return nil, utils.ErrToManyRows
	}

	return m[0], nil
}

// Search performes a search in the database for staff, students, modules and porgrammes.
// it returns an array of maps for each.
// Sample output:
//  map[
//   programmes:[
//  	map[name:SQL matrix! code:10684]
//  	map[name:SCSI circuit! code:86583]
//  	map[name:cross-platform microchip! code:72065]
//   ]
//   staff:[
//  	map[name:Otha Clinton Dooley username:shyl4 id:62540]
//   ]
//   modules:[
//  	map[name:WHY YOU NO NAME code:maiores ucas_code:18950]
//  	map[name:WHY YOU NO NAME code:sit ucas_code:9080]
//   ]
//   students:[
//  	map[name:Tianna Rosella Hettinger username:shyl0 id:72862]
//  	map[name:Sid Rafael Kuhic username:shyl1 id:44148]
//   ]
//  ]
func Search(db utils.SelectMulti, searchParam string) (map[string][]map[string]string, error) {
	if !basicParser.MatchString(searchParam) {
		return nil, utils.ErrSuspiciousInput
	}

	// create the 4 channels where we will recieve the data
	staff := make(chan []map[string]string)
	students := make(chan []map[string]string)
	modules := make(chan []map[string]string)
	programmes := make(chan []map[string]string)

	// initialize the output data
	output := map[string][]map[string]string{}

	// start the 4 different searches in different goroutines
	go doSearch(db, "SELECT * FROM search_staff($1);", searchParam, staff)
	go doSearch(db, "SELECT * FROM search_student($1);", searchParam, students)
	go doSearch(db, "SELECT * FROM search_programme($1);", searchParam, programmes)
	go doSearch(db, "SELECT * FROM search_module($1);", searchParam, modules)

	waitingChannels := 4

	// forChannels: label the for loop so we can break out
	// for loop reads from the channels until all the jobs complete
	// or they time out
forChannels:
	for {
		// selects and reads from channels
		select {
		case msg, ok := <-staff:
			if !ok {
				// nil so we don't select the channel agian
				staff = nil
				// deacrease the count of waiting channels
				waitingChannels--
				// break so we don't overwrite the data withan empty map
				break
			}
			output["staff"] = msg
		case msg, ok := <-students:
			if !ok {
				students = nil
				waitingChannels--
				break
			}
			output["students"] = msg
		case msg, ok := <-modules:
			if !ok {
				modules = nil
				waitingChannels--
				break
			}
			output["modules"] = msg
		case msg, ok := <-programmes:
			if !ok {
				programmes = nil
				waitingChannels--
				break
			}
			output["programmes"] = msg
		case <-time.After(1 * time.Second):
			log.Println("timed out")
			return output, utils.ErrTimedOut
		default:
			// chack for nil channels
			if waitingChannels == 0 {
				// breaks the for loop
				break forChannels
			}
		}
	}

	return output, nil
}

// executes a SQL query that takes a user as input
// once the query is done it writes the responce to the channel and closes the channel
// if an error occures it writes he 0 value to the channel
func doSearch(db utils.SelectMulti, query, user string, c chan []map[string]string) {
	// close the channel after we are done to signal the select
	defer close(c)

	m, err := db.SelectMulti(query, user)
	if err != nil {
		log.Println(err)
		// don't send valid output if we get an error
		c <- []map[string]string{}
		return
	}

	c <- m
}

// GetModuleDetails makes use of the RunSingleRowQuery to extract the information
// about a module and it formats it into a utils.Module struct.
// That struct can later be used to create a json representation of the data.
func GetModuleDetails(db utils.SelectMulti, code string) (utils.Module, error) {
	m, err := RunSingleRowQuery(db, "SELECT * FROM get_module_details($1);", code)
	if err != nil {
		return utils.Module{}, err
	}

	if len(m) == 0 {
		return utils.Module{}, nil
	}

	module, err := formatModule(m)
	if err != nil {
		return utils.Module{}, err
	}

	return module, nil
}

// creates the utils.Module datastructure out of the map[string]string representation.
// This allows us to send properly formated JSON for the request.
func formatModule(m map[string]string) (utils.Module, error) {
	module := utils.Module{}

	// Unmarshal the JSON string into the struct
	// This is needed so we can later on create a single representation of the
	// struct as a JON object for the module
	if err := json.Unmarshal([]byte(m["cwks"]), &module.Cwks); err != nil {
		return utils.Module{}, err
	}

	if err := json.Unmarshal([]byte(m["exam"]), &module.Exam); err != nil {
		return utils.Module{}, err
	}

	// copy the non json strings as normal data
	module.Code = m["code"]
	module.Description = m["description"]
	module.Syllabus = m["syllabus"]
	module.Name = m["name"]
	module.Credits = m["credits"]
	module.Semester = m["semester"]
	module.Year = m["year"]

	return module, nil
}
