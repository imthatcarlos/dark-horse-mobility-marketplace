import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  Grid,
  Button,
  Popover,
  TextField,
  Paper,
  InputLabel,
  Select,
  MenuItem,
  Tooltip
} from '@material-ui/core';
import Title from './Title';

import { SPACE } from './../utils/spaceDaemon';
import { uploadAd } from './../utils/fleekStorage';

const CATEGORIES = ['mobility', 'fashion', 'sports', 'coffee'];
const COUNTRIES = ['United States', 'Italy', 'France', 'Spain'];

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

export default function CreateAd(props) {
  const { web3, spaceClient, mAdsClient, usersReach } = props;

  const classes = useStyles();
  const [openModal, setOpenModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [error, setError] = useState(null);
  const [filename, setFilename] = useState(null);
  const handleClickOpen = (event) => { setAnchorEl(event.currentTarget); setOpenModal(true); };
  const handleClose = () => { setAnchorEl(null); setOpenModal(false); }
  const inputOrg = useRef();
  const inputTitle = useRef();
  const inputFile = useRef();
  const [inputCategory, setInputCategory] = useState('');
  const [inputBudget, setInputBudget] = useState('');

  // NO LONGER USING SPACE DAEMON TO UPLOAD ASSETS
  const createAd = () => new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.addEventListener('load', async (event) => {
        try {
          const key = `${inputOrg.current.value}-${inputTitle.current.value}`;
          const ipfsHash = await uploadAd({
            account: web3.coinbase,
            data: event.target.result,
            key
          });

          await mAdsClient.createCampaign(
            inputOrg.current.value,
            inputCategory,
            inputTitle.current.value,
            ipfsHash,
            `${web3.coinbase}/${key}`,
            parseFloat(inputBudget)
          );

          // @TODO: store in advertiser thread Campaigns
          const id = await mAdsClient.getActiveCampaignId();
          console.log(`campaign storage array id: ${id}`);

          setOpenModal(false);

          resolve();
        } catch (error) {
          console.log(error);
          reject();
        }
      });
      reader.readAsDataURL(inputFile.current.files[0]);
    } catch (error) {
      console.log(error);
      reject();
    }
  });

  const createProfilePopover = () => {
    return (
      <div>
        <Button aria-describedby="profile-popover" onClick={handleClickOpen}>Create Campaign</Button>
        <Popover
          id={'profile-popover'}
          open={openModal}
          anchorEl={anchorEl}
          onClose={handleClose}
          className="popover"
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Paper style={{ padding: 20, width: 400, height: 400 }}>
            <Grid
              spacing={4}
              container
            >
              <Grid item xs={12} >
                <Title>Create Campaign</Title>
              </Grid>
              <Grid item xs={6}>
                 <TextField
                   error={error !== null}
                   helperText={error}
                   id="profile-org"
                   label="Organization"
                   ref={inputOrg}
                   onChange={e => inputOrg.current.value = e.target.value}
                  />
              </Grid>
              <Grid item xs={6}>
                <InputLabel id="profile-category">Category</InputLabel>
                <Select
                   labelId="profile-category"
                   id="profile-category-input"
                   value={inputCategory}
                   onChange={e => setInputCategory(e.target.value)}
                   style={{ minWidth: 160 }}
                >
                  {
                    CATEGORIES.map((c) => <MenuItem value={c} key={c}>{c}</MenuItem>)
                  }
                </Select>
              </Grid>
              <br/><br/>
              <Grid item xs={4}>
                <TextField
                  error={error !== null}
                  helperText={error}
                  id="ad-title"
                  label="Ad Title"
                  ref={inputTitle}
                  onChange={e => inputTitle.current.value = e.target.value}
                 />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  error={error !== null}
                  type="number"
                  helperText={error}
                  id="ad-budget"
                  label="ETH Budget"
                  value={inputBudget}
                  onChange={e => setInputBudget(e.target.value)}
                 />
              </Grid>
              <Grid item xs={4}>
                {
                  inputBudget && (
                    <div>
                      reach {parseInt(inputBudget / 0.05)} users ({usersReach} available)
                    </div>
                  )
                }
              </Grid>
              <Grid item xs={6}>
                <input
                  accept="image/*,video/*"
                  className={classes.input}
                  style={{ display: 'none' }}
                  id="raised-button-file"
                  type="file"
                  ref={inputFile}
                  onChange={e => setFilename(inputFile.current.files[0].name)}
                  />
                <label htmlFor="raised-button-file">
                  <Button component="span" className={classes.button}>
                    Upload Asset
                  </Button>
                </label>
              </Grid>
              <Grid item xs={6}>
                { filename }
              </Grid>
              <Grid item xs={8} />
              <Grid item xs={4}>
                 <Button onClick={createAd} style={{ marginTop: 10 }}>Create</Button>
              </Grid>
            </Grid>
          </Paper>
        </Popover>
      </div>
    )
  };

  return (
    <React.Fragment>
      <Title>Advertise</Title>
      <br/>
      <p style={{ fontSize: '16px' }}>Create an ad to show post-trip. Pay more ETH for more reach</p>
      <br/>
      { createProfilePopover() }
    </React.Fragment>
  );
}
