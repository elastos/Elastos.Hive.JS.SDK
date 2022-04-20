import { VerifiablePresentation } from "@elastosfoundation/did-js-sdk";

export class NodeInfo {
    private service_did: string;
    private owner_did: string;
    private ownership_presentation: VerifiablePresentation;
    private name: string;
    private email: string;
    private description: string;
    private version: string;
    private last_commit_id: string;

    public getServiceDid(): string {
        return this.service_did;
    }

    public getOwnerDid(): string {
        return this.owner_did;
    }

    public getOwnershipPresentation(): VerifiablePresentation {
        return this.ownership_presentation;
    }

    public getName(): string {
        return this.name;
    }

    public getEmail(): string {
        return this.email;
    }

    public getDescription(): string {
        return this.description;
    }

    public getVersion(): string {
        return this.version;
    }

    public getLastCommitId(): string {
        return this.last_commit_id;
    }
}
