const electron       = require('electron');
const app            = electron.app;
const globalShortcut = electron.globalShortcut;
const BrowserWindow  = electron.BrowserWindow;
const Tray           = electron.Tray;
const path           = require('path');
const url            = require('url');
const isOSX          = /^darwin/.test(process.platform);

let tray           = null;
let mainWindow     = null;
let settingsWindow = null;

app.disableHardwareAcceleration();


function createMainWindow()
{
    mainWindow = new BrowserWindow({
        width:       800,
        height:      600,
        resizable:   false,
        movable:     false,
        minimizable: false,
        maximizable: false,
        closable:    false,
        skipTaskbar: true,
        alwaysOnTop: true,
        frame:       false,
        hasShadow:   false,
        //transparent: true,
        show:        false,
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes:  true
    }));

    //mainWindow.webContents.openDevTools();

    mainWindow.on('closed', function()
    {
        mainWindow = null;
    });

    //TODO: make this configurable
    const ret = globalShortcut.register(isOSX ? 'Command+P' : 'PrintScreen', () =>
    {
        //console.log('PrintScreen is pressed');
        mainWindow.webContents.send('take-screenshot');
    });

    if (!ret)
        console.log('registration failed');

    // Check whether a shortcut is registered.
    //console.log(globalShortcut.isRegistered('PrintScreen'))

    if (isOSX)
        app.dock.hide();
}

function createSettingsWindow()
{
    if (!settingsWindow)
    {
        settingsWindow = new BrowserWindow({
            width:       560,
            height:      255,
            resizable:   false,
            movable:     true,
            minimizable: true,
            maximizable: true,
            closable:    true,
            skipTaskbar: false,
            alwaysOnTop: false,
            frame:       true,
            hasShadow:   true,
            transparent: false,
            show:        true,
        });
        settingsWindow.setMenu(null);

        settingsWindow.loadURL(url.format({
            pathname: path.join(__dirname, 'settings.html'),
            protocol: 'file:',
            slashes:  true
        }));

        settingsWindow.on('closed', function()
        {
            settingsWindow = null;
        });
    }
    else
        settingsWindow.show();
}

global.macOnTop = function()
{
    if (isOSX)
    {
        let $ = require('NodObjC');
        $.import('Cocoa');
        $.import('Foundation');
        $.import('AppKit');
        $.import('QuartzCore');

        let appO = $.NSApplication('sharedApplication');

        //let AppDelegate = $.NSObject.extend('AppDelegate');
        appO('setPresentationOptions',
            $.NSApplicationPresentationHideDock |
            $.NSApplicationPresentationHideMenuBar |
            $.NSApplicationPresentationDisableAppleMenu |
            $.NSApplicationPresentationDisableProcessSwitching |
            $.NSApplicationPresentationDisableForceQuit |
            $.NSApplicationPresentationDisableSessionTermination |
            $.NSApplicationPresentationDisableHideApplication);
    }
};

global.macOffTop = function()
{
    if (isOSX)
    {
        let $ = require('NodObjC');
        $.import('Cocoa');
        $.import('Foundation');
        $.import('AppKit');
        $.import('QuartzCore');

        let appO = $.NSApplication('sharedApplication');
        appO('setPresentationOptions', $.NSApplicationPresentationDefault);
    }
};

app.on('ready', () =>
{
    createMainWindow();

    tray              = new Tray(path.join(__dirname, 'img/icon.png'));
    const contextMenu = electron.Menu.buildFromTemplate([{
            label: 'Settings',
            type:  'normal',
            click: function()
            {
                createSettingsWindow();
            }
        }, {
            label: 'Exit',
            type:  'normal',
            click: function()
            {
                app.exit();
            }
        }
    ]);
    tray.setToolTip('Karoo Poacher');
    tray.setContextMenu(contextMenu);
});

app.on('window-all-closed', function()
{
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin')
        app.quit()
});

app.on('activate', function()
{
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null)
        createMainWindow()
});

app.on('will-quit', () =>
{
    globalShortcut.unregister(isOSX ? 'Command+P' : 'PrintScreen');
    //globalShortcut.unregisterAll()
});
