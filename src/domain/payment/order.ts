/**
 * The order is used for payment module and represents and order to upgrade the service of the vault or the backup.
 */
export class Order {
	private order_id: string;
	private subscription: string;
	private pricing_name: string;
	private ela_amount: number;
	private ela_address: string;
	private proof: string;
	private create_time: Date;

	public getOrderId(): string {
		return this.order_id;
	}

	public setOrderId(orderId: string): Order {
		this.order_id = orderId;
        return this;
	}

	public getSubscription(): string {
		return this.subscription;
	}

	public setSubscription(subscription: string): Order {
		this.subscription = subscription;
        return this;
	}

	public getPricingName(): string {
		return this.pricing_name;
	}

	public setPricingName(pricingName: string): Order {
		this.pricing_name = pricingName;
        return this;
	}

	public getElaAmount(): number {
		return this.ela_amount;
	}

	public setElaAmount(elaAmount: number): Order {
		this.ela_amount = elaAmount;
        return this;
	}

	public getElaAddress(): string {
		return this.ela_address;
	}

	public setElaAddress(elaAddress: string): Order {
		this.ela_address = elaAddress;
        return this;
	}

	public getProof(): string {
		return this.proof;
	}

	public setProof(proof: string): Order {
		this.proof = proof;
        return this;
	}

	public getCreateTime(): Date {
		return this.create_time;
	}

	public setCreateTime(createTime: Date): Order {
		this.create_time = createTime;
        return this;
	}
}
