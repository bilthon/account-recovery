require('dotenv').config()
const bip39 = require('bip39')
const bip32 = require('bip32')
const bitcoin = require('bitcoinjs-lib')
const axios = require('axios')
const rateLimit = require('axios-rate-limit')

// The desired gap, 20 is the recommended value.
// But we can start with a lower value to try to find
// the account quicker
const GAP = 2

const ACCOUNT_LIMIT = 10e3

const instance = axios.create({
  baseURL: 'https://blockstream.info/api'
})
const http = rateLimit(instance, { maxRPS: 1 })

const main = async () => {
  const seedWords = process.env.SEED_WORDS
  console.log('seed words: ', seedWords)
  
  const seed = bip39.mnemonicToSeedSync(seedWords)
  console.log('seed: ', seed.toString('hex'))
  
  const root = bip32.fromSeed(seed)
  
  const coin = root.derivePath('m/84\'/0\'')
  
  for(let i = 0; i < ACCOUNT_LIMIT; i++) {
    const account = coin.deriveHardened(i)
    const external = account.derive(0)
    for (let j = 0; j < GAP; j++) {
      const index = external.derive(j)
      const address = bitcoin.payments.p2wpkh({
        pubkey: index.publicKey
      }).address
      try {
        const resp = await http.get(`/address/${address}/txs`)
        if (resp.data.length > 0) {
          console.log('Account found! Index: ', i)
          return
        } else {
          console.log(`m/84'/0'/${i}'/0/${j} -> ${address} - NOT`)
        }
      } catch(err) {
        console.error(err)
      }
    }
  }
}

main()
