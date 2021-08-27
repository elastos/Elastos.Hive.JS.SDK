import { ServiceContext } from '../ServiceContext';
import { CodeFetcher } from '../codefetcher';
import { NodeRPCException } from '../../exceptions';

export class RemoteFetcher implements CodeFetcher {
	private contextProvider: AppContextProvider;
	private authService: AuthService;

	public constructor(ServiceContext: ServiceContext) {
		this.contextProvider = ServiceContext.getAppContext().getAppContextProvider();
		this.authService = new AuthService(ServiceContext, contextProvider.getAppInstanceDocument());
	}

	public fetch(): string {
		try {
			let challenge: string  = this.authService.signIn(contextProvider.getAppInstanceDocument());

			let challengeResponse: string = contextProvider.getAuthorization(challenge).get();
			return this.authService.auth(challengeResponse);
		} catch (e) {
			throw new NodeRPCException(401,-1, "Failed to get token by auth requests.");
		}
	}

	public invalidate(): void {}
}
