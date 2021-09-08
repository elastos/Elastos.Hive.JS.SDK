import { HttpClient } from "../../http/httpclient";
import { ServiceContext } from "../../http/servicecontext";
import { Logger } from '../../logger';
import { RestService } from "../restservice";

export class PaymentService extends RestService {
	private static LOG = new Logger("PaymentService");

    constructor(serviceContext: ServiceContext, httpClient: HttpClient) {
		super(serviceContext, httpClient);
	}

	public isAuthorizationRequired(): boolean {
        return true;
    }
}