package utils

import "errors"

var ErrUnothorized = errors.New("wrong usrname or password")
var ErrUnexpectedChoice = errors.New("no such parameter")
var ErrSuspiciousInput = errors.New("input has unexpected chracters")
