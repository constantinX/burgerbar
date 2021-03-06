import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

//import Firebase from './imports/data/Firebase';
import FirebaseContext from './imports/contexts/FirebaseContext';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

// Initialize Firebase
const prodConfig = {
	apiKey: 'AIzaSyBaDjgbD52e0TMGDugMtpSe9kLzcYGd-ro',
	authDomain: 'burger-bar-a8426.firebaseapp.com',
	databaseURL: 'https://burger-bar-a8426.firebaseio.com',
	projectId: 'burger-bar-a8426',
	storageBucket: 'burger-bar-a8426.appspot.com',
	messagingSenderId: '990935591145',
	appId: '1:990935591145:web:db639db6ad8d8624e2a878',
	measurementId: 'G-6NNPV2GFL9'
};

var devConfig = {
	apiKey: 'AIzaSyBaDjgbD52e0TMGDugMtpSe9kLzcYGd-ro',
	authDomain: 'burger-bar-a8426.firebaseapp.com',
	databaseURL: 'https://burger-bar-a8426.firebaseio.com',
	projectId: 'burger-bar-a8426',
	storageBucket: 'burger-bar-a8426.appspot.com',
	messagingSenderId: '990935591145',
	appId: '1:990935591145:web:db639db6ad8d8624e2a878',
	measurementId: 'G-6NNPV2GFL9'
};

const config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;

firebase.initializeApp(config);

ReactDOM.render(
	<FirebaseContext.Provider value={firebase}>
		<App />
	</FirebaseContext.Provider>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
