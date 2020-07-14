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
  Typography
} from '@material-ui/core';
import PeopleIcon from '@material-ui/icons/People';
import Cookies from 'js-cookie';
import { isEmpty } from 'lodash/lang';

const SPACE = 'mobility-marketplace';

export default function Auth(props) {
  const { web3, spaceClient } = props;
  const [openModal, setOpenModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClickOpen = (event) => { setAnchorEl(event.currentTarget); setOpenModal(true); };
  const handleClose = () => { setAnchorEl(null); setOpenModal(false); }
  const [profile, setProfile] = useState(null);
  const [newUser, setNewUser] = useState(null);
  const [error, setError] = useState(null);
  const inputUsername = useRef();

  const getIdentity = async () => {
    const _username = Cookies.get(`${SPACE}-username`);
    if (!_username) {
      setNewUser(true);
    } else {
      try {
        const res = await spaceClient.getIdentityByUsername({ username: _username });
        console.log(res.getIdentity());
        setProfile(res.getIdentity());
      } catch (error) {
        setError('username not exist');
      }
    }
  };

  useEffect(() => {
    // init
    if (profile === null) {
      getIdentity();
    }
  }, [newUser, error]);

  const auth = async () => {
    const username = inputUsername.current.value;
    setError(null);

    try {
      const res = await spaceClient.getIdentityByUsername({ username });
      Cookies.set(`${SPACE}-username`, username);
      setProfile(res.getIdentity());
    } catch (error) {
      try {
        await spaceClient.createUsernameAndEmail({ username });
        console.log('username created!')
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
                Login to {SPACE}
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

  return (
    <Badge color="secondary" >
      <PeopleIcon style={{ marginTop: 5 }}/>

      <div style={{
        alignItems: 'center',
      }}>
        {
          isEmpty(profile) && newUser === true
            ? popover()
            : <div style={{ marginTop: 8, marginLeft: 10 }}>{profile ? profile.array[2] : null}</div>
        }
      </div>
    </Badge>
  );
}
