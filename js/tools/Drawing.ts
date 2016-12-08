namespace karoo.poacher.tools
{
    export class Drawing
    {
        protected tool;

        protected paths:any[] = [];
        protected currentPath;

        constructor()
        {
            this.tool             = new (window as any).paper.Tool();
            this.tool.onMouseDown = this.onMouseDown;
            this.tool.onMouseDrag = this.onMouseDrag;
        }

        protected onMouseDown = (event) =>
        {
            this.currentPath = new (window as any).paper.Path();
            this.paths.push(this.currentPath);

            this.currentPath.strokeColor = 'red';
            this.currentPath.strokeWidth = 5;
            this.currentPath.strokeCap   = 'round';
            this.currentPath.add(event.point);
        };

        protected onMouseDrag = (event) =>
        {
            this.currentPath.add(event.point);
        };

        public activate()
        {
            this.tool.activate();
        }

        public clear()
        {
            for (let i = 0; i < this.paths.length; i++)
                this.paths[i].clear();
            this.paths = [];
            this.currentPath = null;
            /*if (this.paths)
                this.paths.clear();*/
        };
    }
}
