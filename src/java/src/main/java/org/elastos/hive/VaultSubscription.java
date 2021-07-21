package org.elastos.hive;

import org.elastos.hive.exception.HiveException;
import org.elastos.hive.exception.NotImplementedException;
import org.elastos.hive.subscription.VaultInfo;
import org.elastos.hive.subscription.PricingPlan;
import org.elastos.hive.subscription.SubscriptionController;
import org.elastos.hive.subscription.payment.Order;
import org.elastos.hive.subscription.payment.PaymentController;
import org.elastos.hive.subscription.payment.Receipt;
import org.elastos.hive.service.PaymentService;
import org.elastos.hive.service.SubscriptionService;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;

public class VaultSubscription extends ServiceEndpoint
	implements SubscriptionService<VaultInfo>, PaymentService {

	private SubscriptionController subscriptionController;
	private PaymentController paymentController;

	public VaultSubscription(AppContext context, String providerAddress) throws HiveException {
		super(context, providerAddress);
		subscriptionController = new SubscriptionController(this);
		paymentController = new PaymentController(this);
	}

	@Override
	public CompletableFuture<List<PricingPlan>> getPricingPlanList() {
		return CompletableFuture.supplyAsync(()-> {
			try {
				return subscriptionController.getVaultPricingPlanList();
			} catch (HiveException | RuntimeException e) {
				throw new CompletionException(e);
			}
		});
	}

	@Override
	public CompletableFuture<PricingPlan> getPricingPlan(String planName) {
		return CompletableFuture.supplyAsync(()-> {
			if (planName == null)
				throw new IllegalArgumentException("Empty plan name");

			try {
				return subscriptionController.getVaultPricingPlan(planName);
			} catch (HiveException | RuntimeException e) {
				throw new CompletionException(e);
			}
		});
	}

	public CompletableFuture<VaultInfo> subscribe() {
		return this.subscribe(null);
	}

	@Override
	public CompletableFuture<VaultInfo> subscribe(String credential) {
		return CompletableFuture.supplyAsync(()-> {
			if (credential != null)
				throw new NotImplementedException("Paid pricing plan will be supported later");

			try {
				return subscriptionController.subscribeToVault(credential);
			} catch (HiveException | RuntimeException e) {
				throw new CompletionException(e);
			}
		});
	}

	@Override
	public CompletableFuture<Void> unsubscribe() {
		return CompletableFuture.runAsync(()-> {
			try {
				subscriptionController.unsubscribeVault();
			} catch (HiveException | RuntimeException e) {
				throw new CompletionException(e);
			}
		});
	}

	@Override
	public CompletableFuture<VaultInfo> checkSubscription() {
		return CompletableFuture.supplyAsync(()-> {
			try {
				return subscriptionController.getVaultInfo();
			} catch (HiveException | RuntimeException e) {
				throw new CompletionException(e);
			}
		});
	}

	@Override
	public CompletableFuture<Order> placeOrder(String planName) {
		return CompletableFuture.supplyAsync(() -> {
			try {
				return paymentController.placeOrder("vault", planName);
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
				return paymentController.getOrders("vault");
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
