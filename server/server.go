package main

import (
	"context"
	"fmt"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"

	"github.com/go-playground/validator/v10"
	"github.com/williamfeng323/bitcoin-playground/lib/config"
	"github.com/williamfeng323/bitcoin-playground/routers"

	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

func main() {
	logger := log.Default()
	appConf := config.GetAppConfig()
	addr := fmt.Sprintf("%s:%s", appConf.Host, appConf.Port)
	router := gin.Default()
	router.Use(cors.Default())
	router.Use(static.Serve("/", static.LocalFile("../client/build", true)))
	if v, ok := binding.Validator.Engine().(*validator.Validate); ok {
		v.RegisterValidation("isDerivationPath", routers.IsDerivationPath)
	}
	routers.RouterRegister(router)

	srv := &http.Server{
		Addr:    addr,
		Handler: router,
	}
	go func() {
		// service connections
		if len(appConf.TLSCertFile)!=0 && len(appConf.TLSKeyFile)!=0 {
			if err := srv.ListenAndServeTLS(appConf.TLSCertFile, appConf.TLSKeyFile); err != nil && err != http.ErrServerClosed {
				log.Fatal("listener failed to start: ", err)
			}
		} else {
			if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
				log.Fatal("listener failed to start: ", err)
			}
		}
	}()
	logger.Printf("Start to listen %s", addr)
	// Graceful shutdown
	// Wait for interrupt signal to gracefully shut down the server with
	// a timeout of 5 seconds.
	quit := make(chan os.Signal, 1)
	// kill (no param) default send syscall.SIGTERM
	// kill -2 is syscall.SIGINT
	// kill -9 is syscall.SIGKILL but can't be caught, so don't need to add it
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	logger.Print("Shutdown Server ...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		logger.Fatal("Server Shutdown: ", err)
	}

	logger.Print("Server exiting")
}
