namespace karoo.poacher.tools
{
    export class Arrow
    {
        public arrows = [];

        protected tool;
        protected arrow: any;
        protected headLength = 10;
        protected headAngle  = 150;
        protected arrowColor = 'red';
        protected arrowWidth = 5;

        constructor()
        {
            this.tool             = new (window as any).paper.Tool();
            this.tool.onMouseDown = this.onMouseDown;
            this.tool.onMouseDrag = this.onMouseDrag;
            this.tool.onMouseUp   = this.onMouseUp;
        }

        public activate()
        {
            this.tool.activate();
        }

        protected onMouseDown = (event) =>
        {
            if (this.arrow)
                this.arrow.remove();
            this.drawArrow(event.downPoint, event.point);
        };

        protected onMouseDrag = (event) =>
        {
            if (this.arrow)
                this.arrow.remove();
            this.drawArrow(event.downPoint, event.point);
        };

        protected onMouseUp = (/*event*/) =>
        {
            if (this.arrow)
            {
                this.arrows.push(this.arrow);
                this.arrow = null;
            }
        };

        protected drawArrow(start, end)
        {
            //let tailLine = new (window as any).paper.Path.Line(start, end);
            let tailVector = end.subtract(start);

            let headLine = tailVector.normalize(this.headLength);

            this.arrow = new (window as any).paper.Group([
                new (window as any).paper.Path([start, end]),
                new (window as any).paper.Path([
                    end.add(headLine.rotate(this.headAngle)),
                    end,
                    end.add(headLine.rotate(-this.headAngle))
                ])
            ]);

            this.arrow.strokeColor = this.arrowColor;
            this.arrow.strokeWidth = this.arrowWidth;
        }

        public clear()
        {
            for (let i = 0; i < this.arrows.length; i++)
                this.arrows[i].remove();
            this.arrows = [];
            this.arrow  = null;
        };
    }
}
