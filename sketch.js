
{
var canvas;
var W;
var H;
var PxR;
var Angle;
var tanA2;
var Dz;
var P;
var R;
var COOR;
var Rel;
var KEY;
var KEYCODE;
var D;
var vel;
var windowResize;
var fps;
} // Variables

function reset(){
	angleMode(DEGREES);
	W = window.innerWidth;
	H = window.innerHeight;
	PxR = W/180;
	Angle = 50;
	Dz = (W/2)/tan(Angle/2);
	P = {
    	x: 0,
		y: 50,
		z: -200,
	};
	R = {
    	x: 0,
		y: 0,
		z: 0
	};
	COOR = [
	    {x:0, y:0, z:200},
	    {x:-100, y:20, z:500},
	    {x:-100, y:60, z:500},
	    {x:-100, y:100, z:500},
	    {x:100, y:20, z:500},
	    {x:100, y:60, z:500},
	    {x:100, y:100, z:500},
	    
	    {x:0, y:0, z:220},
	    {x:0, y:0, z:400},
	    {x:0, y:0, z:300},
	    {x:0, y:0, z:200},
	    {x:0, y:0, z:100},
	    {x:0, y:0, z:0},
	    
	    {x:0, y:0, z:1000},
	    {x:0, y:150, z:1000},
	    
	    {x:0, y:375, z:1000},
	    
	    {x:-400, y:80, z:600},
	    {x:400, y:80, z:600},
	    
	    {x:0, y:0, z:0},
	    
	    {x:600, y:40, z:1400},
	];
	Rel = [];
	KEY = "";
	KEYCODE = "";
	D = {L:false,R:false,U:false,D:false,I:false,O:false,RL:false,RR:false};
	vel = 5;
	windowResize = false;
	fps = 40;
}

function setup() {
  // put setup code here
  	frameRate(fps);
	reset();
	canvas = createCanvas(window.innerWidth, window.innerHeight);
	firstDraw();
}


// It appears that the zoom keys come out of sync with the red '+' when approaching from significantly above or below the target... Why?

function draw() {
	W = window.innerWidth;
	H = window.innerHeight;
	if (mouseIsPressed || keyIsPressed || windowResize){
    	background(245, 245, 245);
        applyCamera();
        translate(W/2,H/2);
        scene();
        cameraMove();
    }
    windowResize = false;
}


function CameraRel(coor){
    var X = coor.x-P.x;
    var Y = coor.y-P.y;
    var Z = coor.z-P.z;
    return {x: X, y: Y, z: Z};  
}
function applyCamera(){
    for (var c = 0; c < COOR.length; c+=1){
        Rel[c] = CameraRel(COOR[c]);
    }
}

function coorMaths(C,Rs,coor){
    var X = C.x;
    var Y = C.y;
    var Z = C.z;
    if (Rs && coor){
        var x = coor.x+((C.x-coor.x)*cos(Rs.z)-(C.y-coor.y)*sin(Rs.z));
        var y = coor.y+((C.y-coor.y)*cos(Rs.z)+(C.x-coor.x)*sin(Rs.z));
        var z = C.z;
        var x2 = coor.x+(x-coor.x)*cos(Rs.x)-(z-coor.z)*sin(Rs.x);
        var y2 = y;
        var z2 = coor.z+(z-coor.z)*cos(Rs.x)+(x-coor.x)*sin(Rs.x);
        var x3 = x2;
        var y3 = coor.y+(y2-coor.y)*cos(Rs.y)-(z2-coor.z)*sin(Rs.y);
        var z3 = coor.z+(z2-coor.z)*cos(Rs.y)+(y2-coor.y)*sin(Rs.y);
        X = x3;
        Y = y3;
        Z = z3;
    }
    var X2 = X*cos(R.x)-Z*sin(R.x);
    var Y2 = Y;
    var Z2 = Z*cos(R.x)+X*sin(R.x);
    var X3 = X2;
    var Y3 = Y2*cos(R.y)-Z2*sin(R.y);
    var Z3 = Z2*cos(R.y)+Y2*sin(R.y);

    X = X3;
    Y = Y3;
    Z = Z3;
    
    var PX = X*(Dz/(Z));
    var PY = -Y*(Dz/(Z));
    
    if (Z >= 0){
        return {x:PX, y:PY, NA:false};
    } else {
        return {x:PX, y:PY, NA:true};
    }
}
function drawPoint(P1){
    if (!P1.NA){
		stroke(255,0,0);
        strokeWeight(5);
        point(P1.x,P1.y);
    }
}

