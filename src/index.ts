'use strict';

import { Vault } from "./vault";
import { NodeVersion } from "./service/about/nodeversion";
import { NodeInfo } from "./service/about/nodeinfo";
import { ServiceEndpoint }  from "./connection/serviceendpoint";
import { AccessToken }  from "./connection/auth/accesstoken";
import { AppContext }  from "./connection/auth/appcontext";
import { AppContextProvider }  from "./connection/auth/appcontextprovider";
import { BridgeHandler }  from "./connection/auth/bridgehandler";
import { Logger }  from "./utils/logger";
import { AboutService }  from "./service/about/aboutservice";
import { AuthService }  from "./service/auth/authservice";
import { BackupService }  from "./service/backup/backupservice";
import { BackupSubscription }  from "./service/subscription/backupsubscription/backupsubscription";
import { Collection }  from "./service/database/collection";
import { DatabaseService }  from "./service/database/databaseservice";
import { FilesService }  from "./service/files/filesservice";
import { IpfsRunner }  from "./ipfsrunner";
import { PaymentService }  from "./service/payment/paymentservice";
import { PromotionService }  from "./service/promotion/promotionservice";
import { ScriptingService }  from "./service/scripting/scriptingservice";
import { ScriptRunner }  from "./scriptrunner";
import { AnonymousScriptRunner }  from "./anonymous.scriptrunner";
import { Condition }  from "./service/scripting/condition";
import { OrCondition }  from "./service/scripting/orcondition";
import { AndCondition }  from "./service/scripting/andcondition";
import { AggregatedCondition }  from "./service/scripting/aggregatedcondition";
import { Executable, ExecutableType, ExecutableDatabaseBody, ExecutableFileBody }  from "./service/scripting/executable";
import { Context }  from "./service/scripting/context";
import { VaultSubscription }  from "./service/subscription/vaultsubscription/vaultsubscription";
import { PricingPlan } from "./service/subscription/pricingplan";
import { VaultInfo } from "./service/subscription/vaultinfo";
import { IllegalArgumentException,
    BadContextProviderException,
    DIDNotPublishedException,
    DIDResolverNotSetupException,
    DIDResolverSetupException,
    DIDResolverAlreadySetupException,
    HiveException,
    IllegalDidFormatException,
    NotImplementedException,
    PathNotExistException,
    ProviderNotSetException,
    DIDResolveException,
    JWTException,
    IOException,
    DeserializationError,
    MalformedDIDException,
    NetworkException,
    BadRequestException,
    InvalidParameterException,
    BackupIsInProcessException,
    ElaDidErrorException,
    UnauthorizedException,
    ForbiddenException,
    VaultFrozenException,
    NotFoundException,
    VaultNotFoundException,
    BackupNotFoundException,
    ScriptNotFoundException,
    CollectionNotFoundException,
    PricingPlanNotFoundException,
    FileNotFoundException,
    OrderNotFoundException,
    ReceiptNotFoundException,
    ApplicationNotFoundException,
    AlreadyExistsException,
    ServerException,
    APINotImplementedException,
    InsufficientStorageException,
    ServerUnknownException } from "./exceptions";
import { QueryHasResultCondition, QueryHasResultConditionOptions, QueryHasResultConditionBody } from "./service/scripting/queryhasresultcondition";
import { DeleteExecutable, DeleteExecutableBody } from "./service/scripting/deleteexecutable";
import { FindExecutable, FindExecutableBody } from "./service/scripting/findexecutable";
import { CountExecutable, CountExecutableBody } from "./service/scripting/countexecutable";
import { InsertExecutable, InsertExecutableBody } from "./service/scripting/insertexecutable";
import { FileHashExecutable } from "./service/scripting/filehashexecutable";
import { AggregatedExecutable } from "./service/scripting/aggregatedexecutable";
import { FileUploadExecutable } from "./service/scripting/fileuploadexecutable";
import { FileDownloadExecutable } from "./service/scripting/filedownloadexecutable";
import { FilePropertiesExecutable } from "./service/scripting/filepropertiesexecutable";
import { HashInfo } from "./service/files/hashinfo";
import { FileInfo } from "./service/files/fileinfo";
import { UpdateExecutable, UpdateExecutableBody } from "./service/scripting/updateexecutable";
import { InsertOptions } from "./service/database/insertoptions";
import { FindOptions } from "./service/database/findoptions";
import { UpdateOptions } from "./service/database/updateoptions";
import { QueryOptions } from "./service/database/queryoptions";
import { CountOptions } from "./service/database/countoptions";
import { UpdateResult } from "./service/database/updateresult";
import { SortItem, AscendingSortItem, DescendingSortItem } from "./service/database/sortitem";
import { Order, OrderState } from "./service/payment/order";
import { Receipt } from "./service/payment/receipt";
import { AppContextParameters, DefaultAppContextProvider } from "./connection/auth/defaultappcontextprovider";
import { BackupContext } from "./service/backup/backupcontext";
import { HiveBackupContext } from "./service/backup/hivebackupcontext";
import { Backup } from "./backup";
import { Provider } from "./service/provider/provider";
import { VaultDetail } from "./service/provider/vaultdetail";
import { BackupDetail } from "./service/provider/backupdetail";
import { FilledOrderDetail } from "./service/provider/filledorderdetail";
import { BackupInfo } from "./service/subscription/backupinfo"
import { AppInfo } from "./service/subscription/appinfo"
import { BackupResult, BackupResultResult, BackupResultState } from "./service/backup/backupresult"
import { InsertResult } from "./service/database/insertresult"
import { SubscriptionInfo } from "./service/subscription/subscriptioninfo"

