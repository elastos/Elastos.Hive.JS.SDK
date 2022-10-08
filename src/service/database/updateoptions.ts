export class UpdateOptions {
    public upsert: boolean;
	public bypass_document_validation: boolean;

    public constructor(bypassDocumentValidation?: boolean, upsert?: boolean){
        this.bypass_document_validation = bypassDocumentValidation ?? false;
        this.upsert = upsert ?? false;
    }
}
