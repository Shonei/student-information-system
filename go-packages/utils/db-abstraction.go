package utils

import (
	"database/sql"
	"fmt"
)

// DB is custom struct to abstract the database
type DB struct {
	*sql.DB
}

// Select is a databse interface that returns a single value
// used to get the salt or uesrname of a user.
type Select interface {
	Select(string, ...interface{}) (string, error)
}

// SelectMulti is used to read multiple lines.
// The read data will be prased and read into a map
// for ease of use and parsing.
type SelectMulti interface {
	SelectMulti(string, ...interface{}) ([]map[string]string, error)
}

type Execute interface {
	Execute(string, ...interface{}) error
}

// DBAbstraction hides the database access.
// It should make testing the server easier
// as we can mock the responce from this layer.
type DBAbstraction interface {
	Select
	SelectMulti
	Execute
}

// Select is a basic query function that expect to recieve a single string
// as the responce from the query.
func (db *DB) Select(s string, args ...interface{}) (string, error) {
	var val string
	err := db.QueryRow(s, args...).Scan(&val)
	return val, err
}

// SelectMulti is the abstraction for sql.Query.
// It is used for select statements that will return multiple rows.
// The data will be sttored in a array of maps.
func (db *DB) SelectMulti(s string, args ...interface{}) ([]map[string]string, error) {
	rows, err := db.Query(s, args...)
	if err != nil {
		return nil, err
	}
	m, err := readRows(rows)
	if err != nil {
		return nil, err
	}
	return m, nil
}

// Execute will be the abstacction for update and insert queries.
// It won't return data after the statement has been return but only
// return an error if one has occured.
func (db *DB) Execute(s string, args ...interface{}) error {
	result, err := db.Exec(s, args...)
	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	fmt.Println(rows)
	if rows < 1 {
		return ErrEmptySQLSet
	}

	return err
}

// Reads the data from sqlRows into a []map[string]string
// This will be the basic type returned by the sql abstraction layer
func readRows(rows *sql.Rows) ([]map[string]string, error) {
	cols, err := rows.Columns()
	if err != nil {
		return nil, err
	}

	rawResult := make([][]byte, len(cols))
	var ret []map[string]string
	dest := make([]interface{}, len(cols))

	// load the interface with pointers to get the data
	for i := range rawResult {
		dest[i] = &rawResult[i]
	}

	for rows.Next() {
		// read data into dest that hold the pointers
		err := rows.Scan(dest...)
		if err != nil {
			return nil, err
		}

		result := make(map[string]string)
		// read the pointers and add them to the result
		for i, raw := range rawResult {
			result[cols[i]] = string(raw)
		}

		ret = append(ret, result)
	}

	// maybe a slopy check for an empty result
	if len(ret) == 0 {
		return nil, ErrEmptySQLSet
	}

	return ret, nil
}
