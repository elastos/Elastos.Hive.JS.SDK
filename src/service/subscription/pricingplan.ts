/**
 * The pricing plan is for upgrading the service of the vault or the backup.
 */
export class PricingPlan {
	private amount: number;
	private currency: string;
	private maxStorage: number;
	private name: string;
	private serviceDays: number;

	public setAmount(amount: number): PricingPlan {
		this.amount = amount;
		return this;
	}

	public setCurrency(currency: string): PricingPlan {
		this.currency = currency;
		return this;
	}

	public setMaxStorage(maxStorage: number): PricingPlan {
		this.maxStorage = maxStorage;
		return this;
	}

	public setName(name: string): PricingPlan {
		this.name = name;
		return this;
	}

	public setServiceDays(serviceDays: number): PricingPlan {
		this.serviceDays = serviceDays;
		return this;
	}

	public getAmount(): number {
		return this.amount;
	}

	public getCurrency(): string {
		return this.currency;
	}

	public getMaxStorage(): number {
		return this.maxStorage;
	}

	public getName(): string {
		return this.name;
	}

	public getServiceDays(): number {
		return this.serviceDays;
	}
}
