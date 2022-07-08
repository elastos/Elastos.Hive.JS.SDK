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
    private user_count: number;
    private vault_count: number;
    private backup_count: number;

    getServiceDid(): string {
        return this.service_did;
    }

    getOwnerDid(): string {
        return this.owner_did;
    }

    getOwnershipPresentation(): VerifiablePresentation {
        return this.ownership_presentation;
    }

    getName(): string {
        return this.name;
    }

    getEmail(): string {
        return this.email;
    }

    getDescription(): string {
        return this.description;
    }

    getVersion(): string {
        return this.version;
    }

    getLastCommitId(): string {
        return this.last_commit_id;
    }

    getUserCount() {
        return this.user_count;
    }

    getVaultCount() {
        return this.vault_count;
    }

    getBackupCount() {
        return this.backup_count;
    }
}
