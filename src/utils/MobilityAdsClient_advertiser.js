import { sample } from 'lodash/collection';
import fleekStorage from '@fleekhq/fleek-storage-js';

class MobilityAdsClient {
  constructor({ web3, account, contract }) {
    this.web3 = web3;
    this.account = account.toLowerCase();
    this.contract = contract;
  }

  async createCampaign(
    organization,
    category,
    title,
    ipfsHash,
    key,
    budgetETH
  )
  {
    await this.contract.createCampaign(
      organization,
      category,
      title,
      ipfsHash,
      key,
      { from: this.account, value: this.web3.utils.toWei(budgetETH.toString()) }
    );
  }

  async getActiveCampaign() {
    try {
      const data = await this.contract.getActiveCampaign({ from: this.account });
      const fileData = await fleekStorage.getFileFromHash({ hash: data.ipfsHash });
      return {
        organization: data.organization,
        title: data.title,
        category: data.category,
        budget: this.web3.utils.fromWei(data.budgetWei, 'ether'),
        expiresAt: parseInt(data.expiresAt),
        fileData
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getActiveCampaignId() {
    return this.contract.getActiveCampaignId({ from: this.account });
  }

  async getCampaignReceiversCount() {
    return this.contract.totalCampaignReceivers({ from: this.account });
  }

  async getCampaignRefundedBudget() {
    const wei = await this.contract.calculateRefundedWei({ from: this.account });
    return this.web3.utils.fromWei(wei, 'ether');
  }
}

export default MobilityAdsClient;
