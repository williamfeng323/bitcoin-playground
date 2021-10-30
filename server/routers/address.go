package routers

import (
	"github.com/btcsuite/btcd/chaincfg"
	"github.com/btcsuite/btcutil/hdkeychain"
	"github.com/gin-gonic/gin"
	"net/http"
)

type generateMasterNodeParam struct {
	Seed string `json:"seed" binding:"required"`
	Net string `json:"net" binding:"oneof='' mainnet testnet3"`
}
func generateMasterNode(ctx *gin.Context) {
	param := generateMasterNodeParam{}
	if err := ctx.ShouldBind(&param); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	net := &chaincfg.TestNet3Params
	if param.Net == chaincfg.MainNetParams.Name {
		net = &chaincfg.MainNetParams
	}
	if eKey, err := hdkeychain.NewMaster([]byte(param.Seed), net); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	} else {
		ctx.JSON(http.StatusOK, gin.H{"rootKey": eKey.String()})
	}
	return
}
