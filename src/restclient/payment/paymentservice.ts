import { HttpClient } from "../../http/httpclient";
import { ServiceContext } from "../../http/servicecontext";
import { Logger } from '../../logger';
import { RestService } from "../restservice";

export class PaymentService extends RestService {
	private static LOG = new Logger("PaymentService");

    constructor(serviceContext: ServiceContext, httpClient: HttpClient) {
		super(serviceContext, httpClient);
	}

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