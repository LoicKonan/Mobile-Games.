const firebaseConfig = {
    apiKey: "AIzaSyBtV2iYKp0itQUxvB8A-r3PGYVjQxXUsaE",
    authDomain: "circ-vs-polyg.firebaseapp.com",
    projectId: "circ-vs-polyg",
    storageBucket: "circ-vs-polyg.appspot.com",
    messagingSenderId: "418614147804",
    appId: "1:418614147804:web:4040b506eb99f385bb5219",
    measurementId: "G-9TKE5ZS51E"
};
// Does all the firebase stuff, singleton
class FireManager {
    /**
    * FireManager is a SINGLETON; DO NOT USE CONSTRUCTOR!
    * (Use FireManager.get() instead)
    */
    constructor() {
        this.instance = null;
        // Initialize the firebase app
        this.app = firebase.initializeApp(firebaseConfig);
        // firebase.analytics();
    };

    static get() {
        if (this.instance == null) {
            this.instance = new FireManager();
        }
        return this.instance;
    }

    async signInWithGoogle() {
        // Provider is a connection to the given authentication service
        // (In this case, Google!)
        var provider = new firebase.auth.GoogleAuthProvider();
        try {
            // Try to sign in (with a popup, must not be blocked!)
            return await firebase.auth().signInWithPopup(provider);
        }
        catch (e) {
            throw (e);
        }
    }

    async signOut() {
        try {
            // Try to sign out
            await firebase.auth().signOut();
        }
        catch (e) {
            throw (e);
        }
    }

    user() {
        if (this.app)
            return this.app.auth().currentUser;
        else
            return null;
    }
}