declare const require: any;
declare const __dirname: any;

namespace karoo.poacher
{
    export class ScreenshotApp
    {
        protected screenshotTool;
        protected win;
        protected tools     = [];
        protected inBrowser = false;
        protected testMode  = true;
        protected exportCanvas: HTMLCanvasElement;
        protected electron: any;
        protected isOSX: boolean;
        protected cloudUploadProvider: any;

        constructor()
        {
            this.inBrowser =
                !window || !window['process'] || !window['process'].versions || !window['process'].versions.electron;

            this.isOSX = /^darwin/.test(window['process'].platform);

            if (!this.inBrowser)
            {
                this.electron       = require('electron');
                this.screenshotTool = require('cli-fullscreen-screenshot');

                this.win = this.electron.remote.getCurrentWindow();

                this.electron.ipcRenderer.on('take-screenshot', () => this.takeScreenshot());

                Mousetrap.bind('esc', () => this.hideWindow());
            }

            this.bindHotkeys();

            //FIXME: get rid of ugly jquery usage
            jQuery(() => { this.setUpCanvas(); });

            if (this.inBrowser && this.testMode)
                jQuery(() => { this.fakeScreenshot(); });

            this.exportCanvas = document.createElement('CANVAS') as HTMLCanvasElement;

            let settings = (window as any).storageWrap.getItem('settings');

            if ((settings.cloudProvider != null) && (settings.cloudProvider != "none"))
            {
                if (settings.cloudProvider == 'karoo')
                    this.cloudUploadProvider = new karoo.poacher.cloud_upload_providers.Karoo(
                        settings['cloudProviderSettings'][settings.cloudProvider].token,
                        settings['cloudProviderSettings'][settings.cloudProvider].url
                    );
                else if (settings.cloudProvider == 'imgur')
                    this.cloudUploadProvider = new karoo.poacher.cloud_upload_providers.Imgur(
                        settings['cloudProviderSettings'][settings.cloudProvider].token,
                        settings['cloudProviderSettings'][settings.cloudProvider].url
                    );
            }
        }

        public takeScreenshot()
        {
            this.hideWindow(true);
            this.restart();
            const path             = require('path');
            let screenshotFilename = path.join(__dirname, '/tmp/screenshot_' + Math.random() + '.png');
            let screenshotConfig   = {
                outfile: screenshotFilename
            };

            new this.screenshotTool.Screenshot(screenshotConfig, (error/*, complete*/) =>
            {
                if (error)
                {
                    console.log('Screenshot failed', error);
                    return;
                }
                let $img = jQuery('#img');
                $img.one('load', () =>
                {
                    let raster      = new (window as any).paper.Raster('img');
                    raster.position = new (window as any).paper.Point(raster.size.width / 2, raster.size.height / 2);
                    toastr.remove();

                    this.showFullscreenWindow();
                    toastr.info('Start dragging to select')
                });
                $img.attr('src', screenshotFilename + '');
            });
        }

        public fakeScreenshot()
        {
            let screenshotFilename = 'tmp/demo.png';

            let $img = jQuery('#img');
            $img.attr('src', screenshotFilename + '');
            $img.on('load', () =>
            {
                let raster      = new (window as any).paper.Raster('img');
                raster.position = new (window as any).paper.Point(raster.size.width / 2, raster.size.height / 2);
                jQuery('#mainCanvas').css('display', 'block');
            });
        }

        public showFullscreenWindow()
        {
            let minX = Number.MAX_VALUE;
            let minY = Number.MAX_VALUE;
            let maxX = Number.MIN_VALUE;
            let maxY = Number.MIN_VALUE;

            let screens = this.electron.screen.getAllDisplays();
            for (let i = 0; i < screens.length; i++)
            {
                let bounds = screens[i].bounds;
                if (bounds.x < minX)
                    minX = bounds.x;
                if (bounds.y < minY)
                    minY = bounds.y;

                if (bounds.x + bounds.width > maxX)
                    maxX = bounds.x + bounds.width;
                if (bounds.y + bounds.height > maxY)
                    maxY = bounds.y + bounds.height;
            }
            this.win.setBounds({x: minX, y: minY, width: maxX - minX, height: maxY - minY});
            //leave half screen for test:
            //this.win.setBounds({x: minX, y: minY, width: maxX, height: maxY - minY});

            jQuery('#mainCanvas').fadeIn(50);

            if (this.isOSX)
            {
                this.win.setAlwaysOnTop(true, 'screen-saver');
                this.electron.remote.getGlobal('macOnTop')();
            }

            this.win.show();
        }

        private hideWindow(isImmediate = false)
        {
            if (this.inBrowser)
                return;

            //this.win.setBounds({x: 0, y: 0, width: 0, height: 0});
            if (isImmediate)
            {
                jQuery('#mainCanvas').fadeOut(50);
                (window as any).paper.project.activeLayer.removeChildren();
                if (this.win.isVisible())
                {
                    this.win.hide();
                    if (this.isOSX)
                        this.electron.remote.getGlobal('macOffTop')()
                }
            }
            else
            {
                jQuery('#mainCanvas').fadeOut(50, () =>
                {
                    (window as any).paper.project.activeLayer.removeChildren();
                    if (this.win.isVisible())
                    {
                        this.win.hide();
                        if (this.isOSX)
                            this.electron.remote.getGlobal('macOffTop')();
                    }
                });
            }
        }

