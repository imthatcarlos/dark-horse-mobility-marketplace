import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Paper,
  Typography
} from '@material-ui/core';
import moment from 'moment';

import Title from './../../components/Title';
import { useFeedCampaignsReq } from './FeedReq';
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
    </Paper>
  );
}

export default function Campaigns(props) {
  const classes = useStyles();
  const { web3 } = props;
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const campaigns = useFeedCampaignsReq();

  // const getEth = (wei) => web3.utils.fromWei(wei.toString(), 'ether');
  const getEth = (wei) => 0.25;

  const getItem = ({ type, data }) => {
    if (type === 'campaign') {
      return {
        text: `[${shortAddress(data.creator.owner)}] created campaign ${data.title} for ${getEth(data.budgetWei)} ETH`
      };
    }
  }

  useEffect(() => {
    if (campaigns) {
      console.log(campaigns);
    }
  }, [campaigns]);

  return (
    <Grid container spacing={3}>
      {
        campaigns && (
          <div className={classes.feed}>
            <Paper
              className={classes.feedItemMaster}
              elevation={3}
              >
              <Title>{`Campaigns: ${campaigns.length}`} | {`Users: ${0}`}</Title>
            </Paper>
            <FeedItem data={{ text: '[0x2F56...] received 0.2 ETH in rewards' }} />
            <FeedItem data={{ text: '[0x12F5...] just signed up! ' }} />
            {
              campaigns.map((data, idx) => (
                <FeedItem key={`c-item-${idx}`} data={getItem({ type: 'campaign', data })} />
              ))
            }
          </div>
        )
      }
    </Grid>
  );
};
