// import Tree from './tree';
// import Point from './point';
// import { throws } from 'assert';

// class MultiPoint {
//     public x: number;
//     public y: number;
//     public x2: number;
//     public y2: number;

//     constructor() {
//         this.x = 0;
//         this.y = 0;
//         this.x2 = 0;
//         this.y2 = 0;
//     }
// }

// // Augmented object
// // interface CanvasRenderingContext2D {
// //     save: () => any;
// //     getTransform: () => DOMMatrix;
// //     restore: () => any;
// //     scale: (sx: number, sy:number) => any;
// //     rotate: () => any;
// //     transform: () => any;
// // }

// export default class Scroller {

//     private tree: Tree;
//     private canvas: HTMLCanvasElement;
//     private ctx: CanvasRenderingContext2D | null;

//     private lastPoint: MultiPoint;

//     // Represents multitouch points 1 and 2
//     dragStart: Point | null;
//     dragStartTime: number;
//     multiTouch: boolean;

//     // Based on http://phrogz.net/tmp/canvas_zoom_to_cursor.html
//     constructor(canvas: HTMLCanvasElement, tree: Tree) {

//         this.tree = tree;
//         this.canvas = canvas;
//         let ctx = canvas.getContext('2d');

//         this.ctx = ctx;
//         if(this.ctx) {
//             this.trackTransforms(this.ctx);
//         }

//         this.lastPoint = new MultiPoint()
//         this.lastPoint.x = canvas.width / 2;
//         this.lastPoint.y = canvas.height / 2;
//         this.lastPoint.x2 = this.lastPoint.x ;
//         this.lastPoint.y2 = this.lastPoint.y;

//         this.dragStart = null;
//         this.dragStartTime = 0;
//         this.multiTouch = false;


//         canvas.addEventListener('mousedown', this.mousedown, false);
//         canvas.addEventListener('touchstart', this.touchstart, false);

//         canvas.addEventListener('mousemove', this.mouseMove, false);
//         canvas.addEventListener('touchmove', this.touchmove, false);

//         canvas.addEventListener('mouseup', this.mouseUp, false);
//         canvas.addEventListener('touchend', this.mouseUp, false);


//         canvas.addEventListener('DOMMouseScroll', this.handleScroll, false);
//         canvas.addEventListener('mousewheel',this.handleScroll,false);

//     }

//     mousedown(evt: MouseEvent) {

//         this.lastPoint.x = evt.pageX - this.canvas.offsetLeft;
//         this.lastPoint.y = evt.pageY - this.canvas.offsetTop;
//         this.dragStart.x = this.ctx.transformedPoint(this.lastPoint.x, this.lastPoint.y);
//         this.dragStartTime = new Date().getTime();
//     }

//     touchstart(touchEvent: TouchEvent) {

//         var pos = this.getTouchPos(touchEvent);

//         this.lastPoint.x = pos.x - this.canvas.offsetLeft;
//         this.lastPoint.y = pos.y - this.canvas.offsetTop;

//         if (pos.multiTouch) {
//             this.lastPoint.x2 = pos.x2 - this.canvas.offsetLeft;
//             this.lastPoint.y2 = pos.y2 - this.canvas.offsetTop;
//             this.multiTouch = true;

//             this.dragStart.x = this.ctx.transformedPoint(this.lastPoint.x2, this.lastPoint.y2);
//         }

//         this.dragStart.x = this.ctx.transformedPoint(this.lastPoint.x, this.lastPoint.y);
//         this.dragStartTime = new Date().getTime();

//         touchEvent.preventDefault();
//         return false;
//     }

//     mouseMove (evt: MouseEvent) {

//         // Records last mouse point
//         this.lastPoint.x = evt.pageX - this.canvas.offsetLeft;
//         this.lastPoint.y = evt.pageY - this.canvas.offsetTop;

//         if (this.dragStart.x){
//             let pt = Scroller.ctx.transformedPoint(Scroller.lastPoint.x,Scroller.lastPoint.y);

//             let dx = pt.x - Scroller.dragStart[0].x;
//             let dy = pt.y - Scroller.dragStart[0].y;

//             Scroller.ctx.translate(dx, dy);
//             Scroller.tree.Render();
//         }
//     }

//     touchmove(touchEvent: TouchEvent) {
//         var pos = Scroller.getTouchPos(touchEvent);

//         // Dragstart set by touchstart
//         if (Scroller.dragStart[0]){

//             if (Scroller.dragStart[1]) {
//                 // Multi touch
//                 Scroller.pinchZoom(pos);
//             } else {
//                 Scroller.singleTouchMove(pos);
//             }
//         }

//         return touchEvent.preventDefault() && false;
//     }

//     pinchZoom(pos: MultiPoint) {

//         var pt = Scroller.ctx.transformedPoint(pos.x - Scroller.canvas.offsetLeft, pos.y - Scroller.canvas.offsetTop);
//         var pt2 = Scroller.ctx.transformedPoint(pos.x2 - Scroller.canvas.offsetLeft, pos.y2 - Scroller.canvas.offsetTop);

//         // Use pythagoras theorem to get pinch zoom distance change
//         var originalDistance = (Scroller.dragStart[0].x - Scroller.dragStart[1].x)**2 + (Scroller.dragStart[0].y - Scroller.dragStart[1].y)**2;
//         var newDistance = (pt.x- pt2.x)**2 + (pt.y - pt2.y)**2;

