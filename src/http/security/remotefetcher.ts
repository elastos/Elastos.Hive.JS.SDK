import { ServiceContext } from '../servicecontext';
import { CodeFetcher } from '../codefetcher';
import { NodeRPCException } from '../../exceptions';
import { AppContextProvider } from './appcontextprovider';
import { AuthService } from '../../auth/authservice';

export class RemoteFetcher implements CodeFetcher {
	private contextProvider: AppContextProvider;
	private authService: AuthService;

	public constructor(serviceContext: ServiceContext) {
		this.contextProvider = serviceContext.getAppContext().getAppContextProvider();
		
		// TODO: Java version had a AuthController here which signature differs from our AuthService 
		this.authService = new AuthService(serviceContext, undefined); // this.contextProvider.getAppInstanceDocument());
	}

	public async fetch(): Promise<string> {
		try {
			let challenge: string = await this.authService.signIn(this.contextProvider.getAppInstanceDocument());

			let challengeResponse: string = await this.contextProvider.getAuthorization(challenge);
			return await this.authService.auth(challengeResponse, this.contextProvider.getAppInstanceDocument());
		} catch (e) {
			throw new NodeRPCException(401,-1, "Failed to get token by auth requests.");
		}
	}

	public invalidate(): void {}
}
