export class InsertOptions {
    public bypass_document_validation: boolean;
    public ordered: boolean;

    public constructor(bypassDocumentValidation?: boolean, ordered?: boolean){
        this.bypass_document_validation = bypassDocumentValidation ?? false;
        this.ordered = ordered ?? false;
    }
}