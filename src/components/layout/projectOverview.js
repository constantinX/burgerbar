import React, { useState, useEffect, useContext } from 'react';
import { Link, useRouteMatch, useHistory } from 'react-router-dom';
import FirebaseContext from '../../imports/contexts/FirebaseContext';

//UI Components
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
//import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex'
	},
	paper: {
		padding: theme.spacing(2),
		display: 'flex',
		overflow: 'auto',
		flexDirection: 'column'
	},
	fixedHeight: {
		height: 240
	},
	fab: {
		position: 'absolute',
		right: '30px',
		bottom: '30px'
	}
}));

function ProjectOverview(props) {
	let { path } = useRouteMatch();
	let history = useHistory();
	const classes = useStyles();
	const firebase = useContext(FirebaseContext);
	const [ projects, setProjects ] = useState([]);

	useEffect(
		() => {
			firebase
				.projects()
				.where('ownerId', '==', firebase.auth.currentUser.uid)
				.get()
				.then((querySnapshot) => {
					querySnapshot.forEach((doc) => {
						setProjects((projects) => [ ...projects, { id: doc.id, ...doc.data() } ]);
					});
				})
				.catch(function(error) {
					console.log('Error getting documents: ', error);
				});
		},
		[ firebase ]
	);

	const createProject = () => {
		const newDoc = {
			title: 'Untitled',
			canvasHeight: 800,
			canvasWidth: 400,
			thumbnail: 'none',
			lastUpdated: 'today',
			ownerId: firebase.auth.currentUser.uid,
			state: {
				front: [
					{
						align: 'left',
						bold: false,
						fontColor: '#000',
						fontSize: 36,
						id: '0',
						keepfocus: false,
						selected: false,
						underline: false,
						value: 'front',
						width: 180,
						x: 0,
						y: 0
					}
				],
				back: [
					{
						align: 'left',
						bold: false,
						fontColor: '#000',
						fontSize: 36,
						id: '0',
						keepfocus: false,
						selected: false,
						underline: false,
						value: 'back',
						width: 180,
						x: 0,
						y: 0
					}
				]
			}
		};

		firebase
			.projects()
			.add(newDoc)
			.then((docRef) => {
				history.push(`dashboard/${docRef.id}`);
			})
			.catch((err) => {
				console.log('Error getting documents: ', err);
			});
	};

	return (
		<div>
			<Grid container spacing={3}>
				{projects.map((el, i) => (
					<Grid key={el.id} item xs={12} md={6} lg={3}>
						<Paper key={i}>
							<h2>{el.title}</h2>
							<h2>{el.date}</h2>
							<Link to={path + '/' + el.id}>Open</Link>
						</Paper>
					</Grid>
				))}
			</Grid>
			<Fab className={classes.fab} onClick={createProject} color="primary" aria-label="add">
				<AddIcon />
			</Fab>
		</div>
	);
}

export default ProjectOverview;
