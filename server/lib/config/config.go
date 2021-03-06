package config

import (
	"github.com/williamfeng323/bitcoin-playground/lib/constant"
	"gopkg.in/yaml.v2"
	"io/fs"
	"os"
)

type ApplicationConfig struct {
	WordlistURL string `yaml:"wordlistUrl"`
	Host        string `yaml:"host"`
	Port        string `yaml:"port"`
	TLSCertFile string `yaml:"tlsCertFile"`
	TLSKeyFile  string `yaml:"tlsKeyFile"`
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
		WordlistURL: "https://raw.githubusercontent.com/bitcoin/bips/master/bip-0039/english.txt",
		Host: "0.0.0.0",
		Port: "8081",
	}
	yaml.Unmarshal(rawConfig, &appConfig)
}

// GetAppConfig returns the config loaded from config file
func GetAppConfig() ApplicationConfig {
	return appConfig
}
