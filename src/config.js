// configs for firebase

var config = {
  apiKey: 'AIzaSyAbzg4dEXqsW80kDzzba5fBSTvO3OAm7z0',
  authDomain: 'ng-fitness-app-192c2.firebaseapp.com',
  databaseURL: 'https://ng-fitness-app-192c2.firebaseio.com',
  projectId: 'ng-fitness-app-192c2',
  storageBucket: 'ng-fitness-app-192c2.appspot.com',
  messagingSenderId: '443264938561'
};
// Initialize Firebase
firebase.initializeApp(config);

window.firestore = firebase.firestore();
window.auth = firebase.auth();
