import {BasePath, BaseService, Body, GET, Header, Path, POST, PUT, Response, ResponseTransformer} from 'ts-retrofit';
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
        throw Error('Unknown result.');
    }
}

@BasePath("/api/v2")
export class PaymentAPI extends BaseService {
    @GET("/payment/version")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (jsonObj) => {
            return jsonObj['version'];
        });
    })
    async version(@Header("Authorization") auth: string): Promise<Response> { return null; }

    @PUT("/payment/order")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (jsonObj) => {
            jsonObj['state'] = getOrderStateByStr(jsonObj['state']);
            return Object.assign(new Order(), jsonObj);
        });
    })
    async placeOrder(@Header("Authorization") auth: string,
                     @Body body: object): Promise<Response> { return null; }

    @POST("/payment/order/{orderId}")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (jsonObj) => {
            return Object.assign(new Receipt(), jsonObj);
        });
    })
    async settleOrder(@Header("Authorization") auth: string,
                      @Path('orderId') orderId: number): Promise<Response> { return null; }

    @GET("/payment/order")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (jsonObj) => {
            const jsonObjs: [] = jsonObj['orders'];
            return jsonObjs.map((o: {[key: string]: string}) => {
                o['state'] = getOrderStateByStr(o['state']);
                return Object.assign(new Order(), o);
            });
        });
    })
    async getOrders(@Header("Authorization") auth: string,
                    @Body body: object): Promise<Response> { return null; }

    @GET("/payment/receipt")
    @ResponseTransformer((data: any, headers?: any) => {
        return APIResponse.handleResponseData(data, (jsonObj) => {
            const jsonObjs: [] = jsonObj['receipts'];
            return jsonObjs.map(o => Object.assign(new Receipt(), o));
        });
    })
    async getReceipts(@Header("Authorization") auth: string,
                      @Body body: object): Promise<Response> { return null; }
}
