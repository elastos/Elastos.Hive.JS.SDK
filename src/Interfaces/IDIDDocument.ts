export interface IDIDDocument{
    id: string;
    publicKey: IPublicKey[];
    authentication: string[];
    expires: string;
    proof?: IDIDDocumentProof;
}

export interface IPublicKey {
    id: string;
    type: string;
    controller: string;
    publicKeyBase58: string;
}

export interface IDIDDocumentProof{
    type: string;
    created: string;
    creator?: string;
    signatureValue: string;
}