Logger.setDefaultLevel(Logger.DEBUG);

export type {
    AppContextProvider,
    BridgeHandler,
    BackupContext
}

export {
    Logger,
    
    //initialize,
    HiveBackupContext,
    DefaultAppContextProvider,
    AppContextParameters,
    Vault,
    Backup,
    Provider,
    VaultDetail,
    BackupDetail,
    FilledOrderDetail,
    PricingPlan,
    VaultInfo,
    ServiceEndpoint,
    AccessToken,
    NodeVersion,
    NodeInfo,
    AppContext,
    AboutService,
    AuthService,
    BackupService,
    BackupSubscription,
    Collection,
    DatabaseService,
    FilesService,
    IpfsRunner,
    HashInfo,
    FileInfo,
    PaymentService,
    PromotionService,
    ScriptingService,
    ScriptRunner,
    AnonymousScriptRunner,
    Condition,
    AggregatedCondition,
    OrCondition,
    AndCondition,
    Executable,
    ExecutableFileBody,
    ExecutableDatabaseBody,
    ExecutableType,
    BackupInfo,
    AppInfo,
    BackupResult,
    BackupResultResult,
    BackupResultState,
    InsertResult,
    SubscriptionInfo,
    Context,
    VaultSubscription,
    QueryHasResultCondition,
    QueryHasResultConditionOptions,
    QueryHasResultConditionBody,
    DeleteExecutable,
    DeleteExecutableBody,
    InsertExecutable,
    InsertExecutableBody,
    FindExecutable,
    FindExecutableBody,
    CountExecutable,
    CountExecutableBody,
    FileHashExecutable,
    UpdateExecutable,
    UpdateExecutableBody,
    AggregatedExecutable,
    FileUploadExecutable,
    FileDownloadExecutable,
    FilePropertiesExecutable,
    InsertOptions,
    FindOptions,
    UpdateOptions,
    QueryOptions,
    CountOptions,
    SortItem,
    AscendingSortItem,
    DescendingSortItem,
    Order,
    OrderState,
    Receipt,
    UpdateResult,
    IllegalArgumentException,
    BadContextProviderException,
    DIDNotPublishedException,
    DIDResolverNotSetupException,
    DIDResolverSetupException,
    DIDResolverAlreadySetupException,
    HiveException,
    IllegalDidFormatException,
    NotImplementedException,
    PathNotExistException,
    ProviderNotSetException,
    DIDResolveException,
    JWTException,
    IOException,
    DeserializationError,
    MalformedDIDException,
    NetworkException,
    BadRequestException,
    InvalidParameterException,
    BackupIsInProcessException,
    ElaDidErrorException,
    UnauthorizedException,
    ForbiddenException,
    VaultFrozenException,
    NotFoundException,
    VaultNotFoundException,
    BackupNotFoundException,
    ScriptNotFoundException,
    CollectionNotFoundException,
    PricingPlanNotFoundException,
    FileNotFoundException,
    OrderNotFoundException,
    ReceiptNotFoundException,
    ApplicationNotFoundException,
    AlreadyExistsException,
    ServerException,
    APINotImplementedException,
    InsufficientStorageException,
    ServerUnknownException,
}
