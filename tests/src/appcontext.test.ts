import {AppContext} from "../../src";
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

    test('testKeyPair', async () => {
        // TODO:
    });

    test('testEncryptDecryptByKeyPair', async () => {
    });
});
