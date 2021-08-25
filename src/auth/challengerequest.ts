export class ChallengeRequest {
	private challenge: string;

    constructor(challenge: string) {
        this.challenge = challenge;
    }

	getChallenge(): string {
		return this.challenge;
	}
}
