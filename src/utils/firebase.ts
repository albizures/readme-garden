import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyBiyEPjjgchLQXVy4R5IMx7y-GM26TF_TU',
	authDomain: 'readme-garden.firebaseapp.com',
	projectId: 'readme-garden',
	storageBucket: 'readme-garden.appspot.com',
	messagingSenderId: '1059667282816',
	appId: '1:1059667282816:web:3840ccc5facbc6fe1f8f65',
	measurementId: 'G-4TRF5LGR81',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const store = getFirestore(app);