//         var delta = (newDistance / originalDistance)**0.5;

//         // Midpoint of zoom
//         var mdpt = {
//              x: (pt.x + pt2.x) / 2,
//              y: (pt.y + pt2.y) / 2,
//          };

//         Scroller.ctx.translate(mdpt.x,mdpt.y);
//         Scroller.ctx.scale(delta, delta);
//         Scroller.ctx.translate(-mdpt.x,-mdpt.y);
//         Scroller.tree.Render();
//     }

//     singleTouchMove(pos: Point) {
//         // Single touch move
//         Scroller.lastPoint.x = pos.x - Scroller.canvas.offsetLeft;
//         Scroller.lastPoint.y = pos.y - Scroller.canvas.offsetTop;

//         var pt = Scroller.ctx.transformedPoint(Scroller.lastPoint.x,Scroller.lastPoint.y);

//         let dx = pt.x - Scroller.dragStart[0].x;
//         let dy = pt.y - Scroller.dragStart[0].y;

//         Scroller.ctx.translate(dx, dy);
//         Scroller.tree.Render();
//     }

//     mouseUp() {
//         var elapsedClickTime = new Date().getTime() - Scroller.dragStartTime;

//         // Select if quick single tap
//         if(elapsedClickTime < 150 && !Scroller.dragStart[1]) {
//             var pt = Scroller.ctx.transformedPoint(Scroller.lastPoint.x,Scroller.lastPoint.y);
//             Scroller.tree.Click(pt.x, pt.y);
//         }

//         Scroller.dragStart[0] = null;
//         Scroller.dragStart[1] = null;
//         Scroller.dragStartTime = null;
//     }

//     handleScroll (evt: WheelEvent) {

//         var delta = evt.deltaY ? evt.deltaY / 40 : evt.detail ? -evt.detail : 0;

//         if (delta) {
//             var scaleFactor = 1.1;
//             var pt = this.ctx.transformedPoint(Scroller.lastPoint.x, Scroller.lastPoint.y);
//             Scroller.ctx.translate(pt.x,pt.y);
//             var factor = Math.pow(scaleFactor,delta);
//             Scroller.ctx.scale(factor,factor);
//             Scroller.ctx.translate(-pt.x,-pt.y);
//             Scroller.tree.Render();
//         }

//         evt.preventDefault();
//         return false;
//     }

//     getTouchPos(touchEvent: TouchEvent) {
//         var rect = this.canvas.getBoundingClientRect();

//         var multiTouch = touchEvent.touches.length > 1;
//         var x2 = 0;
//         var y2 = 0;
//         if (multiTouch) {
//             x2 = touchEvent.touches[1].clientX - rect.left,
//             y2 = touchEvent.touches[1].clientY - rect.top
//         }

//         return {
//           multiTouch: multiTouch,
//           x: touchEvent.touches[0].clientX - rect.left,
//           y: touchEvent.touches[0].clientY - rect.top,
//           x2: x2,
//           y2: y2
//         };
//     }

//     trackTransforms(ctx: CanvasRenderingContext2D) {
//         var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
// 		var xform = svg.createSVGMatrix();
//         ctx.getTransform = () => { return xform; };

//         var savedTransforms = Array<DOMMatrix>();
// 		var save = ctx.save;
// 		ctx.save = function(){
// 			savedTransforms.push(xform.translate(0,0));
// 			return save.call(ctx);
// 		};
// 		var restore = ctx.restore;
// 		ctx.restore = function(){
// 			savedTransforms.pop();
// 			return restore.call(ctx);
// 		};

// 		var scale = ctx.scale;
// 		ctx.scale = function(sx: number,sy: number ){
// 			xform = xform.scaleNonUniform(sx,sy);
// 			return scale.call(ctx,sx,sy);
// 		};
// 		var rotate = ctx.rotate;
// 		ctx.rotate = function(radians){
// 			xform = xform.rotate(radians*180/Math.PI);
// 			return rotate.call(ctx,radians);
// 		};
// 		var translate = ctx.translate;
// 		ctx.translate = function(dx,dy){
// 			xform = xform.translate(dx,dy);
// 			return translate.call(ctx,dx,dy);
// 		};
// 		var transform = ctx.transform;
// 		ctx.transform = function(a,b,c,d,e,f){
// 			var m2 = svg.createSVGMatrix();
// 			m2.a=a; m2.b=b; m2.c=c; m2.d=d; m2.e=e; m2.f=f;
// 			xform = xform.multiply(m2);
// 			return transform.call(ctx,a,b,c,d,e,f);
// 		};
// 		var setTransform = ctx.setTransform;
// 		ctx.setTransform = function(a,b,c,d,e,f){
// 			xform.a = a;
// 			xform.b = b;
// 			xform.c = c;
// 			xform.d = d;
// 			xform.e = e;
// 			xform.f = f;
// 			return setTransform.call(ctx,a,b,c,d,e,f);
// 		};
// 		var pt  = svg.createSVGPoint();
// 		ctx.transformedPoint = function(x,y){
// 			pt.x=x; pt.y=y;
// 			return pt.matrixTransform(xform.inverse());
//         }
//     }
// }

