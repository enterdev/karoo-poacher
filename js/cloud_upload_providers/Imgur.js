var karoo;
(function (karoo) {
    var poacher;
    (function (poacher) {
        var cloud_upload_providers;
        (function (cloud_upload_providers) {
            var Imgur = (function () {
                function Imgur(token, url) {
                    if (token === void 0) { token = null; }
                    if (url === void 0) { url = null; }
                    this.url = url || 'https://api.imgur.com/3/image';
                    this.token = token || 'a3fcae624953033';
                }
                Imgur.prototype.submit = function (data) {
                    var p = new jQuery.Deferred();
                    var auth;
                    auth = 'Client-ID ' + this.token;
                    jQuery.ajax({
                        type: 'POST',
                        headers: {
                            Authorization: auth,
                            Accept: 'application/json'
                        },
                        url: this.url,
                        data: {
                            image: data.replace('data:image/png;base64,', ''),
                            type: 'base64'
                        }
                    }).done(function (o) { p.resolve({ url: o.data.link }); });
                    return p;
                };
                return Imgur;
            }());
            cloud_upload_providers.Imgur = Imgur;
        })(cloud_upload_providers = poacher.cloud_upload_providers || (poacher.cloud_upload_providers = {}));
    })(poacher = karoo.poacher || (karoo.poacher = {}));
})(karoo || (karoo = {}));
//# sourceMappingURL=Imgur.js.map