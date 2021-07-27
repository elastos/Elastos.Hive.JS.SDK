package org.elastos.hive.service;

import java.util.List;
import java.util.concurrent.CompletableFuture;

import org.elastos.hive.subscription.PricingPlan;

/**
 * Hive node provides the subscription service to let a new user subscribe to their
 * vault or backup service on the given back-end node.
 */
public interface SubscriptionService<T> {
	/**
	 * Let users to get the all the pricing plan list in order to subscribe
	 * to a new vault or backup service on the user's requirement.
	 *
	 * @return
	 * 		Return a list of all pricing plan with specific type on success.
	 * 		Otherwise, the specific exception would be returned.
	 */
	CompletableFuture<List<PricingPlan>> getPricingPlanList();

	/**
	 * Let users to get the specific pricing plan information.
	 *
	 * @param planName the name of the pricing plan
	 * @return
	 * 		Return the specific pricing plan information on success. Otherwise,
	 *  	the specific exception would be returned.
	 */
	CompletableFuture<PricingPlan> getPricingPlan(String planName);

	/**
	 * Let a new user subscribe to the entity service on the specified back-end
	 * node, where the entity service would be vault or backup service.
	 * Currently this method would only support for subscription to a entity service
	 * with free pricing plan. When there is already a corresponding service existed,
	 * no new service would be subscribed or created.
	 *
	 * @param credential The credential used to subscribe to a vault or backup service,
	 *		currently this parameter would be reserved for future usage.
	 * @return
	 * 		The basic information of the newly created or existing vault on success,
	 *	  otherwise, the specific exception would returned in the wrapper.
	 *
	 */
	CompletableFuture<T> subscribe(String credential);

	/**
	 * Let user to unsubscribe to an existing but useless vault or backup service.
	 *
	 * @return
	 * 		None would be returned on success, otherwise, the specific exception
	 *	  would be returned.
	 */
	CompletableFuture<Void> unsubscribe();


	/**
	 * Let the user to get the basic information of the subscription.
	 *
	 * @return
	 * 		The basic information of the newly created or existing vault on success,
	 *	  otherwise, the specific exception would returned in the wrapper.
	 */
	CompletableFuture<T> checkSubscription();
}
