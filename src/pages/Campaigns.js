import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Paper,
  Typography
} from '@material-ui/core';
import { withRouter } from 'react-router';

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
    height: 250,
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
      const fetchResults = async () => (
        setActiveResults(await getAdImpressions({ account: web3.coinbase, key: `${activeCampaign.organization}-${activeCampaign.title}`}))
      )
      fetchResults();
    }
  }, [web3, activeCampaign]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12} lg={12}>
        <Paper className={fixedHeightPaper}>
          <Title>Active Campaign</Title>
          {
            activeCampaign && (
              <Grid container spacing={2}>
                <Grid item xs={6} md={6} lg={6}>
                  <img
                    src={activeCampaign.fileData}
                    width="150px"
                    height="150px"
                  />
                </Grid>
                <Grid item xs={6} md={6} lg={6}>
                  <p style={{ textAlign: 'left'}}>
                    {activeCampaign.title} - presented by {activeCampaign.organization}
                  </p>
                  <br/>
                  <p style={{ textAlign: 'left'}}>
                    impressions: {activeResults}
                  </p>
                </Grid>
              </Grid>
            )
          }
        </Paper>
      </Grid>
    </Grid>
  )
};
