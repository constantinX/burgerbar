import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

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

function Ingredients({ ingredients, container, onDragEnd }) {
	const classes = useStyles();
	const [ clicked, setClicked ] = useState(false);
	useEffect(() => console.log(ingredients), [ ingredients ]);
	return (
		<React.Fragment>
			<h1 className="bb-menutitle">{ingredients[0].data().cat}</h1>
			<ul role="list" className="bb-menulist w-list-unstyled">
				{ingredients &&
					ingredients.map((doc, i) => (
						<motion.li
							key={i}
							className="bb-ingredientitem"
							onDoubleClick={() => setClicked(!clicked)}
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
							whileHover={{ scale: 1.03 }}
							whileTap={{ scale: 1.12 }}
						>
							<img
								draggable="false"
								src={doc.data().image}
								sizes="(max-width: 479px) 90px, 128px"
								alt=""
								className="ingredientimage"
							/>
							{doc.data().name}
						</motion.li>
					))}
			</ul>
		</React.Fragment>
	);
}

export default Ingredients;
