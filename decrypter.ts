import os from 'os';
import fs from 'fs';
import crypto from 'crypto';
import path from 'path';
import config from './config.json';

const decrypt = () => {

    const userName: string = os.userInfo().username;
    const userDir: string = `C:\\Users\\${userName}`;

    // get arguments
    const args: string[] = process.argv.slice(2);

    if(args.length < 1) {
        console.log('Enter Identification Code as an argument!\n');
        return;
    }

    const idCode: string = args[0];

    console.log('Starting...\n');

    // get key data
    const keyData: string = decryptPrivateKey(idCode);

    const key: string = keyData.substring(0, 32);
    const iv: Buffer = Buffer.from(keyData.substring(32), 'hex');

    console.log(`Key : ${key}\nIV : ${iv.toString('hex')}\n`);

    console.log('Decrypted Files :');

    // decrypt files recursively
    for(let i = 0; i < config.targetFolder.length; i++) decryptDir(`${userDir}\\${config.targetFolder[i]}`, key, iv);

    console.log('\nDecryption Finished!\n');

};

const decryptDir = (dir: string, key: string, iv: Buffer) => {

    // if directory does not exist
    if(!fs.existsSync(dir)) return;

    fs.readdirSync(dir).forEach(file => {

        try {

            const fullPath: string = path.join(dir, file);

            if(fs.lstatSync(fullPath).isDirectory()) { // if folder

                // recursive call
                decryptDir(fullPath, key, iv);

            } else { // if file

                let isTarget: boolean = false;

                // check extension
                for(let j = 0; j < config.targetExtension.length; j++) {
                    if(fullPath.toLowerCase().endsWith(config.targetExtension[j])) {
                        isTarget = true;
                        break;
                    }
                }

                if(isTarget) {

                    // check file size (only under 1GB)
                    let fileStat = fs.statSync(fullPath);
                    let fileSize = fileStat['size'];
                    if(fileSize < 1e9) {

                        decryptFile(fullPath, key, iv);

                        console.log(fullPath);

                    }

                }

            }

        } catch(error) {

            console.log(error);

        }

    });

};

const decryptFile = (file: string, key: string, iv: Buffer) => {

    let fileData: string = fs.readFileSync(file).toString();
    let decryptedData: string = decryptAES(fileData, key, iv);

    fs.writeFileSync(file, decryptedData);

};

const decryptAES = (cipherText: string, key: string, iv: Buffer): string => {

    const cipherBuffer = Buffer.from(cipherText, 'base64');

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

    let decryptedText: Buffer = decipher.update(cipherBuffer);
    decryptedText = Buffer.concat([decryptedText, decipher.final()]);

    return decryptedText.toString();

};

const decryptPrivateKey = (cipherText: string) => {

    const cipherBuffer: Buffer = Buffer.from(cipherText, 'base64');
    const decryptedBuffer: Buffer = crypto.privateDecrypt(config.privateKey, cipherBuffer);

    return decryptedBuffer.toString();

};

// execute
decrypt();
