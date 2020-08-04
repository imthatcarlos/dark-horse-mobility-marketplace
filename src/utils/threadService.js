import { Libp2pCryptoIdentity } from '@textile/threads-core';
import { KeyInfo, ThreadID } from '@textile/hub';
import { Database } from '@textile/threads-database';
import { findKey, isEmpty } from 'lodash';
import { collect } from 'streaming-iterables';

const DBNAME = "threads.advertisers";

export const AdvertiserSchema = {
    $id: 'https://example.com/astronaut.schema.json',
    $schema: "http://json-schema.org/draft-07/schema#",
    definitions: {
      Advertiser: {
        title: "Advertiser",
        type: "object",
        properties: {
          _id: {
            type: "string",
          },
          ethAddr: {
            type: "string",
          },
          org: {
            type: "string",
          },
          category: {
              type: "string",
          },
        },
        required: ["_id", "ethAddr"],
      },
    },
  };


export const CampaignSchema = {
  $id: 'https://example.com/astronaut.schema.json',
  $schema: "http://json-schema.org/draft-07/schema#",
  definitions: {
    Campaigns: {
      title: "Campaigns",
      type: "object",
      properties: {
        _id: {
          type: "string",
        },
        storageId: {
          type: "integer",
        },
        bucketKey: {
          type: "string",
          description: "Name of the file stored in bucket.",
        },
        ethAddr: {
          type: "string",
        },
        numClicks: {
          type: "integer",
        },
        numReachs: {
          type: "integer",
        },
      },
      required: ["_id", "storageId", "bucketKey"],
    },
  },
};


export const PurchasesSchema = {
  $id: 'https://example.com/astronaut.schema.json',
  $schema: "http://json-schema.org/draft-07/schema#",
  definitions: {
    Advertiser: {
      title: "Purchases",
      type: "object",
      properties: {
        _id: {
          type: "string",
        },
        ethAddr: {
          type: "string",
        },
        publicUrl: {
          type: "string",
        },
        txHash: {
            type: "string",
        },
      },
      required: ["_id", "publicUrl", "txHash"],
    },
  },
};


const setOrGetIdentity = async () => {
    try {
      var storedIdent = localStorage.getItem("identity")
      if (storedIdent === null) {
        throw new Error('No identity found')
      }
      const restored = Libp2pCryptoIdentity.fromString(storedIdent)
      return restored;
    }
    catch (e) {
      try {
        const identity = await Libp2pCryptoIdentity.fromRandom()
        const identityString = identity.toString()
        localStorage.setItem("identity", identityString)
        return identity;
      } catch (err) {
        return err.message;
      }
    }
  }


class ThreadService {
    constructor () {
        const currentThreadID = localStorage.getItem('hash');
        this.threadID = currentThreadID ? ThreadID.fromString(currentThreadID) : ThreadID.fromRandom()

    }

    async init() {
        this.identity = await setOrGetIdentity()
        const key = {key: process.env.REACT_APP_API_KEY || ''}
        this.db = await Database.withKeyInfo(key, DBNAME, undefined, undefined)
        // return this;
    }

    async start(ethAddr) {
      this.ethAddr = ethAddr
      if (!this.identity) {
          throw new Error('Identity not found')
      }
      if (!this.db) {
          throw new Error('Database not setup')
      }

      try {
        // await this.db.start(this.identity, {threadID: this.threadID});
        await this.db.start(this.identity, {threadID: undefined});
      } catch (error) {
        console.log(error);
      }

      await this.initAdvertisers(ethAddr);

      // TODO: Stores ThreadId for current session (I guess). Maybe no need for this.
      this.storeCurrentThreadId();

      return this.threadID;
    }

    storeCurrentThreadId () {
        const currentThreadID = this.threadID.toString();
        localStorage.setItem('hash', currentThreadID)
    }

