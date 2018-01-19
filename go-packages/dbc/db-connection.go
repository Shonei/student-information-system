package dbc

import (
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha512"
	"encoding/hex"
	"strconv"
	"strings"

	"github.com/Shonei/student-information-system/go-packages/dba"
)

// TokenError will be used as a message for http request containing a http code
// a mostly human readable message.
type TokenError struct {
	HttpCode int
	Message  string
}

func (t *TokenError) Error() string {
	return string(t.HttpCode)
}

// SingleParamQuery will execute a predefined sql query that takes a single
// paramater and returns a single paramater with no additional modification to the data.
// If it returns an empty string it would mean the query failed.
func SingleParamQuery(db dba.DBAbstraction, query, param string) string {
	switch query {
	case "salt":
		return db.Select("Select salt from login_info where username = $1", param)
	}
	return ""
}

// GenAuthToken will return the token for a given user and save the
// token in the database. If there is an error the function will
// return an error value and an empty string.
func GenAuthToken(db dba.DBAbstraction, user, hash string) (string, error) {
	id, err := db.Select("SELECT id FROM login_info WHERE username = $1 AND user_pass = $2", user, hash)

	// No id was found, assume they gave wrong password or username
	if err != nil {
		return "", &TokenError{403, "Wrong username or password"}
	}

	// get random bytes to generate hmac
	key := make([]byte, 64)
	_, err = rand.Read(key)
	if err != nil {
		return "", &TokenError{500, "We encountered a problem generating the token. Please try again."}
	}

	// compute token
	hashFunc := hmac.New(sha512.New, key)
	_, _ = hashFunc.Write([]byte(user + ":" + hash + ":" + id))
	b := hashFunc.Sum(nil)
	token := hex.EncodeToString(b)
	token = user + ":" + token

	err = db.PreparedStmt("UPDATE login_info SET token = $1, expire_date = NOW() WHERE  username = $2 AND user_pass = $3", token, user, hash)
	if err != nil {
		return "", &TokenError{500, "We encountered a problem generating the token. Please try again."}
	}

	return token, nil
}

// CheckToken checks the if the user has given a valid token and
// returns the access level for that user
// if the token doesn't match it returns -1
func CheckToken(db dba.DBAbstraction, token string) int {
	user := strings.Split(token, ":")[0]

	lvl, err := db.Select("SELECT access_lvl FROM login_info WHERE username = $1 AND token = $2", user, token)

	if err != nil {
		return -1
	}

	i, err := strconv.Atoi(lvl)
	if err != nil {
		return -1
	}
	return i
}

// TokenCleanUp will delete the tokens from the database
// that have expired. Each token has 2 hours to live after creation.
func TokenCleanUp(db dba.DBAbstraction) {
	// UPDATE login_info SET token = random()::text, expire_date = NOW();
	query := "UPDATE login_info SET token = null, expire_date = null WHERE expire_date + '2 hours' < NOW();"
	db.PreparedStmt(query)
}
