import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  Grid,
  Button
} from '@material-ui/core';
import Title from './Title';
import { listFiles, getMedia, KEYS_NAMES } from '../utils/fleekStorage';
import { bufferToImage } from '../utils/images';

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

export default function Deposits(props) {
  const classes = useStyles();
  const [buckets, setBuckets] = useState(null);
  const [icons, setIcons] = useState(null);

  const { setContent } = props;

  const getBuckets = async () => {
    try {
      const res = await listFiles();
      console.log(res);
      setBuckets(res);

      const _icons = await getMedia(Object.keys(res));
      setIcons(_icons.reduce((agg, current) => { agg[current.key] = current.data; return agg; }, {}));
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    // init
    if (buckets === null) {
      getBuckets();
    }
  }, [buckets]);

  return (
    <React.Fragment>
      <Title>Datasets</Title>
      <br/>
      {
        buckets && icons && (
          <Grid container spacing={2}>
            {
              Object.keys(buckets).map((key) => (
                <Grid item xs={6} md={4} lg={4} key={key}>
                  <div>
                    <img
                      src={bufferToImage(icons[key].data)}
                      width="80px"
                      height="80px"
                    />
                    <br/>
                    <Typography component="p" variant="h6">
                      <Button onClick={() => setContent({ key, meta: buckets[key]})}>
                        { KEYS_NAMES[key] }
                      </Button>
                    </Typography>
                  </div>
                </Grid>
              ))
            }
          </Grid>
        )
      }
    </React.Fragment>
  );
}
