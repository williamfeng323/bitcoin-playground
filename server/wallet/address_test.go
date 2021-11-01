package wallet

import (
	"github.com/btcsuite/btcd/chaincfg"
	"github.com/stretchr/testify/assert"
	"testing"
)

type InputParam struct {
		RootKey string
		DerivationPath string
		IsHarden bool
		Counts uint32
		Offset uint32
	}
type Tests struct {
	InputParam
	ExpectError error
}

var cases = []Tests{
	{
		InputParam: InputParam{
			RootKey:        "xprv9s21ZrQH143K4W4kTz43WQ6t4qHjJqW472PddNo8m4qVFxa4AddJsmbKqSGW8h1qnbYHQKwavcD966CcTFXwnh4o9YTbceTKxWmQpS8XCvt",
			DerivationPath: "m/44/0/1/1",
			Counts:         5,
		},
		ExpectError: nil,
	},
	{
		InputParam: InputParam{
			RootKey:        "xprv9s21ZrQH143K4W4kTz43WQ6t4qHjJqW472PddNo8m4qVFxa4AddJsmbKqSGW8h1qnbYHQKwavcD966CcTFXwnh4o9YTbceTKxWmQpS8XCvt",
			DerivationPath: "m",
			Counts:         5,
		},
		ExpectError: nil,
	},
	{
		InputParam: InputParam{
			RootKey:        "xprv9s21ZrQH143K4W4kTz43WQ6t4qHjJqW472PddNo8m4qVFxa4AddJsmbKqSGW8h1qnbYHQKwavcD966CcTFXwnh4o9YTbceTKxWmQpS8XCvt",
			DerivationPath: "m/44/a0/1/1",
			Counts:         5,
		},
		ExpectError: DerivationPathFormatIncorrect,
	},
}

func TestGetAddressesFromRootKey(t *testing.T) {
	for _, testCase := range cases {
		pKey, eKeys, err :=GetAddressesFromRootKey(testCase.RootKey, testCase.DerivationPath, testCase.IsHarden,
			testCase.Counts, testCase.Offset)
		if testCase.ExpectError != nil {
			assert.Error(t, testCase.ExpectError, err)
			assert.Nil(t, eKeys)
			assert.Nil(t, pKey)
			continue
		}
		assert.Equal(t, testCase.Counts, uint32(len(eKeys)))
		assert.NotNil(t, pKey)
		p2wpkh, err := ToP2WPKHAddress(pKey, &chaincfg.MainNetParams)
		assert.Nil(t, err)
		assert.NotNil(t, p2wpkh)
		strAddr := p2wpkh.EncodeAddress()
		assert.NotEmpty(t, strAddr)
	}
}