function drawLine(P1,P2){
    if (!P1.NA && !P2.NA){
        line(P1.x,P1.y,P2.x,P2.y);
    } 
    
    else {
        if (!P1.NA && P2.NA){
            var sto = [P1,P2];
            P1 = sto[1];
            P2 = sto[0];
        }
        if (P1.NA && !P2.NA){
            var A1 = atan((P2.y-P1.y)/(P2.x-P1.x));
            var Hypot = sqrt(sq(W)+sq(H));

            if (P1.x<P2.x){
                line(P2.x,P2.y,P2.x+Hypot*cos(A1),P2.y+Hypot*sin(A1));
            } else if (P1.x>P2.x) {
                line(P2.x,P2.y,P2.x-Hypot*cos(A1),P2.y-Hypot*sin(A1));
            }
        } 
    }
}

function cuboidWire(coor,w,h,d,Rs){
    var w2 = w/2;
    var h2 = h/2;
    var d2 = d/2;
    
    var C = [
        {x: coor.x-w2,y: coor.y-h2,z: coor.z-d2},
        {x: coor.x+w2,y: coor.y-h2,z: coor.z-d2},
        {x: coor.x+w2,y: coor.y+h2,z: coor.z-d2},
        {x: coor.x-w2,y: coor.y+h2,z: coor.z-d2},
        {x: coor.x-w2,y: coor.y-h2,z: coor.z+d2},
        {x: coor.x+w2,y: coor.y-h2,z: coor.z+d2},
        {x: coor.x+w2,y: coor.y+h2,z: coor.z+d2},
        {x: coor.x-w2,y: coor.y+h2,z: coor.z+d2},
    ];
    
    for (var c=0; c<C.length; c+=1){
        C[c] = coorMaths(C[c],Rs,coor);
//         drawPoint(C[c]);
    }

    strokeWeight(1);
    stroke(143, 143, 143);

    drawLine(C[0],C[1]);
    drawLine(C[1],C[2]);
    drawLine(C[2],C[3]);
    drawLine(C[3],C[0]);
    
    drawLine(C[4],C[5]);
    drawLine(C[5],C[6]);
    drawLine(C[6],C[7]);
    drawLine(C[7],C[4]);
    
    drawLine(C[0],C[4]);
    drawLine(C[1],C[5]);
    drawLine(C[2],C[6]);
    drawLine(C[3],C[7]);
}

