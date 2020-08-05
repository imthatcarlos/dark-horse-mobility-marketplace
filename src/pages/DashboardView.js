import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Paper,
  Typography
} from '@material-ui/core';

import Title from './../components/Title';
import Datasets from './../components/Datasets';
import MetaDataTable from './../components/MetaDataTable';
import CreateAd from './../components/CreateAd';
import { KEYS_NAMES } from './../utils/fleekStorage';

const BOGUS_VALUE = 500000000;

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

export default function DashboardView(props) {
  const classes = useStyles();
  const [content, setContent] = useState(null);
  const [adForm, setAdForm] = useState(false);
  const [usersReach, setUsersReach] = useState();
  const { web3, spaceClient, mAdsClient, threadInstance } = props;
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const handleSetContent = (c) => { setContent(c) };

  useEffect(() => {
    if (!usersReach && mAdsClient) {
      const fetchUsersReach = async () => {
        const res = await mAdsClient.getCampaignReceiversCount();
        setUsersReach(parseInt(res));
      };

      fetchUsersReach();
    }
  }, [mAdsClient]);

  const datasetContent = () => (
    <React.Fragment>
      <div style={{ textAlign: 'left' }}>
        <Title>Metadata for {KEYS_NAMES[content.key]}</Title>
        <br/>
        <Grid container spacing={2}>
          {
            <MetaDataTable
              geofence={content.key}
              threadInstance={threadInstance}
              web3={web3}
            />
          }
        </Grid>
      </div>
    </React.Fragment>
  );

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8} lg={9}>
        <Paper className={fixedHeightPaper}>
          <Datasets
            spaceClient={spaceClient}
            setContent={handleSetContent}
          />
        </Paper>
      </Grid>
      <Grid item xs={12} md={4} lg={3}>
        <Paper className={fixedHeightPaper}>
          {
            web3 && (
              <CreateAd
                web3={web3}
                spaceClient={spaceClient}
                setAdForm={setAdForm}
                mAdsClient={mAdsClient}
                usersReach={usersReach}
                threadInstance={threadInstance}

              />
            )
          }
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          {
            content && datasetContent()
          }
        </Paper>
      </Grid>
    </Grid>
  )
};
