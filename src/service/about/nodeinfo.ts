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

    setServiceDid(serviceDid: string) {
        this.service_did = serviceDid;
        return this;
    }

    setOwnerDid(ownerDid: string) {
        this.owner_did = ownerDid;
        return this;
    }

    setOwnershipPresentation(vp: VerifiablePresentation) {
        this.ownership_presentation = vp;
        return this;
    }

    setName(name: string) {
        this.name = name;
        return this;
    }

    setEmail(email: string) {
        this.email = email;
        return this;
    }

    setDescription(des: string) {
        this.description = des;
        return this;
    }

    setVersion(version: string) {
        this.version = version;
        return this;
    }

    setLastCommitId(cid: string) {
        this.last_commit_id = cid;
        return this;
    }

    setUserCount(count: number) {
        this.user_count = count;
        return this;
    }

    setVaultCount(count: number) {
        this.vault_count = count;
        return this;
    }

    setBackupCount(count: number) {
        this.backup_count = count;
        return this;
    }

    setLatestAccessTime(accessTime: Date) {
        this.latest_access_time = accessTime;
        return this;
    }

    setMemoryUsed(count: number) {
        this.memory_used = count;
        return this;
    }

    setMemoryTotal(count: number) {
        this.memory_total = count;
        return this;
    }

    setStorageUsed(count: number) {
        this.storage_used = count;
        return this;
    }

    setStorageTotal(count: number) {
        this.storage_total = count;
        return this;
    }

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