function axis(colour,direction){
    var s = 100;
    strokeWeight(1);
    stroke(colour);
    switch (direction){
    case "X": drawLine(coorMaths({x: -s-P.x,y: 0-P.y,z: 0-P.z}),coorMaths({x: s-P.x,y: 0-P.y,z: 0-P.z}));
            break;
    case "Y": drawLine(coorMaths({x: 0-P.x,y: -s-P.y,z: 0-P.z}),coorMaths({x: 0-P.x,y: s-P.y,z: 0-P.z}));
            break;
    case "Z": drawLine(coorMaths({x: 0-P.x,y: 0-P.y,z: -s-P.z}),coorMaths({x: 0-P.x,y: 0-P.y,z: s-P.z})); 
    }
}
function pyramidWire(coor,w,h,d,Rs){
    var w2 = w/2;
    var h2 = h/2;
    var d2 = d/2;
    var C = [
        {x: coor.x-w2,y: coor.y-h2,z: coor.z+d2},
        {x: coor.x+w2,y: coor.y-h2,z: coor.z+d2},
        {x: coor.x+w2,y: coor.y-h2,z: coor.z-d2},
        {x: coor.x-w2,y: coor.y-h2,z: coor.z-d2},
        {x: coor.x,y: coor.y+h2,z: coor.z}
    ];
    
    for (var c=0; c<C.length; c+=1){
        C[c] = coorMaths(C[c],Rs,coor);
    }

    strokeWeight(1);
    stroke(143, 143, 143);
    
    drawLine(C[0],C[1]);
    drawLine(C[1],C[2]);
    drawLine(C[2],C[3]);
    drawLine(C[3],C[0]);
    
    drawLine(C[0],C[4]);
    drawLine(C[1],C[4]);
    drawLine(C[2],C[4]);
    drawLine(C[3],C[4]);
}
function rectWire(coor,w,d,Rs){
    var w2 = w/2;
    var d2 = d/2;

    var C = [
        {x: coor.x-w2,y: coor.y,z: coor.z+d2},
        {x: coor.x+w2,y: coor.y,z: coor.z+d2},
        {x: coor.x+w2,y: coor.y,z: coor.z-d2},
        {x: coor.x-w2,y: coor.y,z: coor.z-d2},
    ];
    
    for (var c=0; c<C.length; c+=1){
        C[c] = coorMaths(C[c],Rs,coor);
    }
    
    strokeWeight(1);
    stroke(143, 143, 143);
    
    drawLine(C[0],C[1]);
    drawLine(C[2],C[1]);
    drawLine(C[2],C[3]);
    drawLine(C[3],C[0]);
}
function tobleroneWire(coor,w,h,d,Rs){
    var w2 = w/2;
    var h2 = h/2;
    var d2 = d/2;
    
    var C = [
        {x: coor.x-w2,y: coor.y-h2,z: coor.z+d2},
        {x: coor.x-w2,y: coor.y-+h2,z: coor.z-d2},
        {x: coor.x-w2,y: coor.y+h2,z: coor.z},
        {x: coor.x+w2,y: coor.y-h2,z: coor.z+d2},
        {x: coor.x+w2,y: coor.y-h2,z: coor.z-d2},
        {x: coor.x+w2,y: coor.y+h2,z: coor.z},
    ];
    
    for (var c=0; c<C.length; c+=1){
        C[c] = coorMaths(C[c],Rs,coor);
    }
    
    strokeWeight(1);
    stroke(143, 143, 143);
    
    drawLine(C[0],C[1]);
    drawLine(C[1],C[4]);
    drawLine(C[4],C[3]);
    drawLine(C[3],C[0]);
    
    drawLine(C[0],C[2]);
    drawLine(C[1],C[2]);
    drawLine(C[3],C[5]);
    drawLine(C[4],C[5]);
    
    drawLine(C[2],C[5]);
    
}
function slantPyramidWire(coor,w,h,d,Rs){
    var w2 = w/2;
    var h2 = h/2;
    var d2 = d/2;
    var C = [
        {x: coor.x-w2,y: coor.y-h2,z: coor.z+d2},
        {x: coor.x+w2,y: coor.y-h2,z: coor.z+d2},
        {x: coor.x+w2,y: coor.y-h2,z: coor.z-d2},
        {x: coor.x-w2,y: coor.y-h2,z: coor.z-d2},
        {x: coor.x+w2,y: coor.y+h2,z: coor.z}
    ];
    
    for (var c=0; c<C.length; c+=1){
        C[c] = coorMaths(C[c],Rs,coor);
    }

    strokeWeight(1);
    stroke(143, 143, 143);
    
    drawLine(C[0],C[1]);
    drawLine(C[1],C[2]);
    drawLine(C[2],C[3]);
    drawLine(C[3],C[0]);
    
    drawLine(C[0],C[4]);
    drawLine(C[1],C[4]);
    drawLine(C[2],C[4]);
    drawLine(C[3],C[4]);
}
function circleWire(coor,d,Rs,Q){
    var r = d/2; // Radius = Diameter/2
    var A = 5;
    if (d<=100){A*=2;}
    if (d<=50){A*=2;}
    if (Q){
        A=Q;    
    }
    
    
    var C = [];
    for (var i=0; i<=(360/A); i+=1){
        C.push({x: coor.x-r*cos(i*A),y: coor.y,z: coor.z-r*sin(i*A)});
    }
    
    for (var c=0; c<C.length; c+=1){
        C[c] = coorMaths(C[c],Rs,coor);
    }
    
    strokeWeight(1);
    stroke(143, 143, 143);
    
    for (var i = 0; i<C.length-1; i += 1){
        drawLine(C[i],C[i+1]);
    }
}
function sphereWire(coor,d,Rs,Q){
    var r = d/2; // Radius = Diameter/2
    var newR = 0;
    
    var A = 10;
    
    if (abs(coor.z)>300){A = 15;} 
    if (abs(coor.z)>500){A = 20;} 
    if (abs(coor.z)>700){A = 30;}
    if (P.z-coor.z>2000){A = 36;}

    
    if (Q){
        A=Q;    
    }
    // wif (P.z-coor.z>2000){
    //     A = 40;
    // }
    
    var C = [];
    for (var i=0; i<=(360/A); i+=1){
        for (var j=0; j<=(360/A); j+=1){
            C.push({x: coor.x-r*sin(i*A)*cos(j*A),y: coor.y-r*sin(i*A)*sin(j*A),z: coor.z-r*cos(i*A)});
        }
    }
    
    for (var c=0; c<C.length; c+=1){
        C[c] = coorMaths(C[c],Rs,coor);
    }
    
    strokeWeight(1);
    stroke(143, 143, 143);
    
    for (var i = 0; i<C.length-(360/A); i += 1){
        // drawLine(C[i],C[i+1]);
        drawLine(C[i],C[i+360/A]);
    }
    drawLine(C[0],C[20]);
    
}
function sphere2Wire(coor,d,Rs,Q){
    var r = d/2; // Radius = Diameter/2
    var newR = 0;
    
    var A = 10;
    
    if (abs(coor.z)>300){A = 15;} 
    if (abs(coor.z)>500){A = 20;} 
    if (abs(coor.z)>700){A = 30;}
    if (P.z-coor.z>2000){A = 36;}
    
    if (Q){
        A=Q;    
    }
    
    var C1 = [];
    var C2 = [];
    var C3 = [];
    for (var i=0; i<=(360/A); i+=1){
        for (var j=0; j<=(360/A); j+=1){
            C1.push({x: coor.x-r*sin(i*A)*cos(j*A),y: coor.y-r*sin(i*A)*sin(j*A),z: coor.z-r*cos(i*A)});
            C2.push({x: coor.x-r*sin(i*A)*cos(j*A),y: coor.y-r*cos(i*A),z: coor.z-r*sin(i*A)*sin(j*A)});
            C3.push({x: coor.x-r*cos(i*A),y: coor.y-r*sin(i*A)*cos(j*A),z: coor.z-r*sin(i*A)*sin(j*A)});
        }
    }
    
    for (var c=0; c<C1.length; c+=1){
        C1[c] = coorMaths(C1[c],Rs,coor);
        C2[c] = coorMaths(C2[c],Rs,coor);
        C3[c] = coorMaths(C3[c],Rs,coor);
    }
    
    strokeWeight(1);
    stroke(143, 143, 143);
    
    for (var i = 0; i<C1.length-(360/A); i += 1){
        drawLine(C1[i],C1[i+1]);
        drawLine(C2[i],C2[i+1]);
        drawLine(C3[i],C3[i+1]);
    }
    
}
function cylinderWire(coor,d,h,Rs,Q){
    var r = d/2; // Radius = Diameter/2
    var h2 = h/2;
    
    var A = 20;
    if (abs(coor.z)>300){A = 30;} 
    if (abs(coor.z)>500){A = 40;} 
    if (abs(coor.z)>700){A = 60;}
    if (abs(coor.z)>2000){A = 120;}
    if (Q){
        A=Q;    
    }
    var C1 = [];
    var C2 = [];
    for (var i=0; i<=(360/A); i+=1){
        C1.push({x: coor.x-r*cos(i*A),y: coor.y-h2,z: coor.z-r*sin(i*A)});
        C2.push({x: coor.x-r*cos(i*A),y: coor.y+h2,z: coor.z-r*sin(i*A)});
    }
    
    for (var c=0; c<C1.length; c+=1){
        C1[c] = coorMaths(C1[c],Rs,coor);
        C2[c] = coorMaths(C2[c],Rs,coor);
    }
    
    strokeWeight(1);
    stroke(143, 143, 143);
    
    for (var i = 0; i<C1.length-1; i += 1){
        drawLine(C1[i],C1[i+1]);
        drawLine(C2[i],C2[i+1]);
        drawLine(C1[i],C2[i]);
    }
    
}

