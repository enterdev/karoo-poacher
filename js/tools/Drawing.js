var karoo;
(function (karoo) {
    var poacher;
    (function (poacher) {
        var tools;
        (function (tools) {
            var Drawing = (function () {
                function Drawing() {
                    var _this = this;
                    this.paths = [];
                    this.onMouseDown = function (event) {
                        _this.currentPath = new window.paper.Path();
                        _this.paths.push(_this.currentPath);
                        _this.currentPath.strokeColor = 'red';
                        _this.currentPath.strokeWidth = 5;
                        _this.currentPath.strokeCap = 'round';
                        _this.currentPath.add(event.point);
                    };
                    this.onMouseDrag = function (event) {
                        _this.currentPath.add(event.point);
                    };
                    this.tool = new window.paper.Tool();
                    this.tool.onMouseDown = this.onMouseDown;
                    this.tool.onMouseDrag = this.onMouseDrag;
                }
                Drawing.prototype.activate = function () {
                    this.tool.activate();
                };
                Drawing.prototype.clear = function () {
                    for (var i = 0; i < this.paths.length; i++)
                        this.paths[i].clear();
                    this.paths = [];
                    this.currentPath = null;
                    /*if (this.paths)
                        this.paths.clear();*/
                };
                ;
                return Drawing;
            }());
            tools.Drawing = Drawing;
        })(tools = poacher.tools || (poacher.tools = {}));
    })(poacher = karoo.poacher || (karoo.poacher = {}));
})(karoo || (karoo = {}));
//# sourceMappingURL=Drawing.js.map