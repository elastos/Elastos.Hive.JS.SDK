import { HttpClient } from "../../http/httpclient";
import { AppContextProvider } from "../../http/security/appcontextprovider";
import { ServiceContext } from "../../http/servicecontext";
import { Logger } from '../../logger';

export class PromotionService {
	private static LOG = new Logger("PromotionService");

	private httpClient: HttpClient;
	private serviceContext: ServiceContext;
	private contextProvider: AppContextProvider;

    constructor(serviceContext: ServiceContext, httpClient: HttpClient) {
		this.serviceContext = serviceContext;
		this.httpClient = httpClient;
		this.contextProvider = serviceContext.getAppContext().getAppContextProvider();
    }

}