function treeWire(coor,s){
    cylinderWire({x:coor.x,y:coor.y-2*s/6,z:coor.z},s/10,s/3);
    sphereWire({x:coor.x,y:coor.y+s/6,z:coor.z},2*s/3,0,30);
}
function roofWire(coor,w,h,d){
    // tobleroneWire(coor,3*w/5,h,d);
    // slantPyramidWire({x:coor.x-2*w/5,y:coor.y,z:coor.z},w/5,h,d);
    // slantPyramidWire({x:coor.x+2*w/5,y:coor.y,z:coor.z},w/5,h,d,x:{180,y:0,z:0});
    var w2 = w/2;
    var h2 = h/2;
    var d2 = d/2;
    var C = [
        {x: coor.x-w2,y: coor.y-h2,z: coor.z+d2},
        {x: coor.x+w2,y: coor.y-h2,z: coor.z+d2},
        {x: coor.x+w2,y: coor.y-h2,z: coor.z-d2},
        {x: coor.x-w2,y: coor.y-h2,z: coor.z-d2},
        {x: coor.x-3*w2/5,y: coor.y+h2,z: coor.z},
        {x: coor.x+3*w2/5,y: coor.y+h2,z: coor.z}
    ];
    
    for (var c=0; c<C.length; c+=1){
        C[c] = coorMaths(C[c]);
    }

    strokeWeight(1);
    stroke(143, 143, 143);
    
    drawLine(C[0],C[1]);
    drawLine(C[1],C[2]);
    drawLine(C[2],C[3]);
    drawLine(C[3],C[0]);
    
    drawLine(C[0],C[4]);
    drawLine(C[3],C[4]);
    drawLine(C[2],C[5]);
    drawLine(C[1],C[5]);
    
    drawLine(C[4],C[5]);
}


