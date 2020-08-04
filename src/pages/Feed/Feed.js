import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Paper,
  Typography
} from '@material-ui/core';
import moment from 'moment';
import { concat, flatten } from 'lodash/array';
import { orderBy } from 'lodash/collection';

import Title from './../../components/Title';
import { useFeedCampaignsReq, useFeedRewardsReq } from './FeedReq';
import { shortAddress } from './../../utils/getWeb3';

const useStyles = makeStyles((theme) => ({
  feed: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  feedItem: {
    marginTop: '15px',
    width: '75%',
    padding: theme.spacing(3),
    textAlign: 'left'
  },
  feedItemMaster: {
    marginTop: '15px',
    marginBottom: '15px',
    width: '75%',
    padding: theme.spacing(2),
    textAlign: 'center'
  },
  buttons: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  }
}));

function FeedItem(props) {
  const classes = useStyles();
  const { data } = props;
  const [elevation, setElevation] = useState(2);

  return (
    <Paper
      className={classes.feedItem}
      elevation={elevation}
      onMouseOver={() => setElevation(6)}
      onMouseOut={() => setElevation(2)}
      >
      <Title>{ data.text }</Title>
      <div style={{ textAlign: 'right', right: 0, lineHeight: 0 }}>{data.ts}</div>
    </Paper>
  );
}

export default function Campaigns(props) {
  const classes = useStyles();
  const { web3 } = props;
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const [graphData, setGraphData] = useState();

  const campaigns = useFeedCampaignsReq();
  const users = useFeedRewardsReq();

  const getEth = (wei) => web3.utils.fromWei(wei.toString(), 'ether');
  const timeDiff = (ts) => moment.duration(moment.utc().diff(moment.utc(ts * 1000))).humanize();

  const getItem = ({ type, data }) => {
    if (type === 'campaign') {
      return {
        text: `[${shortAddress(data.creator.owner)}] created campaign '${data.title}' for ${getEth(data.budgetWei)} ETH 🔥`,
        ts: `${timeDiff(data.createdAt)} ago`
      };
    }

    if (type === 'user') {
      return {
        text: `[${shortAddress(data.account)}] joined ad rewards 🚀`,
        ts: `${timeDiff(data.enabledAt)} ago`
      };
    }

    return {
      text: `[${shortAddress(data.account)}] received ${getEth(data.rewardsWei)} ETH in rewards 💸`,
      ts: `${timeDiff(data.withdrewAt)} ago`
    };
  }

  useEffect(() => {
    if (campaigns && users) {
      const all = concat(campaigns.mobilityCampaigns, users).map((d) => {
        if (d.creator) {
          return { type: 'campaign', ts: d.createdAt, ...d };
        }

        // user + rewards
        if (d.rewards) {
          return concat({ type: 'user', ts: d.enabledAt, ...d }, d.rewards.map((r) => ({
            type: 'reward', ts: d.withdrewAt, ...r, account: d.account
          })));
        }

        return { type: 'user', ts: d.enabledAt, ...d };
      });

      setGraphData(orderBy(flatten(all), ['ts'], ['desc']));
    }
  }, [campaigns, users]);

  return (
    <Grid container spacing={3}>
      {
        graphData && (
          <div className={classes.feed}>
            <Paper
              className={classes.feedItemMaster}
              elevation={3}
              >
              <Title>{`Advertisers: ${campaigns.mobilityCampaignOwners.length}`} | {`Campaigns: ${campaigns.mobilityCampaigns.length}`} | {`Users: ${users.length}`}</Title>
            </Paper>
            {
              graphData.map((data, idx) => (
                <FeedItem key={`c-item-${idx}`} data={getItem({ type: data.type, data })} />
              ))
            }
          </div>
        )
      }
    </Grid>
  );
};
