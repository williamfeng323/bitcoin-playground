package routers

import (
	"github.com/go-playground/validator/v10"
	"regexp"
)

const DerivationPathRegString = `^m(\/[0-9]*\'?)*[0-9\']$|^m\/$|^m$`

func IsDerivationPath(fl validator.FieldLevel) bool {
	path, ok := fl.Field().Interface().(string)
	if !ok {
		return false
	}
	derivationPathReg, _  := regexp.Compile(DerivationPathRegString)
	isMatched := derivationPathReg.MatchString(path)
	return isMatched
}
