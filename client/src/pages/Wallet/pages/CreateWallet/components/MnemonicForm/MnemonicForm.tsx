import {
    Button,
    FormControl,
    FormControlLabel, FormHelperText,
    FormLabel,
    Grid, Input,
    MenuItem,
    Radio,
    RadioGroup, Select, TextField,
    Typography
} from '@material-ui/core';
import React from 'react';
import { requestClient } from '../../../../../../libs/request';
import * as axios from 'axios';
import {MnemonicContext} from '../../CreateWallet';

const handleGenerateMnemonic = async (sentenceLength: number, passphrase:string, setMnemonic) => {
    try {
        console.log(sentenceLength);
        const rst = await requestClient.post<{sentenceLength:number, passphrase:string}, axios.AxiosResponse<{mnemonic:string; seed: string}>>
            ('/mnemonic', {sentenceLength, passphrase});
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
            <Grid container style={{textAlign:'center', marginLeft:'7%', marginTop:'2%', marginRight:'7%'}}>
                <Grid item xs={12} md={2}>
                    <Select
                        labelId="sentence-length"
                        id="sentence-length"
                        value={sentenceSize}
                        onChange={(e) => {setSentenceSize(e.target.value as number)}}
                        label="Sentence Length"
                        style={{width:'100%'}}
                    >
                        <MenuItem value={12}>12</MenuItem>
                        <MenuItem value={15}>15</MenuItem>
                        <MenuItem value={18}>18</MenuItem>
                        <MenuItem value={21}>21</MenuItem>
                        <MenuItem value={24}>24</MenuItem>
                    </Select>
                </Grid>
                {/*<Grid item xs={6} ms={5}></Grid>*/}
                <Grid item xs={12} md={4} style={{display:'flex'}}>
                    <Typography variant="body1" style={{alignSelf:'flex-end'}}>
                        words mnemonic with
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Grid item xs={12} md={10}><Input style={{width:'100%'}} placeholder="Passphrase" onChange={(e) => setPassphrase(e.target.value)} /></Grid>
                </Grid>
                <Grid item xs={12} md={12}>
                    <Button color={'primary'} variant="contained" onClick={async () => { await handleGenerateMnemonic(sentenceSize, passphrase, setMnemonic)}} style={{width:'100%', margin: '10px 0 10px 0'}}>Generate</Button>
                </Grid>
            </Grid>
        </React.Fragment>
    )
}

const MnemonicForm = () => {
    const {mnemonic, setMnemonic} = React.useContext(MnemonicContext);
    const [isGenerate, setIsGenerate] = React.useState<boolean>(true);
    const [sentenceSize, setSentenceSize] = React.useState<number>(12);
    const [passphrase, setPassphrase] = React.useState<string>('');
    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Mnemonic
            </Typography>
            <FormControl component="fieldset" style={{float: 'left', marginLeft: '5%'}}>
                <FormLabel component="label">Generate New Mnemonic</FormLabel>
                <RadioGroup row aria-label="isGenerate" name="row-radio-buttons-group" 
                    defaultValue={'true'} onChange={(e)=>{setIsGenerate(e.target.value === 'true')}}>
                    <FormControlLabel value="true" control={<Radio color={'primary'}/>} label="true"/>
                    <FormControlLabel value="false" control={<Radio color={'primary'}/>} label="false"/>
                </RadioGroup>
            </FormControl>
            <Grid container spacing={3} >
                {getGenerateForm(isGenerate, sentenceSize,passphrase, setSentenceSize, setMnemonic, setPassphrase)}
                <Grid item xs={12} md={12}>
                    <FormControl variant="standard" style={{width:'90%', marginBottom:'5%'}}>
                        <TextField
                            id="component-error"
                            value={mnemonic.sentence}
                            aria-describedby="component-error-text"
                            variant="outlined"
                            label={'Mnemonic'}
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