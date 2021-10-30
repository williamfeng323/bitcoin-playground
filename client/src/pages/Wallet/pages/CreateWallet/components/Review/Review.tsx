import { Button, Card, CardActions, CardContent, CardHeader, Chip, createStyles, Theme, Typography, WithStyles, withStyles } from "@material-ui/core"
import React from "react";
import * as _ from 'lodash';
import { MnemonicContext } from "../../CreateWallet";

const reviewStyle = (theme:Theme) => {
  return createStyles({
    root: {
      margin: '10px 0 10px 0'
    },
    card: {
      maxWidth: '80%',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginBottom: '10px',
    },
    chip: {
      margin: theme.spacing(),
    },
    wrapText: {
      overflowWrap: 'anywhere',
    }
  })
};

interface Props extends WithStyles<typeof reviewStyle> {}

const Review = withStyles(reviewStyle)(({classes}: Props) => {
  const {mnemonic} = React.useContext(MnemonicContext);
  const wordList = mnemonic.sentence.split(' ');
  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardHeader title="Mnemonic Sentence"/>
        <CardContent>
          {_.isEmpty(mnemonic.sentence) ? <Typography>No Mnemonic sentence</Typography> : wordList.map((word, ind) => {
            return React.cloneElement(
              <Chip label={word} className={classes.chip}/>,
              {key: ind},
            )
          })}
        </CardContent>
        <CardActions>
          <Button size="medium" color="primary" onClick={() => {navigator.clipboard.writeText(mnemonic.sentence)}}>
            Copy to clipboard
          </Button>
        </CardActions>
      </Card>
      <Card className={classes.card}>
        <CardHeader title="Mnemonic Seed"/>
        <CardContent>
        {_.isEmpty(mnemonic.seed) ? <Typography>No Mnemonic Seed</Typography> : 
          <Typography className={classes.wrapText}>{mnemonic.seed}</Typography>}
        </CardContent>
        <CardActions>
          <Button size="medium" color="primary" onClick={() => {navigator.clipboard.writeText(mnemonic.seed)}}>
            Copy to clipboard
          </Button>
        </CardActions>
      </Card>
    </div>
  )
})

export { Review }
