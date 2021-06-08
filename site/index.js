const LocalStorage = require('local-storage.js').ElmLocalStoragePorts;

const app = Elm.Main.init({node: document.getElementById('main')});

// Subscribe to local storage.
const localStorage = new LocalStorage();
localStorage.subscribe(app);
