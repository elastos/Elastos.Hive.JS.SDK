import { VerifiablePresentation } from "@elastosfoundation/did-js-sdk";

export class NodeInfo {
    private serviceDid: string;
    private ownerDid: string;
    private ownershipPresentation: VerifiablePresentation;
    private name: string;
    private email: string;
    private description: string;
    private version: string;
    private lastCommitId: string;
    private userCount: number;
    private vaultCount: number;
    private backupCount: number;
    private latestAccessTime: Date;
    private memoryUsed: number;
    private memoryTotal: number;
    private storageUsed: number;
    private storageTotal: number;

    setServiceDid(serviceDid: string) {
        this.serviceDid = serviceDid;
        return this;
    }

    setOwnerDid(ownerDid: string) {
        this.ownerDid = ownerDid;
        return this;
    }

    setOwnershipPresentation(vp: VerifiablePresentation) {
        this.ownershipPresentation = vp;
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
        this.lastCommitId = cid;
        return this;
    }

    setUserCount(count: number) {
        this.userCount = count;
        return this;
    }

    setVaultCount(count: number) {
        this.vaultCount = count;
        return this;
    }

    setBackupCount(count: number) {
        this.backupCount = count;
        return this;
    }

    setLatestAccessTime(accessTime: Date) {
        this.latestAccessTime = accessTime;
        return this;
    }

    setMemoryUsed(count: number) {
        this.memoryUsed = count;
        return this;
    }

    setMemoryTotal(count: number) {
        this.memoryTotal = count;
        return this;
    }

    setStorageUsed(count: number) {
        this.storageUsed = count;
        return this;
    }

    setStorageTotal(count: number) {
        this.storageTotal = count;
        return this;
    }

    getServiceDid(): string {
        return this.serviceDid;
    }

    getOwnerDid(): string {
        return this.ownerDid;
    }

    getOwnershipPresentation(): VerifiablePresentation {
        return this.ownershipPresentation;
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
        return this.lastCommitId;
    }

    getUserCount() {
        return this.userCount;
    }

    getVaultCount() {
        return this.vaultCount;
    }

    getBackupCount() {
        return this.backupCount;
    }

    getLatestAccessTime(): Date {
        return this.latestAccessTime;
    }

    getMemoryUsed(): number {
        return this.memoryUsed;
    }

    getMemoryTotal(): number {
        return this.memoryTotal;
    }

    getStorageUsed(): number {
        return this.storageUsed;
    }

    getStorageTotal(): number {
        return this.storageTotal;
    }
}
