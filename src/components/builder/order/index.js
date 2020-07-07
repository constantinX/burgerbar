import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		maxWidth: 360,
		backgroundColor: theme.palette.background.paper
	},
	media: {
		height: 140
	}
}));

function OrderedItem({ remove, id, order, className }) {
	const classes = useStyles();
	const [ clicked, setClicked ] = useState(false);

	return (
		<div
			className={className}
			style={{ backgroundImage: `url(${order.orderImage})`, backgroundSize: 'cover' }}
			onClick={() => setClicked(!clicked)}
		>
			<Dialog
				fullWidth={true}
				maxWidth={'sm'}
				open={clicked}
				onClose={() => setClicked(!clicked)}
				aria-labelledby="scroll-dialog-title"
				aria-describedby="scroll-dialog-description"
			>
				<DialogTitle id="scroll-dialog-title">{order.orderName}</DialogTitle>
				<DialogContent>
					<CardMedia className={classes.media} image={order.orderImage} title={order.orderName} />
					<DialogContentText id="scroll-dialog-description" tabIndex={-1}>
						<List className={classes.root}>
							{order &&
								order.orderIngredients.map((ingredient) => (
									<ListItem>
										<ListItemAvatar>
											<Avatar alt={ingredient.name} src={ingredient.image} />
										</ListItemAvatar>
										<ListItemText primary={ingredient.name} />
									</ListItem>
								))}
						</List>
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button color="primary" onClick={() => remove(id)}>
						Abbestellen
					</Button>
					<Button color="primary" onClick={() => setClicked(!clicked)}>
						Schließen
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

export default OrderedItem;
