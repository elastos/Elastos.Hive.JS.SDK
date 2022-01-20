import { HttpMethod } from "../../http/httpmethod";
import {
	AlreadyExistsException, InsufficientStorageException,
	InvalidParameterException,
	NetworkException,
	NodeRPCException, NotFoundException,
	ServerUnknownException,
	UnauthorizedException
} from "../../exceptions";
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
