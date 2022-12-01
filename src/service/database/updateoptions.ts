/**
 * The options of the updating operation.
 */
export class UpdateOptions {
    private upsert: boolean;
	private bypass_document_validation: boolean;
	private timestamp = true;

    setUpsert(upsert: boolean) {
        this.upsert = upsert;
        return this;
    }

    setBypassDocumentValidation(isBypass: boolean) {
        this.bypass_document_validation = isBypass;
        return this;
    }

    setTimestamp(timestamp: boolean) {
        this.timestamp = timestamp;
        return this;
    }

    isUpsert(): boolean {
        return this.bypass_document_validation;
    }

    isBypassDocumentValidation(): boolean {
        return this.bypass_document_validation;
    }

    isTimestamp(): boolean {
        return this.timestamp;
    }
}
