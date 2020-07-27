import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import DashboardIcon from '@material-ui/icons/Dashboard';
import MobileScreenShareIcon from '@material-ui/icons/MobileScreenShare';
import LayersIcon from '@material-ui/icons/Layers';
import { Link } from "react-router-dom";

const Links = (
  <div>
    <ListItem button>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <Typography component="h1" variant="h6" color="inherit" noWrap>
        <Link style={{ color: 'white', textDecoration: 'none' }} to="/"><ListItemText primary="Dashboard" /></Link>
      </Typography>
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <MobileScreenShareIcon />
      </ListItemIcon>
      <Typography component="h1" variant="h6" color="inherit" noWrap>
        <Link style={{ color: 'white', textDecoration: 'none' }} to="/campaigns"><ListItemText primary="Campaigns" /></Link>
      </Typography>
    </ListItem>
  </div>
);

export default Links;
