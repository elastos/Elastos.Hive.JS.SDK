import {Logger} from "./utils/logger";

class ParentException extends Error {
    private causedBy?: Error;

    constructor(message?: string, causedBy?: Error) {
        super(message + (causedBy ? "\nCaused by: " + causedBy.message + (causedBy.stack ? "\nCaused by: " + causedBy.stack : "") : ""));
        this.causedBy = causedBy;
        Object.setPrototypeOf(this, new.target.prototype);
        // let logger = new Logger(this.constructor.name);
        // let stack = (causedBy ? "\nCaused by: " + causedBy.message + (causedBy.stack ? "\nCaused by: " + causedBy.stack : "") : "");
        // logger.error(message + stack);
    }

    from(e: any) {
        this.message += (" Caused by " + e.message);

        return this;
    }
}

export class IllegalArgumentException extends ParentException  {}
export class BadContextProviderException extends ParentException {}
export class DIDNotPublishedException extends ParentException {}
export class DIDResolverNotSetupException extends ParentException {}
export class DIDResolverSetupException extends ParentException {}
export class DIDResolverAlreadySetupException extends ParentException {}
export class HiveException extends ParentException {}
export class IllegalDidFormatException extends ParentException {}
export class NotImplementedException extends ParentException {}
export class PathNotExistException extends ParentException {}
export class ProviderNotSetException extends ParentException {}
export class DIDResolveException extends ParentException {}
export class JWTException extends ParentException {}
export class IOException extends ParentException {}
export class DeserializationError extends ParentException {}
export class HttpException extends ParentException {
    private readonly httpCode: number;

    constructor(httpCode: number, message: string, causedBy?: Error) {
        super(message, causedBy);
        this.httpCode = httpCode;
    }

