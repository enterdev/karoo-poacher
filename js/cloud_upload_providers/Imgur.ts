namespace karoo.poacher.cloud_upload_providers
{
    export class Imgur
    {
        public url;
        public token;

        constructor(token, url = null)
        {
            this.url   = url || 'https://api.imgur.com/3/image';
            this.token = token;
        }

        public submit(data)
        {
            let p = new (jQuery as any).Deferred();
            let auth;
            auth = 'Client-ID ' + this.token;

            jQuery.ajax({
                type: 'POST',
                headers: {
                    Authorization: auth,
                    Accept: 'application/json'
                },
                url:  this.url,
                data: {
                    image: data.replace('data:image/png;base64,', ''),
                    type: 'base64'
                }
            }).done((o) => { p.resolve({url: o.data.link}); });
            return p;
        }
    }
}
