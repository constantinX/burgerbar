import React, { useContext, useState, useRef, useEffect } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { WhatsappShareButton } from 'react-share';
import { WhatsappIcon } from 'react-share';
import { useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, useLocation } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import FirebaseContext from '../imports/contexts/FirebaseContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthState } from 'react-firebase-hooks/auth';
import User from '../components/builder/user';
import MenuComp from '../components/builder/menu';
import KitchenItem from '../components/builder/item';
import MyPlate from '../components/builder/plate';

import Fab from '@material-ui/core/Fab';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import RestaurantIcon from '@material-ui/icons/Restaurant';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import BuildIcon from '@material-ui/icons/Build';
import ViewCarouselIcon from '@material-ui/icons/ViewCarousel';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import LocalMallIcon from '@material-ui/icons/LocalMall';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Checkbox from '@material-ui/core/Checkbox';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const drawerWidth = 240;

const shareMessage =
	'Melde dich bei meiner Burger-Bar mit genau diesem Link an und bestelle dein Essen für unser Event. ';

const shareMessageNone = 'Melde dich bei meiner Burger-Bar an und erstelle Events und lade Freunde ein. ';

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box p={0}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1
	},
	listroot: {
		width: '100%',
		backgroundColor: theme.palette.background.paper
	},
	toolbar: {
		paddingRight: 24 // keep right padding when drawer closed
	},
	toolbarIcon: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		padding: '0 8px',
		...theme.mixins.toolbar
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		transition: theme.transitions.create([ 'width', 'margin' ], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen
		})
	},
	appBarShift: {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create([ 'width', 'margin' ], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen
		})
	},
	menuButton: {
		marginRight: theme.spacing(2),
		display: 'inline-block'
	},
	menuButtonHidden: {
		display: 'none'
	},
	title: {
		flexGrow: 1
	},
	drawerPaper: {
		position: 'relative',
		whiteSpace: 'nowrap',
		width: drawerWidth,
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen
		})
	},
	drawerPaperClose: {
		overflowX: 'hidden',
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen
		}),
		width: theme.spacing(7),
		[theme.breakpoints.up('sm')]: {
			width: theme.spacing(9)
		}
	},
	appBarSpacer: theme.mixins.toolbar,
	content: {
		flexGrow: 1,
		height: '100vh',
		overflow: 'auto'
	},
	container: {
		paddingTop: theme.spacing(4),
		paddingBottom: theme.spacing(4)
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
		right: '20px',
		top: '70px',
		maxWidth: '45%'
	},
	fableft: {
		position: 'absolute',
		left: '20px',
		top: '70px',
		maxWidth: '45%'
	},
	extendedIcon: {
		marginRight: theme.spacing(1)
	}
}));

