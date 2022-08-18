import {DIDDocument} from "@elastosfoundation/did-js-sdk";
import base58 from "bs58";
import {InvalidParameterException} from "../../exceptions";
const _sodium = require('libsodium-wrappers');


export class EncryptionUtils {

    private static readonly TRUNK_SIZE = 1024;

    concatUint8Arrays(arr1: Uint8Array, arr2: Uint8Array) {
        let result = new Uint8Array(arr1.length + arr2.length);
        result.set(arr1, 0);
        result.set(arr2, arr1.length);
        return result;
    }

    async getDIDDerivedPrivateKey(doc: DIDDocument, storepass: string): Promise<Uint8Array> {
        const base58Key = await doc.deriveFromIdentifier('hive_js', 1, storepass);
        const bytes = base58.decode(base58Key);
        const srcKey = Buffer.from(bytes).slice(46, 78);
        return bytes.slice(46, 78);
    }

    /**
     * Encrypt the data with key. The encrypted data started with an encryption header.
     *
     * @param key
     * @param data
     */
    async encryptData(key: Uint8Array, data: Buffer): Promise<Buffer> {
        await _sodium.ready;
        const sodium = _sodium;

        /* Set up a new stream: initialize the state and create the header */
        const result = sodium.crypto_secretstream_xchacha20poly1305_init_push(key);
        const [header, state] = [result.header, result.state];
        console.log(`key, ${Buffer.from(key).toString('hex')}`)
        console.log(`header, ${header}, ${state}`);

        /* encrypt the data */
        const blockSize = EncryptionUtils.TRUNK_SIZE;
        const [length] = [data.length];
        let [start, result_array] = [0, header];
        while (start < length - 1) {
            const isLastPart = start + blockSize >= length - 1;
            const tag = isLastPart ? sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL
                : sodium.crypto_secretstream_xchacha20poly1305_TAG_MESSAGE;
            const len = isLastPart ? length - start : blockSize;

            const encrypt_data = sodium.crypto_secretstream_xchacha20poly1305_push(
                state, Uint8Array.from(data.slice(start, start + len)), null, tag);
            result_array = result_array === null ? encrypt_data : this.concatUint8Arrays(result_array, encrypt_data);

            start += len;
        }

        return Buffer.from(result_array);
    }

    /**
     * Decrypt the data which started with the encryption header.
     *
     * @param key
     * @param data
     */
    async decryptData(key: Uint8Array, data: Buffer): Promise<Buffer> {
        await _sodium.ready;
        const sodium = _sodium;

        if (!data || data.length < sodium.crypto_secretstream_xchacha20poly1305_HEADERBYTES) {
            throw new InvalidParameterException('Invalid encryption data to decrypt');
        }

        /* Decrypt the stream: initializes the state, using the key and a header */
        const header = new Uint8Array(data.slice(0, sodium.crypto_secretstream_xchacha20poly1305_HEADERBYTES));
        console.log(`key, ${Buffer.from(key).toString('hex')}`)
        console.log(`header, ${header}`);
        const state = sodium.crypto_secretstream_xchacha20poly1305_init_pull(header, key);

        // decrypt data
        const blockSize = EncryptionUtils.TRUNK_SIZE + sodium.crypto_secretstream_xchacha20poly1305_ABYTES;
        const [length] = [data.length];
        let [start, result_array] = [sodium.crypto_secretstream_xchacha20poly1305_HEADERBYTES, null];
        while (start < length - 1) {
            const isLastPart = start + blockSize >= length - 1;
            const len = isLastPart ? length - start : blockSize;

            const msgTag = sodium.crypto_secretstream_xchacha20poly1305_pull(state,
                Uint8Array.from(data.slice(start, start + len)));

            result_array = result_array === null ? msgTag.message : this.concatUint8Arrays(result_array, msgTag.message);

            start += len;
        }

        return Buffer.from(result_array);
    }

}