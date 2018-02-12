package utils

import "errors"

// ErrUnothorized can be returned from functions that handle authentication or authoriazation.
var ErrUnothorized = errors.New("wrong usrname or password")

// ErrUnexpectedChoice should never be send by the any function.
// It is only send by functions in the bdc package that have a switch statement
// that chooses between sql queries and we reach the default case.
var ErrUnexpectedChoice = errors.New("no such parameter")

// ErrSuspiciousInput returned by functions in the bdc package.
// That happends when a function determines there are invalid characters in the input variable.
var ErrSuspiciousInput = errors.New("input has unexpected chracters")

// ErrEmptySQLSet is returned if there were no results in the SQL multi select query.
var ErrEmptySQLSet = errors.New("the result set is empty")
