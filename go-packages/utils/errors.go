package utils

import "errors"

// ErrUnothorized can be returned from functions that handle authentication or authoriazation.
var ErrUnothorized = errors.New("wrong usrname or password")

// ErrToManyRows will be returned by functions that expect to find only
// a single row in the output. This type of function can be about generating the
// profile for a user.
var ErrToManyRows = errors.New("no such parameter")

// ErrSuspiciousInput returned by functions in the bdc package.
// That happends when a function determines there are invalid characters in the input variable.
var ErrSuspiciousInput = errors.New("input has unexpected characters")

// ErrEmptySQLSet is returned if there were no results in the SQL multi select query.
var ErrEmptySQLSet = errors.New("the result set is empty")

// ErrTimedOut is returned when a query takes too long
var ErrTimedOut = errors.New("search takes too long")

// ErrTypeMismatch is returned when data cant be converted to struct
var ErrTypeMismatch = errors.New("got an unexpected type")

// ErrSQLFailed is return when an insert or update fails
var ErrSQLFailed = errors.New("SQL query failes")

// ErrEmptyStruct is returned by security check functions when they are empty
var ErrEmptyStruct = errors.New("struct doesn't contain data")
