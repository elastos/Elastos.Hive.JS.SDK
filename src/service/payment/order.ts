export enum OrderState {
    NORMAL = "normal",
    EXPIRED = "expired",
    PAID = "paid",
    ARCHIVE = "archive",
}

/**
 * The order is used for payment module and represents and order to upgrade the service of the vault or the backup.
 */
export class Order {
	private order_id: number;
	private subscription: string;
	private pricing_plan: string;
	private paying_did: string;
	private payment_amount: number;
    private create_time: number;
    private expiration_time: number;
    private receiving_address: string;
    private state: OrderState;
    private proof: string;

    setOrderId(orderId: number) {
        this.order_id = orderId;
        return this;
    }

    setSubscription(subscription: string) {
        this.subscription = subscription;
        return this;
    }

    setPricingPlan(pricingName: string) {
        this.pricing_plan = pricingName;
        return this;
    }

    setPayingDid(payingDid: string) {
        this.paying_did = payingDid;
        return this;
    }

    setPaymentAmount(paymentAmount: number) {
        this.payment_amount = paymentAmount;
        return this;
    }

    setCreateTime(createTime: number) {
        this.create_time = createTime;
        return this;
    }

    setExpirationTime(expirationTime: number) {
        this.expiration_time = expirationTime;
        return this;
    }

    setReceivingAddress(receivingAddress: string) {
        this.receiving_address = receivingAddress;
        return this;
    }

    setState(state: OrderState) {
        this.state = state;
        return this;
    }

    setProof(proof: string) {
        this.proof = proof;
        return this;
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

    getPayingDid(): string {
        return this.paying_did;
    }

	getPaymentAmount(): number {
		return this.payment_amount;
	}

    getCreateTime(): number {
        return this.create_time;
    }

    getExpirationTime(): number {
        return this.expiration_time;
    }

	getReceivingAddress(): string {
		return this.receiving_address;
	}

    getState(): string {
        return this.state;
    }

	getProof(): string {
		return this.proof;
	}
}
