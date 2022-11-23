/**
 * The receipt contains the details of the paid information.
 */
export class Receipt {
	private receiptId: string;
	private orderId: number;
    private subscription: string;
    private pricingPlan: string;
    private paymentAmount: number;
    private paidDid: string;
    private createTime: number;
    private receivingAddress: string;
    private receiptProof: string;

    setReceiptId(receiptId: string) {
        this.receiptId = receiptId;
        return this;
    }

    setOrderId(orderId: number) {
        this.orderId = orderId;
        return this;
    }

    setSubscription(subscription: string) {
        this.subscription = subscription;
        return this;
    }

    setPricingPlan(pricingPlan: string): Receipt {
        this.pricingPlan = pricingPlan;
        return this;
    }

    setPaymentAmount(paymentAmount: number): Receipt {
        this.paymentAmount = paymentAmount;
        return this;
    }

    setPaidDid(paidDid: string): Receipt {
        this.paidDid = paidDid;
        return this;
    }

    setCreateTime(createTime: number): Receipt {
        this.createTime = createTime;
        return this;
    }

    setReceivingAddress(receivingAddress: string): Receipt {
        this.receivingAddress = receivingAddress;
        return this;
    }

    setReceiptProof(receiptProof: string): Receipt {
        this.receiptProof = receiptProof;
        return this;
    }

    getReceiptId(): string {
        return this.receiptId;
    }

	getOrderId(): number {
		return this.orderId;
	}

    getSubscription(): string {
        return this.subscription;
    }

    getPricingPlan(): string {
        return this.pricingPlan;
    }

    getPaymentAmount(): number {
        return this.paymentAmount;
    }

    getPaidDid(): string {
        return this.paidDid;
    }

    getCreateTime(): number {
        return this.createTime;
    }

    getReceivingAddress(): string {
        return this.receivingAddress;
    }

	getReceiptProof(): string {
		return this.receiptProof;
	}
}
