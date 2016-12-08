var karoo;
(function (karoo) {
    var poacher;
    (function (poacher) {
        var cloud_upload_providers;
        (function (cloud_upload_providers) {
            var Karoo = (function () {
                function Karoo(token, url) {
                    if (url === void 0) { url = null; }
                    this.url = url || 'http://aura.karoo.io/server/inventory/file/upload';
                    this.token = token;
                }
                Karoo.prototype.submit = function (data) {
                    var p = new jQuery.Deferred();
                    jQuery.ajax({
                        type: 'POST',
                        url: this.url + '?token=' + this.token,
                        data: {
                            image: data
                        }
                    }).done(function (o) { p.resolve({ url: o.url }); });
                    return p;
                };
                return Karoo;
            }());
            cloud_upload_providers.Karoo = Karoo;
        })(cloud_upload_providers = poacher.cloud_upload_providers || (poacher.cloud_upload_providers = {}));
    })(poacher = karoo.poacher || (karoo.poacher = {}));
})(karoo || (karoo = {}));
//# sourceMappingURL=Karoo.js.map