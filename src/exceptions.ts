import { Logger } from ".";

export class ParentException extends Error{
    private causedBy?: Error;
    private logger = new Logger("");
    constructor(message?: string, causedBy?: Error) {
        super(message + (causedBy ? "\nCaused by: " + causedBy.message + (causedBy.stack ? "\nCaused by: " + causedBy.stack : "") : ""));
        this.causedBy = causedBy;
        Object.setPrototypeOf(this, new.target.prototype);
        let stack = causedBy ? " Caused by: " + causedBy.stack  : "";
        this.logger.error(this.constructor.name + ": " + message + stack);
    }

    public from(e:any) {
        this.message += (" Caused by " + e.message);

        return this;
    }
}

export class IllegalArgumentException extends ParentException  {}
export class InvalidParameterException extends ParentException  {}
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
export class DIDResolveException extends ParentException {}
export class JWTException extends ParentException {}
export class IOException extends ParentException {}
export class DeserializationError extends ParentException {}
export class HttpException extends ParentException {
    private httpCode: number;

    constructor(httpCode: number, message: string, causedBy?: Error) {
        super(message, causedBy);
        this.httpCode = httpCode;
    }

    public getHttpCode(): number {
        return this.httpCode;
    }
} 

export class MalformedDIDException extends IllegalArgumentException {}

export class ServerUnknownException extends ParentException {

    constructor(message?: string, causedBy?: Error) {
        super(message ? message : "Impossible failure happened", causedBy);
    }
    public static withHttpCode(httpCode: number, message: string) {
        return new ServerUnknownException("Exception (http code: " + String(httpCode) + ", message: " + message);
    }
}

export class NetworkException extends ParentException {
    constructor(message: string, causedBy?: Error) {
        super("Unkown network exception with message: " + message, causedBy);
    }

} 

export class NodeRPCException extends ParentException {
    private readonly code: number;
    private readonly internalCode: number;
   
    public static BAD_REQUEST = 400;
	public static UNAUTHORIZED = 401;
	public static FORBIDDEN	= 403;
	public static NOT_FOUND	= 404;
	public static ALREADY_EXISTS = 455;
	public static INSUFFICIENT_STORAGE = 507;
	public static IC_INVALID_PARAMETER = 1;
	public static IC_BACKUP_IS_IN_PROCESSING = 2;

    constructor(code: number, internalCode: number, message: string, causedBy?: Error) {
        super(message, causedBy);
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