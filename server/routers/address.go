package routers

import (
	"encoding/hex"
	"github.com/btcsuite/btcd/chaincfg"
	"github.com/btcsuite/btcutil/hdkeychain"
	"github.com/gin-gonic/gin"
	"github.com/williamfeng323/bitcoin-playground/wallet"
	"net/http"
	"path"
	"strconv"
)

type generateMasterNodeParam struct {
	Seed string `json:"seed" binding:"required"`
	Net  string `json:"net" binding:"oneof='' mainnet testnet3"`
}

func generateMasterNode(ctx *gin.Context) {
	param := generateMasterNodeParam{}
	if err := ctx.ShouldBind(&param); err != nil {
		generalExceptions(ctx, err)
		return
	}
	net := &chaincfg.TestNet3Params
	if param.Net == chaincfg.MainNetParams.Name {
		net = &chaincfg.MainNetParams
	}
	seed, err := hex.DecodeString(param.Seed)
	if err != nil {
		generalExceptions(ctx, err)
		return
	}
	eKey, err := hdkeychain.NewMaster(seed, net)
	if err != nil {
		generalExceptions(ctx, err)
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"rootKey": eKey.String()})
}

type deriveKeysParam struct {
	Page           uint32 `json:"page"`
	PageSize       uint32 `json:"pageSize"`
	DerivePath     string `json:"derivePath" binding:"required,isDerivationPath"`
	ScriptSemantic string `json:"scriptSemantic" binding:"required,oneof=P2WPKH P2WSH"`
	RootKey        string `json:"rootKey" binding:"required"`
	Net            string `json:"net" binding:"oneof='' mainnet testnet3"`
	IsHarden       bool   `json:"isHarden"`
}

type DerivedKey struct {
	PrvKey  string `json:"prvKey,omitempty"`
	PubKey  string `json:"pubKey,omitempty"`
	Address string `json:"address,omitempty"`
	Path    string `json:"path,omitempty"`
}

type deriveKeysResp struct {
	ParentPrvKey string       `json:"parentPrvKey,omitempty"`
	ParentPubKey string       `json:"parentPubKey,omitempty"`
	DerivedKeys  []DerivedKey `json:"derivedKeys,omitempty"`
}

func deriveKeys(ctx *gin.Context) {
	param := deriveKeysParam{PageSize: 50}
	if err := ctx.ShouldBind(&param); err != nil {
		generalExceptions(ctx, err)
		return
	}
	offset := param.Page*param.PageSize
	pKey, eKeys, err := wallet.GetAddressesFromRootKey(param.RootKey, param.DerivePath,
		param.IsHarden, param.PageSize, offset)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusExpectationFailed, gin.H{"error": err.Error()})
		return
	}
	var derivedKeys []DerivedKey
	for i, key := range eKeys {
		pubKey, _ := key.Neuter()
		net := &chaincfg.TestNet3Params
		if param.Net == chaincfg.MainNetParams.Name {
			net = &chaincfg.MainNetParams
		}
		p2wpkh, _ := wallet.ToP2WPKHAddress(pubKey, net)
		derivedKey := DerivedKey{
			PrvKey:  key.String(),
			PubKey:  pubKey.String(),
			Address: p2wpkh.EncodeAddress(),
			Path: path.Join(param.DerivePath, strconv.FormatInt(int64(uint32(i) + offset), 10)),
		}
		derivedKeys = append(derivedKeys, derivedKey)
	}
	pKeyPub, _ := pKey.Neuter()
	ctx.JSON(http.StatusOK, deriveKeysResp{
		ParentPrvKey: pKey.String(),
		ParentPubKey: pKeyPub.String(),
		DerivedKeys:  derivedKeys,
	})
}
