import { Button, CardContent, Checkbox, createTheme, CssBaseline, Divider, FormControl, FormControlLabel, FormLabel, Grid2, InputLabel, Link, Paper, Stack, TextField, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import { ThemeProvider } from '@emotion/react';
import React from 'react';
import { AppTheme } from '../theme';
import axios from '../api/axios';

const REGISTER_URL = './register'

const RegisterScreen = () => {
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [passwordConfirmError, setPasswordConfirmError] = React.useState(false);
    const [passwordConfirmErrorMessage, setPasswordConfirmErrorMessage] = React.useState('');
    const [errMes, setErrMes] = React.useState('');
    const [success, setSuccess] = React.useState(false);
    document.body.style = 'background-image: radial-gradient(#FA7083,#FA7070);'
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const HandleSubmit = async (event) => {
        if (!ValidateInputs(event)) {
            event.preventDefault();
            return;
        }
        const data = new FormData(event.currentTarget);
        const email = data.get('email');
        const pwd = data.get('password');
        try {
            const response = await axios.post(REGISTER_URL,
                JSON.stringify({ email, pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            )
            console.log(response?.data);
            console.log(response?.accessToken);
            console.log(JSON.stringify(response))
            setSuccess(true);
        } catch (err) {
            if (!err?.response) { setErrMes('No Server Response') }
            else if (err.response?.status === 409) {
                setErrMes('Email Taken');
            } else {
                setErrMes('Registration Failed')
            }
        }
    };

    const ValidateInputs = (event) => {
        event.preventDefault();
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        const passwordConfirm = document.getElementById('passwordConfirm');
        let isValid = true;

        if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        if (!password.value || password.value.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 6 characters long.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        if (!passwordConfirm.value || password.value !== passwordConfirm.value) {
            setPasswordConfirmError(true);
            setPasswordConfirmErrorMessage('Passwords must match.');
            isValid = false;
        } else {
            setPasswordConfirmError(false);
            setPasswordConfirmErrorMessage('');
        }
        setErrMes('');
        return isValid;
    };


    return (
        <ThemeProvider theme={AppTheme}>
            <Stack>
                <CssBaseline>
                    <Box display="flex"
                        alignItems="center"
                        justifyContent="center"
                        component="form"
                        onSubmit={HandleSubmit}
                        noValidate
                        sx={{ minHeight: '100vh' }}>
                        <Paper sx={{ width: '29%', margin: '20px auto' }} elevation={10}>
                            {success ? (
                                <>
                                    <Typography
                                        component="h1"
                                        variant="h4"
                                        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', paddingLeft: '5%', paddingTop: '5%' }}
                                    >
                                        Success
                                    </Typography>
                                    <Typography sx={{ textAlign: 'center', paddingBottom: '5%' }}>
                                        Click here to login{' '}
                                        <Link
                                            href="/"
                                            variant="body2"
                                            sx={{ alignSelf: 'center' }}
                                        >
                                            Sign in
                                        </Link>
                                    </Typography>
                                </>
                            ) : (
                                <>
                                    <Typography
                                        component="h1"
                                        variant="h4"
                                        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', paddingLeft: '5%', paddingTop: '5%' }}
                                    >
                                        Sign Up
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            width: '100%',
                                            gap: 2,
                                        }}
                                    >
                                        {errMes ? (
                                            <Typography
                                                sx={{ width: '100%', paddingLeft: '5%', paddingTop: '5%'}}
                                                color='error'
                                            >
                                                {errMes}
                                            </Typography>
                                        ) : (<></>)}
                                        <FormControl sx={{ paddingLeft: '5%', paddingTop: '5%', paddingRight: '5%' }}>
                                            <FormLabel htmlFor="email">Email</FormLabel>
                                            <TextField
                                                error={emailError}
                                                helperText={emailErrorMessage}
                                                id="email"
                                                type="email"
                                                name="email"
                                                placeholder="your@email.com"
                                                autoComplete="email"
                                                autoFocus
                                                required
                                                fullWidth
                                                variant="outlined"
                                                color={emailError ? 'error' : 'primary'}
                                                size='small'
                                            />
                                        </FormControl>
                                        <FormControl sx={{ paddingLeft: '5%', paddingRight: '5%' }}>
                                            <FormLabel htmlFor="password">Password</FormLabel>
                                            <TextField
                                                error={passwordError}
                                                helperText={passwordErrorMessage}
                                                name="password"
                                                placeholder="••••••"
                                                type="password"
                                                id="password"
                                                autoComplete="current-password"
                                                autoFocus
                                                required
                                                fullWidth
                                                variant="outlined"
                                                color={passwordError ? 'error' : 'primary'}
                                                size='small'
                                            />
                                        </FormControl>
                                        <FormControl sx={{ paddingLeft: '5%', paddingRight: '5%' }}>
                                            <FormLabel htmlFor="passwordConfirm">Confirm Password</FormLabel>
                                            <TextField
                                                error={passwordConfirmError}
                                                helperText={passwordConfirmErrorMessage}
                                                name="passwordConfirm"
                                                placeholder="••••••"
                                                type="password"
                                                id="passwordConfirm"
                                                autoComplete="current-password"
                                                autoFocus
                                                required
                                                fullWidth
                                                variant="outlined"
                                                color={passwordConfirmError ? 'error' : 'primary'}
                                                size='small'
                                            />
                                        </FormControl>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            sx={{ marginLeft: '10%', marginRight: '10%' }}>
                                            Sign Up
                                        </Button>
                                        <Divider>or</Divider>
                                        <Typography sx={{ textAlign: 'center', paddingBottom: '5%' }}>
                                            Already have an account?{' '}
                                            <Link
                                                href="/"
                                                variant="body2"
                                                sx={{ alignSelf: 'center' }}
                                            >
                                                Sign in
                                            </Link>
                                        </Typography>
                                    </Box>
                                </>
                            )}
                        </Paper>
                    </Box>
                </CssBaseline>
            </Stack>
        </ThemeProvider>
    );
};

export default RegisterScreen;