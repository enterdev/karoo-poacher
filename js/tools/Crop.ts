namespace karoo.poacher.tools
{
    export class Crop
    {
        public area;

        protected tool;
        protected area1;
        protected area2;
        protected bg;
        protected sub;
        protected startX;
        protected startY;

        protected _onMouseUp = new LiteEvent<void>();
        public get onMouseUp(): ILiteEvent<void>
        {
            return this._onMouseUp;
        }

        constructor()
        {
            this.tool             = new (window as any).paper.Tool();
            this.tool.onMouseDown = this.onMouseDown;
            this.tool.onMouseDrag = this.onMouseDrag;
            this.tool.onMouseUp   = this.toolMouseUpHandler;
            this.area             = [null, null, null, null];
        }

        public activate()
        {
            this.tool.activate();
            $('body').css('cursor', 'crosshair');
        }

        public clear()
        {
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


        protected onMouseDown = (event) =>
        {
            if (this.area1)
                this.area1.remove();
            if (this.area2)
                this.area2.remove();
            if (this.bg)
                this.bg.remove();
            if (this.sub)
                this.sub.remove();

            this.startX = event.point.x;
            this.startY = event.point.y;

            this.area1             =
                (window as any).paper.Path.Rectangle(event.point, new (window as any).paper.Size(1, 1));
            this.area1.opacity     = 1;
            this.area1.strokeWidth = 1;
            this.area1.strokeColor = 'black';
            this.area1.dashArray   = [6, 6];
            this.area1.fillColor   = 'white';

            this.area2             =
                (window as any).paper.Path.Rectangle(event.point, new (window as any).paper.Size(1, 1));
            this.area2.opacity     = 1;
            this.area2.strokeWidth = 1;
            this.area2.strokeColor = 'white';
            this.area2.dashArray   = [6, 6];
            this.area2.dashOffset  = 6;

            this.bg           = (window as any).paper.Path.Rectangle(
                new (window as any).paper.Point(0, 0), (window as any).paper.view.size);
            this.bg.fillColor = 'black';
            this.bg.opacity   = 0.5;

            let group       = new (window as any).paper.Group([this.bg, this.area1]);
            //group.clipped = true;
            group.blendMode = 'multiply';
            /*this.sub = this.bg.subtract(area);
             this.sub.opacity = 0.5;*/
        };

        protected onMouseDrag = (event) =>
        {
            let w = event.point.x - this.startX;
            if (w == 0)
                w = 1;
            if (w > 0)
            {
                this.area1.bounds.width = w;
                this.area2.bounds.width = w;
            }
            else
            {
                this.area1.bounds.x     = this.startX + w;
                this.area2.bounds.x     = this.startX + w;
                this.area1.bounds.width = w * -1;
                this.area2.bounds.width = w * -1;
            }

            let h = event.point.y - this.startY;
            if (h == 0)
                h = 1;
            if (h > 0)
            {
                this.area1.bounds.height = h;
                this.area2.bounds.height = h;
            }
            else
            {
                this.area1.bounds.y      = this.startY + h;
                this.area2.bounds.y      = this.startY + h;
                this.area1.bounds.height = h * -1;
                this.area2.bounds.height = h * -1;
            }
        };

        protected toolMouseUpHandler = (/*event*/) =>
        {
            //noinspection JSSuspiciousNameCombination
            this.area = [
                Math.round(this.area1.bounds.x),
                Math.round(this.area1.bounds.y),
                Math.round(this.area1.bounds.width),
                Math.round(this.area1.bounds.height)];

            $('body').css('cursor', 'default');
            this._onMouseUp.trigger();
        };
    }
}
