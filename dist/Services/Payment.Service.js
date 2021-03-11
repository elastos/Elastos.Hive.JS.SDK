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
exports.PaymentService = exports.EnumVaultPackage = void 0;
const Util_1 = require("../Util");
var EnumVaultPackage;
(function (EnumVaultPackage) {
    EnumVaultPackage["Free"] = "Free";
    EnumVaultPackage["Rookie"] = "Rookie";
    EnumVaultPackage["Advanced"] = "Advanced";
})(EnumVaultPackage = exports.EnumVaultPackage || (exports.EnumVaultPackage = {}));
class PaymentService {
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
    CreateFreeVault() {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkConnection();
            yield Util_1.Util.SendPost({
                url: `${this._session.hiveInstanceUrl}/api/v1/service/vault/create`,
                userToken: this._session.userToken
            });
        });
    }
    GetVaultServiceInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkConnection();
            let response = yield Util_1.Util.SendPost({
                url: `${this._session.hiveInstanceUrl}/api/v1/service/vault`,
                userToken: this._session.userToken
            });
            return {
                max_storage: response.vault_service_info.max_storage,
                file_use_storage: response.vault_service_info.file_use_storage,
                db_use_storage: response.vault_service_info.db_use_storage,
                modify_time: new Date(response.vault_service_info.modify_time * 1000),
                start_time: new Date(response.vault_service_info.start_time * 1000),
                end_time: new Date(response.vault_service_info.end_time * 1000),
                pricing_using: response.vault_service_info.pricing_using
            };
        });
    }
}
exports.PaymentService = PaymentService;
//# sourceMappingURL=Payment.Service.js.map