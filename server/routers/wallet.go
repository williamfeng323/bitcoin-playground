package routers

import (
	"encoding/hex"
	"github.com/gin-gonic/gin"
	"github.com/williamfeng323/bitcoin-playground/wallet"
	"net/http"
)

type generateMnemonicQueryParam struct {
	SentenceLength int `json:"sentenceLength" form:"sentenceLength" binding:"required,oneof=12 15 18 21 24"`
	Passphrase string `json:"passphrase" form:"passphrase,omitempty"`
}
func generateMnemonic(ctx *gin.Context) {
	params := generateMnemonicQueryParam{}
	if err := ctx.ShouldBind(&params); err != nil {
		generalExceptions(ctx, err)
		return
	}
	entropy, err := wallet.GenerateEntropy(wallet.MS2ENT[params.SentenceLength])
	if err != nil {
		generalExceptions(ctx, err)
		return
	}
	mnemonic := wallet.GenerateMnemonic(entropy)
	seed := wallet.MnemonicToSeed(mnemonic, params.Passphrase)
	ctx.JSON(http.StatusOK, gin.H{"mnemonic": mnemonic, "seed": hex.EncodeToString(seed)})
}
