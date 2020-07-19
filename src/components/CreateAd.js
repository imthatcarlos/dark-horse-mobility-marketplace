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

const CATEGORIES = ['mobility', 'fashion', 'sports', 'coffee'];
const COUNTRIES = ['United States', 'Italy', 'France', 'Spain'];

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

export default function CreateAd(props) {
  const { web3, spaceClient } = props;

  const classes = useStyles();
  const [openModal, setOpenModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [error, setError] = useState(null);
  const [filename, setFilename] = useState(null);
  const handleClickOpen = (event) => { setAnchorEl(event.currentTarget); setOpenModal(true); };
  const handleClose = () => { setAnchorEl(null); setOpenModal(false); }
  const inputOrg = useRef();
  const inputTitle = useRef();
  const inputDescription = useRef();
  const inputFile = useRef();
  const [inputCategory, setInputCategory] = useState('');

  const createAd = async () => {
    try {
      console.log(inputFile.current.files[0].name);
      return;
      const res = await spaceClient.addItems({ slug: `${SPACE}/profile` });
      const bucket = res.getBucket();

      console.log(bucket.getName());

      setOpenModal(false);
    } catch (error) {
      console.log(error);
    }
  };

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
                    CATEGORIES.map((c) => <MenuItem value={c}>{c}</MenuItem>)
                  }
                </Select>
              </Grid>
              <br/><br/>
              <Grid item xs={6}>
                <TextField
                  error={error !== null}
                  helperText={error}
                  id="ad-title"
                  label="Campaign Title"
                  ref={inputTitle}
                  onChange={e => inputTitle.current.value = e.target.value}
                 />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  error={error !== null}
                  helperText={error}
                  id="ad-desc"
                  label="Description"
                  ref={inputDescription}
                  onChange={e => inputDescription.current.value = e.target.value}
                 />
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
      <p style={{ fontSize: '16px' }}>Show your ad post-trip. 25% of campaign budget paid towards customers engaged.</p>
      <br/>
      { createProfilePopover() }
    </React.Fragment>
  );
}
