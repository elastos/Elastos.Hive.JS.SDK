import { UnknownInternalException } from "@elastosfoundation/did-js-sdk/typings/exceptions/exceptions";
import { HttpMethod } from "../..";
import { NodeRPCException, NotImplementedException, ServerUnknownException } from "../../exceptions";
import { HttpClient } from "../../http/httpclient";
import { ServiceContext } from "../../http/servicecontext";
import { Logger } from '../../logger';
import { RestService } from "../restservice";

export class PromotionService extends RestService {
	private static LOG = new Logger("PromotionService");

	private static API_PROMOTION_ENDPOINT = "/api/v2/backup/promotion";


    constructor(serviceContext: ServiceContext, httpClient: HttpClient) {
		super(serviceContext, httpClient);
	}

	async promote() : Promise<void> {
		throw new NotImplementedException();
		try {
			await this.httpClient.send<void>(PromotionService.API_PROMOTION_ENDPOINT, HttpClient.NO_PAYLOAD, HttpClient.NO_RESPONSE, HttpMethod.POST);
		} catch (e){
			if (e instanceof NodeRPCException) {
				throw new ServerUnknownException(e.message, e);
			}
		}
	}
}