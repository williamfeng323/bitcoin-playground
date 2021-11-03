import {Box, Button, Container, Paper, Step, StepLabel, Stepper, Typography} from '@material-ui/core';
import React, { useContext } from 'react';
import './CreateWallet.css'
import {MnemonicForm} from './components/MnemonicForm/MnemonicForm';
import {WalletInterface, WalletsContext} from '../../../../App';
import { Review } from './components/Review/Review';
import { useHistory } from 'react-router';
import { LocalStoreWalletsKey } from '../../../../libs/config';

const steps = ['Mnemonic', 'Mnemonic Result'];
const getStepContent = (step: number) => {
    switch (step) {
        case 0:
            return <MnemonicForm/>;
        case 1:
            return  <Review/>;
        default:
            throw new Error('Unknown step');
    }
}
interface MnemonicInterface {
    sentence: string;
    seed: string
}
export const MnemonicContext = React.createContext<{mnemonic: MnemonicInterface, setMnemonic: React.Dispatch<React.SetStateAction<MnemonicInterface>>}>
({mnemonic: {sentence: '', seed: ''}, setMnemonic: (value) => null})

const CreateWallet = () => {
    const [activeStep, setActiveStep] = React.useState(0);
    const {wallets, setWallets} = useContext(WalletsContext);
    const history = useHistory();
    const [mnemonic, setMnemonic] = React.useState<MnemonicInterface>({seed: '', sentence:''});
    const handleNext = () => {
        if (activeStep === steps.length - 1) {
            const wallet: WalletInterface = {
                walletName: `Wallet #${wallets.length + 1}`,
                mnemonic: mnemonic.sentence,
                seed: mnemonic.seed,
            };
            wallets.push(wallet);
            setWallets(wallets);
            window.sessionStorage.setItem(LocalStoreWalletsKey, JSON.stringify(wallets));
        }
        setActiveStep(activeStep + 1);
    };
    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };
    return (
        <div className='create-wallet'>
            <MnemonicContext.Provider value={{mnemonic, setMnemonic}}>
                <Container component='main' maxWidth='sm'>
                    <Paper variant='outlined'>
                        <Typography component='h1' variant='h4' align='center' style={{marginTop:'3%'}}>
                            Create Wallet
                        </Typography>
                        <Stepper activeStep={activeStep} style={{padding:'2%'}}>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                        <React.Fragment>
                            {activeStep === steps.length ? (
                                <div className='add-success'>
                                    <React.Fragment >
                                        <Typography variant='subtitle1' gutterBottom>
                                            New Wallet Added!
                                        </Typography>
                                        <Typography variant='subtitle2'>
                                            Your new wallet is added, you can derive addresses with it now.
                                        </Typography>
                                        <Button onClick={() => {history.push('/')}}>Back to Home</Button>
                                    </React.Fragment>
                                </div>
                            ) : (
                                <React.Fragment>
                                    {getStepContent(activeStep)}
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        {activeStep !== 0 && (
                                            <Button onClick={handleBack} className='button-margin'>
                                                Back
                                            </Button>
                                        )}
                                        <Button
                                            variant='contained'
                                            onClick={handleNext}
                                            className='button-margin'
                                        >
                                            {activeStep === steps.length - 1 ? 'Add to wallet' : 'Next'}
                                        </Button>
                                    </Box>
                                </React.Fragment>
                            )}
                        </React.Fragment>
                    </Paper>
                </Container>
            </MnemonicContext.Provider>
        </div>
    )
}
export { CreateWallet };
