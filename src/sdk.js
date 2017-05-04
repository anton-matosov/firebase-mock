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

class MockFirebaseAuth extends MockFirebase {

  constructor() {
    super(...arguments);

    delete this.ref;
  }

  GoogleAuthProvider() {
    this.providerId = "google.com";
  }

  TwitterAuthProvider() {
    this.providerId = "twitter.com";
  }

  FacebookAuthProvider() {
    this.providerId = "facebook.com";
  }

  GithubAuthProvider() {
    this.providerId = "github.com";
  }
}

class MockFirebaseApp {
  name;

  database() {
    return this._db;
  }

  auth() {
    return this._auth;
  }

  messaging() {
    return this._messaging;
  }
  
  storage() {
    return this._storage;
  }

  constructor(name) {
    this.name = name;
    this._db = new MockFirebaseDatabase();
    this._auth = new MockFirebaseAuth();
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
}

module.exports = MockFirebaseSdk;
