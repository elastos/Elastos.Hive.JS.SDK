export class ParentException extends Error{
    private causedBy?: Error;

    constructor(message?: string, causedBy?: Error) {
        super(message + (causedBy ? "\nCaused by: " + causedBy.message + (causedBy.stack ? "\nCaused by: " + causedBy.stack : "") : ""));
        this.causedBy = causedBy;
        Object.setPrototypeOf(this, new.target.prototype);
    }

    public from(e:any) {
        this.message += (" Caused by " + e.message);

        return this;
    }
}

export class IllegalArgumentException extends ParentException  {}
export class AlreadyExistsException extends ParentException {} 
export class BackupIsInProcessingException extends ParentException {} 
export class BackupNotFoundException extends ParentException {} 
export class BadContextProviderException extends ParentException {} 
export class DIDNotPublishedException extends ParentException {} 
export class DIDResolverNotSetupException extends ParentException {} 
export class DIDResolverSetupException extends ParentException {} 
export class DIDResoverAlreadySetupException extends ParentException {} 
export class HiveException extends ParentException {} 
export class IllegalDidFormatException extends ParentException {} 
export class InsufficientStorageException extends ParentException {} 
export class NotFoundException extends ParentException {} 
export class NotImplementedException extends ParentException {} 
export class PathNotExistException extends ParentException {} 
export class PricingPlanNotFoundException extends ParentException {} 
export class ProviderNotSetException extends ParentException {} 
export class ScriptNotFoundException extends ParentException {} 
export class UnauthorizedException extends ParentException {} 
export class VaultForbiddenException extends ParentException {} 
export class VaultNotFoundException extends ParentException {} 

export class MalformedDIDException extends IllegalArgumentException {}

export class ServerUnknownException extends ParentException {

    constructor(message?: string) {
        super(message ? message : "Impossible failure happened");
    }
    public static withHttpCode(httpCode: number, message: string) {
        return new ServerUnknownException("Exception (http code: " + String(httpCode) + ", message: " + message);
    }
}

export class NetworkException extends ParentException {
    constructor(message: string) {
        super("Unkown network exception with message: " + message);
    }

} 

export class NodeRPCException extends ParentException {
    private readonly code: number;
    private readonly internalCode: number;

    constructor(code: number, internalCode: number, message: string) {
        super(message);
        this.code = code;
        this.internalCode = internalCode;
    }

    public getCode(): number {
        return this.code;
    }

    public getInternalCode(): number {
        return this.internalCode;
    }
}