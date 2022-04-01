/**
 * The receipt contains the details of the paid information.
 */
export class Receipt {
//	@SerializedName("receipt_id")
	private receiptId: string;
//	@SerializedName("order_id")
	private orderId: string;
//	@SerializedName("transaction_id")
	private transactionId: string;
//	@SerializedName("pricing_name")
	private pricingName: string;
//	@SerializedName("paid_did")
	private paidDid: string;
//	@SerializedName("ela_amount")
	private elaAmount: number;
	private proof: string;

	public getReceiptId(): string {
		return this.receiptId;
	}

	public setReceiptId(receiptId: string): Receipt {
		this.receiptId = receiptId;
        return this;
	}

	public getOrderId(): string {
		return this.orderId;
	}

	public setOrderId(orderId: string): Receipt {
		this.orderId = orderId;
        return this;
	}

	public getTransactionId(): string {
		return this.transactionId;
	}

	public setTransactionId(transactionId: string): Receipt {
		this.transactionId = transactionId;
        return this;
	}

	public getPricingName(): string {
		return this.pricingName;
	}

	public setPricingName(pricingName: string): Receipt {
		this.pricingName = pricingName;
        return this;
	}

	public getPaidDid(): string {
		return this.paidDid;
	}

	public setPaidDid(paidDid: string): Receipt {
		this.paidDid = paidDid;
        return this;
	}

	public getElaAmount(): number {
		return this.elaAmount;
	}

	public setElaAmount(elaAmount: number): Receipt {
		this.elaAmount = elaAmount;
        return this;
	}

	public getProof(): string {
		return this.proof;
	}

	public setProof(proof: string): Receipt {
		this.proof = proof;
        return this;
	}
}
