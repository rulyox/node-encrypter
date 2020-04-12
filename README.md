# Node Encrypter

A Node.js ransomware implementation.

This program is targeting Windows.


## Warning

* This program is only for research purposes.
* Do not use this program to attack a system or cause any harm.
* All responsibility lies with the user.


## How it works

### Encryption

1. Create a random AES key & IV.
2. Encrypt target files using AES.
3. Encrypt AES key & IV using RSA to create Identification Code.

### Decryption

1. Decrypt Identification Code to get AES key & IV.
2. Decrypt target files using AES.


## Usage

### Run with NPM

```
npm run build

npm run encrypt
npm run decrypt [Identification Code]
```

### Run exe file

```
npm run build

npm run encrypt-exe
npm run decrypt-exe

encrypter.exe
decrypter.exe [Identification Code]
```


## Configurations

* targetFolder : Folders to encrypt inside Windows User folder.
* targetExtension : Extensions of files to encrypt.
* publicKey, privateKey : RSA key pair used to encrypt AES key.
