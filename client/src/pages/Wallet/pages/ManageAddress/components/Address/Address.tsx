import React, { useEffect, useState } from "react";
import { createStyles, FormControl, FormHelperText, FormLabel, Grid, Input, InputLabel, MenuItem, Select, Theme, Typography } from "@material-ui/core";
import { withStyles, WithStyles } from "@material-ui/styles";
import * as axios from 'axios';
import * as _ from 'lodash';
import classNames from 'classnames';
import { WalletInterface } from "../../../../../../App";
import { requestClient } from "../../../../../../libs/request";
import { AddressTable } from "./AddressTable";

const MaxInt32 = 2147483648;

const useStyle = (theme: Theme) => {
  return createStyles({
    gridContainer: {textAlign:"left", marginLeft:"7%", marginTop:"2%", marginRight:"7%", width:"80%"},
    wrapText:{overflowWrap: "anywhere"},
    formControl: {marginTop: "10px"},
    fullWidth: {width: "100%"}
  })
}

const isDerivationPathValid = (path: string) => {
  const reg = /(^m[\/0-9]*\d$|^m\/$|^m$)/g;
  if (!reg.test(path)) {
    return false;
  }
  const depths = path.split("/");
  for (let i = 1; i<depths.length; i++) {
    if (_.isEmpty(depths[i])) {
      continue;
    }
    if (parseInt(depths[i]) > MaxInt32) {
      return false;
    }
  }
  return true;
}

interface Props extends WithStyles<typeof useStyle> {
  wallet: WalletInterface
}

type NetType = "mainnet" |"testnet3";

type NetsMap = {
  [index in NetType]: string;
};

const Address = withStyles(useStyle)(({classes, wallet}: Props) => {

  const [rootKey, setRootKey] = useState("");
  const [currentNet, setCurrentNet] = useState("");
  const [nets, setNets] = useState<NetsMap>({} as unknown as NetsMap);

  const [derivationPath, setDerivationPath] = useState<{path: string, helpText: string}>({path:"", helpText:""});
  const [isValidDerivationPath, setIsValidDerivationPath] = useState(true);

  const handleNetChange = async (net: NetType) => {
    setCurrentNet(net)
    setRootKey(nets[net]);
  }
  const fetchRootKeys = async (seed:string) => {
    const tempNet: NetsMap = {} as unknown as NetsMap;
    let rst = (await requestClient.post<{seed:string; net: string}, axios.AxiosResponse<{rootKey:string}>>
        (`/master-node`, {seed, net: "mainnet"})).data.rootKey;
    tempNet["mainnet"] = rst;
    rst = (await requestClient.post<{seed:string; net: string}, axios.AxiosResponse<{rootKey:string}>>
      (`/master-node`, {seed, net: "testnet3"})).data.rootKey;
    tempNet["testnet3"] = rst;
    console.log(JSON.stringify(tempNet));
    setNets(tempNet);
    setCurrentNet('');
    setRootKey('');
  };
  useEffect(() => {
    fetchRootKeys(wallet.seed);
  },[wallet]);
  return (
    <React.Fragment>
      <Grid container className={classes.gridContainer}>
        <Grid item xs={12} md={12} style={{marginTop:"10px"}}>
          <Typography>{wallet.walletName}</Typography>
        </Grid>
        <Grid item xs={12} md={12} className={classNames(classes.wrapText, classes.formControl)}>
          <Grid container>
            <Grid item xs={12} md={2}>
              <Typography>Mnemonic Sentence: </Typography>
            </Grid>
            <Grid item xs={12} md={10}>
              <Typography paragraph>
                {wallet.mnemonic}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={12} className={classNames(classes.wrapText, classes.formControl)}>
          <Grid container>
            <Grid item xs={12} md={2}>
              <Typography>Seed: </Typography>
            </Grid>
            <Grid item xs={12} md={10}>
              <Typography paragraph>
                {wallet.seed}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={12}>
          <FormControl className={classNames(classes.fullWidth, classes.formControl)}>
            <InputLabel htmlFor="choose-net">Net</InputLabel>
            <Select
                value={currentNet}        
                onChange={(e) => {handleNetChange(e.target.value as NetType)}}
                inputProps={{
                  name: 'Net',
                  id: 'choose-net',
                }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={"mainnet"}>mainnet</MenuItem>
              <MenuItem value={"testnet3"}>testnet</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={12} className={classNames(classes.wrapText, classes.formControl)}>
          <Grid container>
            <Grid item xs={12} md={2}>
              <Typography>RootKey: </Typography>
            </Grid>
            <Grid item xs={12} md={10}>
              <Typography paragraph>
                {rootKey}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={12} className={classNames(classes.wrapText, classes.formControl)}>
          <FormControl error={!isValidDerivationPath} className={classes.fullWidth}>
            <InputLabel htmlFor="derivation-path">Derivation Path</InputLabel>
            <Input
              id="derivation-path"
              value={derivationPath.path}
              onChange={(e) => {
                const val = e.target.value;
                if (!isDerivationPathValid(val)) {
                  setIsValidDerivationPath(false);
                  setDerivationPath({path:val, helpText:"Derivation Path in wrong format"});
                  return;
                }
                setIsValidDerivationPath(true);
                setDerivationPath({path:val, helpText:""});
              }}
              aria-describedby="derivation-path-text"
              placeholder="m / purpose' / coin_type' / account' / change / address_index"
            />
            <FormHelperText id="derivation-path-text">{derivationPath.helpText}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <AddressTable/>
        </Grid>
      </Grid>
    </React.Fragment>
  )
})

export { Address };
