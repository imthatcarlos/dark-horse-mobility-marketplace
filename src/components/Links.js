import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import DashboardIcon from '@material-ui/icons/Dashboard';
import StorageIcon from '@material-ui/icons/Storage';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import DynamicFeedIcon from '@material-ui/icons/DynamicFeed';
import LayersIcon from '@material-ui/icons/Layers';
import { Link } from "react-router-dom";

function ListItemLink(props) {
  const { icon, primary, to } = props;

  const CustomLink = React.useMemo(
    () =>
      React.forwardRef((linkProps, ref) => (
        <Link style={{ color: 'white', textDecoration: 'none' }} ref={ref} to={to} {...linkProps} />
      )),
    [to],
  );

  return (
    <ListItem button component={CustomLink}>
      <ListItemIcon>{icon}</ListItemIcon>
      <Typography component="h1" variant="h6" color="inherit" noWrap>
        <ListItemText primary={primary} />
      </Typography>
    </ListItem>
  );
}

const Links = (
  <div>
    <ListItemLink icon={<DashboardIcon />} to="/" primary="Dashboard" />
    <br />
    <ListItemLink icon={<LocalAtmIcon />} to="/campaigns" primary="Campaigns" />
    <br />
    <ListItemLink icon={<DynamicFeedIcon />} to="/feed" primary="Feed" />
    <br />
    <ListItemLink icon={<StorageIcon />} to="/datasets" primary="Datasets" />
  </div>
);

export default Links;
