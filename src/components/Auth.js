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
import { SPACE } from './../utils/spaceDaemon';
import { shortAddress } from './../utils/getWeb3';

export default function Auth(props) {
  const {
    web3,
    spaceClient,
    onSetCampaigns,
    threadInstance
  } = props;
  const [openModal, setOpenModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClickOpen = (event) => { setAnchorEl(event.currentTarget); setOpenModal(true); };
  const handleClose = () => { setAnchorEl(null); setOpenModal(false); }
  const [identity, setIdentity] = useState(null);
  const [newUser, setNewUser] = useState(null);
  const [error, setError] = useState(null);
  const inputUsername = useRef();

  const getIdentity = async () => {
    // maybe something with thread?
    const b = await web3.eth.getBalance(web3.coinbase);
    setIdentity({
      username: shortAddress(web3.coinbase),
      balance: Number(parseFloat(web3.utils.fromWei(b, 'ether')).toFixed(2))
    });
  }

  // query for all
  const getCampaigsThread = async() => {
    const res = await threadInstance.queryAllCampaigns();
    console.log(res);
    onSetCampaigns(res);
  }

  useEffect(() => {
    // init
    if (identity === null) {
      getIdentity();
    } else {
      getCampaigsThread();
    }
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

  const showBadgeNotif = (
    isEmpty(identity) && newUser
  );

  return (
    <Badge color="secondary" badgeContent={showBadgeNotif ? 1 : 0}>
      <PeopleIcon style={{ marginTop: 5, marginRight: 10 }}/>

      <div style={{
        alignItems: 'center',
      }}>
        {
          isEmpty(identity) && newUser === true
            ? popover()
            : <Title> { (identity ? `${identity.username} | ${identity.balance} ETH` : null) } </Title>
        }
      </div>
    </Badge>
  );
}
