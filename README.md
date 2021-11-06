# Account Recovery Tool

### Dependencies
- Nodejs (v14.17.0)
- NPM (7.20.6)

Versions are just recommended. This might work with other versions as well.

### Installation

Clone the repository
```bash
git clone https://github.com/bilthon/account-recovery.git
```
Install dependencies
```bash
cd account-recovery
npm install
```

### Configuration
Enter your BIP-39 mnemonic (replacing by your words, of course)
```bash
echo "SEED_WORDS=service burden undo local main absent net chunk foot multiply birth sail" > .env
```

Now you must specify a target address, which can be defined either as the first command line argument or by defining the `TARGET_ADDRESS` environment variable.

### Environment variable
```bash
echo "\nTARGET_ADDRESS=bc1q7lcw0a4aw77frh947td0czyagrr8k8cjfk3fz6" >> .env
```

### Command line argument
```bash
npm start bc1q7lcw0a4aw77frh947td0czyagrr8k8cjfk3fz6
```

You must chose one method. The command line argument one overrides whatever was defined as an environment variable.

### Sample Output
```bash
Scanning, please wait...
Found target address bc1q7lcw0a4aw77frh947td0czyagrr8k8cjfk3fz6!
Derivation path: m/84'/0'/8745/0/13
Scan took 19255 ms
```

The script will scan every account and stop when it finds an account with the target address.