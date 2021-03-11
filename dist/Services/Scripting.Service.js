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
exports.ScriptingService = void 0;
const Util_1 = require("../Util");
class ScriptingService {
    constructor(session) {
        this._isConnected = false;
        if (session) {
            this._isConnected = true;
        }
        this._session = session;
    }
    checkConnection() {
        if (!this._isConnected) {
            throw Error("Hive is not connected");
        }
    }
    SetScript(script) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkConnection();
            try {
                if (this._session.isAnonymous) {
                    throw Error("Anonymous users is not authorized to set scripts");
                }
                let postData = {
                    url: `${this._session.hiveInstanceUrl}/api/v1/scripting/set_script`,
                    userToken: this._session.userToken,
                    body: script
                };
                let response = yield Util_1.Util.SendPost(postData);
                return {
                    isSuccess: true,
                    acknowledged: response.acknowledged,
                    matched_count: response.matched_count,
                    modified_count: response.modified_count,
                    upserted_id: response.upserted_id,
                };
            }
            catch (error) {
                return {
                    isSuccess: false,
                    error: error
                };
            }
        });
    }
    RunScript(script) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkConnection();
            try {
                let postData = {
                    url: `${this._session.hiveInstanceUrl}/api/v1/scripting/run_script`,
                    body: script
                };
                if (!this._session.isAnonymous) {
                    postData["userToken"] = this._session.userToken;
                }
                let response = yield Util_1.Util.SendPost(postData);
                return {
                    isSuccess: true,
                    response: response
                };
            }
            catch (error) {
                return {
                    isSuccess: false,
                    error: error
                };
            }
        });
    }
}
exports.ScriptingService = ScriptingService;
//# sourceMappingURL=Scripting.Service.js.map