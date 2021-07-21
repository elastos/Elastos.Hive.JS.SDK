package org.elastos.hive.subscription.payment;

import retrofit2.Call;
import retrofit2.http.*;

interface PaymentAPI {
	@PUT("/api/v2/payment/order")
	Call<Order> placeOrder(@Body CreateOrderParams params);

	@POST("/api/v2/payment/order/{order_id}")
	Call<Receipt> payOrder(@Path("order_id") String orderId,
						   @Body PayOrderParams params);

	@GET("/api/v2/payment/order")
	Call<OrderCollection> getOrders(@Query("subscription") String subscription,
									@Query("order_id") String orderId);

	@GET("/api/v2/payment/receipt")
	Call<Receipt> getReceipt(@Query("order_id") String orderId);

	@GET("/api/v2/payment/version")
	Call<VersionResult> getVersion();
}
