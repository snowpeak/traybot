let USE_DEV_TOOL = false;
let p_devTool = process.env.TrayBot_DevTool;
if (p_devTool != null && p_devTool == 'true') {
    USE_DEV_TOOL = true;
}

const s_log4js = require('log4js');
const s_logger = s_log4js.getLogger("console");
s_logger.level = 'debug';
let p_logLevel = process.env.TrayBot_LogLevel;
if (p_logLevel != null) {
    s_logger.level = p_logLevel;
}

let s_msgDic = require('./messages').getMsgDic('ja');

s_dbLib = require('./traybot_sqlite');
s_db = null;
let s_lastkey = null;
let s_lastIds = null;
var s_lang = '';
const s_electron = require('electron');
const app = s_electron.app;
const Menu = s_electron.Menu;
const BrowserWindow = s_electron.BrowserWindow;
const shell = s_electron.shell;

let mainWindow;
// リンククリック時に OS のデフォルトブラウザで開く
function handleUrlOpen(x_event, x_url) {
    x_event.preventDefault();

    s_logger.debug(x_url);
    shell.openExternal(x_url);
};

function createWindow() {
    if (mainWindow != null) {
        return;
    }
    //app.allowRendererProcessReuse = false
    let p_width = 450;
    let p_height = 600;
    if (USE_DEV_TOOL) {
        p_width = 800;
        p_height = 800;
    }

    mainWindow = new BrowserWindow({
        width: p_width,
        height: p_height,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,  // true, since electron V12 
            preload: `${__dirname}/../html/js/bridge_traybot.js`
        }
    });

    // 開発ツールを有効化
    if (USE_DEV_TOOL) {
        mainWindow.webContents.openDevTools();
    }

    Menu.setApplicationMenu(null);
    mainWindow.setAlwaysOnTop(true);

    const size = s_electron.screen.getPrimaryDisplay().size
    mainWindow.setPosition(size.width - p_width - 20, size.height - p_height - 50);
    mainWindow.loadURL(`file://${__dirname}/../html/traybot.html`);

    // リンククリック時のイベントハンドラを登録
    //mainWindow.webContents.on('will-navigate', handleUrlOpen);
    //mainWindow.webContents.on('new-window', handleUrlOpen);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

let s_accountListWin;
function createAccountListWin() {
    if (s_accountListWin != null) {
        return;
    }
    //app.allowRendererProcessReuse = false
    let p_width = 1300;
    let p_height = 600;
    if (USE_DEV_TOOL) {
        p_width = 1400;
        p_height = 800;
    }

    let p_win = new BrowserWindow({
        width: p_width,
        height: p_height,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,  // true, since electron V12 
            preload: `${__dirname}/../html/js/bridge_accountList.js`
        }
    });
    s_accountListWin = p_win;

    // 開発ツールを有効化
    if (USE_DEV_TOOL) {
        p_win.webContents.openDevTools();
    }
    p_win.setMenu(null);
    p_win.loadURL(`file://${__dirname}/../html/accountList.html?lang=` + s_lang);

    p_win.on('closed', () => {
        s_accountListWin = null;
    });
}

let s_configurationWin;
/**
 * Create configuration window object.
 * @author LatteBeo
 */
function createConfigurationWin() {
    if (s_configurationWin != null) {
        return;
    }
    let p_width = 1300;
    let p_height = 600;
    if (USE_DEV_TOOL) {
        p_width = 1400;
        p_height = 800;
    }
    let p_win = new BrowserWindow({
        width: p_width,
        height: p_height,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,  // true, since electron V12 
            preload: `${__dirname}/../html/js/bridge_configuration.js`
        }
    });
    s_configurationWin = p_win;
    if (USE_DEV_TOOL) {
        p_win.webContents.openDevTools();
    }
    p_win.setMenu(null);
    p_win.loadURL(`file://${__dirname}/../html/configuration.html?lang=` + s_lang);

    p_win.on('closed', () => {
        s_configurationWin = null;
    });
}

