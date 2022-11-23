export class InsertOptions {
    bypass_document_validation: boolean;
    ordered: boolean;
    timestamp: boolean

    constructor(bypassDocumentValidation?: boolean, ordered?: boolean, timestamp?: boolean){
        this.bypass_document_validation = bypassDocumentValidation ?? false;
        this.ordered = ordered ?? false;
        this.timestamp = timestamp ?? true;
    }
}