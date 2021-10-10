package config_test

import (
	"github.com/stretchr/testify/assert"
	"github.com/williamfeng323/bitcoin-playground/lib/config"
	"testing"
)

func TestGetAppConfig(t *testing.T) {
	conf := config.GetAppConfig()
	assert.NotNil(t, conf)
	assert.Equal(t,"https://raw.githubusercontent.com/bitcoin/bips/master/bip-0039/english.txt",
		conf.WordlistURL)
}
