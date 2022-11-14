export class HiveException extends Error {
    private causedBy?: Error;

    constructor(message?: string, causedBy?: Error) {
        super(message + (causedBy ? "\nCaused by: " + causedBy.message + (causedBy.stack ? "\nCaused by: " + causedBy.stack : "") : ""));
        this.causedBy = causedBy;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class IllegalArgumentException extends HiveException  {}
export class BadContextProviderException extends HiveException {}
export class DIDNotPublishedException extends HiveException {}
export class DIDResolverNotSetupException extends HiveException {}
export class DIDResolverSetupException extends HiveException {}
export class DIDResolverAlreadySetupException extends HiveException {}
export class IllegalDidFormatException extends HiveException {}
export class NotImplementedException extends HiveException {}
export class PathNotExistException extends HiveException {}
export class ProviderNotSetException extends HiveException {}
export class DIDResolveException extends HiveException {}
export class JWTException extends HiveException {}
export class IOException extends HiveException {}
export class DeserializationError extends HiveException {}
export class EncryptionException extends HiveException {}
export class MalformedDIDException extends IllegalArgumentException {}
export class InvalidMnemonicException extends IllegalArgumentException {}
export class NetworkException extends HiveException {
    constructor(message: string, causedBy?: Error) {
        super("Unknown network exception with message: " + message, causedBy);
    }
}

///////// node exception

// BAD_REQUEST

export class BadRequestException extends HiveException {}
export class InvalidParameterException extends HiveException {}
export class BackupIsInProcessException extends HiveException {}
export class ElaDidErrorException extends HiveException {}

// UNAUTHORIZED

export class UnauthorizedException extends HiveException {}

// FORBIDDEN

export class ForbiddenException extends HiveException {}
export class VaultFrozenException extends HiveException {}

// NOT_FOUND

export class NotFoundException extends HiveException {}
export class VaultNotFoundException extends HiveException {}
export class BackupNotFoundException extends HiveException {}
export class ScriptNotFoundException extends HiveException {}
export class CollectionNotFoundException extends HiveException {}
export class PricingPlanNotFoundException extends HiveException {}
export class FileNotFoundException extends HiveException {}
export class OrderNotFoundException extends HiveException {}
export class ReceiptNotFoundException extends HiveException {}
export class ApplicationNotFoundException extends HiveException {}

// ALREADY_EXISTS

export class AlreadyExistsException extends HiveException {}

// SERVER_EXCEPTION

export class ServerException extends HiveException {}

// NOT_IMPLEMENTED

export class APINotImplementedException extends HiveException {}

// INSUFFICIENT_STORAGE

export class InsufficientStorageException extends HiveException {}

// Undefined exception from hive node

export class ServerUnknownException extends HiveException {}

export class NodeExceptionAdapter {
    // http status code
    protected static BAD_REQUEST = 400; //InvalidParameterException
    protected static UNAUTHORIZED = 401; //UnauthorizedException
    protected static FORBIDDEN = 403; //ForbiddenException
    protected static NOT_FOUND = 404; //NotFoundException
    protected static ALREADY_EXISTS = 455; //AlreadyExistsException
    protected static SERVER_EXCEPTION = 500; //ServerException
    protected static NOT_IMPLEMENTED = 501; //NotImplementedException
    protected static INSUFFICIENT_STORAGE = 507; //InsufficientStorageException

    // internal code for BAD_REQUEST
    protected static IC_INVALID_PARAMETER = 1;
    protected static IC_BACKUP_IS_IN_PROCESS = 2;
    protected static IC_ELADID_ERROR = 3;

    // internal code for FORBIDDEN
    protected static IC_VAULT_FROZEN = 1

    // internal code for NOT_FOUND
    protected static IC_VAULT_NOT_FOUND = 1
    protected static IC_BACKUP_NOT_FOUND = 2
    protected static IC_SCRIPT_NOT_FOUND = 3
    protected static IC_COLLECTION_NOT_FOUND = 4
    protected static IC_PRICING_PLAN_NOT_FOUND = 5
    protected static IC_FILE_NOT_FOUND = 6
    protected static IC_ORDER_NOT_FOUND = 7
    protected static IC_RECEIPT_NOT_FOUND = 8
    protected static IC_APPLICATION_NOT_FOUND = 9

    static forHttpCode(httpCode: number, message?: string, internalCode?: number, causedBy?: Error): NodeExceptionAdapter {
        const msg = message ? message : '';
        switch (httpCode) {
            case NodeExceptionAdapter.BAD_REQUEST:
                if (internalCode == this.IC_INVALID_PARAMETER)
                    return new InvalidParameterException(msg, causedBy);
                else if (internalCode == this.IC_BACKUP_IS_IN_PROCESS)
                    return new BackupIsInProcessException(msg, causedBy);
                else if (internalCode == this.IC_ELADID_ERROR)
                    return new ElaDidErrorException(msg, causedBy);
                return new BadRequestException(msg, causedBy);
            case NodeExceptionAdapter.UNAUTHORIZED:
                return new UnauthorizedException(msg, causedBy);
            case NodeExceptionAdapter.FORBIDDEN:
                if (internalCode == this.IC_VAULT_FROZEN)
                    return new VaultFrozenException(msg, causedBy);
                return new ForbiddenException(msg, causedBy);
            case NodeExceptionAdapter.NOT_FOUND:
                if (internalCode == this.IC_VAULT_NOT_FOUND)
                    return new VaultNotFoundException(msg, causedBy);
                else if (internalCode == this.IC_BACKUP_NOT_FOUND)
                    return new BackupNotFoundException(msg, causedBy);
                else if (internalCode == this.IC_SCRIPT_NOT_FOUND)
                    return new ScriptNotFoundException(msg, causedBy);
                else if (internalCode == this.IC_COLLECTION_NOT_FOUND)
                    return new CollectionNotFoundException(msg, causedBy);
                else if (internalCode == this.IC_PRICING_PLAN_NOT_FOUND)
                    return new PricingPlanNotFoundException(msg, causedBy);
                else if (internalCode == this.IC_FILE_NOT_FOUND)
                    return new FileNotFoundException(msg, causedBy);
                else if (internalCode == this.IC_ORDER_NOT_FOUND)
                    return new OrderNotFoundException(msg, causedBy);
                else if (internalCode == this.IC_RECEIPT_NOT_FOUND)
                    return new ReceiptNotFoundException(msg, causedBy);
                else if (internalCode == this.IC_APPLICATION_NOT_FOUND)
                    return new ApplicationNotFoundException(msg, causedBy);
                return new NotFoundException(msg, causedBy);
            case NodeExceptionAdapter.ALREADY_EXISTS:
                return new AlreadyExistsException(msg, causedBy);
            case NodeExceptionAdapter.SERVER_EXCEPTION:
                return new ServerException(msg, causedBy);
            case NodeExceptionAdapter.NOT_IMPLEMENTED:
                return new APINotImplementedException(msg, causedBy);
            case NodeExceptionAdapter.INSUFFICIENT_STORAGE:
                return new InsufficientStorageException(msg, causedBy);
            default:
                return new ServerUnknownException(msg, causedBy);
        }
    }
}
