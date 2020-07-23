import contract from '@truffle/contract';

import MobilityCampaignsABI from '../json/MobilityCampaigns.json';

const contracts = require("./../json/contracts.json");

export const getContracts = (web3) => new Promise(async (resolve, reject) => {
  try {
    const MobilityCampaignsAddress = contracts[web3.network]["MobilityCampaigns"];
    const MobilityCampaignsContract = contract(MobilityCampaignsABI);

    MobilityCampaignsContract.setProvider(web3.currentProvider);

    const MobilityCampaigns = await MobilityCampaignsContract.at(MobilityCampaignsAddress);

    resolve({
      mobilityCampaigns: MobilityCampaigns,
    });
  } catch (error) {
    console.log(error)
    reject(null); // metamask OR contracts failed
  }
});
