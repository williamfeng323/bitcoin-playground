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

func TestToMultiSigP2SHAddress(t *testing.T) {
	addr, err := ToMultiSigP2SHAddress(18, []string{})
	assert.Empty(t, addr)
	assert.Error(t, err, "M or pub-keys cannot be greater than 16")

	addr, err = ToMultiSigP2SHAddress(5, []string{})
	assert.Empty(t, addr)
	assert.Error(t, err, "no pub keys provided")

	addr, err = ToMultiSigP2SHAddress(3, []string{"12345"})
	assert.Error(t, err, "M cannot be less than pub keys")

	addr, err = ToMultiSigP2SHAddress(1, []string{"xpub6Gtsqete458wyPxVuX45oQCbbZd6kNHBEjsZLeVQCWhdb5gVropXWuSTCjbQVu3i93g6y1WuVMRxd9BSvNMBK9fsypBT1ihEEfsHfBKWpAM"})
	assert.Equal(t, "2Mw1Q7x2HibJRn3nHZoFF9cKTF8zzWykVeU", addr)
}
