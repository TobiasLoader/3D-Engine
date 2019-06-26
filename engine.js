

// It appears that the zoom keys come out of sync with the red '+' when approaching from significantly above or below the target... Why?


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
        point(P1.x,P1.y);
    }
}
function drawPointRAW(P1){
		drawPoint(coorMaths(P1));
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
function drawLineRAW(coor1,coor2){
	drawLine(coorMaths(coor1),coorMaths(coor2));
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

    strokeWeight(lineWidthScale(coor));
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
    case "X": drawLineRAW({x: -s-P.x,y: 0-P.y,z: 0-P.z},{x: s-P.x,y: 0-P.y,z: 0-P.z});
            break;
    case "Y": drawLineRAW({x: 0-P.x,y: -s-P.y,z: 0-P.z},{x: 0-P.x,y: s-P.y,z: 0-P.z});
            break;
    case "Z": drawLineRAW({x: 0-P.x,y: 0-P.y,z: -s-P.z},{x: 0-P.x,y: 0-P.y,z: s-P.z}); 
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

    strokeWeight(lineWidthScale(coor));
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
    
    strokeWeight(lineWidthScale(coor));
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
    
    strokeWeight(lineWidthScale(coor));
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

    strokeWeight(lineWidthScale(coor));
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
    
    strokeWeight(lineWidthScale(coor));
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
    
    strokeWeight(lineWidthScale(coor));
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
    
    strokeWeight(lineWidthScale(coor));
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
    
    strokeWeight(lineWidthScale(coor));
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

    strokeWeight(lineWidthScale(coor));
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
function personWire(coor,s){
	var angle = atan(coor.z/coor.x)+90;
	var Sangle = sin(angle);
	var Cangle = cos(angle);
	cuboidWire({x:coor.x,y:coor.y+(3/8)*s,z:coor.z},s/4,s/4,s/4,{x:0,y:90,z:angle});
	drawLineRAW({x:coor.x,y:coor.y+(1/4)*s,z:coor.z},{x:coor.x,y:coor.y-(1/8)*s,z:coor.z});
	drawLineRAW({x:coor.x,y:coor.y-(1/8)*s,z:coor.z},{x:coor.x+(1/8)*s,y:coor.y-(1/2)*s,z:coor.z});
	drawLineRAW({x:coor.x,y:coor.y-(1/8)*s,z:coor.z},{x:coor.x-(1/8)*s,y:coor.y-(1/2)*s,z:coor.z});
	drawLineRAW({x:coor.x+(1/4)*s,y:coor.y+(1/8)*s,z:coor.z},{x:coor.x-(1/4)*s,y:coor.y+(1/8)*s,z:coor.z});
	strokeWeight(4*lineWidthScale(coor));
	if (coor.x<0){
		drawPointRAW({x:coor.x+((1/8)*s*Sangle)+((3/64)*s*Cangle),y:coor.y+(13/32)*s,z:coor.z-((1/8)*s*Cangle)+((3/64)*s*Sangle)});
		drawPointRAW({x:coor.x+((1/8)*s*Sangle)-((3/64)*s*Cangle),y:coor.y+(13/32)*s,z:coor.z-((1/8)*s*Cangle)-((3/64)*s*Sangle)});
	} else {
		drawPointRAW({x:coor.x-((1/8)*s*Sangle)-((3/64)*s*Cangle),y:coor.y+(13/32)*s,z:coor.z+((1/8)*s*Cangle)-((3/64)*s*Sangle)});
		drawPointRAW({x:coor.x-((1/8)*s*Sangle)+((3/64)*s*Cangle),y:coor.y+(13/32)*s,z:coor.z+((1/8)*s*Cangle)+((3/64)*s*Sangle)});
	}
	strokeWeight(lineWidthScale(coor));
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

function lineWidthScale(coor){
	if (!lineWidthConstantSize){
		return 1000/sqrt(sq(coor.x)+sq(coor.y)+sq(coor.z));
	} else {
		return lineWidthConstantSize;
	}
}
function applyKeyFunc(val){
    if (keyCode===37 || keyCode===65){ D.L=val; }
    if (keyCode===39 || keyCode===68){ D.R=val; }
    if (keyCode===90 || keyCode===188){ D.U=val; }
    if (keyCode===88 || keyCode===190){ D.D=val; }
    if (keyCode===38 || keyCode===87){ D.I=val; }
    if (keyCode===40 || keyCode===83){ D.O=val; }
    if (keyCode===13){ reset(); }
    if (keyCode===72){alert("3D-Engine\n\nI built this from scratch in the summer of 2018, before I started my A-Levels. At this time I hadn't learned  matrices, so it took me a lot longer to build this project than it otherwise could have, however I still had lots of fun working on it!\n\nCONTROLS\n\nUse WASDZX to move.\n\nW = forwards\nA = left\nS = backwards\nD = right\nZ = up\nX = down\n\nDrag to rotate the camera.");}
    addKeyPressed();
}