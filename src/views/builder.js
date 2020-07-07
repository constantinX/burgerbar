import React, { useContext, useState, useRef, useEffect } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { WhatsappShareButton } from 'react-share';
import { WhatsappIcon } from 'react-share';
import { useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import FirebaseContext from '../imports/contexts/FirebaseContext';
import { motion, AnimatePresence } from 'framer-motion';
import Fab from '@material-ui/core/Fab';
import NavigationIcon from '@material-ui/icons/Navigation';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import { useAuthState } from 'react-firebase-hooks/auth';
import Grid from '@material-ui/core/Grid';
import Ingredients from '../components/ingredient';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import clsx from 'clsx';
import Box from '@material-ui/core/Box';
import SkipNextIcon from '@material-ui/icons/SkipNext';

import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';

const initialOrder = {
	orderImage: 'https://image.flaticon.com/icons/svg/3075/3075977.svg',
	orderName: 'Mein Lecker Burger',
	orderUid: '',
	orderIngredients: [],
	menuItemId: 'custom'
};

const menuInit = {
	cat: 'Burger',
	itemImage: 'https://image.flaticon.com/icons/svg/3075/3075977.svg',
	itemName: 'Mein Lecker Burger',
	ingredients: []
};

const isSetup = false;

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex'
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
		marginRight: theme.spacing(2)
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
	hide: {
		display: 'none'
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
	extendedIcon: {
		marginRight: theme.spacing(1)
	}
}));

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

