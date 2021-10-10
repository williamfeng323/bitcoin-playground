package config

import (
	"github.com/williamfeng323/bitcoin-playground/lib/constant"
	"gopkg.in/yaml.v2"
	"io/fs"
	"os"
)

type ApplicationConfig struct {
	WordlistURL string `yaml:"wordlist_url"`
}

var appConfig ApplicationConfig

func init() {
	configPath := os.Getenv(constant.ConfigPathEnv)
	rawConfig, err := os.ReadFile(configPath)
	if err != nil {
		if _, isPathErr := err.(*fs.PathError); !isPathErr {
			panic(err)
		}
	}
	appConfig = ApplicationConfig{
		"https://raw.githubusercontent.com/bitcoin/bips/master/bip-0039/english.txt",
	}
	yaml.Unmarshal(rawConfig, &appConfig)
}

// GetAppConfig returns the config loaded from config file
func GetAppConfig() ApplicationConfig {
	return appConfig
}
