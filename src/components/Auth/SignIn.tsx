import React, { useState, useContext } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import AuthContext from '../../store/auth-context';
import {Avatar,Button,CssBaseline,TextField,Paper,Box,Grid,Typography} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './Auth.css';
const theme = createTheme();

export default function SignIn() {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [enteredUsername, setEnteredUsername] = useState('');
  const [enteredPassword, setEnteredPassword] = useState('');
  const [passwordIsValid, setPasswordIsValid] = useState<boolean>();
  const [formIsValid, setFormIsValid] = useState(false);

const passwordValidator = (str: string) => {
  if (
    str.match(/[a-z]/g) &&
    str.match(/[A-Z]/g) &&
    str.match(/[0-9]/g) &&
    str.match(/[^a-zA-Z\d]/g) &&
    str.length >= 8
  ) {
    return true;
  } else return false;
};

const passwordChangeHandler = (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  setEnteredPassword(event.target.value);
  setFormIsValid(
    passwordValidator(event.target.value)
  );
};

const usernameChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
  setEnteredUsername(event.target.value);
  setFormIsValid(
    passwordValidator(enteredPassword)
  );
};

const validatePasswordHandler = () => {
  setPasswordIsValid(passwordValidator(enteredPassword));
};

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    fetch('https://mail.aniworks.live/mapi/authenticate', {
      method: 'POST',
      body: JSON.stringify({
        username: enteredUsername,
        password: enteredPassword,
        scope: 'master',
        token: 'true',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        setIsLoading(false);
        if (res.ok) {
          console.log(res);
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage = 'Authentication failed!';
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        console.log(data);
        authCtx.login(data.token);
        navigate('/contacts');
      })
      .catch((err) => {
        console.error(err.message);
        alert(err.message);
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8bmF0dXJlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign In
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="Username"
                autoComplete="Username"
                value={enteredUsername}
                onChange={usernameChangeHandler}
                autoFocus
              />
              <TextField
                className={`${
                  passwordIsValid === false ? 'invalidLabel' : ''
                }`}
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={enteredPassword}
                onChange={passwordChangeHandler}
                onBlur={validatePasswordHandler}
                autoComplete="current-password"
              />
              {
                <p className='invalidText'>{`${
                  passwordIsValid === false
                    ? 'Password should contain atleast 1 uppercase character, 1 lowercase character, 1 digit, 1 special character, and minimum 8 characters.'
                    : ''
                }`}</p>
              }
              <Link className='link' to="/">Create account</Link>
              {!isLoading && <Button
                disabled={!formIsValid}
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>}
              {isLoading && <p>Sending request...</p>}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
