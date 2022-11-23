import {BasePath, BaseService, Body, GET, Header, Path, POST, PUT, Response, ResponseTransformer} from 'ts-retrofit';
import {NotImplementedException, ServerUnknownException} from "../../exceptions";
import {APIResponse} from "../restservice";
import {Order, OrderState} from "./order";
import {Receipt} from "./receipt";

function getOrderStateByStr(value: string): OrderState {
    if (value === 'normal') {
        return OrderState.NORMAL;
    } else if (value === 'expired') {
        return OrderState.EXPIRED;
    } else if (value === 'paid') {
        return OrderState.PAID;
    } else if (value === 'archive') {
        return OrderState.ARCHIVE;
    } else {
        throw new ServerUnknownException('Unknown result.');
    }
}

@BasePath("/api/v2")
export class PaymentAPI extends BaseService {
    @GET("/payment/version")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (body) => {
            return body['version'];
        });
    })
    async version(@Header("Authorization") auth: string): Promise<Response> {
        throw new NotImplementedException();
    }

    @PUT("/payment/order")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (body) => {
            return new Order()
                .setOrderId(body['order_id'])
                .setSubscription(body['order_id'])
                .setPricingPlan(body['order_id'])
                .setPayingDid(body['order_id'])
                .setPaymentAmount(body['order_id'])
                .setCreateTime(body['order_id'])
                .setExpirationTime(body['order_id'])
                .setReceivingAddress(body['order_id'])
                .setState(getOrderStateByStr(body['state']))
                .setProof(body['order_id']);
        });
    })
    async placeOrder(@Header("Authorization") auth: string,
                     @Body body: object): Promise<Response> {
        throw new NotImplementedException();
    }

    @POST("/payment/order/{orderId}")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (body) => {
            return new Receipt()
                .setReceiptId(body['receipt_id'])
                .setOrderId(body['order_id'])
                .setSubscription(body['subscription'])
                .setPricingPlan(body['pricing_plan'])
                .setPaymentAmount(body['payment_amount'])
                .setPaidDid(body['paid_did'])
                .setCreateTime(body['create_time'])
                .setReceivingAddress(body['receiving_address'])
                .setReceiptProof(body['receipt_proof']);
        });
    })
    async settleOrder(@Header("Authorization") auth: string,
                      @Path('orderId') orderId: number): Promise<Response> {
        throw new NotImplementedException();
    }

    @GET("/payment/order")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (body) => {
            return body['orders'].map(o => new Order()
                .setOrderId(o['order_id'])
                .setSubscription(o['order_id'])
                .setPricingPlan(o['order_id'])
                .setPayingDid(o['order_id'])
                .setPaymentAmount(o['order_id'])
                .setCreateTime(o['order_id'])
                .setExpirationTime(o['order_id'])
                .setReceivingAddress(o['order_id'])
                .setState(getOrderStateByStr(o['state']))
                .setProof(o['order_id']));
        });
    })
    async getOrders(@Header("Authorization") auth: string,
                    @Body body: object): Promise<Response> {
        throw new NotImplementedException();
    }

    @GET("/payment/receipt")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (body) => {
            return body['receipts'].map(o => new Receipt()
                .setReceiptId(o['receipt_id'])
                .setOrderId(o['order_id'])
                .setSubscription(o['subscription'])
                .setPricingPlan(o['pricing_plan'])
                .setPaymentAmount(o['payment_amount'])
                .setPaidDid(o['paid_did'])
                .setCreateTime(o['create_time'])
                .setReceivingAddress(o['receiving_address'])
                .setReceiptProof(o['receipt_proof']));
        });
    })
    async getReceipts(@Header("Authorization") auth: string,
                      @Body body: object): Promise<Response> {
        throw new NotImplementedException();
    }
}
