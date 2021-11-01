package wallet

import (
	"errors"
	"github.com/btcsuite/btcd/chaincfg"
	"github.com/btcsuite/btcutil"
	"github.com/btcsuite/btcutil/hdkeychain"
	"github.com/williamfeng323/bitcoin-playground/lib/constant"
	"strconv"
	"strings"
)

var DerivationPathFormatIncorrect = errors.New("the derivation path format incorrect")
var ParentKeyIsNotRootKey = errors.New("provided key is not a root key")

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
		mKey, _ = mKey.Child(uint32(kIdx))
	}
	var addrs []*hdkeychain.ExtendedKey
	for i:=offset; i< offset + addrCount; i++ {
		idx := i
		if isHarden {
			idx = hdkeychain.HardenedKeyStart * i
		}
		addr, _ := mKey.Child(idx)
		addrs = append(addrs, addr)
	}
	return mKey, addrs, nil
}

func ToP2WPKHAddress(key *hdkeychain.ExtendedKey, net *chaincfg.Params) (*btcutil.AddressWitnessPubKeyHash, error) {
	ecPubKey, err := key.ECPubKey()
	if err != nil {
		return nil, err
	}
	keyHash := btcutil.Hash160(ecPubKey.SerializeCompressed())
	return btcutil.NewAddressWitnessPubKeyHash(keyHash, net)
}