    getHttpCode(): number {
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

    constructor(code: number, internalCode: number, message: string, causedBy?: Error) {
        super(message, causedBy);
        this.code = code;
        this.internalCode = internalCode ? internalCode : -1;
    }

    static forHttpCode(httpCode: number, message?: string, internalCode?: number, causedBy?: Error): NodeRPCException {
        const msg = message ? message : '';
        switch (httpCode) {
            case NodeRPCException.BAD_REQUEST:
                if (internalCode == this.IC_INVALID_PARAMETER) {
                    return new InvalidParameterException(msg, causedBy);
                } else if (internalCode == this.IC_BACKUP_IS_IN_PROCESS) {
                    return new BackupIsInProcessException(msg, causedBy);
                } else if (internalCode == this.IC_ELADID_ERROR) {
                    return new ElaDidErrorException(msg, causedBy);
                }
                return new BadRequestException(msg, causedBy, internalCode);
            case NodeRPCException.UNAUTHORIZED:
                return new UnauthorizedException(msg, causedBy, internalCode);
            case NodeRPCException.FORBIDDEN:
                if (internalCode == this.IC_VAULT_FROZEN) {
                    return new VaultFrozenException(msg, causedBy);
                }
                return new ForbiddenException(msg, causedBy, internalCode);
            case NodeRPCException.NOT_FOUND:
                if (internalCode == this.IC_VAULT_NOT_FOUND) {
                    return new VaultNotFoundException(msg, causedBy);
                } else if (internalCode == this.IC_BACKUP_NOT_FOUND) {
                    return new BackupNotFoundException(msg, causedBy);
                } else if (internalCode == this.IC_SCRIPT_NOT_FOUND) {
                    return new ScriptNotFoundException(msg, causedBy);
                } else if (internalCode == this.IC_COLLECTION_NOT_FOUND) {
                    return new CollectionNotFoundException(msg, causedBy);
                } else if (internalCode == this.IC_PRICING_PLAN_NOT_FOUND) {
                    return new PricingPlanNotFoundException(msg, causedBy);
                } else if (internalCode == this.IC_FILE_NOT_FOUND) {
                    return new FileNotFoundException(msg, causedBy);
                } else if (internalCode == this.IC_ORDER_NOT_FOUND) {
                    return new OrderNotFoundException(msg, causedBy);
                } else if (internalCode == this.IC_RECEIPT_NOT_FOUND) {
                    return new ReceiptNotFoundException(msg, causedBy);
                } else if (internalCode == this.IC_APPLICATION_NOT_FOUND) {
                    return new ApplicationNotFoundException(msg, causedBy);
                }
                return new NotFoundException(msg, causedBy, internalCode);
            case NodeRPCException.ALREADY_EXISTS:
                return new AlreadyExistsException(msg, causedBy, internalCode);
            case NodeRPCException.SERVER_EXCEPTION:
                return new ServerException(msg, causedBy, internalCode);
            case NodeRPCException.NOT_IMPLEMENTED:
                return new APINotImplementedException(msg, causedBy, internalCode);
            case NodeRPCException.INSUFFICIENT_STORAGE:
                return new InsufficientStorageException(msg, causedBy, internalCode);
            default:
                return new ServerUnknownException(httpCode, msg, causedBy, internalCode);
        }
    }

    getCode(): number {
        return this.code;
    }

    getInternalCode(): number {
        return this.internalCode;
    }
}

// BAD_REQUEST

export class BadRequestException extends NodeRPCException {
    constructor(message: string, causedBy?: Error, internalCode?: number) {
        super(NodeRPCException.BAD_REQUEST, internalCode, message, causedBy);
    }
}

export class InvalidParameterException extends NodeRPCException {
    constructor(message: string, causedBy?: Error) {
        super(NodeRPCException.BAD_REQUEST, NodeRPCException.IC_INVALID_PARAMETER, message, causedBy);
    }
}

export class BackupIsInProcessException extends NodeRPCException {
    constructor(message: string, causedBy?: Error) {
        super(NodeRPCException.BAD_REQUEST, NodeRPCException.IC_BACKUP_IS_IN_PROCESS, message, causedBy);
    }
}

export class ElaDidErrorException extends NodeRPCException {
    constructor(message: string, causedBy?: Error) {
        super(NodeRPCException.BAD_REQUEST, NodeRPCException.IC_ELADID_ERROR, message, causedBy);
    }
}

// UNAUTHORIZED

export class UnauthorizedException extends NodeRPCException {
    constructor(message: string, causedBy?: Error, internalCode?: number) {
        super(NodeRPCException.UNAUTHORIZED, internalCode, message, causedBy);
    }
}

// FORBIDDEN

export class ForbiddenException extends NodeRPCException {
    constructor(message: string, causedBy?: Error, internalCode?: number) {
        super(NodeRPCException.FORBIDDEN, internalCode, message, causedBy);
    }
}

export class VaultFrozenException extends NodeRPCException {
    constructor(message: string, causedBy?: Error) {
        super(NodeRPCException.FORBIDDEN, NodeRPCException.IC_VAULT_FROZEN, message, causedBy);
    }
}

// NOT_FOUND

export class NotFoundException extends NodeRPCException {
    constructor(message: string, causedBy?: Error, internalCode?: number) {
        super(NodeRPCException.NOT_FOUND, internalCode, message, causedBy);
    }
}

export class VaultNotFoundException extends NodeRPCException {
    constructor(message: string, causedBy?: Error) {
        super(NodeRPCException.NOT_FOUND, NodeRPCException.IC_VAULT_NOT_FOUND, message, causedBy);
    }
}

export class BackupNotFoundException extends NodeRPCException {
    constructor(message: string, causedBy?: Error) {
        super(NodeRPCException.NOT_FOUND, NodeRPCException.IC_BACKUP_NOT_FOUND, message, causedBy);
    }
}

export class ScriptNotFoundException extends NodeRPCException {
    constructor(message: string, causedBy?: Error) {
        super(NodeRPCException.NOT_FOUND, NodeRPCException.IC_SCRIPT_NOT_FOUND, message, causedBy);
    }
}

export class CollectionNotFoundException extends NodeRPCException {
    constructor(message: string, causedBy?: Error) {
        super(NodeRPCException.NOT_FOUND, NodeRPCException.IC_COLLECTION_NOT_FOUND, message, causedBy);
    }
}

export class PricingPlanNotFoundException extends NodeRPCException {
    constructor(message: string, causedBy?: Error) {
        super(NodeRPCException.NOT_FOUND, NodeRPCException.IC_COLLECTION_NOT_FOUND, message, causedBy);
    }
}

export class FileNotFoundException extends NodeRPCException {
    constructor(message: string, causedBy?: Error) {
        super(NodeRPCException.NOT_FOUND, NodeRPCException.IC_FILE_NOT_FOUND, message, causedBy);
    }
}

export class OrderNotFoundException extends NodeRPCException {
    constructor(message: string, causedBy?: Error) {
        super(NodeRPCException.NOT_FOUND, NodeRPCException.IC_ORDER_NOT_FOUND, message, causedBy);
    }
}

export class ReceiptNotFoundException extends NodeRPCException {
    constructor(message: string, causedBy?: Error) {
        super(NodeRPCException.NOT_FOUND, NodeRPCException.IC_RECEIPT_NOT_FOUND, message, causedBy);
    }
}

export class ApplicationNotFoundException extends NodeRPCException {
    constructor(message: string, causedBy?: Error) {
        super(NodeRPCException.NOT_FOUND, NodeRPCException.IC_APPLICATION_NOT_FOUND, message, causedBy);
    }
}

// ALREADY_EXISTS

export class AlreadyExistsException extends NodeRPCException {
    constructor(message: string, causedBy?: Error, internalCode?: number) {
        super(NodeRPCException.ALREADY_EXISTS, internalCode, message, causedBy);
    }
}

// SERVER_EXCEPTION

export class ServerException extends NodeRPCException {
    constructor(message: string, causedBy?: Error, internalCode?: number) {
        super(NodeRPCException.SERVER_EXCEPTION, internalCode, message, causedBy);
    }
}

// NOT_IMPLEMENTED

export class APINotImplementedException extends NodeRPCException {
    constructor(message: string, causedBy?: Error, internalCode?: number) {
        super(NodeRPCException.NOT_IMPLEMENTED, internalCode, message, causedBy);
    }
}

// INSUFFICIENT_STORAGE

export class InsufficientStorageException extends NodeRPCException {
    constructor(message: string, causedBy?: Error, internalCode?: number) {
        super(NodeRPCException.INSUFFICIENT_STORAGE, internalCode, message, causedBy);
    }
}

// undefined exception in hive js but in hive node.

export class ServerUnknownException extends NodeRPCException {
    constructor(httpCode: number, message: string, causedBy?: Error, internalCode?: number) {
        super(httpCode, internalCode, message, causedBy);
    }
}
