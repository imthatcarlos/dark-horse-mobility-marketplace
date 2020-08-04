import { useQuery } from '@apollo/react-hooks';

import { GET_MOBILITY_CAMPAIGNS, GET_REWARD_OWNERS } from './../../graphql/darkHorse';

export function useFeedCampaignsReq() {
  const { loading, error, data } = useQuery(GET_MOBILITY_CAMPAIGNS, {});

  if (loading) return null;
  if (error) {
    console.log(error); // eslint-disable-line
    return null;
  }

  return data;
}

export function useFeedRewardsReq() {
  const { loading, error, data } = useQuery(GET_REWARD_OWNERS, {});

  if (loading) return null;
  if (error) {
    console.log(error); // eslint-disable-line
    return null;
  }

  return data.rewardOwners;
}
