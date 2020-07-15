import React, { useState, useEffect, useRef } from 'react';
import {
  Grid,
  Button,
  CircularProgress,
  Avatar,
  IconButton,
  Badge,
  Popover,
  TextField,
  Paper,
  Typography,
  InputLabel,
  Select,
  MenuItem
} from '@material-ui/core';
import PeopleIcon from '@material-ui/icons/People';
import Cookies from 'js-cookie';
import { isEmpty } from 'lodash/lang';
import { find } from 'lodash/collection';

import Title from './Title';

const SPACE = 'mobility-marketplace';
const CATEGORIES = ['mobility', 'fashion', 'sports', 'coffee'];
const COUNTRIES = ['United States', 'Italy', 'France', 'Spain'];

export default function Auth(props) {
  const { web3, spaceClient } = props;
  const [openModal, setOpenModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClickOpen = (event) => { setAnchorEl(event.currentTarget); setOpenModal(true); };
  const handleClose = () => { setAnchorEl(null); setOpenModal(false); }
  const [identity, setIdentity] = useState(null);
  const [newUser, setNewUser] = useState(null);
  const [buckets, setBuckets] = useState(null);
  const [error, setError] = useState(null);
  const inputUsername = useRef();
  const inputOrg = useRef();
  const [inputCategory, setInputCategory] = useState('');

  const getIdentity = async () => {
    const _username = Cookies.get(`${SPACE}-username`);
    if (!_username) {
      setNewUser(true);
    } else {
      try {
        const res = await spaceClient.getIdentityByUsername({ username: _username });
        console.log(res.getIdentity());
        setIdentity(res.getIdentity());
      } catch (error) {
        setError('username does not exist');
      }
    }
  };

  const getBuckets = async () => {
    const res = await spaceClient.listBuckets();
    const buckets = res.getBucketsList();
    console.log(buckets);

    setBuckets(buckets);
    // have they initialized a private identity?
    setNewUser(!find(buckets, (b) => b.getName() === `${SPACE}/profile`));
  }

  useEffect(() => {
    // init
    // if (identity === null) {
    //   getIdentity();
    // } else {
    //   getBuckets();
    // }
  }, [newUser, error, identity]);

  const auth = async () => {
    const username = inputUsername.current.value;
    setError(null);

    try {
      const res = await spaceClient.getIdentityByUsername({ username });
      Cookies.set(`${SPACE}-username`, username);
      setIdentity(res.getIdentity());
    } catch (error) {
      try {
        await spaceClient.createUsernameAndEmail({ username });
        console.log('username created!');
        Cookies.set(`${SPACE}-username`, username);
      } catch (error) {
        setError('wrong username');
      }
    }
  };

  const createProfile = async () => {
    try {
      const res = await spaceClient.createBucket({ slug: `${SPACE}/profile` });
      const bucket = res.getBucket();

      console.log(bucket.getName());

      setBuckets([bucket]);
    } catch (error) {
      console.log(error);
    }
  };

  const popover = () => {
    return (
      <div>
        <Button aria-describedby="auth-popover" onClick={handleClickOpen}>Auth</Button>
        <Popover
          id={'auth-popover'}
          open={openModal}
          anchorEl={anchorEl}
          onClose={handleClose}
          className="popover"
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Paper style={{ padding: 20, width: 300, height: 150 }}>
            <Grid
              spacing={2}
              container
              align="center"
            >
              <Grid item xs={12} >
                <Title>Login</Title>
              </Grid>
              <Grid item xs={8}>
                 <TextField
                   error={error !== null}
                   helperText={error}
                   id="auth-username"
                   label="Username"
                   ref={inputUsername}
                   onChange={e => inputUsername.current.value = e.target.value}
                  />
              </Grid>
              <Grid item xs={4}>
                 <Button onClick={auth} style={{ marginTop: 10 }}>Go</Button>
              </Grid>
            </Grid>
          </Paper>
        </Popover>
      </div>
    )
  };

  const createProfilePopover = () => {
    return (
      <div>
        <Button aria-describedby="profile-popover" onClick={handleClickOpen}>{identity ? identity.array[2] : null}</Button>
        <Popover
          id={'profile-popover'}
          open={openModal}
          anchorEl={anchorEl}
          onClose={handleClose}
          className="popover"
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Paper style={{ padding: 20, width: 400, height: 200 }}>
            <Grid
              spacing={1}
              container
              align="center"
            >
              <Grid item xs={12} >
                <Title>Advertiser Profile</Title>
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
                   style={{ minWidth: 140 }}
                >
                  {
                    CATEGORIES.map((c) => <MenuItem value={c}>{c}</MenuItem>)
                  }
                </Select>
              </Grid>
              <Grid item xs={8} />
              <Grid item xs={4}>
                 <Button onClick={createProfile} style={{ marginTop: 10 }}>Create</Button>
              </Grid>
            </Grid>
          </Paper>
        </Popover>
      </div>
    )
  };

  const showBadgeNotif = (
    (isEmpty(identity) && newUser)
      || (identity && newUser)
  );

  return (
    <Badge color="secondary" badgeContent={showBadgeNotif ? 1 : 0}>
      <PeopleIcon style={{ marginTop: 5 }}/>

      <div style={{
        alignItems: 'center',
      }}>
        {
          isEmpty(identity) && newUser === true
            ? popover()
            : null
        }
        {
          identity && newUser === true
            ? createProfilePopover()
            : null
        }
      </div>
    </Badge>
  );
}
