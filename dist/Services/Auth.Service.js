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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const Util_1 = require("../Util");
const jsrsasign_1 = __importDefault(require("jsrsasign"));
class AuthService {
    constructor(options) {
        this._options = options;
    }
    getAppChallenge(appDidDocument) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = `${this._options.hiveUrl}/api/v1/did/sign_in`;
            let payload = {
                document: JSON.parse(JSON.stringify(appDidDocument, null, "")),
            };
            let response = yield Util_1.Util.SendPost({
                url: url,
                body: payload,
            });
            if (!response || response._status !== "OK")
                throw new Error("Error authenticating did and app");
            return {
                challenge: response.challenge,
            };
        });
    }
    getAuthenticationToken(userVerifiablePresentation) {
        return __awaiter(this, void 0, void 0, function* () {
            let ec = new jsrsasign_1.default.KJUR.crypto.ECDSA({ curve: "secp256r1" });
            ec.setPrivateKeyHex(this._options.appInstance.privateKey);
            var tNow = jsrsasign_1.default.KJUR.jws.IntDate.get("now");
            var tEnd = jsrsasign_1.default.KJUR.jws.IntDate.get("now + 1month");
            var oHeader = { alg: "ES256", typ: "JWT", cty: "json" };
            var oPayload = {
                iss: this._options.appInstance.did,
                iat: tNow,
                exp: tEnd,
                presentation: JSON.parse(JSON.stringify(userVerifiablePresentation, null, "")),
            };
            var sHeader = JSON.stringify(oHeader);
            var sPayload = JSON.stringify(oPayload);
            var sJWT = jsrsasign_1.default.KJUR.jws.JWS.sign("ES256", sHeader, sPayload, ec);
            return yield this.AuthenticateUser(sJWT);
        });
    }
    getElastosQrCode() {
        return __awaiter(this, void 0, void 0, function* () {
            let ec = new jsrsasign_1.default.KJUR.crypto.ECDSA({ curve: "secp256r1" });
            ec.setPrivateKeyHex(this._options.appInstance.privateKey);
            var tNow = jsrsasign_1.default.KJUR.jws.IntDate.get("now");
            var tEnd = jsrsasign_1.default.KJUR.jws.IntDate.get("now + 1month");
            var oHeader = { alg: "ES256", typ: "JWT", cty: "json" };
            var oPayload = {
                iss: this._options.appInstance.did,
                iat: tNow,
                exp: tEnd,
                appid: this._options.appId,
                appdid: this._options.appInstance.did,
                appinstancedid: this._options.appInstance.did,
                callbackurl: this._options.applicationCallback,
            };
            var sHeader = JSON.stringify(oHeader);
            var sPayload = JSON.stringify(oPayload);
            var sJWT = jsrsasign_1.default.KJUR.jws.JWS.sign("ES256", sHeader, sPayload, ec);
            return `https://did.elastos.net/appidcredissue/${sJWT}`;
        });
    }
    AuthenticateUser(authToken) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = `${this._options.hiveUrl}/api/v1/did/auth`;
            let document = {
                jwt: authToken,
            };
            let response = yield Util_1.Util.SendPost({
                url: url,
                body: document,
            });
            return response.access_token;
        });
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=Auth.Service.js.map