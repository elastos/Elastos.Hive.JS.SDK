"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = exports.EnumDirection = void 0;
const Util_1 = require("../Util");
var EnumDirection;
(function (EnumDirection) {
    EnumDirection["Ascending"] = "asc";
    EnumDirection["Descending"] = "desc";
})(EnumDirection = exports.EnumDirection || (exports.EnumDirection = {}));
class DatabaseService {
    constructor(session) {
        this._isConnected = false;
        if (session && !session.isAnonymous && session.userToken && session.userToken.length > 0) {
            this._isConnected = true;
        }
        this._session = session;
    }
    checkConnection() {
        if (!this._isConnected) {
            throw Error("Hive is not connected");
        }
    }
    createCollection(collectionName) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkConnection();
            let url = `${this._session.hiveInstanceUrl}/api/v1/db/create_collection`;
            let document = {
                "collection": collectionName
            };
            yield Util_1.Util.SendPost({
                url: url,
                body: document,
                userToken: this._session.userToken
            });
            return this.getCollection(collectionName);
        });
    }
    getCollection(collectionName) {
        return new DatabaseCollection(collectionName, this);
    }
    deleteCollection(collectionName) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkConnection();
            let url = `${this._session.hiveInstanceUrl}/api/v1/db/delete_collection`;
            let document = {
                "collection": collectionName
            };
            yield Util_1.Util.SendPost({
                url: url,
                body: document,
                userToken: this._session.userToken
            });
        });
    }
    insertOne(collectionName, newDocument, options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkConnection();
            let url = `${this._session.hiveInstanceUrl}/api/v1/db/insert_one`;
            let document = {
                "collection": collectionName,
                "document": newDocument
            };
            if (options)
                document.options = options;
            let response = yield Util_1.Util.SendPost({
                url: url,
                body: document,
                userToken: this._session.userToken
            });
            return {
                acknowledged: response.acknowledged,
                inserted_id: response.inserted_id
            };
        });
    }
    insertMany(collectionName, newDocuments, options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkConnection();
            let url = `${this._session.hiveInstanceUrl}/api/v1/db/insert_many`;
            if (!options) {
                options = {
                    bypass_document_validation: false,
                    ordered: true
                };
            }
            let document = {
                "collection": collectionName,
                "document": newDocuments,
            };
            let response = yield Util_1.Util.SendPost({
                url: url,
                body: document,
                userToken: this._session.userToken
            });
            return {
                acknowledged: response.acknowledged,
                inserted_ids: response.inserted_ids
            };
        });
    }
    updateOne(collectionName, filter, updateCommand, options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkConnection();
            let url = `${this._session.hiveInstanceUrl}/api/v1/db/update_one`;
            let document = {
                "collection": collectionName,
                "filter": filter,
                "update": updateCommand
            };
            if (options)
                document.options = options;
            let response = yield Util_1.Util.SendPost({
                url: url,
                body: document,
                userToken: this._session.userToken
            });
            return {
                acknowledged: response.acknowledged,
                matched_count: response.matched_count,
                modified_count: response.modified_count,
                upserted_id: response.upserted_id
            };
        });
    }
    updateMany(collectionName, filter, updateCommand, options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkConnection();
            let url = `${this._session.hiveInstanceUrl}/api/v1/db/update_many`;
            let document = {
                "collection": collectionName,
                "filter": filter,
                "update": updateCommand
            };
            if (options)
                document.options = options;
            let response = yield Util_1.Util.SendPost({
                url: url,
                body: document,
                userToken: this._session.userToken
            });
            return {
                acknowledged: response.acknowledged,
                matched_count: response.matched_count,
                modified_count: response.modified_count,
                upserted_id: response.upserted_id
            };
        });
    }
    deleteOne(collectionName, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkConnection();
            let url = `${this._session.hiveInstanceUrl}/api/v1/db/delete_one`;
            let document = {
                "collection": collectionName,
                "filter": filter
            };
            let response = yield Util_1.Util.SendPost({
                url: url,
                body: document,
                userToken: this._session.userToken
            });
            return {
                acknowledged: response.acknowledged,
                deleted_count: response.deleted_count
            };
        });
    }
    deleteMany(collectionName, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkConnection();
            let url = `${this._session.hiveInstanceUrl}/api/v1/db/delete_many`;
            let document = {
                "collection": collectionName,
                "filter": filter
            };
            let response = yield Util_1.Util.SendPost({
                url: url,
                body: document,
                userToken: this._session.userToken
            });
            return {
                acknowledged: response.acknowledged,
                deleted_count: response.deleted_count
            };
        });
    }
    countDocuments(collectionName, filter = {}, options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkConnection();
            let url = `${this._session.hiveInstanceUrl}/api/v1/db/count_documents`;
            let document = {
                "collection": collectionName,
                "filter": filter
            };
            if (options)
                document.options = options;
            let response = yield Util_1.Util.SendPost({
                url: url,
                body: document,
                userToken: this._session.userToken
            });
            return {
                count: response.count
            };
        });
    }
    findOne(collectionName, filter, options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkConnection();
            let url = `${this._session.hiveInstanceUrl}/api/v1/db/find_one`;
            let document = {
                "collection": collectionName,
                "filter": filter
            };
            if (options)
                document.options = options;
            let response = yield Util_1.Util.SendPost({
                url: url,
                body: document,
                userToken: this._session.userToken
            });
            return response.items;
        });
    }
    findMany(collectionName, filter, options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkConnection();
            let url = `${this._session.hiveInstanceUrl}/api/v1/db/find_many`;
            let document = {
                "collection": collectionName,
            };
            if (filter)
                document.filter = filter;
            if (options)
                document.options = options;
            let response = yield Util_1.Util.SendPost({
                url: url,
                body: document,
                userToken: this._session.userToken
            });
            return response.items;
        });
    }
}
exports.DatabaseService = DatabaseService;
class DatabaseCollection {
    constructor(collectionName, service) {
        this._collectionName = "";
        this._collectionName = collectionName;
        this._service = service;
    }
    drop() {
        return this._service.deleteCollection(this._collectionName);
    }
    insertOne(newDocument, options) {
        return this._service.insertOne(this._collectionName, newDocument, options);
    }
    insertMany(newDocuments, options) {
        return this._service.insertMany(this._collectionName, newDocuments, options);
    }
    updateOne(filter, updateCommand, options) {
        return this._service.updateOne(this._collectionName, filter, updateCommand, options);
    }
    updateMany(filter, updateCommand, options) {
        return this._service.updateMany(this._collectionName, filter, updateCommand, options);
    }
    deleteOne(filter) {
        return this._service.deleteOne(this._collectionName, filter);
    }
    deleteMany(filter) {
        return this._service.deleteMany(this._collectionName, filter);
    }
    count(filter = {}, options) {
        return this._service.countDocuments(this._collectionName, filter, options);
    }
    findOne(filter, options) {
        return this._service.findOne(this._collectionName, filter, options);
    }
    findMany(filter, options) {
        return this._service.findMany(this._collectionName, filter, options);
    }
}
//# sourceMappingURL=Database.Service.js.map