let s_editAccountWin;
function createEditAccountWin(x_account) {
    if (s_editAccountWin != null) {
        return;
    }
    //app.allowRendererProcessReuse = false
    let p_width = 650;
    let p_height = 800;
    if (USE_DEV_TOOL) {
        p_width = 1000;
        p_height = 800;
    }

    let p_win = new BrowserWindow({
        width: p_width,
        height: p_height,
        show: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,  // true, since electron V12 
            preload: `${__dirname}/../html/js/bridge_editAccount.js`
        }
    });
    s_editAccountWin = p_win;

    // 開発ツールを有効化
    if (USE_DEV_TOOL) {
        p_win.webContents.openDevTools();
    }
    p_win.setMenu(null);
    p_win.loadURL(`file://${__dirname}/../html/editAccount.html?lang=` + s_lang);

    p_win.once('ready-to-show', () => {
        s_logger.info("send editAccount__setAccount()" + x_account);
        p_win.webContents.send('editAccount__setAccount', x_account);
        p_win.show();
    });

    p_win.on('closed', () => {
        s_editAccountWin = null;
    });
}

let s_showAccountWin;
function createShowAccountWin(x_account) {
    let p_win = null;
    if (s_showAccountWin == null) {
        //app.allowRendererProcessReuse = false
        let p_width = 650;
        let p_height = 800;
        if (USE_DEV_TOOL) {
            p_width = 1000;
            p_height = 800;
        }

        let p_win = new BrowserWindow({
            width: p_width,
            height: p_height,
            show: false,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,  // true, since electron V12 
                preload: `${__dirname}/../html/js/bridge_showAccount.js`
            }
        });
        s_showAccountWin = p_win;

        // 開発ツールを有効化
        if (USE_DEV_TOOL) {
            p_win.webContents.openDevTools();
        }
        p_win.setMenu(null);
        p_win.loadURL(`file://${__dirname}/../html/showAccount.html?lang=` + s_lang);

        p_win.once('ready-to-show', () => {
            s_logger.info("send showAccount__setAccount()" + x_account);
            p_win.webContents.send('showAccount__setAccount', x_account);
            p_win.show();
        });
        p_win.on('closed', () => {
            s_showAccountWin = null;
        });
    } else {
        p_win = s_showAccountWin;
        p_win.webContents.send('showAccount__setAccount', x_account);
        p_win.show();
    }
}

//-------------------------
// タスクトレイ作成
//------------------------
function createTray() {

    // タスクトレイ
    const tray = new s_electron.Tray(`${__dirname}/../image/icon-16.${process.platform === 'win32' ? 'ico' : 'png'}`);
    const nativeImage = s_electron.nativeImage;
    tray.setContextMenu(s_electron.Menu.buildFromTemplate([
        {
            label: s_msgDic["register_data"],
            icon: nativeImage.createFromPath(`${__dirname}/../image/add.png`),
            click: () => {
                createEditAccountWin(null);
            }
        },
        {
            label: s_msgDic["maintenance_data"],
            icon: nativeImage.createFromPath(`${__dirname}/../image/editList.png`),
            click: () => {
                createAccountListWin();
            }
        },
        {
            label: s_msgDic["configuration"],
            icon: nativeImage.createFromPath(`${__dirname}/../image/editList.png`),
            click: () => {
                createConfigurationWin();
            }
        },
        {
            label: 'About',
            //role: 'about',
            icon: nativeImage.createFromPath(`${__dirname}/../image/icon-16.png`),
            click: () => {
                s_electron.dialog.showMessageBoxSync({
                    title: 'TrayBot ' + s_msgDic["help_version"],
                    message: s_msgDic["help_message"],
                    detail: s_msgDic["help_detail"]
                });
            }
        },
        {
            type: 'separator'
        },
        {
            label: 'Exit',
            role: 'quit',
            icon: nativeImage.createFromPath(`${__dirname}/../image/close-16.png`),
        }
    ]));

    tray.on('click', (event, bounds, position) => {
        console.log('clicked');
        createWindow();
    });
    return tray;
}

