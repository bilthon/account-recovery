require('dotenv').config()
const bip39 = require('bip39')
const bip32 = require('bip32')
const bitcoin = require('bitcoinjs-lib')
const axios = require('axios')

// The desired gap, 20 is the recommended value.
// But we can start with a lower value to try to find
// the account quicker
const GAP = 2

const ACCOUNT_LIMIT = 2//10e3

const http = axios.create({
  baseURL: 'https://blockstream.info/api'
})

const main = async () => {
  const seedWords = process.env.SEED_WORDS
  console.log('seed words: ', seedWords)
  
  const seed = bip39.mnemonicToSeedSync(seedWords)
  console.log('seed: ', seed.toString('hex'))
  
  const root = bip32.fromSeed(seed)
  console.log('root: ', root)
  
  const coin = root.derivePath('m/84\'/0\'')
  
  for(let i = 0; i < ACCOUNT_LIMIT; i++) {
    const account = coin.deriveHardened(i)
    const external = account.derive(0)
    for (let j = 0; j < GAP; j++) {
      const index = external.derive(j)
      const address = bitcoin.payments.p2wpkh({
        pubkey: index.publicKey
      }).address
      console.log(`m/84'/0'/${i}/0/${j} -> ${address}`)
      try {
        const resp = await http.get(`/address/${address}/txs`)
        if (resp.data.length > 0) {
          console.log('Account found! Index: ', i)
          return
        }
      } catch(err) {
        console.error(err)
      }
    }
  }
}

main()
