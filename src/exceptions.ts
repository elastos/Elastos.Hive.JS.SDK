import { ParentException, NodeRPCException, IllegalArgumentException } from "@carlduranleau/commons.js.tools";

export class BackupIsInProcessingException extends ParentException {} 
export class BackupNotFoundException extends ParentException {} 
export class BadContextProviderException extends ParentException {} 
export class DIDNotPublishedException extends ParentException {} 
export class DIDResolverNotSetupException extends ParentException {} 
export class DIDResolverSetupException extends ParentException {} 
export class DIDResolverAlreadySetupException extends ParentException {} 
export class HiveException extends ParentException {} 
export class IllegalDidFormatException extends ParentException {} 
export class PathNotExistException extends ParentException {} 
export class PricingPlanNotFoundException extends ParentException {} 
export class ProviderNotSetException extends ParentException {} 
export class ScriptNotFoundException extends ParentException {} 
export class DIDResolveException extends ParentException {}
export class JWTException extends ParentException {}
export class IOException extends ParentException {}
export class DeserializationError extends ParentException {}

export class MalformedDIDException extends IllegalArgumentException {}
export class NetworkException extends ParentException {
    constructor(message: string, causedBy?: Error) {
        super("Unknown network exception with message: " + message, causedBy);
    }

}
export class VaultForbiddenException extends NodeRPCException  {
    constructor(message: string, causedBy?: Error, internalCode?: number) {
        super(NodeRPCException.FORBIDDEN, internalCode, message, causedBy);
    }
}

export class VaultNotFoundException extends NodeRPCException  {
    constructor(message: string, causedBy?: Error, internalCode?: number) {
        super(NodeRPCException.NOT_FOUND, internalCode, message, causedBy);
    }
}
