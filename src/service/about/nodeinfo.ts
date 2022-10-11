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
    private latest_access_time: Date;
    private memory_used: number;
    private memory_total: number;
    private storage_used: number;
    private storage_total: number;

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

    getLatestAccessTime(): Date {
        return this.latest_access_time;
    }

    getMemoryUsed(): number {
        return this.memory_used;
    }

    getMemoryTotal(): number {
        return this.memory_total;
    }

    getStorageUsed(): number {
        return this.storage_used;
    }

    getStorageTotal(): number {
        return this.storage_total;
    }
}
