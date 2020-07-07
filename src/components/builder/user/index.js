import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

function User({ user, orders }) {
	const classes = useStyles();
	const [ open, openOrders ] = useState(false);
	const [ clicked, setClicked ] = useState(false);

	return (
		<div className="bb-usercontainer">
			<div className="bb-user" onClick={() => openOrders(!open)}>
				<img
					src={user.data().image || 'https://source.unsplash.com/random'}
					draggable="false"
					sizes="72px"
					alt=""
					className="bb-userimage"
				/>
			</div>
			<AnimatePresence>
				{!open && (
					<motion.p
						initial={{
							y: 100,
							opacity: 0,
							transition: {
								staggerChildren: 0.5
							}
						}}
						animate={{
							y: 0,
							opacity: 1,
							transition: {
								staggerChildren: 1
							}
						}}
						exit={{ y: 100, opacity: 0 }}
					>
						{user.data().name}
					</motion.p>
				)}
				{open && (
					<div className="bb-userorders">
						<ul role="list" className="bb-list w-list-unstyled">
							{orders &&
								orders.docs.map(
									(ord, i) =>
										ord.data().orderUid === user.id ? (
											<motion.li
												className="bb-listitem"
												key={i}
												initial={{
													y: 100,
													opacity: 0,
													transition: {
														staggerChildren: 0.5
													}
												}}
												animate={{
													y: 0,
													opacity: 1,
													transition: {
														staggerChildren: 1
													}
												}}
												exit={{ y: 100, opacity: 0 }}
											>
												<img
													src={ord.data().orderImage}
													width="45"
													height="45"
													sizes="45px"
													alt=""
													className="bb-orderlistimage"
												/>
												<div className="bb-orderlisttext">{ord.data().orderName}</div>
												<Dialog
													fullWidth={true}
													maxWidth={'sm'}
													open={clicked}
													onClose={() => setClicked(!clicked)}
													aria-labelledby="scroll-dialog-title"
													aria-describedby="scroll-dialog-description"
												>
													<DialogTitle id="scroll-dialog-title">
														{ord.data().orderName}
													</DialogTitle>
													<DialogContent>
														<CardMedia
															className={classes.media}
															image={ord.data().orderImage}
															title={ord.data().orderName}
														/>
														<DialogContentText id="scroll-dialog-description" tabIndex={-1}>
															<List className={classes.root}>
																{ord &&
																	ord.data().orderIngredients.map((ingredient) => (
																		<ListItem>
																			<ListItemAvatar>
																				<Avatar
																					alt={ingredient.name}
																					src={ingredient.image}
																				/>
																			</ListItemAvatar>
																			<ListItemText
																				primary={ingredient.name}
																				secondary="Jan 9, 2014"
																			/>
																		</ListItem>
																	))}
															</List>
														</DialogContentText>
													</DialogContent>
													<DialogActions>
														<Button color="primary" onClick={() => setClicked(!clicked)}>
															Schließen
														</Button>
													</DialogActions>
												</Dialog>
											</motion.li>
										) : null
								)}
						</ul>
					</div>
				)}
			</AnimatePresence>
		</div>
	);
}

export default User;
