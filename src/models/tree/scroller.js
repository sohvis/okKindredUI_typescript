
export const Scroller = {   

    tree: null,
    canvas: null,
    ctx: null,
    lastPoint: {
        x: 0,
        y: 0,
        // Multitouch
        x2: 0,
        y2: 0,
    },

    // Represents multitouch points 1 and 2
    dragStart: [null, null],
    dragStartTime: new Date().getTime(),
    multiTouch: false,

    // Based on http://phrogz.net/tmp/canvas_zoom_to_cursor.html
    initialize: (canvas, tree) => {

        Scroller.tree = tree;
        Scroller.canvas = canvas;
        Scroller.ctx = tree.ctx;
        
        Scroller.trackTransforms(Scroller.ctx);

        Scroller.lastPoint.x = canvas.width / 2; 
        Scroller.lastPoint.y = canvas.height / 2;
        Scroller.lastPoint.x2 = Scroller.lastPoint.x ; 
        Scroller.lastPoint.y2 = Scroller.lastPoint.y;
        
        canvas.addEventListener('mousedown', Scroller.mousedown, false);
        canvas.addEventListener('touchstart', Scroller.touchstart, false);

        canvas.addEventListener('mousemove', Scroller.mouseMove, false);
        canvas.addEventListener('touchmove', Scroller.touchmove, false);

        canvas.addEventListener('mouseup', Scroller.mouseUp, false);
        canvas.addEventListener('touchend', Scroller.mouseUp, false);


        canvas.addEventListener('DOMMouseScroll', Scroller.handleScroll,false);
        canvas.addEventListener('mousewheel',Scroller.handleScroll,false);

        window.console.log(`Scroller.canvas.offsetTop: ${Scroller.canvas.offsetTop}`);
        window.console.log(`Scroller.tree.dpr: ${Scroller.tree.dpr}`);

    },

    mousedown: (evt) => {

        Scroller.lastPoint.x = evt.pageX - Scroller.canvas.offsetLeft;
        Scroller.lastPoint.y = evt.pageY - Scroller.canvas.offsetTop;
        Scroller.dragStart[0] = Scroller.ctx.transformedPoint(Scroller.lastPoint.x, Scroller.lastPoint.y);
        Scroller.dragStartTime = new Date().getTime();
    },

    touchstart: (touchEvent) => {

        var pos = Scroller.getTouchPos(touchEvent);

        Scroller.lastPoint.x = pos.x; // - Scroller.canvas.offsetLeft;
        Scroller.lastPoint.y = pos.y; // - Scroller.canvas.offsetTop;

        if (pos.multiTouch) {
            Scroller.lastPoint.x2 = pos.x2; // - Scroller.canvas.offsetLeft;
            Scroller.lastPoint.y2 = pos.y2; // - Scroller.canvas.offsetTop;
            Scroller.multiTouch = true;

            Scroller.dragStart[1] = Scroller.ctx.transformedPoint(Scroller.lastPoint.x2, Scroller.lastPoint.y2);
        } 

        Scroller.dragStart[0] = Scroller.ctx.transformedPoint(Scroller.lastPoint.x, Scroller.lastPoint.y);
        Scroller.dragStartTime = new Date().getTime();

        return touchEvent.preventDefault() && false;
    },

    mouseMove: (evt) => {

        // Records last mouse point
        const pos = Scroller.canvas.getBoundingClientRect();
        Scroller.lastPoint.x = evt.pageX - Scroller.canvas.offsetLeft;
        Scroller.lastPoint.y = evt.pageY - Scroller.canvas.offsetTop;
        let pt = Scroller.ctx.transformedPoint(Scroller.lastPoint.x,Scroller.lastPoint.y);

        if (Scroller.dragStart[0]){
            

            let dx = pt.x - Scroller.dragStart[0].x;
            let dy = pt.y - Scroller.dragStart[0].y;

            Scroller.ctx.translate(dx, dy);
            Scroller.tree.render(false);
        } else {
            Scroller.tree.hover(pt.x, pt.y)
        }
    },

    touchmove: (touchEvent) => {
        var pos = Scroller.getTouchPos(touchEvent);

        // Dragstart set by touchstart
        if (Scroller.dragStart[0]){
                       
            if (Scroller.dragStart[1]) {
                // Multi touch
                Scroller.pinchZoom(pos);
            } else {
                Scroller.singleTouchMove(pos);
            }
        }

        return touchEvent.preventDefault() && false;
    },

    pinchZoom: (pos) => {

        var pt = Scroller.ctx.transformedPoint(pos.x, pos.y);
        var pt2 = Scroller.ctx.transformedPoint(pos.x2, pos.y2);
        // var pt = Scroller.ctx.transformedPoint(pos.x - Scroller.canvas.offsetLeft, pos.y - Scroller.canvas.offsetTop);
        // var pt2 = Scroller.ctx.transformedPoint(pos.x2 - Scroller.canvas.offsetLeft, pos.y2 - Scroller.canvas.offsetTop);
        
        // Use pythagoras theorem to get pinch zoom distance change
        var originalDistance = (Scroller.dragStart[0].x - Scroller.dragStart[1].x)**2 + (Scroller.dragStart[0].y - Scroller.dragStart[1].y)**2;
        var newDistance = (pt.x- pt2.x)**2 + (pt.y - pt2.y)**2;

        var delta = (newDistance / originalDistance)**0.5;
        
        // Midpoint of zoom
        var mdpt = {
             x: (pt.x + pt2.x) / 2,
             y: (pt.y + pt2.y) / 2,
         };

        Scroller.ctx.translate(mdpt.x,mdpt.y);
        Scroller.ctx.scale(delta, delta);
        Scroller.ctx.translate(-mdpt.x,-mdpt.y);
        Scroller.tree.render(false);
    },

    singleTouchMove: (pos) => {
        // Single touch move
        Scroller.lastPoint.x = pos.x; // - Scroller.canvas.offsetLeft;
        Scroller.lastPoint.y = pos.y; // - Scroller.canvas.offsetTop;

        var pt = Scroller.ctx.transformedPoint(Scroller.lastPoint.x,Scroller.lastPoint.y);

        let dx = pt.x - Scroller.dragStart[0].x;
        let dy = pt.y - Scroller.dragStart[0].y;

        Scroller.ctx.translate(dx, dy);
        Scroller.tree.render(false);
    },

    mouseUp: () => {
        var elapsedClickTime = new Date().getTime() - Scroller.dragStartTime;
        
        // Select if quick single tap
        if(elapsedClickTime < 150 && !Scroller.dragStart[1]) {
            var pt = Scroller.ctx.transformedPoint(Scroller.lastPoint.x, Scroller.lastPoint.y);
            Scroller.tree.click(pt.x, pt.y);
        } 

        Scroller.dragStart[0] = null;
        Scroller.dragStart[1] = null;
        Scroller.dragStartTime = null;
    },

    handleScroll: (evt) => {
        var delta = evt.wheelDelta ? evt.wheelDelta/40 : evt.detail ? -evt.detail : 0;
        
        if (delta) {
            var scaleFactor = 1.1;
            var pt = Scroller.ctx.transformedPoint(Scroller.lastPoint.x, Scroller.lastPoint.y);
            Scroller.ctx.translate(pt.x,pt.y);
            var factor = Math.pow(scaleFactor,delta);
            Scroller.ctx.scale(factor,factor);
            Scroller.ctx.translate(-pt.x,-pt.y);
            Scroller.tree.render(false);
        }

        return evt.preventDefault() && false;
    },

    getTouchPos: (touchEvent) => {
        var rect = Scroller.canvas.getBoundingClientRect();

        var multiTouch = touchEvent.touches.length > 1;
        var x2 = 0;
        var y2 = 0;
        if (multiTouch) {
            x2 = touchEvent.touches[1].clientX - rect.left,
            y2 = touchEvent.touches[1].clientY - rect.top 
        }

        return {
          multiTouch: multiTouch,
          x: touchEvent.touches[0].clientX - rect.left,
          y: touchEvent.touches[0].clientY - rect.top,
          x2: x2,
          y2: y2
        };
    },

    trackTransforms: (ctx) => {
        var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
		var xform = svg.createSVGMatrix();
        ctx.getTransform = () => { return xform; };      

        var savedTransforms = [];
		var save = ctx.save;
		ctx.save = function(){
			savedTransforms.push(xform.translate(0,0));
			return save.call(ctx);
		};
		var restore = ctx.restore;
		ctx.restore = function(){
			xform = savedTransforms.pop();
			return restore.call(ctx);
		};

		var scale = ctx.scale;
		ctx.scale = function(sx,sy){
			xform = xform.scaleNonUniform(sx,sy);
			return scale.call(ctx,sx,sy);
		};
		var rotate = ctx.rotate;
		ctx.rotate = function(radians){
			xform = xform.rotate(radians*180/Math.PI);
			return rotate.call(ctx,radians);
		};
		var translate = ctx.translate;
		ctx.translate = function(dx,dy){
			xform = xform.translate(dx,dy);
			return translate.call(ctx,dx,dy);
		};
		var transform = ctx.transform;
		ctx.transform = function(a,b,c,d,e,f){
			var m2 = svg.createSVGMatrix();
			m2.a=a; m2.b=b; m2.c=c; m2.d=d; m2.e=e; m2.f=f;
			xform = xform.multiply(m2);
			return transform.call(ctx,a,b,c,d,e,f);
		};
		var setTransform = ctx.setTransform;
		ctx.setTransform = function(a,b,c,d,e,f){
			xform.a = a;
			xform.b = b;
			xform.c = c;
			xform.d = d;
			xform.e = e;
			xform.f = f;
			return setTransform.call(ctx,a,b,c,d,e,f);
		};
		var pt  = svg.createSVGPoint();
		ctx.transformedPoint = function(x,y){
			pt.x=x; pt.y=y;
			return pt.matrixTransform(xform.inverse());
        }
    }
}

export default Scroller;