export class InsertOptions {
    public bypass_document_validation: boolean;
    public ordered: boolean;
    public timestamp: boolean

    public constructor(bypassDocumentValidation?: boolean, ordered?: boolean, timestamp?: boolean){
        this.bypass_document_validation = bypassDocumentValidation ?? false;
        this.ordered = ordered ?? false;
        this.timestamp = timestamp ?? true;
    }
}