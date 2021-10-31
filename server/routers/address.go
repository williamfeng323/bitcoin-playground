package routers

import (
	"encoding/hex"
	"github.com/btcsuite/btcd/chaincfg"
	"github.com/btcsuite/btcutil/hdkeychain"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
)

type generateMasterNodeParam struct {
	Seed string `json:"seed" binding:"required"`
	Net string `json:"net" binding:"oneof='' mainnet testnet3"`
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
	log.Println(param.Seed)
	seed, err:= hex.DecodeString(param.Seed)
	if err != nil {
		generalExceptions(ctx, err)
		return
	}
	eKey, err := hdkeychain.NewMaster(seed, net)
	if  err != nil {
		generalExceptions(ctx, err)
		return
	}
	log.Printf(eKey.String())
	ctx.JSON(http.StatusOK, gin.H{"rootKey": eKey.String()})
}

type deriveKeysParam struct {
	Page int `json:"page"`
	PageSize int `json:"pageSize"`
	DerivePath string `json:"derivePath"`
}
func deriveKeys(ctx *gin.Context) {

}