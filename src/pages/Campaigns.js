import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Paper,
  Typography,
  Button
} from '@material-ui/core';
import { withRouter } from 'react-router';
import moment from 'moment';

import Title from './../components/Title';
import { getAdImpressions } from './../utils/fleekStorage';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 280,
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Campaigns(props) {
  const classes = useStyles();
  const { web3, spaceClient, mAdsClient } = props;
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const [activeCampaign, setActiveCampaign] = useState();
  const [activeResults, setActiveResults] = useState();

  useEffect(() => {
    if (web3 && activeCampaign === undefined) {
      const fetchCampaign = async () => setActiveCampaign(await mAdsClient.getActiveCampaign());
      fetchCampaign();
    }

    if (activeCampaign && activeResults === undefined) {
      const fetchResults = async () => {
        const impressions = await getAdImpressions({ account: web3.coinbase, key: `${activeCampaign.organization}-${activeCampaign.title}`});
        const unspent = await mAdsClient.getCampaignRefundedBudget();
        setActiveResults({
          impressions,
          unspent
        });
      }
      fetchResults();
    }
  }, [web3, activeCampaign]);

  const closeCampaign = async () => {

  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12} lg={12}>
        <Paper className={fixedHeightPaper}>
          <Title>Active Campaign</Title>
          <br />
          {
            activeCampaign && (
              <Grid container spacing={2}>
                <Grid item xs={4} md={4} lg={4}>
                  <img
                    src={activeCampaign.fileData}
                    width="150px"
                    height="150px"
                  />
                </Grid>
                <Grid item xs={4} md={4} lg={4}>
                  <p style={{ textAlign: 'left'}}>
                    <strong>Details</strong>
                  </p>
                  <p style={{ textAlign: 'left'}}>
                    {activeCampaign.title} - presented by {activeCampaign.organization}
                  </p>
                  <p style={{ textAlign: 'left'}}>
                    expires: {moment(activeCampaign.expiresAt * 1000).format()}
                  </p>
                  <p style={{ textAlign: 'left'}}>
                    total budget: {activeCampaign.budget} ETH
                  </p>
                </Grid>
                <Grid item xs={4} md={4} lg={4}>
                  <p style={{ textAlign: 'left'}}>
                    <strong>Results</strong>
                  </p>
                  {
                    activeResults && (
                      <div>
                        <p style={{ textAlign: 'left'}}>
                          impressions: {activeResults.impressions}
                        </p>
                        <p style={{ textAlign: 'left'}}>
                          unspent budget: {activeResults.unspent} ETH
                        </p>
                        <br />
                        <Button onClick={closeCampaign}>Close Campaign</Button>
                      </div>
                    )
                  }
                </Grid>
              </Grid>
            )
          }
        </Paper>
      </Grid>
    </Grid>
  )
};
