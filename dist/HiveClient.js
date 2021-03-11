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
exports.OptionsBuilder = exports.HiveClient = void 0;
const Auth_Service_1 = require("./Services/Auth.Service");
const Database_Service_1 = require("./Services/Database.Service");
const Payment_Service_1 = require("./Services/Payment.Service");
const Scripting_Service_1 = require("./Services/Scripting.Service");
class HiveClient {
    constructor() {
        this._isConnected = false;
    }
    get isConnected() {
        return this._isConnected;
    }
    get Database() {
        return this._databaseService;
    }
    get Payment() {
        return this._paymentService;
    }
    get Scripting() {
        return this._scriptingService;
    }
    static createInstance(userToken, hiveUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            let client = new HiveClient();
            let session = {
                hiveInstanceUrl: hiveUrl,
                isAnonymous: false,
                userToken: userToken
            };
            yield client.SignIn(session);
            return client;
        });
    }
    static createAnonymousInstance(hiveUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            let client = new HiveClient();
            let session = {
                hiveInstanceUrl: hiveUrl,
                isAnonymous: true
            };
            yield client.SignIn(session);
            return client;
        });
    }
    static getApplicationChallenge(options, appDocument) {
        return __awaiter(this, void 0, void 0, function* () {
            let authService = new Auth_Service_1.AuthService(options);
            return authService.getAppChallenge(appDocument);
        });
    }
    static getAuthenticationToken(options, userVerifiablePresentation) {
        return __awaiter(this, void 0, void 0, function* () {
            let authService = new Auth_Service_1.AuthService(options);
            return authService.getAuthenticationToken(userVerifiablePresentation);
        });
    }
    static getQrCode(options) {
        let authService = new Auth_Service_1.AuthService(options);
        return authService.getElastosQrCode();
    }
    SignIn(session) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this._databaseService = new Database_Service_1.DatabaseService(session);
                this._paymentService = new Payment_Service_1.PaymentService(session);
                this._scriptingService = new Scripting_Service_1.ScriptingService(session);
                this._isConnected = true;
            }
            catch (error) {
                console.error("Error on sign in", error);
                this._isConnected = false;
            }
        });
    }
}
exports.HiveClient = HiveClient;
class OptionsBuilder {
    constructor() {
        this._appId = "";
        this._hiveUrl = "";
        this._applicationCallback = "";
    }
    setHiveHost(url) {
        this._hiveUrl = url;
    }
    setApplicationCallback(url) {
        this._applicationCallback = url;
    }
    setAppInstance(appId, instance) {
        this._appId = appId;
        this._appInstance = instance;
    }
    build() {
        return {
            appId: this._appId,
            appInstance: this._appInstance,
            hiveUrl: this._hiveUrl,
            applicationCallback: this._applicationCallback
        };
    }
}
exports.OptionsBuilder = OptionsBuilder;
//# sourceMappingURL=HiveClient.js.map