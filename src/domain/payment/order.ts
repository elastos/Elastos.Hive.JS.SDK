/**
 * The order is used for payment module and represents and order to upgrade the service of the vault or the backup.
 */
export class Order {
//	@SerializedName("order_id")
	private orderId: string;
	private subscription: string;
//	@SerializedName("pricing_name")
	private pricingName: string;
//	@SerializedName("ela_amount")
	private elaAmount: number;
//	@SerializedName("ela_address")
	private elaAddress: string;
	private proof: string;
//	@SerializedName("create_time")
	private createTime: Date;

	public getOrderId(): string {
		return this.orderId;
	}

	public setOrderId(orderId: string): Order {
		this.orderId = orderId;
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
		return this.pricingName;
	}

	public setPricingName(pricingName: string): Order {
		this.pricingName = pricingName;
        return this;
	}

	public getElaAmount(): number {
		return this.elaAmount;
	}

	public setElaAmount(elaAmount: number): Order {
		this.elaAmount = elaAmount;
        return this;
	}

	public getElaAddress(): string {
		return this.elaAddress;
	}

	public setElaAddress(elaAddress: string): Order {
		this.elaAddress = elaAddress;
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
		return this.createTime;
	}

	public setCreateTime(createTime: Date): Order {
		this.createTime = createTime;
        return this;
	}
}
