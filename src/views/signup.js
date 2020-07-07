import React, { useState, useContext } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

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

export default function SignUpSide({ setWorkspace }) {
	const classes = useStyles();
	const history = useHistory();
	const location = useLocation();
	const firebase = useContext(FirebaseContext);
	const [ inputs, setInputs ] = useState(initial);
	const [ err, setErr ] = useState('');

	const signup = (evt) => {
		evt.preventDefault();
		console.log(location);
		if (!inputs.email || !inputs.name || !inputs.password || !inputs.password2) return null;
		if (inputs.password !== inputs.password2) return null;

		firebase
			.auth()
			.createUserWithEmailAndPassword(inputs.email, inputs.password)
			.then((res) => {
				console.log(res);
				if (location.search) {
					setWorkspace(location.search.substring(1));
				}
				return firebase.firestore().collection('users').doc(res.user.uid).set({
					created: firebase.firestore.FieldValue.serverTimestamp(),
					name: inputs.name,
					image: 'https://source.unsplash.com/200x200/?cat',
					event: location.search ? [ location.search.substring(1), res.user.uid ] : [ res.user.uid ]
				});
			})
			.then(() => history.push('/dashboard'));
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
					<h3>Family Burger Bar</h3>
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

					<form className={classes.form} noValidate>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							id="text"
							label="Dein Name"
							name="name"
							onChange={change}
							value={inputs.name}
							autoComplete="name"
							autoFocus
						/>
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
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							name="password2"
							onChange={change}
							value={inputs.password2}
							label="Password"
							type="password"
							id="password2"
							autoComplete="current-password"
						/>
						{err && (
							<Typography component="p" variant="caption">
								{err}
							</Typography>
						)}
						{/*	<FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />*/}
						<Button
							type="submit"
							onClick={signup}
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
						>
							Sign In
						</Button>

						<Grid container>
							<Grid item xs>
								<Link href="#" variant="body2">
									Forgot password?
								</Link>
							</Grid>
							<Grid item>
								<Link href="/" variant="body2">
									{'Already have an account? Sign In'}
								</Link>
							</Grid>
						</Grid>
					</form>
				</div>
			</Grid>
		</Grid>
	);
}
