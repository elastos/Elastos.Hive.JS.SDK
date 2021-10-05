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
        if (session &&
            !session.isAnonymous &&
            session.userToken &&
            session.userToken.length > 0) {
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
            yield Util_1.Util.SendPut({
                url: `${this._session.hiveInstanceUrl}/api/v2/subscription/vault`,
                userToken: this._session.userToken,
            });
        });
    }
    GetVaultServiceInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkConnection();
            let response = yield Util_1.Util.SendGet({
                url: `${this._session.hiveInstanceUrl}/api/v2/subscription/vault`,
                userToken: this._session.userToken,
            });
            return {
                service_did: response.service_did,
                storage_quota: response.storage_quota,
                storage_used: response.storage_used,
                created: new Date(response.created * 1000),
                updated: new Date(response.updated * 1000),
                pricing_plan: response.pricing_plan,
            };
        });
    }
}
exports.PaymentService = PaymentService;
//# sourceMappingURL=Payment.Service.js.map