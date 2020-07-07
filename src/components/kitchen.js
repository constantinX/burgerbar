import React, { useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/core/styles';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import SendIcon from '@material-ui/icons/Send';

import Button from '@material-ui/core/Button';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import KitchenItem from './builder/item';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
	appBar: {
		position: 'relative'
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1
	},
	root: {
		width: '100%',
		maxWidth: 360,
		backgroundColor: theme.palette.background.paper
	}
}));

function Kitchen({ orders, users }) {
	const [ openKitchen, setOpenKitchen ] = React.useState(false);
	const [ ingredientUnique, setIngredientsUnique ] = React.useState([]);
	const classes = useStyles();

	const handleClickOpenKitchen = () => {
		setOpenKitchen(true);
	};

	const handleCloseKitchen = () => {
		setOpenKitchen(false);
	};

	return (
		<React.Fragment>
			<IconButton
				edge="start"
				className={classes.menuButton}
				onClick={handleClickOpenKitchen}
				color="inherit"
				aria-label="menu"
				size="small"
			>
				<MenuBookIcon />
			</IconButton>
			<Dialog fullScreen open={openKitchen} onClose={handleCloseKitchen} TransitionComponent={Transition}>
				<AppBar className={classes.appBar}>
					<Toolbar>
						<IconButton edge="start" color="inherit" onClick={handleCloseKitchen} aria-label="close">
							<CloseIcon />
						</IconButton>
						<Typography variant="h6" className={classes.title}>
							Küche
						</Typography>
						<Button autoFocus color="inherit" onClick={handleCloseKitchen}>
							save
						</Button>
					</Toolbar>
				</AppBar>
				<List
					component="nav"
					aria-labelledby="nested-list-subheader"
					subheader={
						<ListSubheader component="div" id="nested-list-subheader">
							Bestellungen
						</ListSubheader>
					}
					className={classes.root}
				>
					<KitchenItem orders={orders} users={users} />
				</List>
				<List
					component="nav"
					aria-labelledby="nested-list-subheader"
					subheader={
						<ListSubheader component="div" id="nested-list-subheader">
							Zutaten
						</ListSubheader>
					}
					className={classes.root}
				>
					{ingredientUnique &&
						ingredientUnique.map((ingr) => (
							<ListItem button>
								<ListItemIcon>
									<SendIcon />
								</ListItemIcon>
								<ListItemText primary="Sent mail" />
							</ListItem>
						))}
				</List>
			</Dialog>
		</React.Fragment>
	);
}

export default Kitchen;
