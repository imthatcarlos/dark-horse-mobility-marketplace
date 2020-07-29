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
    budgetETH
  ) {

    // @TODO: create ThreadDB ActiveCampaign => with id: ipfsHash => new collection?
    // @NOTE: thread id just like we do Trips (random id) for advertiser
    // now we have an id to a collection record
    let campaignResultsThreadId;

    await this.contract.createCampaign(
      organization,
      category,
      title,
      ipfsHash,
      campaignResultsThreadId,
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
        fileData
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export default MobilityAdsClient;
