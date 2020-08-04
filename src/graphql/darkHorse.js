import { gql } from 'apollo-boost';

/* eslint-disable import/prefer-default-export */
export const GET_MOBILITY_CAMPAIGNS = gql`
  {
    mobilityCampaigns(where:{ isActive_not: false }, orderBy: "createdAt", orderDirection: "desc", first: 10) {
      id
      idx
      creator {
        owner
        totalContributedWei
      }
      title
      category
      createdAt
      budgetWei
    }
    mobilityCampaignOwners(where:{ totalContributedWei_gt: 0}, first: 10) {
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
    rewardOwners(where:{ enabledAt_not: 0 }, orderBy: "enabledAt", orderDirection: "desc", first: 10) {
      account
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
