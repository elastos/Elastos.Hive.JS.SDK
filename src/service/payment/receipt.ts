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

	getReceiptId(): string {
		return this.receipt_id;
	}

	setReceiptId(receiptId: string): Receipt {
		this.receipt_id = receiptId;
        return this;
	}

	getOrderId(): number {
		return this.order_id;
	}

	setOrderId(orderId: number): Receipt {
		this.order_id = orderId;
        return this;
	}

    getSubscription(): string {
        return this.subscription;
    }

    setSubscription(subscription: string): Receipt {
        this.subscription = subscription;
        return this;
    }

    getPricingPlan(): string {
        return this.pricing_plan;
    }

    setPricingPlan(pricingPlan: string): Receipt {
        this.pricing_plan = pricingPlan;
        return this;
    }

    getPaymentAmount(): number {
        return this.payment_amount;
    }

    setPaymentAmount(paymentAmount: number): Receipt {
        this.payment_amount = paymentAmount;
        return this;
    }

    getPaidDid(): string {
        return this.paid_did;
    }

    setPaidDid(paidDid: string): Receipt {
        this.paid_did = paidDid;
        return this;
    }

    getCreateTime(): number {
        return this.create_time;
    }

    setCreateTime(createTime: number): Receipt {
        this.create_time = createTime;
        return this;
    }

    getReceivingAddress(): string {
        return this.receiving_address;
    }

    setReceivingAddress(receivingAddress: string): Receipt {
        this.receiving_address = receivingAddress;
        return this;
    }

	getReceiptProof(): string {
		return this.receipt_proof;
	}

	setReceiptProof(receiptProof: string): Receipt {
		this.receipt_proof = receiptProof;
        return this;
	}
}
