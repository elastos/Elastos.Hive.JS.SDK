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
	private orderId: number;
	private subscription: string;
	private pricingPlan: string;
	private payingDid: string;
	private paymentAmount: number;
    private createTime: number;
    private expirationTime: number;
    private receivingAddress: string;
    private state: OrderState;
    private proof: string;

    setOrderId(orderId: number) {
        this.orderId = orderId;
        return this;
    }

    setSubscription(subscription: string) {
        this.subscription = subscription;
        return this;
    }

    setPricingPlan(pricingName: string) {
        this.pricingPlan = pricingName;
        return this;
    }

    setPayingDid(payingDid: string) {
        this.payingDid = payingDid;
        return this;
    }

    setPaymentAmount(paymentAmount: number) {
        this.paymentAmount = paymentAmount;
        return this;
    }

    setCreateTime(createTime: number) {
        this.createTime = createTime;
        return this;
    }

    setExpirationTime(expirationTime: number) {
        this.expirationTime = expirationTime;
        return this;
    }

    setReceivingAddress(receivingAddress: string) {
        this.receivingAddress = receivingAddress;
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
		return this.orderId;
	}

	getSubscription(): string {
		return this.subscription;
	}

	getPricingPlan(): string {
		return this.pricingPlan;
	}

    getPayingDid(): string {
        return this.payingDid;
    }

	getPaymentAmount(): number {
		return this.paymentAmount;
	}

    getCreateTime(): number {
        return this.createTime;
    }

    getExpirationTime(): number {
        return this.expirationTime;
    }

	getReceivingAddress(): string {
		return this.receivingAddress;
	}

    getState(): string {
        return this.state;
    }

	getProof(): string {
		return this.proof;
	}
}