function Dashboard({ workspace, setWorkspace }) {
	const firebase = useContext(FirebaseContext);
	const classes = useStyles();
	const history = useHistory();
	const location = useLocation();
	//const [ Over, setOver ] = useState(false);
	const [ order, setOrder ] = useState([]);
	const [ anchorEl, setAnchorEl ] = React.useState(null);
	const [ menuOpen, toggleMenu ] = useState(false);
	//const [ workspace, setWorkspace ] = useState(null);
	let { path } = useRouteMatch();
	const divRef = useRef(null);
	const [ anchorMenuEL, setAnchorMenuEl ] = React.useState(null);
	const [ value, setValue ] = React.useState(0);
	const [ openIng, setOpenIng ] = React.useState(false);
	const [ ing, setIng ] = React.useState([]);

	const [ openTickets, setOpenTickets ] = React.useState(false);
	const [ tickets, setTickets ] = React.useState([]);

	const [ user, loadingUser, errorUser ] = useAuthState(firebase.auth());
	const [ users, loadingUsers, errorUsers ] = useCollection(
		user &&
			firebase.firestore().collection('users').where('event', 'array-contains', workspace ? workspace : user.uid),
		{
			snapshotListenOptions: { includeMetadataChanges: true }
		}
	);

	//get menuItems
	const [ menuitems, loading, error ] = useCollection(firebase.firestore().collection('menu'), {
		snapshotListenOptions: { includeMetadataChanges: true }
	});
	const [ orders, loadingOrders, errorOrders ] = useCollection(firebase.firestore().collection('orders'), {
		snapshotListenOptions: { includeMetadataChanges: true }
	});

	const placeOrder = () => {
		//build a batch and do it all at once
		// Get a new write batch
		/*let ordersIds = orders.docs.map((doc) => doc.id);
    */
		if (order.length) {
			const db = firebase.firestore();
			let batch = db.batch();

			order.forEach((ord) => {
				let orderRef = db.collection('orders').doc();
				batch.set(orderRef, ord);
			});

			// Commit the batch
			batch.commit().then(() => {
				console.log('Order Sent');
				setOrder([]);
			});
		}

		/*		firebase.firestore().collection('orders').add({
			created: firebase.firestore.FieldValue.serverTimestamp(),
			users: 'TEst'
		});*/
	};

	const dragEnd = (e, doc, id) => {
		e.preventDefault();
		let object = e.target.getBoundingClientRect();
		let container = divRef.current.getBoundingClientRect();

		if (isColliding(object, container)) {
			//find if id is on order array, then add complete order info
			const exists = order.some((ord) => ord.menuItemId === id);

			console.log(exists);

			if (!exists) {
				let orderItem = {
					menuItemId: id,
					orderUid: user.uid,
					orderName: doc.itemName,
					orderIngredients: doc.ingredients,
					orderImage: doc.itemImage
				};
				setOrder((prevState) => [ ...prevState, orderItem ]);
			}
		}
	};

	const isColliding = (object, container) => {
		var x1 = object.left;
		var y1 = object.top;
		var h1 = object.height;
		var w1 = object.width;

		var x2 = container.left;
		var y2 = container.top;
		var h2 = container.height;
		var w2 = container.width;

		var b1 = y1 + h1;
		var r1 = x1 + w1;

		var b2 = y2 + h2;
		var r2 = x2 + w2;

		if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
		return true;
	};

	const isOrdered = (id) => {
		return false;
	};

	const removefromDB = (id) => {
		const db = firebase.firestore();
		db
			.collection('orders')
			.doc(id)
			.delete()
			.then(() => {
				console.log('Document successfully deleted!');
			})
			.catch((error) => {
				console.error('Error removing document: ', error);
			});
	};

	const removefromOrder = (id) => {
		//filter out the item and set a new order
		const newOrder = order.filter((ord) => ord.menuItemId !== id);
		setOrder(newOrder);
	};

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const selectWorkspace = (evt) => {
		setWorkspace(evt);
		setAnchorEl(null);
	};

	const handleChange = (dir) => {
		let val;
		if (dir) {
			val = value + 1;
		} else {
			val = value - 1;
		}

		if (val > 1) val = 0;
		if (val < 0) val = 1;
		setValue(val);
	};

	const getIngredients = () => {
		let ing = [];
		if (orders) {
			orders.docs.forEach((ord) => ing.push(...ord.data().orderIngredients));

			ing.sort((a, b) => (a.id > b.id ? 1 : b.id > a.id ? -1 : 0));

			let c = [],
				prev = { id: '' };

			for (var i = 0; i < ing.length; i++) {
				if (ing[i].id !== prev.id) {
					c.push({ qu: 1, cat: ing[i].cat, name: ing[i].name, image: ing[i].image });
				} else {
					c[c.length - 1].qu++;
				}
				prev = ing[i];
			}

			c.sort((e, f) => (e.name > f.name ? 1 : f.name > e.name ? -1 : 0));

			setIng(c);
			setOpenIng(true);
			handleCloseMenu();
		}
	};

	const getAllOrders = () => {
		let ords = [];
		if (orders) {
			orders.docs.forEach((ord) => ords.push(ord.data()));
			ords.sort((a, b) => (a.menuItemId > b.menuItemId ? 1 : b.menuItemId > a.menuItemId ? -1 : 0));
			const ordersWithUser = ords.map((ord) => {
				let usr = users.docs.map((user) => {
					if (user.id === ord.orderUid) {
						return user.data();
					}
				});
				let dat = usr.filter((u) => typeof u !== 'undefined');
				if (dat.length) return { name: dat[0].name, image: dat[0].image, ...ord };
			});

			let d = ordersWithUser.filter((u) => typeof u !== 'undefined');
			console.log(d);
			setTickets(d);
			setOpenTickets(true);
			handleCloseMenu();
		}
	};

	const handleClickMenu = (event) => {
		setAnchorMenuEl(event.currentTarget);
	};

	const handleCloseMenu = () => {
		setAnchorMenuEl(null);
	};

	return (
		<div>
			<AppBar position="static">
				<Toolbar>
					<Typography variant="h6" className={classes.title}>
						Burger Bar
					</Typography>
					<IconButton
						edge="start"
						className={classes.menuButton}
						onClick={handleClickMenu}
						color="inherit"
						aria-label="menu"
						size="small"
					>
						<LocalMallIcon />
					</IconButton>
					<Menu
						id="simple-menu"
						anchorEl={anchorMenuEL}
						keepMounted
						open={Boolean(anchorMenuEL)}
						onClose={handleCloseMenu}
					>
						<MenuItem onClick={getIngredients}>Shopping List</MenuItem>
						<MenuItem onClick={getAllOrders}>Orders</MenuItem>
						<MenuItem onClick={handleCloseMenu}>Logout</MenuItem>
					</Menu>
					{/**TICKETS */}
					<Dialog
						open={openTickets}
						TransitionComponent={Transition}
						keepMounted
						fullWidth={true}
						maxWidth={'sm'}
						onClose={() => setOpenTickets(false)}
						aria-labelledby="alert-dialog-slide-title"
						aria-describedby="alert-dialog-slide-description"
					>
						<DialogTitle id="alert-dialog-slide-title">Tickets</DialogTitle>
						<DialogContent>
							<DialogContentText id="alert-dialog-slide-description">
								<List className={classes.listroot}>
									{tickets && tickets.map((ticket) => <KitchenItem order={ticket} />)}
								</List>
							</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Button onClick={() => setOpenTickets(false)} color="primary">
								Ok
							</Button>
						</DialogActions>
					</Dialog>
					{/**INGREDIENTS */}
					<Dialog
						open={openIng}
						TransitionComponent={Transition}
						keepMounted
						fullWidth={true}
						maxWidth={'sm'}
						onClose={() => setOpenIng(false)}
						aria-labelledby="alert-dialog-slide-title"
						aria-describedby="alert-dialog-slide-description"
					>
						<DialogTitle id="alert-dialog-slide-title">Zutaten</DialogTitle>
						<DialogContent>
							<DialogContentText id="alert-dialog-slide-description">
								<List className={classes.listroot}>
									{ing &&
										ing.map((ingr) => (
											<ListItem>
												<ListItemAvatar>
													<Avatar src={ingr.image} />
												</ListItemAvatar>
												<ListItemText
													primary={ingr.name}
													secondary={`${ingr.qu} x Portionen bestellt`}
												/>
												<ListItemSecondaryAction>
													<Checkbox edge="end" />
												</ListItemSecondaryAction>
											</ListItem>
										))}
								</List>
							</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Button onClick={() => setOpenIng(false)} color="primary">
								Ok
							</Button>
						</DialogActions>
					</Dialog>
					<IconButton
						edge="start"
						className={classes.menuButton}
						onClick={() => toggleMenu(!menuOpen)}
						color="inherit"
						aria-label="menu"
						size="small"
					>
						<MenuBookIcon />
					</IconButton>
					<IconButton
						edge="start"
						className={classes.menuButton}
						onClick={handleClick}
						color="inherit"
						aria-label="menu"
						size="small"
					>
						<ViewCarouselIcon />
					</IconButton>
					<Menu
						id="simple-menu"
						anchorEl={anchorEl}
						keepMounted
						open={Boolean(anchorEl)}
						onClose={handleClose}
					>
						{users &&
							users.docs.map((usr, i) => {
								if (usr.id === user.uid)
									return usr
										.data()
										.event.map(
											(evt) =>
												evt !== user.uid ? (
													<MenuItem onClick={() => selectWorkspace(evt)}>{evt}</MenuItem>
												) : null
										);
							})}
					</Menu>
					{user && (
						<WhatsappShareButton
							url={
								workspace ? (
									`${shareMessage} -> https://burger-bar-a8426.web.app/signup?${workspace}`
								) : (
									`${shareMessageNone} -> https://burger-bar-a8426.web.app/signup`
								)
							}
							className={classes.menuButton}
						>
							<WhatsappIcon size={32} round={true} />
						</WhatsappShareButton>
					)}
					<IconButton
						edge="end"
						className={classes.menuButton}
						onClick={() => {
							firebase
								.auth()
								.signOut()
								.then(function() {
									// Sign-out successful.
									history.push('/');
								})
								.catch(function(error) {
									console.log(error);
								});
						}}
						color="inherit"
						aria-label="menu"
					>
						<MeetingRoomIcon />
					</IconButton>
				</Toolbar>
			</AppBar>
			<main className="bb-main">
				{menuitems && (
					<div className="bb-menu" style={{ right: menuOpen ? '0px' : '-128px' }}>
						<IconButton
							style={{
								margin: '0 auto',
								background: 'white',
								color: 'black',
								marginTop: '10px',
								marginRight: '10px',
								width: '32px',
								height: '32px'
							}}
							className={classes.menuButton}
							onClick={() => handleChange(false)}
						>
							<SkipPreviousIcon />
						</IconButton>
						<IconButton
							style={{
								margin: '0 auto',
								background: 'white',
								color: 'black',
								marginTop: '10px',
								width: '32px',
								height: '32px'
							}}
							className={classes.menuButton}
							onClick={() => handleChange(true)}
						>
							<SkipNextIcon />
						</IconButton>

						<TabPanel value={value} index={0}>
							<MenuComp
								menuitems={menuitems.docs.filter((item) => item.data().cat === 'Burger')}
								onDragEnd={dragEnd}
							/>
						</TabPanel>
						<TabPanel value={value} index={1}>
							<MenuComp
								menuitems={menuitems.docs.filter((item) => item.data().cat === 'Sides')}
								onDragEnd={dragEnd}
							/>
						</TabPanel>
					</div>
				)}

				<div className="bb-foodarea">
					{users && (
						<React.Fragment>
							{users.docs.map((usr, i) => {
								if (usr.id === user.uid) return null;
								return (
									<motion.div
										drag
										key={usr.id}
										style={{ width: '0px' }}
										initial={{ x: 50, y: 30 * (i + 1) }}
									>
										<User name={usr.data().name} user={usr} orders={orders} />
									</motion.div>
								);
							})}
						</React.Fragment>
					)}
				</div>
				<div className="bb-platecontainer">
					{order.length === 0 && <h3 className="bb-tellertitle">Mein Teller</h3>}
					<div className="bb-plate" ref={divRef}>
						<MyPlate
							orders={orders}
							user={user}
							order={order}
							removefromOrder={removefromOrder}
							removefromDB={removefromDB}
						/>
					</div>
				</div>
				<Fab className={classes.fableft} onClick={placeOrder} disabled={order.length === 0} variant="extended">
					<RestaurantIcon className={classes.extendedIcon} />
					Bestellen
				</Fab>
				<Fab className={classes.fab} onClick={() => history.push('/burger-builder')} variant="extended">
					<BuildIcon className={classes.extendedIcon} />
					Burger Machen
				</Fab>
			</main>
		</div>
	);
}

export default Dashboard;
