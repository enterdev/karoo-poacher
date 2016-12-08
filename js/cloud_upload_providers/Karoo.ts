namespace karoo.poacher.cloud_upload_providers
{
    export class Karoo
    {
        public url;
        public token;

        constructor(token, url = null)
        {
            this.url   = url || 'http://aura.karoo.io/server/inventory/file/upload';
            this.token = token;
        }


        public submit(data)
        {
            let p = new (jQuery as any).Deferred();
            jQuery.ajax({
                type: 'POST',
                url:  this.url + '?token=' + this.token,
                data: {
                    image: data
                }
            }).done((o) => { p.resolve({url: o.url}); });
            return p;
        }
    }
}
