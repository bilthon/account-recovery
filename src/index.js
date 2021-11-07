require('dotenv').config()
const bip39 = require('bip39')
const bip32 = require('bip32')
const bitcoin = require('bitcoinjs-lib')

// The desired gap, 20 is the recommended value.
const GAP = 20

const ACCOUNT_LIMIT = 10e3

const main = async () => {
  const seedWords = process.env.SEED_WORDS

  const targetAddress = process.argv[2] || process.env.TARGET_ADDRESS 
  if (!targetAddress) {
    console.log('Missing target address, please specify one either by setting the TARGET_ADDRESS environment variable or passing it as a command line argument')
    return
  }
  
  const seed = bip39.mnemonicToSeedSync(seedWords)
  
  const root = bip32.fromSeed(seed)
  
  const coin = root.derivePath('m/84\'/0\'')
  
  const before = Date.now()

  console.log('Scanning, please wait...')
  for(let i = 0; i < ACCOUNT_LIMIT; i++) {
    const account = coin.deriveHardened(i)
    // Going over external addresses
    const external = account.derive(0)
    for (let j = 0; j < GAP; j++) {
      const index = external.derive(j)
      const address = bitcoin.payments.p2wpkh({
        pubkey: index.publicKey
      }).address
      if (address === targetAddress) {
        console.log(`Found target address ${targetAddress}!`)
        console.log(`Derivation path: m/84'/0'/${i}/0/${j}`)
      }
    }
    // Going over change addresses
    const change = account.derive(1)
    for (let j = 0; j < GAP; j++) {
      const index = change.derive(j)
      const address = bitcoin.payments.p2wpkh({
        pubkey: index.publicKey
      }).address
      if (address === targetAddress) {
        console.log(`Found target address ${targetAddress}!`)
        console.log(`Derivation path: m/84'/0'/${i}/0/${j}`)
      }
    }
  }
  const after = Date.now()
  console.log(`Scan took ${after - before} ms`)
}

main()
