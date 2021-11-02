package wallet

import (
	"errors"
	"github.com/btcsuite/btcd/btcec"
	"github.com/btcsuite/btcd/chaincfg"
	"github.com/btcsuite/btcd/txscript"
	"github.com/btcsuite/btcutil"
	"github.com/btcsuite/btcutil/hdkeychain"
	"github.com/williamfeng323/bitcoin-playground/lib/constant"
	"math"
	"strconv"
	"strings"
)

var DerivationPathFormatIncorrect = errors.New("the derivation path format incorrect")
var ParentKeyIsNotRootKey = errors.New("provided key is not a root key")
var StringIsNotPubKey = errors.New("provided string is not a valid key")

// GetAddressesFromRootKey returns a set of children from the root key
func GetAddressesFromRootKey(rootKey string, derivationPath string, isHarden bool, addrCount, offset uint32) (*hdkeychain.ExtendedKey, []*hdkeychain.ExtendedKey, error) {
	mKey, err := hdkeychain.NewKeyFromString(rootKey)
	if mKey.String() != rootKey {
		return nil, nil, nil
	}
	if err != nil {
		return nil, nil, err
	}

	if !mKey.IsPrivate() {
		return nil,nil, ParentKeyIsNotRootKey
	}
	paths := strings.Split(strings.TrimRight(derivationPath, constant.PathSeparator), constant.PathSeparator)
	for _, path := range paths[1:] {
		kIdx, e := strconv.ParseUint(strings.TrimRight(path, constant.HardenReMark), 10, 32)
		isHardenM := false
		if path[len(path)-1:] == constant.PathSeparator {
			isHardenM = true
		}
		if e != nil {
			return nil, nil, DerivationPathFormatIncorrect
		}
		if isHardenM {
			kIdx = hdkeychain.HardenedKeyStart + kIdx
		}
		mKey, _ = mKey.Derive(uint32(kIdx))
	}
	var addrs []*hdkeychain.ExtendedKey
	for i:=offset; i< offset + addrCount; i++ {
		idx := i
		if isHarden {
			idx = hdkeychain.HardenedKeyStart + i
		}
		if idx >= math.MaxUint32 {
			break
		}
		addr, _ := mKey.Derive(idx)
		addrs = append(addrs, addr)
	}
	return mKey, addrs, nil
}

// ToP2WPKHAddress returns a P2WPKH address
func ToP2WPKHAddress(key *hdkeychain.ExtendedKey, net *chaincfg.Params) (*btcutil.AddressWitnessPubKeyHash, error) {
	ecPubKey, err := key.ECPubKey()
	if err != nil {
		return nil, err
	}
	keyHash := btcutil.Hash160(ecPubKey.SerializeCompressed())
	return btcutil.NewAddressWitnessPubKeyHash(keyHash, net)
}

// ToMultiSigP2SHAddress returns a multi-sig P2SH addr
func ToMultiSigP2SHAddress(m int, keys []string) (string, error) {
	if m > 16 || len(keys) > 16{
		return "", errors.New("M or pub-keys cannot be greater than 16")
	}
	if len(keys) == 0 {
		return "", errors.New("no pub keys provided")
	}
	if len(keys) < m {
		return "", errors.New("M cannot be less than pub keys")
	}
	var pubKeys []*btcec.PublicKey
	for i := range keys {
		exK, err := hdkeychain.NewKeyFromString(keys[i])
		if err != nil || exK.IsPrivate(){
			return "", StringIsNotPubKey
		}
		pk, err := exK.ECPubKey()
		if err != nil {
			return "", err
		}
		pubKeys = append(pubKeys, pk)
	}
	op := txscript.OP_1 + m -1
	op2 := txscript.OP_1 + len(keys) -1
	builder := txscript.NewScriptBuilder()
	builder.AddOp(byte(op))
	for i := range pubKeys {
		pk := pubKeys[i].SerializeCompressed()
		builder.AddData(pk)
	}
	builder.AddOp(byte(op2))
	redeemScript, err := builder.Script()
	if err != nil {
		return "", err
	}
	redeemHash := btcutil.Hash160(redeemScript)
	addr, err := btcutil.NewAddressScriptHashFromHash(redeemHash, &chaincfg.TestNet3Params)
	if err != nil {
		return "", err
	}
	return addr.EncodeAddress(), nil
}