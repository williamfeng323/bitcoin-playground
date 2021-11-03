# bitcoin-playground

This is an application to help users manage their BTC assets follows Bip32, Bip39 and Bip144. 

## Dependencies
### Server side

#### Main external libs
**gingonic**: 
One of the most famous Golang web application framework. It provides user-friendly APIs
to help developers build backend server. 

**btcutil**:
btcutil is a package provides bitcoin related features implements in Golang. In this web app, 
we mainly use its hdkeychain package to generate the bip32 HD extended keys and then derive 
the corresponding private/public keys and addresses.

#### Security:
The server use HTTP protocol as default. But it also supports HTTPS. To enable HTTPS, 
please provide tls cert file and tls key file and config the files' path in the yaml config
file with key tlsCertFile and tlsKeyFile.

The server itself does not save any data but only help generate hd keys and addresses. 

### Client side
#### Main external libs
**ReactJS**:
ReactJS is the most widely use front-end framework. This Web APP utilizes ReactJS to build a 
single page application. Considering the states in the application are not complicate, we use 
React hook only.

**material-ui**:
MUI provides a set of handy components for React Applications. This repo uses many MUI components to 
provide a stylish UI/UX.

#### Security:
The client side allows user to manage multiple wallets, wallet data will be temporary store in browser 
storage using localSession. All data will be automatically deleted after the browser closed.

### Coding Style
The client side is implemented in Typescript to guard types 
and eslint is introduced to guarantee code quality.

The server side is implemented in Golang which is language that follows predefined 
code format by applying go fmt ./...; Sonarqube is introduced to detect the scannable
bugs and cognitive issues.

### Unit Tests
The server side implements unit tests in key packages such as wallet and config. Unit test coverage 
could be checked via go test -cover ./...

Apologize for missing the tests in the client side at the moment. If time allowed, I will follow TDD
 when I code.

### Deployment
Since the project is designed in separation of front-end and back-end mode, to simplify the deployment,
I designed to use docker compose. By simply run below command, you can start the application and play around
 in [this side](http://localhost).

The docker-compose actually spin up the client server, api server and a reverse proxy to serve the application
 under one exposed endpoint.
```bash
docker-compose up
```

### Further Enhancement
1. Unit tests
2. P2WPKH nested in P2SH, P2WSH, P2WSH nested in P2SH support
3. WIP support
4. Create Wallet via mnemonic words
5. Data persistence 