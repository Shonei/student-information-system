package dba

import (
	"database/sql"
	"log"
)

// DB is custom struct to abstract the database
type DB struct {
	*sql.DB
}

// DBAbstraction hides the database access.
// It should make testing the server easier
// as we can mock the responce from this layer.
type DBAbstraction interface {
	Select(string, ...interface{}) string
	SelectMulti(string, ...interface{}) ([]map[string]string, error)
	PreparedStmt(string, ...interface{}) error
}

// Select is a basic query function that expect to recieve a single string
// as the responce from the query.
func (db *DB) Select(s string, args ...interface{}) string {
	var val string
	err := db.QueryRow(s, args...).Scan(&val)

	if err != nil {
		if err == sql.ErrNoRows {
			return ""
		}
		log.Println(err)
	}
	return val
}

// SelectMulti is the abstraction for sql.Query.
// It is used for select statements that will return multiple rows.
// The data will be sttored in a array of maps.
func (db *DB) SelectMulti(s string, args ...interface{}) ([]map[string]string, error) {
	rows, err := db.Query(s, args)
	if err != nil {
		return nil, err
	}
	m, err := readRows(rows)
	if err != nil {
		return nil, err
	}
	return m, nil
}

// PreparedStmt will be the abstacction for update and insert queries.
// It won't return data after the statement has been return but only
// return an error if one has occured.
func (db *DB) PreparedStmt(s string, args ...interface{}) error {
	stmt, err := db.Prepare(s)
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(args...)
	if err != nil {
		return err
	}

	return nil
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
	return ret, nil
}
