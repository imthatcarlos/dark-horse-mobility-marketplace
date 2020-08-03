import { gql } from 'apollo-boost';

/* eslint-disable import/prefer-default-export */
export const GET_MOBILITY_CAMPAIGNS = gql`
  {
    mobilityCampaigns(where:{ isActive_not: false }, orderBy: "createdAt", orderDirection: "desc") {
      id
      idx
      creator {
        owner
        totalContributedWei
      }
      title
      category
      createdAt
    }
    mobilityCampaignOwners(where:{ totalContributedWei_gt: 0}) {
      id
      owner
      campaigns {
        idx
        title
        category
      }
      totalContributedWei
    }
  }
`;

export const GET_REWARD_OWNERS = gql`
  {
    rewardOwners(where:{ enabledAt_not: 0 }, orderBy: "enabledAt", orderDirection: "desc") {
      owner
      enabledAt
      enabledAtCampaignIdx
      totalRewardsWei
      rewards {
        rewardsWei
        withdrewAt
      }
    }
  }
`;
/* eslint-enable */
