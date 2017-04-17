var MockFirebase = require('./firebase');
var assert = require('assert');


class MockFirebaseDatabase {

  constructor(createDatabase) {
    this._createDatabase = createDatabase;
  }

  ref(path) {
    return this._createDatabase ? this._createDatabase(path) : new MockFirebase(path);
  }

  refFromURL(url) {
    return this.ref(url);
  }
}

class MockFirebaseApp {
  name;
  database;
  auth;
  messaging;
  storage;

  constructor(name) {
    this.name = name;
    var db = new MockFirebaseDatabase();
    this.database = () => {
      return db;
    };

    var auth = new MockFirebase();
    this.auth = () => {
      return auth;
    };

    this.messaging = () => {
    };
    
    this.storage = () => {
    };
  }
}

const defaultAppName = "[DEFAULT]";

class MockFirebaseSdk {
  constructor() {
    this._apps = {};
    this._defaultApp = undefined;
  }

  database(app) {
    return this._resolveApp(app, "database").database();
  }

  auth(app) {
    return this._resolveApp(app, "auth").auth();
  }

  _resolveApp(app, forCall) {
    let resolvedApp = app || this._defaultApp;
    assert(resolvedApp, `Default app is not initialized. Call initializeApp() before calling ${forCall}()`);
    return resolvedApp;
  }

  initializeApp(appKey, appSecret, appName) {
    let app = new MockFirebaseApp(appName || defaultAppName);
    if (!this._defaultApp) {
      this._defaultApp = app;
    }
    this._apps[app.name] = app;
    return app;
  }


  // function MockFirebaseAuth() {
  //   if (!auth) {
  //     auth = createAuth ? createAuth() : new MockFirebase();
  //     delete auth.ref;
  //   }
  //   return auth;
  // }
  // MockFirebaseAuth.GoogleAuthProvider = function() {
  //   this.providerId = "google.com";
  // };
  // MockFirebaseAuth.TwitterAuthProvider = function() {
  //   this.providerId = "twitter.com";
  // };
  // MockFirebaseAuth.FacebookAuthProvider = function() {
  //   this.providerId = "facebook.com";
  // };
  // MockFirebaseAuth.GithubAuthProvider = function() {
  //   this.providerId = "github.com";
  // };
  //
  // function MockFirebaseDatabase() {
  //   return {
  //     ref: function(path) {
  //       return createDatabase ? createDatabase(path) : new MockFirebase(path);
  //     },
  //     refFromURL: function(url) {
  //       return createDatabase ? createDatabase(url) : new MockFirebase(url);
  //     }
  //   };
  // }
  //
  // return {
  //   database: MockFirebaseDatabase,
  //   auth: MockFirebaseAuth,
  //   initializeApp: function(appKey, appSecret, appName) {
  //     return new MockFirebaseApp(appName ?: "[DEFAULT]");
  //   }
  // };
}

module.exports = MockFirebaseSdk;
