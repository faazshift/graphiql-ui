let {app, session, BrowserWindow} = require('electron');

let path = require('path');
let url = require('url');

class GraphiQL_UI {
    constructor(config = {}) {
        this.config = Object.assign({
            size: {
                minWidth: 600,
                minHeight: 500,
                width: 800,
                height: 600
            }
        }, config);
    }

    setup() {
        // Slightly intelligent initial window sizing
        let electronScreen = require('electron').screen;
        let display = electronScreen.getPrimaryDisplay();
        let defaultSize = {
            minWidth: this.config.size.minWidth,
            minHeight: this.config.size.minHeight
        };
        defaultSize.width = parseInt(display.size.width * (1 / 2));
        defaultSize.width = defaultSize.width > 1600 ? 1600 : defaultSize.width;
        defaultSize.height = parseInt(defaultSize.width * (3 / 4));
        defaultSize.height = defaultSize.height > display.size.height ? display.size.height : defaultSize.height;

        this.config.size = defaultSize;

        // Disable pesky origin control for web requests
        session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
          if('Origin' in details.requestHeaders && details.requestHeaders['Origin'] == 'null') {
            delete details.requestHeaders['Origin'];
          }
          callback({cancel: false, requestHeaders: details.requestHeaders});
        });
    }

    createMainWindow() {
        if(!('main' in this) || this.main === null) {
            this.main = new BrowserWindow({
                show: false,
                minWidth: this.config.size.minWidth,
                minHeight: this.config.size.minHeight,
                width: this.config.size.width,
                height: this.config.size.height
            });

            this.main.once('ready-to-show', () => {
                this.main.show();
            });

            this.main.on('closed', () => {
                this.main = null;
            });

            this.loadMain();
        }
    }

    loadMain() {
        let mainURL = url.format({
            pathname: path.join(__dirname, 'app', 'main.html'),
            protocol: 'file:',
            slashes: true
        });

        this.main.loadURL(mainURL);
    }

    run() {
        app.on('ready', () => {
            this.setup();
            this.createMainWindow();
        });

        app.on('activate', () => {
            this.createMainWindow();
        });

        app.on('window-all-closed', () => {
            if(process.platform !== 'darwin') {
                app.quit();
            }
        });
    }
}

if(require.main === module) {
    let config = {};

    // For now, we won't use any config files
    // We may in the future
    //
    // try {
    //     config = require('./config.json');
    // } catch(e) {
    //     console.error('Config missing or invalid.');
    //     process.exit(1);
    // }

    let main = new GraphiQL_UI();
    main.run();
} else {
    console.error('This cannot be required');
}