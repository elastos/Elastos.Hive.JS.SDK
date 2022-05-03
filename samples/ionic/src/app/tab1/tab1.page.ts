import { Component } from '@angular/core';
import Vault from '../hivejs/vault';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  public message: string;
  private vault: Vault;

  constructor() {
    this.message = 'Tab 1 Page';
  }

  async getVault(): Promise<Vault> {
    if (!this.vault) {
      this.vault = await Vault.getInstance();
    }
    return this.vault;
  }

  async updateMessage(action: () => Promise<boolean>) {
    this.message = 'Processing ...';
    const result = await action();
    this.message = result ? 'Succeed' : 'Failed';
  }

  async subscribe() {
    await this.updateMessage(async () => await (await this.getVault()).subscribe());
  }

  async vaultInfo() {
    await this.updateMessage(async () => await (await this.getVault()).vaultInfo());
  }

  async unsubscribe() {
    await this.updateMessage(async () => await (await this.getVault()).unsubscribe());
  }

  async insertDocument() {
    await this.updateMessage(async () => await (await this.getVault()).insertDocument());
  }

  async deleteDocument() {
    await this.updateMessage(async () => await (await this.getVault()).deleteDocument());
  }

  async uploadFile() {
    await this.updateMessage(async () => await (await this.getVault()).uploadFile());
  }

  async downloadFile() {
    await this.updateMessage(async () => await (await this.getVault()).downloadFile());
  }

  async scriptingUpload() {
    await this.updateMessage(async () => await (await this.getVault()).scriptingUpload());
  }

  async scriptingDownload() {
    await this.updateMessage(async () => await (await this.getVault()).scriptingDownload());
  }
}
