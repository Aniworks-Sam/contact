import React, { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import {Avatar,Button,CssBaseline,TextField,Paper,Box,Grid,Typography} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './Auth.css';
const theme = createTheme();

export default function SignUp() {
  const navigate = useNavigate();
  const [isValid,setIsValid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const [enteredEmail, setEnteredEmail] = useState('');
  const [emailIsValid, setEmailIsValid] = useState<boolean>();
  const [enteredPassword, setEnteredPassword] = useState('');
  const [passwordIsValid, setPasswordIsValid] = useState<boolean>();
  const [enteredName, setEnteredName] = useState('');
  const [enteredUsername, setEnteredUsername] = useState('');
  const [usernameIsValid, setUsernameIsValid] = useState<boolean>();
  const [enteredRecoveryEmail, setEnteredRecoveryEmail] = useState('');
  const [recoveryemailIsValid, setRecoveryEmailIsValid] = useState<boolean>();
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

  const emailChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredEmail(event.target.value);
    setFormIsValid(
      event.target.value.includes('@') && passwordValidator(enteredPassword) && isValid
    );
  };

  const passwordChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEnteredPassword(event.target.value);
    setFormIsValid(
      enteredEmail.includes('@') &&
        enteredEmail.includes('.') &&
        passwordValidator(event.target.value) && isValid
    );
  };

  const validateEmailHandler = () => {
    setEmailIsValid(enteredEmail.includes('@') && enteredEmail.includes('.'));
  };

  const validatePasswordHandler = () => {
    setPasswordIsValid(passwordValidator(enteredPassword));
  };

  const usernameChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredUsername(event.target.value);
    setFormIsValid(
      enteredEmail.includes('@') &&
        enteredEmail.includes('.') &&
        passwordValidator(enteredPassword) && isValid
    );
  };

  const nameChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredName(event.target.value);
  };

  const recoveryEmailChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredRecoveryEmail(event.target.value);
  };

  const validateRecoveryEmailHandler = () => {
    setRecoveryEmailIsValid(enteredRecoveryEmail.includes('@') && enteredRecoveryEmail.includes('.'));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    fetch('https://anisoft.us/mailapp/api/mail/create', {
      method: 'POST',
      body: JSON.stringify({
        username: enteredUsername,
        password: enteredPassword,
        name: enteredName,
        address: enteredEmail,
        tags: [
        "status:regular_user",
        "subscription:swismail"
        ],
        recoveryemail: enteredRecoveryEmail,
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
        if(data.success){
          console.log(data.success);
          navigate('/signIn');
        }
      })
      .catch((err) => {
        console.error(err.message);
        alert(err.message);
      });
  };

  const usernameValidater = (event: any) => {
    console.log(event.target.value);
    setIsCheck(true);
    setUsernameIsValid(enteredUsername ? true : false);
    fetch(`https://anisoft.us/mailapp/api/mail/userexist?id=${event.target.value}`, {
      method: 'POST',
      body: JSON.stringify({}),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        setIsCheck(false);
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
        setIsValid(data);
      })
      .catch((err) => {
        console.error(err.message);
        alert(err.message);
      });
  }

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
              Sign Up
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoComplete="name"
              value={enteredName}
              onChange={nameChangeHandler}
            />
              <TextField
                className={`${
                  !isValid === false ? 'invalidLabel' : ''
                }`}
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="Username"
                autoComplete="Username"
                value={enteredUsername}
                onChange={usernameChangeHandler}
                onBlur={usernameValidater}
              />
              {!isValid && isCheck && <div>Checking.....</div>}
              {isValid && isCheck && <div>Checking.....</div>}
              {!isValid && !isCheck && usernameIsValid && <div>✅ Username available</div>}
              {isValid && !isCheck && <div className='invalidText'>❌ Username already exist</div>}
              <TextField
                className={`${emailIsValid === false ? 'invalidLabel' : ''}`}
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                value={enteredEmail}
                onChange={emailChangeHandler}
                onBlur={validateEmailHandler}
              />
              {
            <p className='invalidText'>{`${
              emailIsValid === false ? 'Please enter valid email!' : ''
            }`}</p>
          }
              <TextField
                className={`${recoveryemailIsValid === false ? 'invalidLabel' : ''}`}
                margin="normal"
                required
                fullWidth
                id="recoveryemail"
                label="Recovery Email"
                name="recoveryemail"
                autoComplete="recoveryemail"
                value={enteredRecoveryEmail}
                onChange={recoveryEmailChangeHandler}
                onBlur={validateRecoveryEmailHandler}
              />
              {
            <p className='invalidText'>{`${
              recoveryemailIsValid === false ? 'Please enter valid email!' : ''
            }`}</p>
          }
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
              <Link className='link' to="/signIn">Sign in instead</Link>
              {!isLoading && <Button
                disabled={!formIsValid}
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>}
              {isLoading && <p>Sending request...</p>}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
