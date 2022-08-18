import {AppContext} from "../../src";
import {EncryptionUtils} from "../../src/utils/encryption/encrypt_utils";
const _sodium = require('libsodium-wrappers');

/**
 * Please run this file with a prod hive node.
 */

describe.skip("test appcontext", () => {
    beforeAll(() => {});

    test("testGetProviderAddress", async () => {
        const userDid = 'did:elastos:imedtHyjLS155Gedhv7vKP3FTWjpBUAUm4';
        const providerAddress = await AppContext.getProviderAddressByUserDid(userDid, null, true);
        console.log(`Provider address: ${providerAddress}`);
        expect(providerAddress).not.toBeUndefined();
        expect(providerAddress).not.toBe('https://hive1.trinity-tech.io');
    });

    test('testGeneratePrivateKey', async () => {
        await _sodium.ready;
        const sodium = _sodium;

        // OK
        let key = '808182838485868788898a8b8c8d8e8f909192939495969798999a9b9c9d9e9f';
        let derivedKey = Buffer.from(sodium.crypto_kdf_derive_from_key(32, 1, 'data_encrypt', Buffer.from(key, 'hex')));
        console.log(`derived key: ${derivedKey.toString('hex')}`);

        key = '5OO9gnYjg_U0Skd4bI0kUOjWviQhlg6XRINPivuG4QZHbcMlEQgKPGTVzS9olfhg1HROuKi5myU-mgeFslsDFX7KNP8ToAhKTwNQvSuf9bVTZdf9esJvVvFcJ1-f_1Fd';
        let salt = Buffer.from('808182838485868788898a8b8c8d8e8f', 'hex');
        let key2 = Buffer.from(sodium.crypto_pwhash(32, key, salt, 2, 65536 << 10, 2));
        console.log(`derived key: ${key2.toString('hex')}`);
        derivedKey = Buffer.from(sodium.crypto_kdf_derive_from_key(32, 1, 'data_encrypt', key2));
        console.log(`derived key: ${derivedKey.toString('hex')}`);
        expect(derivedKey.toString('hex')).toEqual('e419419e07e60e0426efcf80d02f33e28042c89fda0722214a0328bac714fd8d');
    });

    test('testEncryptDecryptByPrivateKey', async () => {
        await _sodium.ready;
        const sodium = _sodium;

        /* Shared secret key required to encrypt/decrypt the stream */
        const key = sodium.crypto_secretstream_xchacha20poly1305_keygen();

        /* Set up a new stream: initialize the state and create the header */
        const result = sodium.crypto_secretstream_xchacha20poly1305_init_push(key);
        const [header, state] = [result.header, result.state];

        /* Now, encrypt the first chunk. `c1` will contain an encrypted,
         * authenticated representation of `MESSAGE_PART1`. */
        const part1 = sodium.crypto_secretstream_xchacha20poly1305_push(
            state, sodium.from_string("Arbitrary data to encrypt"), null, sodium.crypto_secretstream_xchacha20poly1305_TAG_MESSAGE);

        /* Encrypt the second chunk. `c2` will contain an encrypted, authenticated
         * representation of `MESSAGE_PART2`. */
        const part2 = sodium.crypto_secretstream_xchacha20poly1305_push(
            state, sodium.from_string("split into"), null, sodium.crypto_secretstream_xchacha20poly1305_TAG_MESSAGE);
        // (&state, c2, NULL, MESSAGE_PART2, MESSAGE_PART2_LEN, NULL, 0, 0);

        /* Encrypt the last chunk, and store the ciphertext into `c3`.
         * Note the `TAG_FINAL` tag to indicate that this is the final chunk. */
        const part3 = sodium.crypto_secretstream_xchacha20poly1305_push(
            state, sodium.from_string("three messages"), null, sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL);

        /* Decrypt the stream: initializes the state, using the key and a header */
        const stateDecrypt = sodium.crypto_secretstream_xchacha20poly1305_init_pull(header, key);

        /* Decrypt the first chunk. A real application would probably use
         * a loop, that reads data from the network or from disk, and exits after
         * an error, or after the last chunk (with a `TAG_FINAL` tag) has been
         * decrypted. */
        const msg1 = sodium.crypto_secretstream_xchacha20poly1305_pull(stateDecrypt, part1);
        expect(sodium.to_string(msg1.message)).toEqual("Arbitrary data to encrypt");

        /* Decrypt the second chunk, store the result into `m2` */
        const msg2 = sodium.crypto_secretstream_xchacha20poly1305_pull(stateDecrypt, part2);
        expect(sodium.to_string(msg2.message)).toEqual("split into");

        /* Decrypt the last chunk, store the result into `m3` */
        const msg3 = sodium.crypto_secretstream_xchacha20poly1305_pull(stateDecrypt, part3);
        expect(sodium.to_string(msg3.message)).toEqual("three messages");
    });

    test('EncryptionUtils', async () => {
        const utils = new EncryptionUtils();
        const key = Uint8Array.from(Buffer.from('5fde3dbee357613c3ecc62fc36c30bdc10f0cd9c6ee8ebea4966754c7e2d403a', 'hex'));
        const data = '{"@context":["https://www.w3.org/ns/did/v1","https://ns.elastos.org/did/v1","https://w3id.org/security/v1"],"id":"did:elastos:ipUGBPuAgEx6Le99f4TyDfNZtXVT2NKXPR","publicKey":[{"id":"did:elastos:ipUGBPuAgEx6Le99f4TyDfNZtXVT2NKXPR#primary","type":"ECDSAsecp256r1","controller":"did:elastos:ipUGBPuAgEx6Le99f4TyDfNZtXVT2NKXPR","publicKeyBase58":"nQgixgrEngN2xLQsD87mKXwhfAuXuLj94gi4JN2d5zqz"}],"authentication":["did:elastos:ipUGBPuAgEx6Le99f4TyDfNZtXVT2NKXPR#primary"],"expires":"2027-04-01T08:35:47Z","proof":{"type":"ECDSAsecp256r1","created":"2022-04-01T08:35:47Z","creator":"did:elastos:ipUGBPuAgEx6Le99f4TyDfNZtXVT2NKXPR#primary","signatureValue":"6LTNIME_2PSMppIdNvXXn_ZwjzFpuluyqdLx628ED2Ih6QNQN2C20orZQJA_VxYPmMWENp1oAoa7OgqMR5-IxQ"}}{"@context":["https://www.w3.org/ns/did/v1","https://ns.elastos.org/did/v1","https://w3id.org/security/v1"],"id":"did:elastos:ipUGBPuAgEx6Le99f4TyDfNZtXVT2NKXPR","publicKey":[{"id":"did:elastos:ipUGBPuAgEx6Le99f4TyDfNZtXVT2NKXPR#primary","type":"ECDSAsecp256r1","controller":"did:elastos:ipUGBPuAgEx6Le99f4TyDfNZtXVT2NKXPR","publicKeyBase58":"nQgixgrEngN2xLQsD87mKXwhfAuXuLj94gi4JN2d5zqz"}],"authentication":["did:elastos:ipUGBPuAgEx6Le99f4TyDfNZtXVT2NKXPR#primary"],"expires":"2027-04-01T08:35:47Z","proof":{"type":"ECDSAsecp256r1","created":"2022-04-01T08:35:47Z","creator":"did:elastos:ipUGBPuAgEx6Le99f4TyDfNZtXVT2NKXPR#primary","signatureValue":"6LTNIME_2PSMppIdNvXXn_ZwjzFpuluyqdLx628ED2Ih6QNQN2C20orZQJA_VxYPmMWENp1oAoa7OgqMR5-IxQ"}}';
        const encryptData = await utils.encryptData(key, Buffer.from(data));
        console.log(`encoded data: ${encryptData.toString('hex')}`);
        expect(encryptData).not.toBeNull();

        const decryptData = await utils.decryptData(key, encryptData);
        expect(decryptData.toString('utf8')).toEqual(data);
    });

    test('testGenerateEncryptionKeyPair', async () => {
        await _sodium.ready;
        const sodium = _sodium;

        // example OK
        let aliceKeypair = Buffer.from(
            '411a2c2227d2a799ebae0ed94417d8e8ed1ca9b0a9d5f4cd743cc52d961e94e2' +
            'da49154c9e700b754199df7974e9fa4ee4b6ebbc71f89d8d8938335ea4a1409d' +
            'da49154c9e700b754199df7974e9fa4ee4b6ebbc71f89d8d8938335ea4a1409d', 'hex');
        let aliceSecret = Buffer.from(aliceKeypair.slice(0, 64)); // 64bytes
        let alicePublic = Buffer.from(aliceKeypair.slice(64, 96)); // 32bytes

        let ecdhSecret = Buffer.from(sodium.crypto_sign_ed25519_sk_to_curve25519(aliceSecret));
        expect(ecdhSecret.toString('hex')).toEqual('60c783b8d1674b7081b72a105b55872502825d4ec638028152e085b54705ad7e');
        let ecdhPublic = Buffer.from(sodium.crypto_sign_ed25519_pk_to_curve25519(alicePublic));
        expect(ecdhPublic.toString('hex')).toEqual('5a791d07cfb39060c8e9b641b6a915a3126cd14ddc243a9928c490c8e1f59e7c');
    });
});
