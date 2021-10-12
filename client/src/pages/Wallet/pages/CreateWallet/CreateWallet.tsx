import {Box, Button, Container, Paper, Step, StepLabel, Stepper, Typography} from "@material-ui/core";
import React from "react";
import "./CreateWallet.css"
import {MnemonicForm} from "../MnemonicForm/MnemonicForm";
import {WalletInterface} from "../../../../App";

const steps = ['Mnemonic', 'Mnemonic Result'];
const getStepContent = (step: number) => {
    switch (step) {
        case 0:
            return <MnemonicForm/>;
        case 1:
            return  (<Typography component="h1" variant="h5" align="center">Review</Typography>);
        default:
            throw new Error('Unknown step');
    }
}
interface MnemonicInterface {
    sentence: string;
    seed: string
}
export const MnemonicContext = React.createContext<{mnemonic: MnemonicInterface, setMnemonic: React.Dispatch<React.SetStateAction<MnemonicInterface>>}>
({mnemonic: {sentence: "", seed: ""}, setMnemonic: (value) => null})

const CreateWallet = () => {
    const [activeStep, setActiveStep] = React.useState(0);
    const handleNext = () => {
        setActiveStep(activeStep + 1);
    };
    const [mnemonic, setMnemonic] = React.useState<MnemonicInterface>({seed: "", sentence:""});
    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };
    return (
        <div className="create-wallet">
            <MnemonicContext.Provider value={{mnemonic, setMnemonic}}>

                <Container component="main" maxWidth="sm">
                    <Paper variant="outlined">
                        <Typography component="h1" variant="h4" align="center" style={{marginTop:"3%"}}>
                            Create Wallet
                        </Typography>
                        <Stepper activeStep={activeStep} style={{padding:"2%"}}>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                        <React.Fragment>
                            {activeStep === steps.length ? (
                                <div className="add-success">
                                    <React.Fragment >
                                        <Typography variant="subtitle1" gutterBottom>
                                            New Wallet Added!
                                        </Typography>
                                        <Typography variant="subtitle2">
                                            Your new wallet is added, you can derive addresses with it now.
                                        </Typography>
                                    </React.Fragment>
                                </div>
                            ) : (
                                <React.Fragment>
                                    {getStepContent(activeStep)}
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        {activeStep !== 0 && (
                                            <Button onClick={handleBack} className="button-margin">
                                                Back
                                            </Button>
                                        )}
                                        <Button
                                            variant="contained"
                                            onClick={handleNext}
                                            className="button-margin"
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
