package wallet

import (
	"math/big"
)

const (
	WordListSplitter         = "\n"
	BitByteConvertor         = 8
	CheckSumFixedDenominator = 32
	WordGroupDenominator     = 11
	FixSalt                  = "mnemonic"
	IterationCount           = 2048
	KeyLength                = 64
)

var (
	ElevenBitMask            = big.NewInt(2048)
	ElevenBitAndMask         = big.NewInt(2047)
)
