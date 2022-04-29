import { HttpMethod } from "../../connection/httpmethod";
import {
	NetworkException,
	NodeRPCException
} from "../../exceptions";
import { HttpClient } from "../../connection/httpclient";
import { ServiceEndpoint } from "../../connection/serviceendpoint";
import { Logger } from '../../utils/logger';
import { RestService } from "../restservice";

export class PromotionService extends RestService {
	private static LOG = new Logger("PromotionService");

	private static API_PROMOTION_ENDPOINT = "/api/v2/backup/promotion";

    constructor(serviceContext: ServiceEndpoint, httpClient: HttpClient) {
		super(serviceContext, httpClient);
	}

	public async promote(): Promise<void> {
		try {
			await this.httpClient.send<void>(PromotionService.API_PROMOTION_ENDPOINT,
					                         HttpClient.NO_PAYLOAD, HttpClient.NO_RESPONSE, HttpMethod.POST);
		} catch (e) {
			if (e instanceof NodeRPCException) {
				throw e;
			}
			throw new NetworkException(e.message, e);
		}
	}
}
