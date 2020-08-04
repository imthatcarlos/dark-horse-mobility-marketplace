import React from 'react';
import { inflate } from 'pako';
import { uniqBy } from 'lodash';
import { getTripContent, listTrips } from './../utils/fleekStorage';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';


const computeMeta = async (fileKey) => {
  const content = await getTripContent(fileKey);
  
  var result = inflate(content.data, { to: 'text' });
  var string = new TextDecoder("utf-8").decode(result);
  var json = JSON.parse(string);
  const tripsArray = json.data

  const numTrips = tripsArray.length
  var totalDist = 0;
  var totalDuration = 0;
  for (let i = 0; i < tripsArray.length; i++) {
    totalDist += parseFloat(tripsArray[i].trip_distance);
    totalDuration += parseFloat(tripsArray[i].trip_duration);
  }
  const uniqueUsers = uniqBy(tripsArray, (obj) => obj.user_id)

  const res = {
    "numTrips": numTrips,
    "totalDistance": Math.round(totalDist),
    "totalDuration": Math.round(totalDuration),
    "numUsers": uniqueUsers.length,
    "url": content.publicUrl
  };
  return res;
}


const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});


const handleClick = async (publicUrl, threadInstance) => {
  // Call function to handle the transaction 
  const txHash="egereoerjnejnoe";
  await threadInstance.initPurchases(txHash, publicUrl);
};

function Row(props) {
  const { row, threadInstance } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">{row.geofence}</TableCell>
        <TableCell align="right">{row.year}</TableCell>
        <TableCell align="right">{row.month}</TableCell>
        <TableCell align="right">{row.day}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                <Button onClick={async () => await handleClick(row.meta.url, threadInstance)}>
                  Purchase
                  </Button>
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Num. Trips</TableCell>
                    <TableCell>Num. Users</TableCell>
                    <TableCell align="right">Total Distance Traveled</TableCell>
                    <TableCell align="right">Total Duration Traveled</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={0}>
                    <TableCell component="th" scope="row">{row.meta.numTrips}</TableCell>
                    <TableCell>{row.meta.numUsers}</TableCell>
                    <TableCell align="right">{row.meta.totalDistance}</TableCell>
                    <TableCell align="right">{row.meta.totalDuration}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const handleTrips = async (geofence) => {
  const trips = await listTrips(geofence);
  const result = await Promise.all(trips.map(async(row) => {
    row.meta = await computeMeta(`MDS-trips/${row.geofence}/${row.year}-${row.month}/${row.day}.json.gz`)
    return row;
  }));
  return result;
};

export default function MetaDataTable(props) {
  const { geofence, threadInstance } = props;
  const [tripsData, setTripsData] = React.useState();

  React.useEffect(() => {
    const fetchTrips = async () => {
      setTripsData(await handleTrips(geofence))
    };
    fetchTrips();
  }, [geofence]);

  if (tripsData === undefined) {
    return null;
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>City</TableCell>
            <TableCell align="right">Year</TableCell>
            <TableCell align="right">Month</TableCell>
            <TableCell align="right">Day</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tripsData.map((row, idx) => (
            <Row 
            key={idx} 
            row={row} 
            threadInstance={threadInstance}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