        private setUpCanvas()
        {
            let canvas = document.getElementById('mainCanvas');
            // Create an empty project and a view for the canvas:
            (window as any).paper.setup(canvas as HTMLCanvasElement);

            this.setUpDrawingTool();
            this.setUpArrowTool();
            this.setUpCropTool();
            this.tools['crop'].activate();
        }

        //FIXME: these need to be plugins
        private setUpDrawingTool()
        {
            this.tools['drawing'] = new karoo.poacher.tools.Drawing();
        }

        private setUpArrowTool()
        {
            this.tools['arrow'] = new karoo.poacher.tools.Arrow();
        }

        private setUpCropTool()
        {
            this.tools['crop'] = new karoo.poacher.tools.Crop();
            this.tools['crop'].onMouseUp.on(() => { this.tools['arrow'].activate(); });
        }

        //noinspection JSUnusedLocalSymbols
        private setUpTextTool()
        {
            //TODO
        }

        private resultToBuffer()
        {
            this.exportResult();
            this.hideWindow();

            //TODO: check if there's a workaround for browser
            if (this.inBrowser)
            {
                alert('Buffer not supported in browser');
                this.restart();
            }
            else
                this.electron.clipboard.writeImage(
                    this.electron.nativeImage.createFromDataURL(this.exportCanvas.toDataURL()), 'png');
        }

        private resultToCloud()
        {
            this.exportResult();
            this.hideWindow();

            if (!this.cloudUploadProvider)
                return;

            this.cloudUploadProvider.submit(this.exportCanvas.toDataURL()).done((o) =>
            {
                if (this.inBrowser)
                {
                    if (this.isOSX)
                        window.prompt('Press Command+C to copy', o.url);
                    else
                        window.prompt('Press Ctrl+C to copy', o.url);
                    this.restart();
                }
                else
                    this.electron.clipboard.writeText(o.url);
            });
        }

        private resultToFilesystem()
        {
            this.exportResult();

            this.hideWindow();

            this.exportCanvas.toBlob(function (blob)
            {
                let FileSaver = require('file-saver');
                FileSaver.saveAs(blob, 'screenshot.png');
            });
        }

        private undo()
        {

        }

        private redo()
        {

        }

        private restart()
        {
            this.tools['crop'].clear();
            this.tools['crop'].activate();

            this.tools['arrow'].clear();

            this.tools['drawing'].clear();
        }

        private exportResult()
        {
            let area = this.tools['crop'].area;
            this.tools['crop'].clear();
            (window as any).paper.view.draw();

            this.exportCanvas.width  = area[2];
            this.exportCanvas.height = area[3];
            let destinationContext   = this.exportCanvas.getContext('2d');
            destinationContext.drawImage(
                document.getElementById('mainCanvas') as HTMLCanvasElement,
                area[0], area[1], area[2], area[3],
                0, 0, area[2], area[3]
            );
        }

        private bindHotkeys()
        {
            //TODO: make this configurable
            let toBufferKey     = 'ctrl+c';
            let toCloudKey      = 'ctrl+d';
            let toFilesystemKey = 'ctrl+s';
            let undoKey         = 'ctrl+z';
            let redoKey         = ['ctrl+y', 'ctrl+shift+z'];
            let restartKey      = 'ctrl+r';
            let fakeKey         = 'ctrl+p';
            if (this.isOSX)
            {
                toBufferKey     = 'command+c';
                toCloudKey      = 'command+d';
                toFilesystemKey = 'command+s';
                undoKey         = 'command+z';
                redoKey         = ['command+y', 'command+shift+z'];
                restartKey      = 'command+r';
                fakeKey         = 'command+p';
            }

            Mousetrap.bind(toBufferKey, () =>
            {
                this.resultToBuffer();
                return false;
            });
            Mousetrap.bind(toCloudKey, () =>
            {
                this.resultToCloud();
                return false;
            });
            Mousetrap.bind(toFilesystemKey, () =>
            {
                this.resultToFilesystem();
                return false;
            });
            Mousetrap.bind(undoKey, () =>
            {
                this.undo();
                return false;
            });
            Mousetrap.bind(redoKey, () =>
            {
                this.redo();
                return false;
            });
            Mousetrap.bind(restartKey, () =>
            {
                this.restart();
                return false;
            });

            if (!this.inBrowser && this.testMode)
            {
                Mousetrap.bind(fakeKey, () =>
                {
                    this.takeScreenshot();
                    return false
                });
            }

            //TODO: do we also need to check for Command+Q on mac?
            Mousetrap.bind('alt+f4', function () { return false; });
        }
    }
}

//noinspection JSUnusedGlobalSymbols
let app = new karoo.poacher.ScreenshotApp();