//----------------
// 初期化
//----------------
const s_path = require('path');
app.on('ready', () => {
    // mac処理
    if (process.platform === 'darwin') g_electron.app.dock.hide();

    let p_dbPath = 'traybot.sqlite3';
    if (__dirname.indexOf('app.asar') >= 0) {
        const path = require('path');
        let p_dbDir = path.resolve(process.env['USERPROFILE'], '.traybot');
        const fs = require('fs');
        if (!fs.existsSync(p_dbDir)) {
            fs.mkdirSync(p_dbDir);
        }
        p_dbPath = path.resolve(p_dbDir, p_dbPath);
    }
    //s_dbLib.connectDB("./traybot.sqlite3")
    s_dbLib.connectDB(p_dbPath)
        .then((x_db) => {
            s_db = x_db;
            s_logger.debug("init window");

            s_dbLib.getParams(s_db, function (x_rows) {
                for (i = 0; i < x_rows.length; i++) {
                    if (x_rows[i].parameter == 'lang') {
                        s_lang = x_rows[i].value;
                    }

                }
                s_msgDic = require('./messages').getMsgDic(s_lang);
                g_tray = createTray();

            });


        })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        //app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

//-----------------------------
// routing
//-----------------------------
const { ipcMain } = require('electron');
ipcMain.on('traybot__search', (x_event, x_key) => {
    s_logger.debug("traybot__search received: " + x_key);

    s_dbLib.getAccounts(s_db, x_key, (x_rows) => {
        x_event.sender.send('traybot__resSearch', x_rows);
    })
})
ipcMain.on('traybot__getById', (x_event, x_id) => {
    s_logger.debug("traybot__getById received: " + x_id);

    s_dbLib.getAccount(s_db, x_id, (x_account) => {
        x_event.sender.send('traybot__resSearch', [x_account]);
    })
})
ipcMain.on('traybot__showById', (x_event, x_id) => {
    s_logger.debug("traybot__showById received: " + x_id);

    s_dbLib.getAccount(s_db, x_id, (x_account) => {
        createShowAccountWin(x_account);
    })
})
ipcMain.on('traybot__openWindow', (x_event, x_url) => {
    s_logger.debug("traybot__openWindow received: " + x_url);
    shell.openExternal(x_url);
})

ipcMain.on('accountList__search', (x_event, x_key) => {
    s_logger.debug("accountList__search received: " + x_key);

    s_dbLib.getAccounts(s_db, x_key, (x_rows) => {
        x_event.sender.send('accountList__resSearch', x_rows);
    })
})
ipcMain.on('accountList__editAccount', (x_event, x_id) => {
    s_logger.debug("accountList__editAccount received: " + x_id);
    if (x_id == null) {
        createEditAccountWin(x_id);
    } else {
        s_dbLib.getAccount(s_db, x_id, (x_account) => {
            createEditAccountWin(x_account);
        })
    }
})
ipcMain.on('editAccount__saveAccount', (x_event, x_account) => {
    if (x_account.title == null || x_account.title == "") {
        x_event.sender.send('editAccount__inserted', null, s_msgDic.require_title);
        return;
    }

    s_logger.debug("editAccount__saveAccount received: " + x_account);
    if (x_account.id == null || x_account.id == "") {
        s_dbLib.insert(s_db, "account", s_dbLib.TBL_ACCOUNT_COLS, x_account, (x_id) => {
            x_event.sender.send('editAccount__inserted', x_id);
        });
    } else {
        s_dbLib.update(s_db, "account", s_dbLib.TBL_ACCOUNT_COLS, x_account, (x_status) => {
            if (x_status) {
                x_event.sender.send('editAccount__updated', null);
            } else {
                x_event.sender.send('editAccount__updated', s_msgDic.error);
            }
        });
    }
})
ipcMain.on('editAccount__delAccount', (x_event, x_id) => {
    s_logger.debug("editAccount__delAccount received: " + x_id);
    s_dbLib.delete(s_db, "account", "id", [x_id], (x_status) => {
        if (x_status) {
            x_event.sender.send('editAccount__deleted', null);
        } else {
            x_event.sender.send('editAccount__deleted', s_msgDic.error);
        }
    });
})
ipcMain.on('configuration__getParams', (x_event, x_id) => {
    s_dbLib.getParams(s_db, (x_rows) => {
        x_event.sender.send('configuration__gotParams', x_rows);
    });
})
ipcMain.on('configuration__saveParams', (x_event, x_id) => {
    s_dbLib.saveParam(s_db, 'lang', x_id);
    s_lang = x_id;
})