    async initAdvertisers (ethAddr) {
        try {
          if (!this.db) {
            throw new Error('No db')
          }
          const { collections } = this.db
          const c = collections.get('advertisers');

          if (c) {
            console.log("collection found...");
            this.Advertisers = c
            const data = await this.queryAdvertisers(ethAddr);

            if (isEmpty(data)) {
              console.log("no data for the user");
              this.advertiser = new this.Advertisers({ _id: '', ethAddr });
              await this.advertiser.save()

            } else {
              this.advertiser = new this.Advertisers(data[0].value);
            }

          } else {
            console.log("collection not found...")
            this.Advertisers = await this.db.newCollection('advertisers', AdvertiserSchema)
            this.advertiser = new this.Advertisers({ _id: '', ethAddr });
            await this.advertiser.save()
          }
          this.storeCurrentThreadId()
        } catch (error) {
          console.log(error)
        }
    }

  async updateAdvertiser (org, cateogry) {
    if (this.advertiser) {
      this.advertiser.org = org
      this.advertiser.category = cateogry
      await this.advertiser.save()

    } else {
      throw new Error('Failed to update advertiser. No advertiser instance')
    }
  }

  async initCampaigns (storageId, bucketKey) {
    if (!this.db) {
      throw new Error('No db')
    }
    const { collections } = this.db
    const c = collections.get('campaigns');
    if (c) {
      console.log("collection found...");
      this.Campaigns = c
      const data = await this.queryCampaigns(storageId);

      if (isEmpty(data)) {
        this.campaign = new this.Campaigns({ _id: '', ethAddr: this.ethAddr, storageId, bucketKey });
        await this.campaign.save()

      } else {
        this.campaign = new this.Campaigns(data[0].value);
      }

    } else {
      console.log("collection not found...")
      this.Campaigns = await this.db.newCollection('campaigns', CampaignSchema)
      this.campaign = new this.Campaigns({ _id: '', ethAddr: this.ethAddr, storageId, bucketKey });
      await this.campaign.save()
    }
    this.storeCurrentThreadId()
  }

  async updateCampaign (numClicks, numReachs) {
    if (this.campaign) {
      this.campaign.numClicks = numClicks
      this.campaign.numReachs = numReachs
      await this.campaign.save()
    } else {
      throw new Error('Failed to update campaign. No campaign instance')
    }
  }

  async initPurchases (txHash, fileUrl) {
    if (!this.db) {
      throw new Error('No db')
    }
    const { collections } = this.db
    const c = collections.get('purchases');
    if (c) {
      console.log("collection found...");
      this.Purchases = c
      const data = await this.queryPurchases(fileUrl);

      if (isEmpty(data)) {
        this.purchase = new this.Purchases({ _id: "", ethAddr: this.ethAddr, publicUrl: fileUrl, txHash })
        await this.purchase.save();

      } else {
        this.purchase = new this.Purchases(data[0].value);
      }

    } else {
      console.log("collection not found...")
      this.Purchases = await this.db.newCollection('purchases', PurchasesSchema);
      this.purchase = new this.Purchases({ _id: "", ethAddr: this.ethAddr, publicUrl: fileUrl, txHash })
      await this.purchase.save();
    }
  }

  async queryPurchases (fileUrl) {
    const query = {
      $and: [
        {publicUrl: fileUrl},
        {ethAddr: this.ethAddr}
      ]
    };
    const cursor = this.Purchases.find(query);
    return await collect(cursor);
  };

  async queryAllPurchases () {
    const { collections } = this.db;
    const c = collections.get('purchases');
    if (c) {
      console.log("collection exists");
      const query = {
        ethAddr: this.ethAddr
      };
      const cursor = c.find(query);
      return await collect(cursor);
    } else {
      console.log("no collections");
      return [];
    }
  };
  
  async queryAdvertisers (ethAddr) {
    const query = {
      ethAddr: ethAddr
    };
    const cursor = this.Advertisers.find(query);
    return await collect(cursor);
  }

  async queryCampaigns (storageId) {
    const query = {
      $and: [
        { storageId: storageId },
        { ethAddr: this.ethAddr }
      ]
    };
    const cursor = this.Campaigns.find(query);
    return await collect(cursor);
  }

  async queryAllCampaigns () {
    const { collections } = this.db;
    const c = collections.get('campaigns');

    if (c) {
      console.log("collection exists.")
      const query = {
        ethAddr: this.ethAddr
      };
      const cursor = c.find(query);
      return await collect(cursor);

    } else {
      console.log('no Campaigns collectiom');
      return [];
    }
  }
}

export default ThreadService;
