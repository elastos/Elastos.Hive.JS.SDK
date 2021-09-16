export class CreateOrderParams {
//	@SerializedName("subscription")
	private subscription: string;

//	@SerializedName("pricing_name")
	private pricingName: string;

    public getSubscription(): string {
        return this.subscription;
    }

    public getPricingName(): string {
        return this.pricingName;
    }

    public setSubscription(subscription: string): CreateOrderParams {
        this.subscription = subscription;
        return this;
    }

    public setPricingName(pricingName: string): CreateOrderParams {
        this.pricingName = pricingName;
        return this;
    }
}
