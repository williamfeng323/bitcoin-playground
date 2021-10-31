package routers

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

// RouterRegister router registration
func RouterRegister(rg *gin.Engine) {
	rg.POST("/api/mnemonic", generateMnemonic)
	rg.POST("/api/master-node", generateMasterNode)
}

func generalExceptions(ctx *gin.Context, err error) {
	ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
}