import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import FirebaseContext from '../../imports/contexts/FirebaseContext';

import { useAuthState } from 'react-firebase-hooks/auth';
// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function ProtectedRoute({ children, ...rest }) {
	const firebase = useContext(FirebaseContext);
	const [ user, loading, error ] = useAuthState(firebase.auth());

	return (
		<Route
			{...rest}
			render={({ location }) =>
				user ? (
					children
				) : (
					<Redirect
						to={{
							pathname: '/',
							state: { from: location }
						}}
					/>
				)}
		/>
	);
}

export default ProtectedRoute;
