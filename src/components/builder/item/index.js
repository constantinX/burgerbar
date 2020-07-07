import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';

const useStyles = makeStyles((theme) => ({
	nested: {
		paddingLeft: theme.spacing(4)
	}
}));

function KitchenItem({ order }) {
	const classes = useStyles();
	const [ open, setOpen ] = React.useState(false);

	const handleClickKitchen = () => {
		setOpen(!open);
	};
	return (
		<React.Fragment>
			<ListItem button onClick={handleClickKitchen}>
				<ListItemAvatar>
					<Avatar src={order.orderImage} />
				</ListItemAvatar>
				<ListItemText primary={`${order.name} will ${order.orderName}`} />
				{open ? <ExpandLess /> : <ExpandMore />}
			</ListItem>
			<Collapse in={open} timeout="auto" unmountOnExit>
				<List component="div" disablePadding>
					{order &&
						order.orderIngredients.map((ingredient) => (
							<ListItem button className={classes.nested}>
								<ListItemAvatar>
									<Avatar src={ingredient.image} />
								</ListItemAvatar>
								<ListItemText primary={ingredient.name} />
							</ListItem>
						))}
				</List>
			</Collapse>
		</React.Fragment>
	);
}

export default KitchenItem;
