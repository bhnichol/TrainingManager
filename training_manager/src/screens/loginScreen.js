import { Button, Checkbox, CssBaseline, Divider, FormControl, FormControlLabel, FormLabel, Link, Paper, Stack, TextField, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { ThemeProvider } from '@emotion/react';
import React from 'react';
import { AppTheme } from '../theme';
import {useLocation, useNavigate } from 'react-router-dom';
import axios from '../api/axios'
import useAuth from '../hooks/useAuth';
const LOGIN_URL = '/auth'

const LoginScreen = () => {
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';
    const [email, setEmail] = React.useState('');
    const [pwd, setPwd] = React.useState('');
    const [error, setError] = React.useState('');
    document.body.style = 'background-image: radial-gradient(#FA7083,#FA7070);'

    React.useEffect(() => {
        setError('');
    }, [email, pwd])

    const HandleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ email, pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                });
            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;
            console.log(response?.data)
            setAuth({ email, pwd, roles, accessToken });
            setPwd('');
            setEmail('');
            setError('');
            navigate(from, {replace: true});
        } catch (err) {
            if (!err?.response) {
                setError('No Server Response');
            } else if (err.response?.status === 400) {
                setError('Missing Email or Password');
            } else if (err.response?.status === 401) {
                setError('Unauthorized');
            } else {
                setError('Login Failed');
            }
        }

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
                        <Paper sx={{ width: '29%', margin: '20px auto' }} alignSelf='center' elevation={10}>
                            <Typography
                                component="h1"
                                variant="h4"
                                sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', paddingLeft: '5%', paddingTop: '5%' }}
                            >
                                Sign in
                            </Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    width: '100%',
                                    gap: 2,
                                }}
                            >
                                {error ? (
                                            <Typography
                                                sx={{ width: '100%', paddingLeft: '5%', paddingTop: '5%'}}
                                                color='error'
                                            >
                                                {error}
                                            </Typography>
                                        ) : (<></>)}
                                <FormControl sx={{ paddingLeft: '5%', paddingTop: '5%', paddingRight: '5%' }}>
                                    <FormLabel htmlFor="email">Email</FormLabel>
                                    <TextField
                                        id="email"
                                        type="email"
                                        name="email"
                                        placeholder="your@email.com"
                                        autoComplete="email"
                                        autoFocus
                                        required
                                        fullWidth
                                        variant="outlined"
                                        size='small'
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </FormControl>
                                <FormControl sx={{ paddingLeft: '5%', paddingRight: '5%' }}>
                                    <FormLabel htmlFor="password">Password</FormLabel>
                                    <TextField
                                        name="password"
                                        placeholder="••••••"
                                        type="password"
                                        id="password"
                                        autoComplete="current-password"
                                        autoFocus
                                        required
                                        fullWidth
                                        variant="outlined"
                                        size='small'
                                        onChange={(e) => setPwd(e.target.value)}
                                        value={pwd}
                                    />
                                </FormControl>
                                <FormControlLabel
                                    control={<Checkbox value="remember" color="primary" />}
                                    label="Remember me"
                                    sx={{ paddingLeft: '5%' }}
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{ marginLeft: '10%', marginRight: '10%' }}>
                                    Sign In
                                </Button>
                                <Link
                                    component="button"
                                    type="button"
                                    variant="body2"
                                    sx={{ alignSelf: 'center' }}
                                >
                                    Forgot your password?
                                </Link>
                                <Divider>or</Divider>
                                <Typography sx={{ textAlign: 'center', paddingBottom: '5%' }}>
                                    Don&apos;t have an account?{' '}
                                    <Link
                                        href="/register"
                                        variant="body2"
                                        sx={{ alignSelf: 'center' }}
                                    >
                                        Sign up
                                    </Link>
                                </Typography>
                            </Box>
                        </Paper>
                    </Box>
                </CssBaseline>
            </Stack>
        </ThemeProvider>
    );
};

export default LoginScreen;