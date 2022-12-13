/**
 * The options of the inserting operation.
 */
export class InsertOptions {
    private bypass_document_validation: boolean;
    private ordered: boolean;
    private timestamp = true;

    setBypassDocumentValidation(validation: boolean): InsertOptions {
        this.bypass_document_validation = validation;
        return this;
    }

    setOrdered(ordered: boolean): InsertOptions {
        this.ordered = ordered;
        return this;
    }

    setTimestamp(timestamp: boolean): InsertOptions {
        this.timestamp = timestamp;
        return this;
    }

    isBypassDocumentValidation(): boolean {
        return this.bypass_document_validation;
    }

    isOrdered(): boolean {
        return this.ordered;
    }

    isTimestamp(): boolean {
        return this.timestamp;
    }
}
