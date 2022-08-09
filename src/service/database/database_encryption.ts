import {InvalidParameterException} from "../../exceptions";
import {JSONObject} from "@elastosfoundation/did-js-sdk";
import {EncryptionDocument} from "./encryption_doc";
import {EncryptionFilter} from "./encryption_filter";
import {EncryptionUpdate} from "./encryption_update";

export class DatabaseEncryption {
    /**
     * Encrypt the document fields when insert.
     *
     * @param doc
     * @param isEncrypt
     */
    encryptDoc(doc: any, isEncrypt=true) {
        const json = DatabaseEncryption.getGeneralJsonDict(doc, 'The document must be dictionary.');
        if (Object.keys(json).length == 0) {
            return {};
        }

        const edoc = new EncryptionDocument(json);
        return isEncrypt ? edoc.encrypt() : edoc.decrypt();
    }

    /**
     * Encrypt the fields of documents when insert.
     *
     * @param docs
     * @param isEncrypt
     */
    encryptDocs(docs: any[], isEncrypt=true) {
        let resDocs = [];
        for (const doc of docs) {
            resDocs.push(this.encryptDoc(doc, isEncrypt));
        }
        return resDocs;
    }

    /**
     * Encrypt the fields of the filter when find, count, etc.
     *
     * Just support simply query (with the vault of the fields).
     *
     * @param filter
     * @param isEncrypt
     */
    encryptFilter(filter: JSONObject) {
        const json = DatabaseEncryption.getGeneralJsonDict(filter, 'The filter must be dictionary.');
        if (Object.keys(json).length == 0) {
            return {};
        }

        return new EncryptionFilter(json).encrypt();
    }

    /**
     * Encrypt the fields of the update.
     *
     * Just support simply query (with the vault of the fields).
     *
     * @param update
     * @param isEncrypt
     */
    encryptUpdate(update: JSONObject) {
        const json = DatabaseEncryption.getGeneralJsonDict(update, 'The update must be dictionary.');
        if (Object.keys(json).length == 0) {
            return {};
        }

        return new EncryptionUpdate(json).encrypt();
    }

    private static getGeneralJsonDict(map: any, message: string) {
        const str = JSON.stringify(map);
        const json = JSON.parse(str);
        if (json.constructor != Object) { // not dictionary
            throw new InvalidParameterException(message);
        }
        return json;
    }
}
