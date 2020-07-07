//import React from 'react'
// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import * as firebase from 'firebase/app';

// Add the Firebase services that you want to use

import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';
//import { firestore } from 'firebase';
// Get the `FieldValue` object
//import { is } from 'immutable';

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

class Firebase {
	constructor() {
		firebase.initializeApp(config);
		this.auth = firebase.auth();
		this.db = firebase.firestore();
		this.storage = firebase.storage();
	}
}

export default Firebase;
