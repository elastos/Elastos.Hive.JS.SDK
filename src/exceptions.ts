import { Logger } from "./utils/logger";

export class ParentException extends Error{
    private causedBy?: Error;
    
    constructor(message?: string, causedBy?: Error) {
        super(message + (causedBy ? "\nCaused by: " + causedBy.message + (causedBy.stack ? "\nCaused by: " + causedBy.stack : "") : ""));
        this.causedBy = causedBy;
        Object.setPrototypeOf(this, new.target.prototype);
        let logger = new Logger(this.constructor.name);
        let stack = (causedBy ? "\nCaused by: " + causedBy.message + (causedBy.stack ? "\nCaused by: " + causedBy.stack : "") : "");
        logger.error(message + stack);
    }

    public from(e:any) {
        this.message += (" Caused by " + e.message);

        return this;
    }
}

export class IllegalArgumentException extends ParentException  {}
export class BackupIsInProcessingException extends ParentException {} 
export class BackupNotFoundException extends ParentException {} 
export class BadContextProviderException extends ParentException {} 
export class DIDNotPublishedException extends ParentException {} 
export class DIDResolverNotSetupException extends ParentException {} 
export class DIDResolverSetupException extends ParentException {} 
export class DIDResolverAlreadySetupException extends ParentException {} 
export class HiveException extends ParentException {} 
export class IllegalDidFormatException extends ParentException {} 
export class NotImplementedException extends ParentException {} 
export class PathNotExistException extends ParentException {} 
export class PricingPlanNotFoundException extends ParentException {} 
export class ProviderNotSetException extends ParentException {} 
export class ScriptNotFoundException extends ParentException {} 
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
export class NetworkException extends ParentException {
    constructor(message: string, causedBy?: Error) {
        super("Unknown network exception with message: " + message, causedBy);
    }

}
export class NodeRPCException extends ParentException {
    private readonly code: number;
    private readonly internalCode: number;
   
    public static BAD_REQUEST = 400; //InvalidParameterException
	public static UNAUTHORIZED = 401; //UnauthorizedException
	public static FORBIDDEN	= 403; //VaultForbiddenException
	public static NOT_FOUND	= 404; //NotFoundException
	public static ALREADY_EXISTS = 455; //AlreadyExistsException
	public static INSUFFICIENT_STORAGE = 507; //InsufficientStorageException
    public static SERVER_EXCEPTION = 500; //ServerUnknownException
	public static IC_INVALID_PARAMETER = 1; //
	public static IC_BACKUP_IS_IN_PROCESSING = 2;

    constructor(code: number, internalCode: number, message: string, causedBy?: Error) {
        super(message, causedBy);
        this.code = code;
        this.internalCode = internalCode ? internalCode : -1;
    }

    public static forHttpCode(httpCode: number, message?: string, internalCode?: number, causedBy?: Error): NodeRPCException {
        switch (httpCode) {
            case NodeRPCException.UNAUTHORIZED:
                return new UnauthorizedException(message ? message : "", causedBy, internalCode);
            case NodeRPCException.FORBIDDEN:
                return new VaultForbiddenException(message ? message : "", causedBy, internalCode);
            case NodeRPCException.BAD_REQUEST:
                return new InvalidParameterException(message ? message : "", causedBy, internalCode);
            case NodeRPCException.NOT_FOUND:
                return new NotFoundException(message ? message : "", causedBy, internalCode);
            case NodeRPCException.ALREADY_EXISTS:
                return new AlreadyExistsException(message ? message : "", causedBy, internalCode);
            case NodeRPCException.INSUFFICIENT_STORAGE:
                return new InsufficientStorageException(message ? message : "", causedBy, internalCode);
            default:
                return new ServerUnknownException(httpCode, message ? message : "", causedBy, internalCode);
        }
    }

    public getCode(): number {
        return this.code;
    }

    public getInternalCode(): number {
        return this.internalCode;
    }
}
export class InvalidParameterException extends NodeRPCException  {
    constructor(message: string, causedBy?: Error, internalCode?: number) {
        super(NodeRPCException.BAD_REQUEST, internalCode, message, causedBy);
    }
}

export class UnauthorizedException extends NodeRPCException  {
    constructor(message: string, causedBy?: Error, internalCode?: number) {
        super(NodeRPCException.UNAUTHORIZED, internalCode, message, causedBy);
    }
}

export class VaultForbiddenException extends NodeRPCException  {
    constructor(message: string, causedBy?: Error, internalCode?: number) {
        super(NodeRPCException.FORBIDDEN, internalCode, message, causedBy);
    }
}

export class NotFoundException extends NodeRPCException  {
    constructor(message: string, causedBy?: Error, internalCode?: number) {
        super(NodeRPCException.NOT_FOUND, internalCode, message, causedBy);
    }
}

export class VaultNotFoundException extends NodeRPCException  {
    constructor(message: string, causedBy?: Error, internalCode?: number) {
        super(NodeRPCException.NOT_FOUND, internalCode, message, causedBy);
    }
}

export class AlreadyExistsException extends NodeRPCException  {
    constructor(message: string, causedBy?: Error, internalCode?: number) {
        super(NodeRPCException.ALREADY_EXISTS, internalCode, message, causedBy);
    }
}

export class InsufficientStorageException extends NodeRPCException  {
    constructor(message: string, causedBy?: Error, internalCode?: number) {
        super(NodeRPCException.ALREADY_EXISTS, internalCode, message, causedBy);
    }
}

export class ServerUnknownException extends NodeRPCException  {
    constructor(httpCode: number, message: string, causedBy?: Error, internalCode?: number) {
        super(httpCode, internalCode, message, causedBy);
    }
}

