var karoo;
(function (karoo) {
    var poacher;
    (function (poacher) {
        var ScreenshotApp = (function () {
            function ScreenshotApp() {
                var _this = this;
                this.tools = [];
                this.inBrowser = false;
                this.testMode = true;
                this.inBrowser =
                    !window || !window['process'] || !window['process'].versions || !window['process'].versions.electron;
                this.isOSX = /^darwin/.test(window['process'].platform);
                if (!this.inBrowser) {
                    this.electron = require('electron');
                    this.screenshotTool = require('cli-fullscreen-screenshot');
                    this.win = this.electron.remote.getCurrentWindow();
                    this.electron.ipcRenderer.on('take-screenshot', function () { return _this.takeScreenshot(); });
                    Mousetrap.bind('esc', function () { return _this.hideWindow(); });
                }
                this.bindHotkeys();
                //FIXME: get rid of ugly jquery usage
                jQuery(function () { _this.setUpCanvas(); });
                if (this.inBrowser && this.testMode)
                    jQuery(function () { _this.fakeScreenshot(); });
                this.exportCanvas = document.createElement('CANVAS');
                this.loadCloudProviderSettings();
            }
            ScreenshotApp.prototype.takeScreenshot = function () {
                var _this = this;
                this.hideWindow(true);
                this.restart();
                var path = require('path');
                var screenshotFilename = path.join(__dirname, '/tmp/screenshot_' + Math.random() + '.png');
                var screenshotConfig = {
                    outfile: screenshotFilename
                };
                new this.screenshotTool.Screenshot(screenshotConfig, function (error /*, complete*/) {
                    if (error) {
                        console.log('Screenshot failed', error);
                        return;
                    }
                    var $img = jQuery('#img');
                    $img.one('load', function () {
                        var raster = new window.paper.Raster('img');
                        raster.position = new window.paper.Point(raster.size.width / 2, raster.size.height / 2);
                        toastr.remove();
                        _this.showFullscreenWindow();
                        toastr.info('Start dragging to select');
                    });
                    $img.attr('src', screenshotFilename + '');
                });
            };
            ScreenshotApp.prototype.fakeScreenshot = function () {
                var screenshotFilename = 'tmp/demo.png';
                var $img = jQuery('#img');
                $img.attr('src', screenshotFilename + '');
                $img.on('load', function () {
                    var raster = new window.paper.Raster('img');
                    raster.position = new window.paper.Point(raster.size.width / 2, raster.size.height / 2);
                    jQuery('#mainCanvas').css('display', 'block');
                });
            };
            ScreenshotApp.prototype.showFullscreenWindow = function () {
                var minX = Number.MAX_VALUE;
                var minY = Number.MAX_VALUE;
                var maxX = Number.MIN_VALUE;
                var maxY = Number.MIN_VALUE;
                var screens = this.electron.screen.getAllDisplays();
                for (var i = 0; i < screens.length; i++) {
                    var bounds = screens[i].bounds;
                    if (bounds.x < minX)
                        minX = bounds.x;
                    if (bounds.y < minY)
                        minY = bounds.y;
                    if (bounds.x + bounds.width > maxX)
                        maxX = bounds.x + bounds.width;
                    if (bounds.y + bounds.height > maxY)
                        maxY = bounds.y + bounds.height;
                }
                this.win.setBounds({ x: minX, y: minY, width: maxX - minX, height: maxY - minY });
                //leave half screen for test:
                //this.win.setBounds({x: minX, y: minY, width: maxX, height: maxY - minY});
                jQuery('#mainCanvas').fadeIn(50);
                if (this.isOSX) {
                    this.win.setAlwaysOnTop(true, 'screen-saver');
                    this.electron.remote.getGlobal('macOnTop')();
                }
                this.win.show();
            };
            ScreenshotApp.prototype.hideWindow = function (isImmediate) {
                var _this = this;
                if (isImmediate === void 0) { isImmediate = false; }
                if (this.inBrowser)
                    return;
                //this.win.setBounds({x: 0, y: 0, width: 0, height: 0});
                if (isImmediate) {
                    jQuery('#mainCanvas').fadeOut(50);
                    window.paper.project.activeLayer.removeChildren();
                    if (this.win.isVisible()) {
                        this.win.hide();
                        if (this.isOSX)
                            this.electron.remote.getGlobal('macOffTop')();
                    }
                }
                else {
                    jQuery('#mainCanvas').fadeOut(50, function () {
                        window.paper.project.activeLayer.removeChildren();
                        if (_this.win.isVisible()) {
                            _this.win.hide();
                            if (_this.isOSX)
                                _this.electron.remote.getGlobal('macOffTop')();
                        }
                    });
                }
            };
            ScreenshotApp.prototype.setUpCanvas = function () {
                var canvas = document.getElementById('mainCanvas');
                // Create an empty project and a view for the canvas:
                window.paper.setup(canvas);
                this.setUpDrawingTool();
                this.setUpArrowTool();
                this.setUpCropTool();
                this.tools['crop'].activate();
            };
            //FIXME: these need to be plugins
            ScreenshotApp.prototype.setUpDrawingTool = function () {
                this.tools['drawing'] = new karoo.poacher.tools.Drawing();
            };
            ScreenshotApp.prototype.setUpArrowTool = function () {
                this.tools['arrow'] = new karoo.poacher.tools.Arrow();
            };
            ScreenshotApp.prototype.setUpCropTool = function () {
                var _this = this;
                this.tools['crop'] = new karoo.poacher.tools.Crop();
                this.tools['crop'].onMouseUp.on(function () { _this.tools['arrow'].activate(); });
            };
            //noinspection JSUnusedLocalSymbols
            ScreenshotApp.prototype.setUpTextTool = function () {
                //TODO
            };
            ScreenshotApp.prototype.resultToBuffer = function () {
                this.exportResult();
                this.hideWindow();
                //TODO: check if there's a workaround for browser
                if (this.inBrowser) {
                    alert('Buffer not supported in browser');
                    this.restart();
                }
                else
                    this.electron.clipboard.writeImage(this.electron.nativeImage.createFromDataURL(this.exportCanvas.toDataURL()), 'png');
            };
            ScreenshotApp.prototype.resultToCloud = function () {
                var _this = this;
                this.exportResult();
                this.hideWindow();
                this.loadCloudProviderSettings();
                if (!this.cloudUploadProvider)
                    return;
                this.cloudUploadProvider.submit(this.exportCanvas.toDataURL()).done(function (o) {
                    if (_this.inBrowser) {
                        if (_this.isOSX)
                            window.prompt('Press Command+C to copy', o.url);
                        else
                            window.prompt('Press Ctrl+C to copy', o.url);
                        _this.restart();
                    }
                    else
                        _this.electron.clipboard.writeText(o.url);
                });
            };
            ScreenshotApp.prototype.resultToFilesystem = function () {
                this.exportResult();
                this.hideWindow();
                this.exportCanvas.toBlob(function (blob) {
                    var FileSaver = require('file-saver');
                    FileSaver.saveAs(blob, 'screenshot.png');
                });
            };
            ScreenshotApp.prototype.undo = function () {
            };
            ScreenshotApp.prototype.redo = function () {
            };
            ScreenshotApp.prototype.restart = function () {
                this.tools['crop'].clear();
                this.tools['crop'].activate();
                this.tools['arrow'].clear();
                this.tools['drawing'].clear();
            };
            ScreenshotApp.prototype.exportResult = function () {
                var area = this.tools['crop'].area;
                this.tools['crop'].clear();
                window.paper.view.draw();
                this.exportCanvas.width = area[2];
                this.exportCanvas.height = area[3];
                var destinationContext = this.exportCanvas.getContext('2d');
                destinationContext.drawImage(document.getElementById('mainCanvas'), area[0], area[1], area[2], area[3], 0, 0, area[2], area[3]);
            };
            ScreenshotApp.prototype.bindHotkeys = function () {
                var _this = this;
                //TODO: make this configurable
                var toBufferKey = 'ctrl+c';
                var toCloudKey = 'ctrl+d';
                var toFilesystemKey = 'ctrl+s';
                var undoKey = 'ctrl+z';
                var redoKey = ['ctrl+y', 'ctrl+shift+z'];
                var restartKey = 'ctrl+r';
                var fakeKey = 'ctrl+p';
                if (this.isOSX) {
                    toBufferKey = 'command+c';
                    toCloudKey = 'command+d';
                    toFilesystemKey = 'command+s';
                    undoKey = 'command+z';
                    redoKey = ['command+y', 'command+shift+z'];
                    restartKey = 'command+r';
                    fakeKey = 'command+p';
                }
                Mousetrap.bind(toBufferKey, function () {
                    _this.resultToBuffer();
                    return false;
                });
                Mousetrap.bind(toCloudKey, function () {
                    _this.resultToCloud();
                    return false;
                });
                Mousetrap.bind(toFilesystemKey, function () {
                    _this.resultToFilesystem();
                    return false;
                });
                Mousetrap.bind(undoKey, function () {
                    _this.undo();
                    return false;
                });
                Mousetrap.bind(redoKey, function () {
                    _this.redo();
                    return false;
                });
                Mousetrap.bind(restartKey, function () {
                    _this.restart();
                    return false;
                });
                if (!this.inBrowser && this.testMode) {
                    Mousetrap.bind(fakeKey, function () {
                        _this.takeScreenshot();
                        return false;
                    });
                }
                //TODO: do we also need to check for Command+Q on mac?
                Mousetrap.bind('alt+f4', function () { return false; });
            };
            ScreenshotApp.prototype.loadCloudProviderSettings = function () {
                var settings = window.storageWrap.getItem('settings');
                if (settings === null) {
                    settings = { cloudProvider: 'imgur' };
                    settings['cloudProviderSettings'] = {};
                    settings['cloudProviderSettings'][settings.cloudProvider] = {};
                }
                if ((settings.cloudProvider !== null) && (settings.cloudProvider !== "none")) {
                    if (settings.cloudProvider === 'karoo')
                        this.cloudUploadProvider = new karoo.poacher.cloud_upload_providers.Karoo(settings['cloudProviderSettings'][settings.cloudProvider].token, settings['cloudProviderSettings'][settings.cloudProvider].url);
                    else if (settings.cloudProvider === 'imgur')
                        this.cloudUploadProvider = new karoo.poacher.cloud_upload_providers.Imgur(settings['cloudProviderSettings'][settings.cloudProvider].token, settings['cloudProviderSettings'][settings.cloudProvider].url);
                }
            };
            return ScreenshotApp;
        }());
        poacher.ScreenshotApp = ScreenshotApp;
    })(poacher = karoo.poacher || (karoo.poacher = {}));
})(karoo || (karoo = {}));
//noinspection JSUnusedGlobalSymbols
var app = new karoo.poacher.ScreenshotApp();
//# sourceMappingURL=App.js.map