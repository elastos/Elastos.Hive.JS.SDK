/**
 * The receipt contains the details of the paid information.
 */
export class Receipt {
	private receipt_id: string;
	private order_id: number;
    private subscription: string;
    private pricing_plan: string;
    private payment_amount: number;
    private paid_did: string;
    private create_time: number;
    private receiving_address: string;
    private receipt_proof: string;

    setReceiptId(receiptId: string) {
        this.receipt_id = receiptId;
        return this;
    }

    setOrderId(orderId: number) {
        this.order_id = orderId;
        return this;
    }

    setSubscription(subscription: string) {
        this.subscription = subscription;
        return this;
    }

    setPricingPlan(pricingPlan: string): Receipt {
        this.pricing_plan = pricingPlan;
        return this;
    }

    setPaymentAmount(paymentAmount: number): Receipt {
        this.payment_amount = paymentAmount;
        return this;
    }

    setPaidDid(paidDid: string): Receipt {
        this.paid_did = paidDid;
        return this;
    }

    setCreateTime(createTime: number): Receipt {
        this.create_time = createTime;
        return this;
    }

    setReceivingAddress(receivingAddress: string): Receipt {
        this.receiving_address = receivingAddress;
        return this;
    }

    setReceiptProof(receiptProof: string): Receipt {
        this.receipt_proof = receiptProof;
        return this;
    }

    getReceiptId(): string {
        return this.receipt_id;
    }

	getOrderId(): number {
		return this.order_id;
	}

    getSubscription(): string {
        return this.subscription;
    }

    getPricingPlan(): string {
        return this.pricing_plan;
    }

    getPaymentAmount(): number {
        return this.payment_amount;
    }

    getPaidDid(): string {
        return this.paid_did;
    }

    getCreateTime(): number {
        return this.create_time;
    }

    getReceivingAddress(): string {
        return this.receiving_address;
    }

	getReceiptProof(): string {
		return this.receipt_proof;
	}
}
