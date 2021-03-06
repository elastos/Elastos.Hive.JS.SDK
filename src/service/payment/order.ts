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

	getOrderId(): number {
		return this.order_id;
	}

	setOrderId(orderId: number): Order {
		this.order_id = orderId;
        return this;
	}

	getSubscription(): string {
		return this.subscription;
	}

	setSubscription(subscription: string): Order {
		this.subscription = subscription;
        return this;
	}

	getPricingPlan(): string {
		return this.pricing_plan;
	}

	setPricingPlan(pricingName: string): Order {
		this.pricing_plan = pricingName;
        return this;
	}

    getPayingDid(): string {
        return this.paying_did;
    }

    setPayingDid(payingDid: string): Order {
        this.paying_did = payingDid;
        return this;
    }

	getPaymentAmount(): number {
		return this.payment_amount;
	}

	setPaymentAmount(paymentAmount: number): Order {
		this.payment_amount = paymentAmount;
        return this;
	}

    getCreateTime(): number {
        return this.create_time;
    }

    setCreateTime(createTime: number): Order {
        this.create_time = createTime;
        return this;
    }

    getExpirationTime(): number {
        return this.expiration_time;
    }

    setExpirationTime(expirationTime: number): Order {
        this.expiration_time = expirationTime;
        return this;
    }

	getReceivingAddress(): string {
		return this.receiving_address;
	}

	setReceivingAddress(receivingAddress: string): Order {
		this.receiving_address = receivingAddress;
        return this;
	}

    getState(): string {
        return this.state;
    }

	setState(state: OrderState) {
	    this.state = state;
    }

	getProof(): string {
		return this.proof;
	}

	setProof(proof: string): Order {
		this.proof = proof;
        return this;
	}
}
