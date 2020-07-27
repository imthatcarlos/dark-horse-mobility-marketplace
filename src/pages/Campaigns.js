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

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
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

  useEffect(() => {
    if (web3 && activeCampaign === undefined) {
      const fetchCampaign = async () => {
        setActiveCampaign(await mAdsClient.getActiveCampaign());
      };

      fetchCampaign();
    }
  }, [web3]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12} lg={12}>
        <Paper className={fixedHeightPaper}>
          <Title>Active Campaign</Title>
          {
            activeCampaign && (
              <div>
                {activeCampaign.title} - presented by {activeCampaign.organization}
              </div>
            )
          }
        </Paper>
      </Grid>
    </Grid>
  )
};
