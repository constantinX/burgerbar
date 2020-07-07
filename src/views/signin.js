import React, { useState, useContext } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import { useAuthState } from 'react-firebase-hooks/auth';

//
import { useHistory, useLocation } from 'react-router-dom';
import FirebaseContext from '../imports/contexts/FirebaseContext';

const useStyles = makeStyles((theme) => ({
	root: {
		height: '100vh'
	},
	image: {
		backgroundImage:
			'url(https://images.unsplash.com/photo-1457460866886-40ef8d4b42a0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80)',
		backgroundRepeat: 'no-repeat',
		backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
		backgroundSize: 'cover',
		backgroundPosition: 'center'
	},
	paper: {
		margin: theme.spacing(8, 4),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1)
	},
	submit: {
		margin: theme.spacing(3, 0, 2)
	}
}));

const initial = { email: '', password: '' };

export default function SignInSide({ setWorkspace }) {
	const classes = useStyles();
	const history = useHistory();
	const location = useLocation();
	const firebase = useContext(FirebaseContext);
	const [ inputs, setInputs ] = useState(initial);
	const [ err, setErr ] = useState('');
	const [ user, loading, error ] = useAuthState(firebase.auth());

	const login = (evt) => {
		evt.preventDefault();
		if (location.search) {
			setWorkspace(location.search.substring(1));
		}
		firebase
			.auth()
			.signInWithEmailAndPassword(inputs.email, inputs.password)
			.then(() => history.push('/dashboard'))
			.catch((error) => setErr(error.message));
	};

	const signupWithGoogle = (evt) => {
		evt.preventDefault();
		const provider = new firebase.auth.GoogleAuthProvider();
		firebase
			.auth()
			.signInWithPopup(provider)
			.then((res) => {
				console.log(res);
				if (location.search) {
					setWorkspace(location.search.substring(1));
				}
				if (res.additionalUserInfo.isNewUser) {
					return firebase.firestore().collection('users').doc(res.user.uid).set({
						created: firebase.firestore.FieldValue.serverTimestamp(),
						name: res.user.displayName,
						image: res.user.photoURL ? res.user.photoURL : 'https://source.unsplash.com/200x200/?cat',
						event: location.search ? [ location.search.substring(1), res.user.uid ] : [ res.user.uid ]
					});
				}
				return null;
			})
			.then(() => history.push('/dashboard'))
			.catch(function(error) {
				setErr(error.message);
				console.log(error);
			});
	};

	function change(e) {
		setErr('');
		setInputs({ ...inputs, [e.target.name]: e.target.value });
	}

	return (
		<Grid container component="main" className={classes.root}>
			<CssBaseline />
			<Grid item xs={false} sm={4} md={7} className={classes.image} />
			<Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
				<div className={classes.paper}>
					<Avatar className={classes.avatar}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Sign in
					</Typography>
					<form className={classes.form} noValidate>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							id="email"
							label="Email Address"
							name="email"
							onChange={change}
							value={inputs.email}
							autoComplete="email"
							autoFocus
						/>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							name="password"
							onChange={change}
							value={inputs.password}
							label="Password"
							type="password"
							id="password"
							autoComplete="current-password"
						/>
						{err && (
							<Typography component="p" variant="caption">
								{err}
							</Typography>
						)}
						{/*<FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />*/}
						<Button
							type="submit"
							onClick={login}
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
						>
							Sign In
						</Button>
						<Button
							type="submit"
							onClick={signupWithGoogle}
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
						>
							Sign In With Google
						</Button>
						<Grid container>
							<Grid item xs>
								<Link href="#" variant="body2">
									Forgot password?
								</Link>
							</Grid>
							<Grid item>
								<Link href="/signup" variant="body2">
									{"Don't have an account? Sign Up"}
								</Link>
							</Grid>
						</Grid>
					</form>
				</div>
			</Grid>
		</Grid>
	);
}
