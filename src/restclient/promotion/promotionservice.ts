import { HttpClient } from "../../http/httpclient";
import { AppContextProvider } from "../../http/security/appcontextprovider";
import { ServiceContext } from "../../http/servicecontext";

export class PromotionService {

	private httpClient: HttpClient;
	private serviceContext: ServiceContext;
	private contextProvider: AppContextProvider;

    constructor(serviceContext: ServiceContext, httpClient: HttpClient) {
		this.serviceContext = serviceContext;
		this.httpClient = httpClient;
		this.contextProvider = serviceContext.getAppContext().getAppContextProvider();
    }

}