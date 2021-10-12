import {
    Button,
    FormControl,
    FormControlLabel, FormHelperText,
    FormLabel,
    Grid, Input,
    makeStyles, MenuItem,
    Radio,
    RadioGroup, Select, TextField,
    Typography
} from '@material-ui/core';
import React from 'react';
import { requestClient } from "../../../../libs/request";
import * as axios from 'axios';
import {WalletsContext} from "../../../../App";
import {MnemonicContext} from "../CreateWallet/CreateWallet";

const useStyles = makeStyles({
    root: {
        // component default is "inline-flex", using "flex" makes the
        // label + control group use the entire width of the parent element
        display: "flex",
        // component default is "flex-start", using "space-between" pushes
        // both flexed content to the right and left edges of the flexbox
        // Note: the content is aligned to the right by default because
        // the 'labelPlacement="start"' component prop changes the flexbox
        // direction to "row-reverse"
        justifyContent: "space-between",
    },
});

const handleGenerateMnemonic = async (sentenceLength: number, passphrase:string, setMnemonic) => {
    try {
        console.log(sentenceLength);
        const rst = await requestClient.post<{sentenceLength:number, passphrase:string}, axios.AxiosResponse<{mnemonic:string; seed: string}>>
            (`/mnemonic`, {sentenceLength, passphrase});
        const { data } = rst;
        setMnemonic({
            sentence: data.mnemonic,
            seed: data.seed,
        });
    } catch (e) {
        console.log(e);
    }

};

const getGenerateForm = (isGenerate: boolean, sentenceSize: number, passphrase: string, setSentenceSize, setMnemonic, setPassphrase) => {
    if (!isGenerate) {
        return
    }
    return (
        <React.Fragment>
            <Grid container style={{textAlign:"center", marginLeft:"7%", marginTop:"2%", marginRight:"7%"}}>
                <Grid item xs={12} md={2}>
                    <Select
                        labelId="sentence-length"
                        id="sentence-length"
                        value={sentenceSize}
                        onChange={(e) => {setSentenceSize(e.target.value as number)}}
                        label="Sentence Length"
                        style={{width:"100%"}}
                    >
                        <MenuItem value={12}>12</MenuItem>
                        <MenuItem value={15}>15</MenuItem>
                        <MenuItem value={18}>18</MenuItem>
                        <MenuItem value={21}>21</MenuItem>
                        <MenuItem value={24}>24</MenuItem>
                    </Select>
                </Grid>
                {/*<Grid item xs={6} ms={5}></Grid>*/}
                <Grid item xs={12} md={4}>
                    <Typography variant="body1" style={{marginTop: "1%", marginLeft:"2%"}}>
                        words mnemonic
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Grid item xs={12} md={10}><Input style={{width:"100%"}} placeholder="Passphrase" onChange={(e) => setPassphrase(e.target.value)} /></Grid>
                </Grid>
                <Grid item xs={12} md={12}>
                    <Button color={"primary"} onClick={async () => { await handleGenerateMnemonic(sentenceSize, passphrase, setMnemonic)}} style={{width:"100%"}}>Generate</Button>
                </Grid>
            </Grid>
        </React.Fragment>
    )
}

const MnemonicForm = () => {
    const classes = useStyles();
    const {wallets, setWallets} = React.useContext(WalletsContext);
    const {mnemonic, setMnemonic} = React.useContext(MnemonicContext);
    let [isGenerate, setIsGenerate] = React.useState<boolean>(true);
    let [sentenceSize, setSentenceSize] = React.useState<number>(12);
    let [passphrase, setPassphrase] = React.useState<string>("");
    let [mnemonicError, setMnemonicError] = React.useState<boolean>(false);
    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Mnemonic
            </Typography>
            <FormControl component="fieldset" style={{float: "left", marginLeft: "5%"}}>
                <FormLabel component="label" classes={classes}>Generate New Mnemonic</FormLabel>
                <RadioGroup row aria-label="isGenerate" name="row-radio-buttons-group" defaultValue={"true"} onChange={(e)=>{setIsGenerate(e.target.value === 'true')}}>
                    <FormControlLabel value="true" control={<Radio color={"primary"}/>} label="true"/>
                    <FormControlLabel value="false" control={<Radio color={"primary"}/>} label="false"/>
                </RadioGroup>
            </FormControl>
            <Grid container spacing={3} >
                {getGenerateForm(isGenerate, sentenceSize,passphrase, setSentenceSize, setMnemonic, setPassphrase)}
                <Grid item xs={12} md={12}>
                    <FormControl error={mnemonicError} variant="standard" style={{width:"90%", marginBottom:"5%"}}>
                        <TextField
                            id="component-error"
                            value={mnemonic.sentence}
                            aria-describedby="component-error-text"
                            variant="outlined"
                            label={"Mnemonic"}
                            multiline
                            rows={4}
                        />
                        <FormHelperText id="component-error-text" hidden>Error</FormHelperText>
                    </FormControl>
                </Grid>
            </Grid>
        </React.Fragment>
    )
};

export { MnemonicForm };