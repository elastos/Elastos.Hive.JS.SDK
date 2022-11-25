/**
 * Represents the order detail which is already paid by user.
 */
export class FilledOrderDetail {
	private order_id: string;
	private receipt_id: string;
	private user_did: string;
	private subscription: string;
	private pricing_name: string;
	private ela_amount: number;
	private ela_address: string;
	private paid_did: string;

    setOrderId(orderId) {
        this.order_id = orderId;
        return this;
    }

    setReceiptId(receiptId) {
        this.receipt_id = receiptId;
        return this;
    }

    setUserDid(userDid) {
        this.user_did = userDid;
        return this;
    }

    setSubscription(subscription) {
        this.subscription = subscription;
        return this;
    }

    setPricingName(pricingName) {
        this.pricing_name = pricingName;
        return this;
    }

    setElaAmount(elaAmount) {
        this.ela_amount = elaAmount;
        return this;
    }

    setElaAddress(elaAddress) {
        this.ela_address = elaAddress;
        return this;
    }

    setPaidDid(paidDid) {
        this.paid_did = paidDid;
        return this;
    }

	getOrderId() {
		return this.order_id;
	}

	getReceiptId() {
		return this.receipt_id;
	}

	getUserDid() {
		return this.user_did;
	}

	getSubscription() {
		return this.subscription;
	}

	getPricingName() {
		return this.pricing_name;
	}

	getElaAmount() {
		return this.ela_amount;
	}

	getElaAddress() {
		return this.ela_address;
	}

	getPaidDid() {
		return this.paid_did;
	}
}
