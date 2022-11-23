export class UpdateOptions {
    upsert: boolean;
	bypass_document_validation: boolean;

    constructor(bypassDocumentValidation?: boolean, upsert?: boolean) {
        this.bypass_document_validation = bypassDocumentValidation ?? false;
        this.upsert = upsert ?? false;
    }
}
