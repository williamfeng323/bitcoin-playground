package routers

import "github.com/gin-gonic/gin"

// RouterRegister router registration
func RouterRegister(rg *gin.Engine) {
	rg.POST("/api/mnemonic", generateMnemonic)
	rg.POST("/api/master-node", generateMasterNode)
}

