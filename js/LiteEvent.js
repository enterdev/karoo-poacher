//Author: Jason Kleban
//https://gist.github.com/JasonKleban/50cee44960c225ac1993c922563aa540
var LiteEvent = (function () {
    function LiteEvent() {
        this.handlers = [];
    }
    LiteEvent.prototype.on = function (handler) {
        this.handlers.push(handler);
    };
    LiteEvent.prototype.off = function (handler) {
        this.handlers = this.handlers.filter(function (h) { return h !== handler; });
    };
    LiteEvent.prototype.trigger = function (data) {
        this.handlers.slice(0).forEach(function (h) { return h(data); });
    };
    return LiteEvent;
}());
//# sourceMappingURL=LiteEvent.js.map