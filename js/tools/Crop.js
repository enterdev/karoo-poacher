var karoo;
(function (karoo) {
    var poacher;
    (function (poacher) {
        var tools;
        (function (tools) {
            var Crop = (function () {
                function Crop() {
                    var _this = this;
                    this._onMouseUp = new LiteEvent();
                    this.onMouseDown = function (event) {
                        if (_this.area1)
                            _this.area1.remove();
                        if (_this.area2)
                            _this.area2.remove();
                        if (_this.bg)
                            _this.bg.remove();
                        if (_this.sub)
                            _this.sub.remove();
                        _this.startX = event.point.x;
                        _this.startY = event.point.y;
                        _this.area1 =
                            window.paper.Path.Rectangle(event.point, new window.paper.Size(1, 1));
                        _this.area1.opacity = 1;
                        _this.area1.strokeWidth = 1;
                        _this.area1.strokeColor = 'black';
                        _this.area1.dashArray = [6, 6];
                        _this.area1.fillColor = 'white';
                        _this.area2 =
                            window.paper.Path.Rectangle(event.point, new window.paper.Size(1, 1));
                        _this.area2.opacity = 1;
                        _this.area2.strokeWidth = 1;
                        _this.area2.strokeColor = 'white';
                        _this.area2.dashArray = [6, 6];
                        _this.area2.dashOffset = 6;
                        _this.bg = window.paper.Path.Rectangle(new window.paper.Point(0, 0), window.paper.view.size);
                        _this.bg.fillColor = 'black';
                        _this.bg.opacity = 0.5;
                        var group = new window.paper.Group([_this.bg, _this.area1]);
                        //group.clipped = true;
                        group.blendMode = 'multiply';
                        /*this.sub = this.bg.subtract(area);
                         this.sub.opacity = 0.5;*/
                    };
                    this.onMouseDrag = function (event) {
                        var w = event.point.x - _this.startX;
                        if (w === 0)
                            w = 1;
                        if (w > 0) {
                            _this.area1.bounds.width = w;
                            _this.area2.bounds.width = w;
                        }
                        else {
                            _this.area1.bounds.x = _this.startX + w;
                            _this.area2.bounds.x = _this.startX + w;
                            _this.area1.bounds.width = w * -1;
                            _this.area2.bounds.width = w * -1;
                        }
                        var h = event.point.y - _this.startY;
                        if (h === 0)
                            h = 1;
                        if (h > 0) {
                            _this.area1.bounds.height = h;
                            _this.area2.bounds.height = h;
                        }
                        else {
                            _this.area1.bounds.y = _this.startY + h;
                            _this.area2.bounds.y = _this.startY + h;
                            _this.area1.bounds.height = h * -1;
                            _this.area2.bounds.height = h * -1;
                        }
                    };
                    this.toolMouseUpHandler = function () {
                        //noinspection JSSuspiciousNameCombination
                        _this.area = [
                            Math.round(_this.area1.bounds.x),
                            Math.round(_this.area1.bounds.y),
                            Math.round(_this.area1.bounds.width),
                            Math.round(_this.area1.bounds.height)
                        ];
                        $('body').css('cursor', 'default');
                        _this._onMouseUp.trigger();
                    };
                    this.tool = new window.paper.Tool();
                    this.tool.onMouseDown = this.onMouseDown;
                    this.tool.onMouseDrag = this.onMouseDrag;
                    this.tool.onMouseUp = this.toolMouseUpHandler;
                    this.area = [null, null, null, null];
                }
                Object.defineProperty(Crop.prototype, "onMouseUp", {
                    get: function () {
                        return this._onMouseUp;
                    },
                    enumerable: true,
                    configurable: true
                });
                Crop.prototype.activate = function () {
                    this.tool.activate();
                    $('body').css('cursor', 'crosshair');
                };
                Crop.prototype.clear = function () {
                    if (this.area1)
                        this.area1.remove();
                    if (this.area2)
                        this.area2.remove();
                    if (this.bg)
                        this.bg.remove();
                    if (this.sub)
                        this.sub.remove();
                    this.area = [null, null, null, null];
                };
                ;
                return Crop;
            }());
            tools.Crop = Crop;
        })(tools = poacher.tools || (poacher.tools = {}));
    })(poacher = karoo.poacher || (karoo.poacher = {}));
})(karoo || (karoo = {}));
//# sourceMappingURL=Crop.js.map