function cameraMove(){
    if (D.L){ 
        P.x-=vel*cos(R.x);
        P.z+=vel*sin(R.x);
    }
    if (D.R){ 
        P.x+=vel*cos(R.x);
        P.z-=vel*sin(R.x);
    }
    if (D.U){ 
        P.y+=vel;
    }
    if (D.D){ 
        P.y-=vel;
    }
    if (D.I){
        P.x+=vel*sin(R.x);
        P.y+=vel*sin(R.y);
        P.z+=vel*cos(R.x)*cos(R.y);
    }
    if (D.O){ 
        P.x-=vel*sin(R.x);
        P.y-=vel*sin(R.y);
        P.z-=vel*cos(R.x)*cos(R.y);
    }
}
function scene(){
    
	 	axis(color(184, 87, 87),"X");
    axis(color(0, 143, 0),"Y");
    axis(color(0, 115, 255),"Z");
    circleWire(Rel[0],20000);
    cuboidWire(Rel[1],40,40,40);
    cuboidWire(Rel[2],40,40,40);
    pyramidWire(Rel[3],40,40,40);
    cuboidWire(Rel[4],40,40,40);
    cuboidWire(Rel[5],40,40,40);
    pyramidWire(Rel[6],40,40,40);
    
    rectWire(Rel[7],240,600);
    rectWire(Rel[8],10,40);
    rectWire(Rel[9],10,40);
    rectWire(Rel[10],10,40);
    rectWire(Rel[11],10,40);
    rectWire(Rel[12],10,40);
    
    rectWire(Rel[13],1000,960);
    cuboidWire(Rel[14],500,300,400);
//     cuboidWire(Rel[14],200,200,200,{x:atan(Rel[14].z/Rel[14].x),y:0,z:0});
    
    roofWire(Rel[15],500,150,400);
    
    treeWire(Rel[16],160);
    treeWire(Rel[17],160);
    
//     circle(Rel[18],100,{x:atan(Rel[14].z/Rel[14].x),y:90,z:0});
	    
    strokeWeight(1);
    stroke(255, 0, 0);
    line(-10,0,10,0);
    line(0,-10,0,10);
    
}

function firstDraw(){
    background(245, 245, 245);
    applyCamera();
    translate(W/2,H/2);
    scene();
    cameraMove();
}

function applyKeyFunc(val){
    if (keyCode===37 || keyCode===65){ D.L=val; }
    if (keyCode===39 || keyCode===68){ D.R=val; }
    if (keyCode===90 || keyCode===188){ D.U=val; }
    if (keyCode===88 || keyCode===190){ D.D=val; }
    if (keyCode===38 || keyCode===87){D.I=val; }
    if (keyCode===40 || keyCode===83){D.O=val; }
    if (keyCode===13){
        reset();    
    }
}

function keyPressed(){
    applyKeyFunc(true);
}
function keyReleased(){
    applyKeyFunc(false);
}

function mouseDragged(){
    R.x += (mouseX-pmouseX)/PxR;
    R.y -= (mouseY-pmouseY)/PxR;
}

window.onresize = function() {
  windowResize = true;
  canvas.size(window.innerWidth,window.innerHeight);
  width = W;
  height = H;
};