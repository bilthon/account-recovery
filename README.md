# Account Recovery Tool

## Dependencies
- Nodejs (v14.17.0)
- NPM (7.20.6)

Versions are just recommended. This might work with other versions as well.

## Installation
Clone the repository
```bash
git clone git@github.com:bilthon/account-recovery.git
```
Install dependencies
```bash
cd account-recovery
npm install
```

## Configuration
Enter your BIP-39 mnemonic (replacing by your words, of course)
```bash
echo "SEED_WORDS=service burden undo local main absent net chunk foot multiply birth sail" > .env
```

There's another constant that you might want to adjust, and that's the wallet address gap.

Normally a wallet will not generate more than 20 unused addresses or will warn you when you reach that limit.

An exhaustive account search would look for at least 20 addresses for every account candidate. However since for most cases the account's first 2 addresses will present some activity, we can initially perform a quicker but not so exaustive search setting the `GAP` constant in `src/index.js` to 2.

If that doesn't turn out any result we could then increase the `GAP` constant to something like 10, or even 20.

This search will take much longer though.

## Run
```bash
npm start
```

### Output
```bash
m/84'/0'/0'/0/0 -> bc1q6wuwhamv5d0mgzzzj78l9sa78ha3rar760vupc - NOT
m/84'/0'/0'/0/1 -> bc1qycg0hvh5whus036etvcg27excc6a2aae0wryvv - NOT
m/84'/0'/1'/0/0 -> bc1q6t3l2yruc069r2f20uttghypyyqq3hpqa7vs2r - NOT
m/84'/0'/1'/0/1 -> bc1q3asf03ee9q55s3cwv6ze0mqk5skj9zp5r7n90j - NOT
m/84'/0'/2'/0/0 -> bc1qxkv2w6av7s9safc65r26hwk8ep40q9efaqayal - NOT
```

The script will scan every account and stop when it finds an account with addresses that have been used.

### Rate limit
Because we're using a free block explorer API and we don't want to be banned from it, there's a rate limit put in place. This means that the requests per second is capped to a specified amount. Initially this value is 1 req/sec. This can be changed by modifying the following line:

```bash
const http = rateLimit(instance, { maxRPS: 1 })
```