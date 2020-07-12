import React, { useState, useEffect } from 'react';
import {
  Grid,
  Button,
  CircularProgress,
  Avatar,
  IconButton,
  DialogTitle,
  Dialog
} from '@material-ui/core';

import { isEmpty } from 'lodash/lang';

const SPACE = 'hackfs-dark-horse';

function SimpleDialog(props) {
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
      top={25}
      right={25}
    >
      <DialogTitle id="simple-dialog-title">Edit Profile</DialogTitle>
    </Dialog>
  );
}

export default function Auth(props) {
  const { web3 } = props;
  const [openModal, setOpenModal] = useState(false);
  const handleClickOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false)
  const [profile, setProfile] = useState(null);
  const [newUser, setNewUser] = useState(null);

  useEffect(() => {
    // init
    if (profile === null) {
      console.log('authorizing...');
    }

    if (newUser === true) {
      console.log('showing create profile view')
    } else if (newUser === false) {
      console.log('showing public profile')
    }
  }, [newUser]);

  const createProfile = () => {
    return (
      <Grid
        spacing={3}
        container
        justify="flex-start"
        align="center"
      >
        <Grid item xs={12}>
          <Button onClick={handleClickOpen}>Create Profile</Button>
          <SimpleDialog open={openModal} onClose={handleClose}/>
        </Grid>
      </Grid>
    )
  };

  return (
    <div style={{
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {
        (profile === null && newUser === null) &&
          null
      }

      {
        isEmpty(profile) && newUser === true
          ? createProfile()
          : null
      }
    </div>
  );
}
