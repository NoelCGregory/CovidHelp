let currentUser;
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    currentUser = firebase.auth().currentUser;
  } else {
    //Redirect to login page
    window.location.replace("AuthSection/LoginMethods.html");
  }
});

function logout() {
  firebase.auth().signOut();
}