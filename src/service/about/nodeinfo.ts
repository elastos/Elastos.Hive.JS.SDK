import { VerifiablePresentation } from "@elastosfoundation/did-js-sdk";

export class NodeInfo {
    private _service_did: string;
    private _owner_did: string;
    private _ownership_presentation: VerifiablePresentation;
    private _name: string;
    private _email: string;
    private _description: string;
    private _version: string;
    private _last_commit_id: string;

    get service_did(): string {
        return this._service_did;
    }

    set service_did(value: string) {
        this._service_did = value;
    }

    get owner_did(): string {
        return this._owner_did;
    }

    set owner_did(value: string) {
        this._owner_did = value;
    }

    get ownership_presentation(): VerifiablePresentation {
        return this._ownership_presentation;
    }

    set ownership_presentation(value: any) {
        this._ownership_presentation = VerifiablePresentation.parse(JSON.stringify(value))
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        this._email = value;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    get version(): string {
        return this._version;
    }

    set version(value: string) {
        this._version = value;
    }

    get last_commit_id(): string {
        return this._last_commit_id;
    }

    set last_commit_id(value: string) {
        this._last_commit_id = value;
    }

}
