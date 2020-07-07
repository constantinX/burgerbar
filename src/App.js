import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import ProtectedRoute from './components/navigation/protectedRoute';

//Views
import SignUpSide from './views/signup';
import SignInSide from './views/signin';
import Dashboard from './views/dashboard';
import Builder from './views/builder';

//import './App.css';
import './normalize.css';
import './webflow.css';
import './burger-bar.webflow.css';

function App() {
	const [ workspace, setWorkspace ] = useState(null);

	return (
		<Router>
			<Switch>
				<Route exact path="/">
					<SignInSide setWorkspace={setWorkspace} />
				</Route>
				<Route exact path="/signup">
					<SignUpSide setWorkspace={setWorkspace} />
				</Route>
				<ProtectedRoute path="/dashboard">
					<Dashboard workspace={workspace} setWorkspace={setWorkspace} />
				</ProtectedRoute>
				<ProtectedRoute path="/burger-builder">
					<Builder />
				</ProtectedRoute>
			</Switch>
		</Router>
	);
}

export default App;
