package dbc

import (
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
func SingleParamQuery(db utils.DBAbstraction, query, param string) (string, error) {
	switch query {
	case "salt":
		return db.Select("Select salt from login_info where username = $1", param)
	}
	return "", utils.ErrUnexpectedChoice
}

// GenAuthToken will authenticate the user based on the HMAC value fo the password
// and he username. If they match the database results a map will be generated containing a token and
// the access level for that user. The token will then be used for consecutive requests
// to the server removing the need for sending personal information agian.
func GenAuthToken(db utils.DBAbstraction, user, hash string) (map[string]string, error) {
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

func RunMultyRowQuery(db utils.DBAbstraction, query, user string) ([]map[string]string, error) {
	if !basicParser.MatchString(user) {
		return nil, utils.ErrSuspiciousInput
	}
	return db.SelectMulti(query, user)
}

func RunSingleRowQuery(db utils.DBAbstraction, query, user string) (map[string]string, error) {
	if !basicParser.MatchString(user) {
		return nil, utils.ErrSuspiciousInput
	}

	m, err := db.SelectMulti(query, user)

	if err != nil {
		return nil, err
	}

	if len(m) > 1 {
		return nil, utils.ErrToManyRows
	}

	return m[0], nil
}
