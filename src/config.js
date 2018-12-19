// configs for firebase

var config = {
  apiKey: '<your-key>',
  authDomain: '<your-project-authdomain>',
  databaseURL: '<your-database-URL>',
  projectId: '<your-project-id>',
  storageBucket: '<your-storage-bucket>',
  messagingSenderId: '<your-messaging-sender-id>'
};
// Initialize Firebase
firebase.initializeApp(config);

window.firestore = firebase.firestore();
window.auth = firebase.auth();
