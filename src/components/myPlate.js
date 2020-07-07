import React from 'react';
import OrderedItem from './orderedItem';

function MyPlate({ orders, user, order, removefromDB, removefromOrder }) {
	return (
		<React.Fragment>
			{orders &&
				orders.docs.map(
					(ord, i) =>
						ord.data().orderUid === user.uid ? (
							<OrderedItem
								key={i}
								className="bb-alreadyordered"
								remove={removefromDB}
								order={ord.data()}
								id={ord.id}
							/>
						) : null
				)}
			{order &&
				order.map(
					(ord, i) =>
						ord.orderUid === user.uid ? (
							<OrderedItem
								className="bb-tobeordered"
								key={i}
								remove={removefromOrder}
								order={ord}
								id={ord.menuItemId}
							/>
						) : null
				)}
		</React.Fragment>
	);
}

export default MyPlate;
