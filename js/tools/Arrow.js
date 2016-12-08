var karoo;
(function (karoo) {
    var poacher;
    (function (poacher) {
        var tools;
        (function (tools) {
            var Arrow = (function () {
                function Arrow() {
                    var _this = this;
                    this.arrows = [];
                    this.headLength = 10;
                    this.headAngle = 150;
                    this.arrowColor = 'red';
                    this.arrowWidth = 5;
                    this.onMouseDown = function (event) {
                        if (_this.arrow)
                            _this.arrow.remove();
                        _this.drawArrow(event.downPoint, event.point);
                    };
                    this.onMouseDrag = function (event) {
                        if (_this.arrow)
                            _this.arrow.remove();
                        _this.drawArrow(event.downPoint, event.point);
                    };
                    this.onMouseUp = function () {
                        if (_this.arrow) {
                            _this.arrows.push(_this.arrow);
                            _this.arrow = null;
                        }
                    };
                    this.tool = new window.paper.Tool();
                    this.tool.onMouseDown = this.onMouseDown;
                    this.tool.onMouseDrag = this.onMouseDrag;
                    this.tool.onMouseUp = this.onMouseUp;
                }
                Arrow.prototype.activate = function () {
                    this.tool.activate();
                };
                Arrow.prototype.drawArrow = function (start, end) {
                    //let tailLine = new (window as any).paper.Path.Line(start, end);
                    var tailVector = end.subtract(start);
                    var headLine = tailVector.normalize(this.headLength);
                    this.arrow = new window.paper.Group([
                        new window.paper.Path([start, end]),
                        new window.paper.Path([
                            end.add(headLine.rotate(this.headAngle)),
                            end,
                            end.add(headLine.rotate(-this.headAngle))
                        ])
                    ]);
                    this.arrow.strokeColor = this.arrowColor;
                    this.arrow.strokeWidth = this.arrowWidth;
                };
                Arrow.prototype.clear = function () {
                    for (var i = 0; i < this.arrows.length; i++)
                        this.arrows[i].remove();
                    this.arrows = [];
                    this.arrow = null;
                };
                ;
                return Arrow;
            }());
            tools.Arrow = Arrow;
        })(tools = poacher.tools || (poacher.tools = {}));
    })(poacher = karoo.poacher || (karoo.poacher = {}));
})(karoo || (karoo = {}));
//# sourceMappingURL=Arrow.js.map