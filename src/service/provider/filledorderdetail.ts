export class FilledOrderDetail {
	private order_id: string;
	private receipt_id: string;
	private user_did: string;
	private subscription: string;
	private pricing_name: string;
	private ela_amount: number;
	private ela_address: string;
	private paid_did: string;

	public getOrderId() {
		return this.order_id;
	}

	public setOrderId(orderId) {
		this.order_id = orderId;
	}

	public getReceiptId() {
		return this.receipt_id;
	}

	public setReceiptId(receiptId) {
		this.receipt_id = receiptId;
	}

	public getUserDid() {
		return this.user_did;
	}

	public setUserDid(userDid) {
		this.user_did = userDid;
	}

	public getSubscription() {
		return this.subscription;
	}

	public setSubscription(subscription) {
		this.subscription = subscription;
	}

	public getPricingName() {
		return this.pricing_name;
	}

	public setPricingName(pricingName) {
		this.pricing_name = pricingName;
	}

	public getElaAmount() {
		return this.ela_amount;
	}

	public setElaAmount(elaAmount) {
		this.ela_amount = elaAmount;
	}

	public getElaAddress() {
		return this.ela_address;
	}

	public setElaAddress(elaAddress) {
		this.ela_address = elaAddress;
	}

	public getPaidDid() {
		return this.paid_did;
	}

	public setPaidDid(paidDid) {
		this.paid_did = paidDid;
	}
}
