import { AppContext } from "../../../http/security/appcontext";
import { HttpClient } from "../../../http/httpclient";
import { ServiceContext } from "../../../http/servicecontext";
import { Logger } from '../../../logger';
import { PaymentService } from "../../payment/paymentservice";
import { SubscriptionService } from "../../subscription/subscriptionservice";
import { PricingPlan } from "../../../domain/subscription/pricingplan";

export class BackupSubscriptionService extends ServiceContext {
	private static LOG = new Logger("BackupSubscriptionService");

    private paymentService: PaymentService;
    private subscriptionService: SubscriptionService;

    public constructor(context: AppContext, providerAddress: string) {
		super(context, providerAddress);
        let httpClient = new HttpClient(this, HttpClient.WITH_AUTHORIZATION, HttpClient.DEFAULT_OPTIONS);
        this.paymentService = new PaymentService(this, httpClient);
        this.subscriptionService = new SubscriptionService(this, httpClient);
	}

	public async getPricingPlanList(): Promise<PricingPlan[]> {
        return await this.subscriptionService.getBackupPricingPlanList();
    }

	@Override
	public CompletableFuture<PricingPlan> getPricingPlan(String planName) {
		return CompletableFuture.supplyAsync(()-> {
			if (planName == null)
				throw new IllegalArgumentException("Empty plan name");

			try {
				return subscriptionController.getBackupPricingPlan(planName);
			} catch (RuntimeException | HiveException e) {
				throw new CompletionException(e);
			}
		});
	}

	@Override
	public CompletableFuture<BackupInfo> subscribe() {
		return CompletableFuture.supplyAsync(()-> {
			try {
				return subscriptionController.subscribeToBackup();
			} catch (HiveException | RuntimeException e) {
				throw new CompletionException(e);
			}
		});
	}

	@Override
	public CompletableFuture<Void> unsubscribe() {
		return CompletableFuture.runAsync(()-> {
			try {
				subscriptionController.unsubscribeBackup();
			} catch (HiveException | RuntimeException e) {
				throw new CompletionException(e);
			}
		});
	}

	@Override
	public CompletableFuture<BackupInfo> checkSubscription() {
		return CompletableFuture.supplyAsync(()-> {
			try {
				return subscriptionController.getBackupInfo();
			} catch (HiveException | RuntimeException e) {
				throw new CompletionException(e);
			}
		});
	}

	@Override
	public CompletableFuture<Order> placeOrder(String planName) {
		return CompletableFuture.supplyAsync(() -> {
			try {
				return paymentController.placeOrder("backup", planName);
			} catch (HiveException | RuntimeException e) {
				throw new CompletionException(e);
			}
		});
	}

	@Override
	public CompletableFuture<Order> getOrder(String orderId) {
		return CompletableFuture.supplyAsync(() -> {
			try {
				return paymentController.getOrder(orderId);
			} catch (HiveException | RuntimeException e) {
				throw new CompletionException(e);
			}
		});
	}

	@Override
	public CompletableFuture<Receipt> payOrder(String orderId, String transactionId) {
		return CompletableFuture.supplyAsync(() -> {
			try {
				return paymentController.payOrder(orderId, transactionId);
			} catch (HiveException | RuntimeException e) {
				throw new CompletionException(e);
			}
		});
	}

	@Override
	public CompletableFuture<List<Order>> getOrderList() {
		return CompletableFuture.supplyAsync(() -> {
			try {
				return paymentController.getOrders("backup");
			} catch (HiveException | RuntimeException e) {
				throw new CompletionException(e);
			}
		});
	}

	@Override
	public CompletableFuture<Receipt> getReceipt(String orderId) {
		return CompletableFuture.supplyAsync(() -> {
			try {
				return paymentController.getReceipt(orderId);
			} catch (HiveException | RuntimeException e) {
				throw new CompletionException(e);
			}
		});
	}

	@Override
	public CompletableFuture<String> getVersion() {
		return CompletableFuture.supplyAsync(() -> {
			try {
				return paymentController.getVersion();
			} catch (HiveException | RuntimeException e) {
				throw new CompletionException(e);
			}
		});
	}
}