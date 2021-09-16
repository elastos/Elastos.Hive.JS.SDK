export class PayOrderParams {
//	@SerializedName("transaction_id")
	private transactionId;

	public setTransactionId(transactionId: string): PayOrderParams {
		return this.transactionId;
	}

    public getTransactionId(): string {
        return this.transactionId;
    }
}
