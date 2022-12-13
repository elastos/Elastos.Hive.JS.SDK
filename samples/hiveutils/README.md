# Hive Utilities

This folder contains some useful utilities. Before use this tool:

```
$ npm install
$ npm run hiveutils -- --help
```

## Hive Url Check

Hive url is for downloading the file from other user by the scripting service.

```
# Usage
$ npm run hiveutils -- -e <testnet|mainnet> -u <hive_url> -o <file_name>

# Example
$ npm run hiveutils -- -e testnet -u 'hive://did:elastos:iT6mGBL8nATPhLGowgi2PRRRG85X4TKVYc@did:elastos:ig1nqyyJhwTctdLyDFbZomSbZSjyMN1uor/getMainIdentityAvatar1658844232162?params={"empty":0}' -o icon.png
$ npm run hiveutils -- -e mainnet -u 'hive://did:elastos:iabbGwqUN18F6YxkndmZCiHpRPFsQF1imT@did:elastos:ig1nqyyJhwTctdLyDFbZomSbZSjyMN1uor/getMainIdentityAvatar1627717470347?params={"empty":0}' -o icon.png
```
