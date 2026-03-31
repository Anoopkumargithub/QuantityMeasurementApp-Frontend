app.service("AuthService", function ($q, FIREBASE_CONFIG) {
  function validateFirebaseConfig(config) {
    return config
      && config.apiKey && config.apiKey.indexOf("REPLACE_WITH") === -1
      && config.authDomain && config.authDomain.indexOf("REPLACE_WITH") === -1
      && config.projectId && config.projectId.indexOf("REPLACE_WITH") === -1
      && config.appId && config.appId.indexOf("REPLACE_WITH") === -1;
  }

  if (!validateFirebaseConfig(FIREBASE_CONFIG)) {
    throw new Error("Firebase is not configured. Update app/config/firebase.config.js with your project values.");
  }

  if (!firebase.apps || !firebase.apps.length) {
    firebase.initializeApp(FIREBASE_CONFIG);
  }

  var auth = firebase.auth();

  this.signUp = function (email, password) {
    return $q.when(auth.createUserWithEmailAndPassword(email, password));
  };

  this.signIn = function (email, password) {
    return $q.when(auth.signInWithEmailAndPassword(email, password));
  };

  this.signInWithGoogle = function () {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account"
    });

    return $q.when(auth.signInWithPopup(provider));
  };

  this.linkGoogleProvider = function () {
    var user = auth.currentUser;

    if (!user) {
      return $q.reject(new Error("No authenticated user."));
    }

    var provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account"
    });

    return $q.when(user.linkWithPopup(provider));
  };

  this.signOut = function () {
    return $q.when(auth.signOut());
  };

  this.getCurrentUser = function () {
    return auth.currentUser;
  };

  this.getIdToken = function (forceRefresh) {
    var user = auth.currentUser;

    if (!user) {
      return $q.reject(new Error("No authenticated user."));
    }

    return $q.when(user.getIdToken(!!forceRefresh));
  };

  this.onAuthStateChanged = function (callback) {
    return auth.onAuthStateChanged(callback);
  };
});
