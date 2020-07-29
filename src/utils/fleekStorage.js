import fleekStorage from '@fleekhq/fleek-storage-js';

const {
  REACT_APP_FLEEK_API_KEY,
  REACT_APP_FLEEK_API_SECRET
} = process.env;

const BUCKET = 'hackfs-dark-horse-bucket';
const DATA_DIRECTORY = 'MDS-trips';
const ADS_DIRECTORY = 'campaigns';
const ADS_RESULTS_DIRECTORY = 'campaigns-results';

const ICONS_KEYS = {
  'santa-barbara': 'media/datasets/santa-monica.png',
  'milan': 'media/datasets/milan.png'
};

export const KEYS_NAMES = {
  milan: 'Milano, Italy',
  "santa-barbara": 'Santa Barbara, LA'
};

const files = (opt = ['key']) => fleekStorage.listFiles({
  apiKey: REACT_APP_FLEEK_API_KEY,
  apiSecret: REACT_APP_FLEEK_API_SECRET,
  bucket: BUCKET,
  getOptions: opt
});

export const listFiles = async () => {
  const datasets = (await files()).filter((f) => f.key.startsWith(DATA_DIRECTORY) && !f.key.includes('.keep'));
  const keys = datasets.map((f) => f.key);

  // MDS-trips/{geofence}/{yyyy-mm}
  return keys.reduce((agg, curr) => {
    const opts = curr.split('/');
    if (agg[opts[1]]) {
      agg[opts[1]][opts[2]] = agg[opts[1]][opts[2]] !== undefined ? agg[opts[1]][opts[2]] + 1 : 1;
    } else {
      agg[opts[1]] = {};
      agg[opts[1]][opts[2]] = 1;
    }

    return agg;
  }, {});
};

export const getMedia = (keys) => Promise.all(keys.map((k) => new Promise(async (resolve, reject) => {
  const data = await fleekStorage.get({
    apiKey: REACT_APP_FLEEK_API_KEY,
    apiSecret: REACT_APP_FLEEK_API_SECRET,
    key: ICONS_KEYS[k],
    bucket: BUCKET,
    getOptions: ['data'],
  });

  resolve({
    data,
    key: k
  });
})));

export const uploadAd = async ({ account, key, data }) => {
  try {
    const res = await fleekStorage.upload({
      apiKey: REACT_APP_FLEEK_API_KEY,
      apiSecret: REACT_APP_FLEEK_API_SECRET,
      key: `${ADS_DIRECTORY}/${account}/${key}/asset`,
      bucket: BUCKET,
      data
    });

    console.log(`ad asset key: ${`${ADS_DIRECTORY}/${account}/${key}/asset`}`);

    return res.hash;
  } catch (error) {
    return null;
  }
};

export const getAdImpressions = async ({ account, key }) => {
  try {
    const ads = (await files())
      .filter((f) => f.key.startsWith(`${ADS_DIRECTORY}/${account}/${key}/results`) && !f.key.includes('.keep'))
      .map((f) => f.key);

    return ads.length
  } catch (error) {
    return null;
  }
};

export const getAdResults = async ({ account, key }) => {
  try {
    const ads = (await files('hash'))
      .filter((f) => f.key.startsWith(`${ADS_DIRECTORY}/${account}/${key}/results`) && !f.key.includes('.keep'))
      .map((f) => f.key);

    const data = await Promise.all(ads.map(async (h) => JSON.parse(await fleekStorage.getFileFromHash({ hash: h }))));
    return {
      impressions: ads.length,
      clicks: data.filter((d) => d.clickedAd),
      data
    };
  } catch (error) {
    return null;
  }
};