function Builder(props) {
	const firebase = useContext(FirebaseContext);
	const classes = useStyles();
	const history = useHistory();
	const [ value, setValue ] = React.useState(0);

	const [ order, setOrder ] = useState(isSetup ? menuInit : initialOrder);
	const [ menuOpen, toggleMenu ] = useState(false);
	const divRef = useRef(null);
	let { path } = useRouteMatch();
	const [ user, loadingUser, errorUser ] = useAuthState(firebase.auth());

	console.log('isSetup: ', isSetup);

	const handleChange = (dir) => {
		let val;
		if (dir) {
			val = value + 1;
		} else {
			val = value - 1;
		}

		if (val > 6) val = 0;
		if (val < 0) val = 6;
		setValue(val);
	};

	//get menuItems
	const [ ingredients, loading, error ] = useCollection(firebase.firestore().collection('ingredients'), {
		snapshotListenOptions: { includeMetadataChanges: true }
	});

	const placeOrder = () => {
		/*place the order for this order Item*/
		order.orderUid = user.uid;
		firebase.firestore().collection(isSetup ? 'menu' : 'orders').add(order).then(() => history.push('/dashboard'));
	};

	const dragEnd = (e, doc, id) => {
		e.preventDefault();
		let object = e.target.getBoundingClientRect();
		let container = divRef.current.getBoundingClientRect();

		if (isColliding(object, container)) {
			//find if id is on order array, then add complete order info
			//const exists = order.some((ord) => ord.menuItemId === id);
			//add ingredient to order
			if (isSetup) {
				setOrder((prevState) => {
					return { ...prevState, ingredients: [ ...order.ingredients, { id: id, ...doc } ] };
				});
			} else {
				setOrder((prevState) => {
					return { ...prevState, orderIngredients: [ ...order.orderIngredients, { id: id, ...doc } ] };
				});
			}
		}
		console.log(order);
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

	const onChange = (e) => {
		const { value, name } = e.target;
		setOrder((prevState) => {
			return { ...prevState, [name]: value };
		});
	};

	const removefromIngredient = (id) => {
		//filter out the item and set a new order
		//const newIngredients = order.orderIngredients.filter((ord) => ord.id !== id);
		if (isSetup) {
			order.ingredients.splice(id, 1);
			setOrder((prevState) => {
				return { ...prevState, ingredients: order.ingredients };
			});
		} else {
			order.orderIngredients.splice(id, 1);
			setOrder((prevState) => {
				return { ...prevState, orderIngredients: order.orderIngredients };
			});
		}
	};

	return (
		<div>
			<AppBar position="static" style={{ zIndex: '999' }}>
				<Toolbar>
					<IconButton
						edge="start"
						className={classes.menuButton}
						onClick={() => history.push('/dashboard')}
						color="inherit"
						aria-label="menu"
					>
						<ArrowBackIcon />
					</IconButton>
					<IconButton
						edge="start"
						className={classes.menuButton}
						onClick={() => toggleMenu(!menuOpen)}
						color="inherit"
						aria-label="menu"
					>
						<MenuBookIcon />
					</IconButton>
					<Typography variant="h6" className={classes.title}>
						Burger Bar
					</Typography>
					<Fab
						className={classes.fab}
						onClick={placeOrder}
						disabled={isSetup ? !order.ingredients.length : !order.orderIngredients.length}
						variant="extended"
					>
						<NavigationIcon className={classes.extendedIcon} />
						Bestellen
					</Fab>
				</Toolbar>
			</AppBar>

			<main className="bb-main" style={{ textAlign: 'center' }}>
				{ingredients && (
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
							<Ingredients
								ingredients={ingredients.docs.filter(
									(ingredient) => ingredient.data().cat === 'Veggies'
								)}
								onDragEnd={dragEnd}
							/>
						</TabPanel>
						<TabPanel value={value} index={1}>
							<Ingredients
								ingredients={ingredients.docs.filter((ingredient) => ingredient.data().cat === 'Beef')}
								onDragEnd={dragEnd}
							/>
						</TabPanel>
						<TabPanel value={value} index={2}>
							<Ingredients
								ingredients={ingredients.docs.filter((ingredient) => ingredient.data().cat === 'Salat')}
								onDragEnd={dragEnd}
							/>
						</TabPanel>
						<TabPanel value={value} index={3}>
							<Ingredients
								ingredients={ingredients.docs.filter((ingredient) => ingredient.data().cat === 'Sauce')}
								onDragEnd={dragEnd}
							/>
						</TabPanel>
						<TabPanel value={value} index={4}>
							<Ingredients
								ingredients={ingredients.docs.filter((ingredient) => ingredient.data().cat === 'Bun')}
								onDragEnd={dragEnd}
							/>
						</TabPanel>
						<TabPanel value={value} index={5}>
							<Ingredients
								ingredients={ingredients.docs.filter((ingredient) => ingredient.data().cat === 'Dairy')}
								onDragEnd={dragEnd}
							/>
						</TabPanel>
						<TabPanel value={value} index={6}>
							<Ingredients
								ingredients={ingredients.docs.filter(
									(ingredient) => ingredient.data().cat === 'Specials'
								)}
								onDragEnd={dragEnd}
							/>
						</TabPanel>
					</div>
				)}
				<div className="bb-foodarea">
					<div style={{ width: '100%', maxWidth: '320px', padding: '20px' }}>
						<TextField
							onChange={onChange}
							name={isSetup ? 'itemName' : 'orderName'}
							id="outlined-basic"
							fullWidth
							style={{ color: 'white' }}
							label="Burger Name"
							value={isSetup ? order.itemName : order.orderName}
							variant="filled"
						/>
					</div>
				</div>
				<div className="bb-platecontainer">
					{order.length === 0 && <h3 className="bb-tellertitle">Mein Teller</h3>}
					<div className="bb-plate" ref={divRef}>
						<Grid
							container
							style={{ position: 'absolute', bottom: '50px' }}
							direction="column-reverse"
							justify="center"
							alignItems="center"
							spacing={0}
						>
							{order &&
								!isSetup &&
								order.orderIngredients.map((ingredient, i) => (
									<Grid key={i} item xs={12}>
										<img
											onClick={() => removefromIngredient(i)}
											alt=""
											width="50px"
											height="50px"
											src={ingredient.image}
										/>
									</Grid>
								))}
							{order &&
								isSetup &&
								order.ingredients.map((ingredient, i) => (
									<Grid key={i} item xs={12}>
										<img
											onClick={() => removefromIngredient(i)}
											alt=""
											width="50px"
											height="50px"
											src={ingredient.image}
										/>
									</Grid>
								))}
						</Grid>
					</div>
				</div>
			</main>
		</div>
	);
}

export default Builder;
