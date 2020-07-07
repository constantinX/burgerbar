import React, { useState } from 'react';
import { motion } from 'framer-motion';
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

function MenuComp({ menuitems, container, onDragEnd }) {
	const classes = useStyles();
	const [ clicked, setClicked ] = useState('');
	return (
		<React.Fragment>
			<h1 className="bb-menutitle">{menuitems[0].data().cat}</h1>
			<ul role="list" className="bb-menulist w-list-unstyled">
				{menuitems &&
					menuitems.map((doc, i) => (
						<motion.li
							key={i}
							className="bb-menuitem"
							onDoubleClick={() => setClicked(doc.id)}
							drag
							dragConstraints={container}
							dragTransition={{ bounceStiffness: 200, bounceDamping: 10 }}
							onDragEnd={(e) => onDragEnd(e, doc.data(), doc.id)}
							layoutTransition={{
								type: 'spring',
								delay: 0.4,
								damping: 20,
								stiffness: 300
							}}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 1.2 }}
						>
							<img
								draggable="false"
								src={doc.data().itemImage}
								sizes="(max-width: 479px) 90px, 128px"
								alt=""
								className="image"
							/>
							<p style={{ fontSize: '12px' }}>{doc.data().itemName}</p>
							<Dialog
								fullWidth={true}
								maxWidth={'sm'}
								open={clicked === doc.id ? true : false}
								onClose={() => setClicked('')}
								aria-labelledby="scroll-dialog-title"
								aria-describedby="scroll-dialog-description"
							>
								<DialogTitle id="scroll-dialog-title">{doc.data().itemName}</DialogTitle>
								<DialogContent>
									<CardMedia
										className={classes.media}
										image={doc.data().itemImage}
										title={doc.data().itemName}
									/>
									<DialogContentText id="scroll-dialog-description" tabIndex={-1}>
										<List className={classes.root}>
											{doc &&
												doc.data().ingredients.map((ingredient, i) => (
													<ListItem key={i}>
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
									<Button color="primary" onClick={() => setClicked('')}>
										Schließen
									</Button>
								</DialogActions>
							</Dialog>
						</motion.li>
					))}
			</ul>
		</React.Fragment>
	);
}

export default MenuComp;
