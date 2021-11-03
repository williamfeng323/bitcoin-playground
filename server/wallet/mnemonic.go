package wallet

// This file generates mnemonic follows bip39

import (
	"crypto/sha256"
	"crypto/sha512"
	"errors"
	"github.com/williamfeng323/bitcoin-playground/lib/config"
	"golang.org/x/crypto/pbkdf2"
	"io/ioutil"
	"math/big"
	"math/rand"
	"net/http"
	"strings"
	"time"
)

var wordMap map[string]int
var wordList []string

var ENT2MS = map[int]int{
	128: 12,
	160: 15,
	192: 18,
	224: 21,
	256: 24,
}

var MS2ENT = map[int]int {
	12: 128,
	15: 160,
	18: 192,
	21: 224,
	24: 256,
}

type Entropy struct {
	entropy         []byte
	BitSize         uint
	CheckSumSize    uint
	checksumEntropy []byte
}

func (ent *Entropy) CalCheckSum() error {
	hashWriter := sha256.New()
	_, err := hashWriter.Write(ent.entropy)
	if err != nil {
		return err
	}
	hash := hashWriter.Sum(nil)
	checksumBitSize := uint(ent.BitSize / CheckSumFixedDenominator)
	checksumByte := hash[0] // 256/36/8 == 1, so checksum will only need to take the first byte.
	// extract the bits of checksumBitSize length and convert to byte then concat to the end of entropy
	intHash := big.NewInt(0).SetBytes(ent.entropy)
	for i := uint(0); i < checksumBitSize; i++ {
		intHash.Mul(intHash, big.NewInt(2))
		b := big.NewInt(0)
		mask := 1 << (7 - i)
		if int(checksumByte)&mask == mask {
			b = big.NewInt(1)
		}
		intHash.Or(intHash, b)
	}
	ent.checksumEntropy = intHash.Bytes()
	ent.CheckSumSize = checksumBitSize
	return nil
}

func init() {
	initWordList()
}

func initWordList() {
	resp, err := http.Get(config.GetAppConfig().WordlistURL)
	if err != nil {
		panic(err)
	}
	rawBody, err := ioutil.ReadAll(resp.Body)
	defer resp.Body.Close()
	if err != nil {
		panic(err)
	}
	wordMap = make(map[string]int)
	wordList = strings.Split(string(rawBody), WordListSplitter)
	for i, word := range wordList {
		wordMap[word] = i
	}
}

func GenerateEntropy(bitSize int) (Entropy, error) {
	if bitSize%32 != 0 || bitSize < 128 || bitSize > 256 {
		return Entropy{}, errors.New("inputted bit size must be a multiple of 32 bits and range from 128 to 256")
	}
	entBytes := make([]byte, bitSize/BitByteConvertor) // 1 byte = 8 bits
	rand.Seed(int64(time.Now().Nanosecond()))
	if _, err := rand.Read(entBytes); err != nil {
		return Entropy{}, err
	}
	entropy := Entropy{
		entropy: entBytes,
		BitSize: uint(bitSize),
	}
	entropy.CalCheckSum()
	return entropy, nil
}

// GenerateMnemonic generate mnemonic according to the entropy
func GenerateMnemonic(ent Entropy) string {
	sentenceSize := (ent.BitSize + ent.CheckSumSize) / WordGroupDenominator
	mnemonicSentence := make([]string, sentenceSize)
	intHash := big.NewInt(0).SetBytes(ent.checksumEntropy)
	for i := int(sentenceSize - 1); i >= 0; i-- {
		temp := big.NewInt(0)
		temp.And(intHash, ElevenBitAndMask)
		intHash.Div(intHash, ElevenBitMask)
		mnemonicSentence[i] = wordList[temp.Uint64()]
	}
	return strings.Join(mnemonicSentence, " ")
}

// MnemonicToSeed generate the seed from mnemonic
func MnemonicToSeed(mnemonic, passphase string) []byte {
	return pbkdf2.Key([]byte(mnemonic), []byte(FixSalt+passphase), IterationCount, KeyLength, sha512.New)
}
