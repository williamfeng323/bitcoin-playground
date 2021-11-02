import React, { useEffect, useState } from 'react';
import {
  Button,
  createStyles,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Switch,
  TablePagination,
  Theme,
  Typography,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { withStyles, WithStyles } from '@material-ui/styles';
import * as axios from 'axios';
import * as _ from 'lodash';
import classNames from 'classnames';
import { WalletInterface } from '../../../../../../App';
import { requestClient } from '../../../../../../libs/request';
import { AddressTable, AddressDataMap } from './AddressTable';

const MaxInt32 = 2147483648;

const useStyle = (theme: Theme) => {
    return createStyles({
        gridContainer: {textAlign:'left', marginLeft:'7%', marginTop:'2%', marginRight:'7%', width:'80%'},
        wrapText:{overflowWrap: 'anywhere'},
        formControl: {marginTop: '10px'},
        fullWidth: {width: '100%'},
        pagination: {display:'inline-flex', marginTop:'10px'},
        generateMultiSigBtn: {marginTop: '20px'},
        generateMultiSig: {alignSelf: 'flex-end'},
        close: {padding: theme.spacing() / 2},
    });
}

const isDerivationPathValid = (path: string) => {
  const reg = /^m(\/[0-9]*'?)*[0-9']$|^m\/$|^m$/g;
  if (!reg.test(path)) {
    return false;
  }
  const depths = path.split('/');
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

type NetType = 'mainnet' |'testnet3';

type NetsMap = {
  [index in NetType]: string;
};

interface DerivedKeys {
  parentPrvKey: string;
  parentPubKey: string;
  derivedKeys: AddressDataMap[];
}

type SemanticType = 'P2WPKH' | 'P2WSH';

const Address = withStyles(useStyle)(({classes, wallet}: Props) => {

  const [rootKey, setRootKey] = useState('');
  const [page, setPage] = useState(0);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [fetchSize, setFetchSize] = useState(100);
  const [multiSigN, setMultiSigN] = useState(0);
  const [multiSigAddr, setMultiSigAddr] = useState('');
  const [currentNet, setCurrentNet] = useState('');
  const [isHarden, setIsHarden] = useState(false);
  const [derivedKeys, setDerivedKeys] = useState<DerivedKeys>({} as DerivedKeys);
  const [currentScriptSemantic, setCurrentScriptSemantic] = useState('P2WPKH');
  const [nets, setNets] = useState<NetsMap>({} as unknown as NetsMap);
  const [derivationPath, setDerivationPath] = useState<{path: string, helpText: string}>({path:'', helpText:''});
  const [isValidDerivationPath, setIsValidDerivationPath] = useState(true);
  const [selectedAddr, setSelectedAddr] = useState<{[index:string]: boolean}>({} as {[index:string]: boolean});
  const [openAlert, setOpenAlert] = React.useState({status: false, message:''});

  const handleNetChange = async (net: NetType) => {
    setCurrentNet(net);
    setRootKey(nets[net]);
  }

  const handleSemanticChange = async (semantic: SemanticType) => {
    setCurrentScriptSemantic(semantic);
  }

  const handleGenerateMultiSigN = async () => {
    if (multiSigN <= 0 || multiSigN > 16) {
        setOpenAlert({status: true, message: 'Multi-sig N must be between 1, 16'});
        return;
    }
    if (_.keys(selectedAddr).length === 0) {
        setOpenAlert({status: true, message: 'Please select public keys from below table by clicking the row'});
        return;
    }
    if (_.keys(selectedAddr).length < multiSigN) {
        setOpenAlert({status: true, message: 'Select public keys # must be greater than multi-sig N'});
        return;
    }
    try {
        const rst = (await requestClient.post<any, axios.AxiosResponse<{p2sh:string}>>('/master-node/multisig-addr', {
            n: multiSigN, pubKeys: _.keys(selectedAddr)
        }));
        setMultiSigAddr(rst.data.p2sh);
    } catch(err) {
        setOpenAlert({status: true, message: err as string});
    }
  }

  const refreshDerivationAddrs = async () => {
    if (!_.isEmpty(currentNet) && !_.isEmpty(rootKey) && !_.isEmpty(derivationPath.path)){
      const rst = (await requestClient.post<any, axios.AxiosResponse<DerivedKeys>>('/master-node/derivation-keys', {
        derivePath: derivationPath.path, scriptSemantic: currentScriptSemantic,
        rootKey: rootKey, net: currentNet, isHarden:isHarden, pageSize: fetchSize,
      }));
      setDerivedKeys(rst.data);
    }
  }
  const fetchRootKeys = async (seed:string) => {
    const tempNet: NetsMap = {} as unknown as NetsMap;
    let rst = (await requestClient.post<{seed:string; net: string}, axios.AxiosResponse<{rootKey:string}>>
        ('/master-node', {seed, net: 'mainnet'})).data.rootKey;
    tempNet['mainnet'] = rst;
    rst = (await requestClient.post<{seed:string; net: string}, axios.AxiosResponse<{rootKey:string}>>
      ('/master-node', {seed, net: 'testnet3'})).data.rootKey;
    tempNet['testnet3'] = rst;
    console.log(JSON.stringify(tempNet));
    setNets(tempNet);
    setCurrentNet('');
    setRootKey('');
    setIsHarden(false);
    setDerivationPath({path:'', helpText:''});
    setDerivedKeys({} as DerivedKeys);
  };
  useEffect(() => {
    fetchRootKeys(wallet.seed).catch((reason) => console.log(reason));
  },[wallet]);
  useEffect(() => {
    refreshDerivationAddrs().catch((reason) => console.log(reason));
  },[derivationPath, isHarden, rootKey, currentScriptSemantic])
  return (
    <React.Fragment>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={openAlert.status}
          autoHideDuration={6000}
          onClose={() => setOpenAlert({status: false, message: ''})}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{openAlert.message}</span>}
          action={[
            <Button key="undo" color="secondary" size="small" onClick={() => setOpenAlert({status: false, message: ''})}>
              Noted
            </Button>,
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={() => setOpenAlert({status: false, message: ''})}
            >
              <Close />
            </IconButton>,
          ]}
        />
      <Grid container className={classes.gridContainer}>
        <Grid item xs={12} md={12} style={{marginTop:'10px'}}>
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
              <MenuItem value={'mainnet'}>mainnet</MenuItem>
              <MenuItem value={'testnet3'}>testnet</MenuItem>
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
              onChange={async (e) => {
                const p = e.target.value;
                if (_.isEmpty(p)) {
                  await setDerivationPath({path:p, helpText:''});
                  return;
                }
                if (!isDerivationPathValid(p)) {
                  await setIsValidDerivationPath(false);
                  await setDerivationPath({path:p, helpText:'Derivation Path in wrong format'});
                  return;
                }
                await setIsValidDerivationPath(true);
                const newPath = {path:p, helpText:''};
                await setDerivationPath(newPath);
              }}
              aria-describedby="derivation-path-text"
              placeholder="m / purpose' / coin_type' / account' / change / address_index"
            />
            <FormHelperText id="derivation-path-text">{derivationPath.helpText}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={12}>
          <FormControl className={classNames(classes.fullWidth, classes.formControl)}>
            <InputLabel htmlFor="choose-semantic">Script Semantics</InputLabel>
            <Select
                value={currentScriptSemantic}
                onChange={async (e) => {await handleSemanticChange(e.target.value as SemanticType)}}
                inputProps={{
                  name: 'choose semantic',
                  id: 'choose-semantic',
                }}
            >
              <MenuItem value={'P2WPKH'}>P2WPKH</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={12} className={classNames(classes.wrapText, classes.formControl)}>
          <Grid container>
            <Grid item xs={12} md={3}>
              <Typography>Bip32 Extended Public Key: </Typography>
            </Grid>
            <Grid item xs={12} md={9}>
              <Typography paragraph>
                {derivedKeys.parentPubKey}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={12} className={classNames(classes.wrapText, classes.formControl)}>
          <Grid container>
            <Grid item xs={12} md={3}>
              <Typography>Bip32 Extended Private Key: </Typography>
            </Grid>
            <Grid item xs={12} md={9}>
              <Typography paragraph>
                {derivedKeys.parentPrvKey}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid>
          <FormControlLabel
            control={
              <Switch
                checked={isHarden}
                onChange={async (e) => {
                  setIsHarden(e.target.checked);
                }}
                value="isHarden"
                color="primary"
              />
            }
            label="Is Harden"
          />
        </Grid>
        <Grid  item xs={12} className={classNames(classes.formControl)}>
          <Typography variant="h5">Address Table</Typography>
        </Grid>
        <Grid container xs={12}>
          <Grid item xs={12}  md={2} className={classNames(classes.formControl)}>
            <FormControl >
              <InputLabel htmlFor="multi-sig-n">Multi-sig N</InputLabel>
              <Input
                  id="multi-sig-n"
                  value={multiSigN}
                  onChange={(e) => {
                      setMultiSigN(parseInt(e.target.value || '0'));
                  }}
                  aria-describedby="multi-sig-n"
                  placeholder="Multi Sig (N) of M"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}  md={3}>
            <Button 
                className={classes.generateMultiSigBtn}
                onClick={handleGenerateMultiSigN}
            >
                Generate Multi-Sig Addr
            </Button>
          </Grid>
          <Grid item xs={12} md={3}
            className={classes.generateMultiSig}
          >
              {multiSigAddr}
          </Grid>
        </Grid>
        <Grid container xs={12} className={classNames(classes.wrapText, classes.formControl)}>
            <Grid item xs={12} md={2}>
                <FormControl >
                    <InputLabel htmlFor="fetch-size">Fetch Size</InputLabel>
                    <Input
                        id="fetch-size"
                        value={fetchSize}
                        onBlur={(e) => {
                            refreshDerivationAddrs();
                        }}
                        onChange={(e) => {
                            setFetchSize(parseInt(e.target.value || '0'));
                        }}
                        aria-describedby="fetch-size"
                        placeholder="fetch size"
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
                <TablePagination
                    component="div"
                    className={classes.pagination}
                    count={derivedKeys.derivedKeys?.length || 0}
                    page={page}
                    onPageChange={(e, p) => {
                      setPage(p);
                    }}
                    rowsPerPage={currentPageSize}
                    onRowsPerPageChange={(e) => {
                      setCurrentPageSize(parseInt(e.target.value));
                    }}
                />
            </Grid>
        </Grid>

        <Grid item xs={12} className={classNames(classes.wrapText, classes.formControl)}>
            <AddressTable
                addresses={derivedKeys.derivedKeys?.slice(currentPageSize*page, currentPageSize*page + currentPageSize)}
                selectedAddr={selectedAddr}
                setSelectedAddr={setSelectedAddr}
            />
        </Grid>
      </Grid>
    </React.Fragment>
  )
})

export { Address };
