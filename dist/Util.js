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
exports.Util = void 0;
class Util {
    static SendGet(options) {
        return __awaiter(this, void 0, void 0, function* () {
            let payload = {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            };
            if (options.userToken) {
                payload.headers["Authorization"] = "token " + options.userToken;
            }
            let response = yield fetch(options.url, payload);
            if (response.ok) {
                let json = yield response.json();
                if (json._status != "OK") {
                    throw new Error(`Error on send GET to ${options.url} - ${json._error.code} - ${json._error.message}`);
                }
                return json;
            }
            throw new Error(`Error on send GET to ${options.url} - ${response.status} - ${response.statusText}`);
        });
    }
    static SendPost(options) {
        return __awaiter(this, void 0, void 0, function* () {
            let payload = {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            };
            if (options.userToken) {
                payload.headers["Authorization"] = "token " + options.userToken;
            }
            if (options.body) {
                payload.headers["Content-Length"] = JSON.stringify(options.body).length;
                payload.body = JSON.stringify(options.body);
            }
            let response = yield fetch(options.url, payload);
            if (response.ok) {
                let json = yield response.json();
                if (json._status != "OK") {
                    throw new Error(`Error on send POST to ${options.url} - ${json._error.code} - ${json._error.message}`);
                }
                return json;
            }
            throw new Error(`Error on send POST to ${options.url} - ${response.status} - ${response.statusText}`);
        });
    }
    static SendPut(options) {
        return __awaiter(this, void 0, void 0, function* () {
            let payload = {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            };
            if (options.userToken) {
                payload.headers["Authorization"] = "token " + options.userToken;
            }
            let response = yield fetch(options.url, payload);
            if (response.ok) {
                let json = yield response.json();
                if (json._status != "OK") {
                    throw new Error(`Error on send PUT to ${options.url} - ${json._error.code} - ${json._error.message}`);
                }
                return json;
            }
            throw new Error(`Error on send PUT to ${options.url} - ${response.status} - ${response.statusText}`);
        });
    }
    static SendPatch(options) {
        return __awaiter(this, void 0, void 0, function* () {
            let payload = {
                method: "PATCH",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            };
            if (options.userToken) {
                payload.headers["Authorization"] = "token " + options.userToken;
            }
            let response = yield fetch(options.url, payload);
            if (response.ok) {
                let json = yield response.json();
                if (json._status != "OK") {
                    throw new Error(`Error on send PATCH to ${options.url} - ${json._error.code} - ${json._error.message}`);
                }
                return json;
            }
            throw new Error(`Error on send PATCH to ${options.url} - ${response.status} - ${response.statusText}`);
        });
    }
    static SendDelete(options) {
        return __awaiter(this, void 0, void 0, function* () {
            let payload = {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            };
            if (options.userToken) {
                payload.headers["Authorization"] = "token " + options.userToken;
            }
            let response = yield fetch(options.url, payload);
            if (response.ok) {
                let json = yield response.json();
                if (json._status != "OK") {
                    throw new Error(`Error on send DELETE to ${options.url} - ${json._error.code} - ${json._error.message}`);
                }
                return json;
            }
            throw new Error(`Error on send DELETE to ${options.url} - ${response.status} - ${response.statusText}`);
        });
    }
}
exports.Util = Util;
//# sourceMappingURL=Util.js.map