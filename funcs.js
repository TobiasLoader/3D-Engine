{
var canvas;
var W = window.innerWidth;
var H = window.innerHeight;
var PxR;
var Angle;
var tanA2;
var Dz;
var P;
var R;
var Rel;
var KEY;
var KEYCODE;
var D;
var vel;
var windowResize;
var fps;
var lineWidthConstantSize;
} // Variables

function reset(){
	textFont("Avenir Next",20);
	textAlign(CENTER,CENTER);
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
	Rel = [];
	KEY = "";
	KEYCODE = "";
	D = {L:false,R:false,U:false,D:false,I:false,O:false,RL:false,RR:false};
	vel = 5;
	windowResize = false;
	fps = 40;
	if (edgeThicknessResize){
		lineWidthConstantSize = 0;
	} else {
		lineWidthConstantSize = 1;
	}
	
}

function setup() {
  // put setup code here
  	frameRate(fps);
	reset();
	canvas = createCanvas(window.innerWidth, window.innerHeight);
	firstDraw();
	popUp("Press H for Help",1);
}

function seconds(){
	return millis()/1000;
}


function popUp(MESSAGE,priority){
	if (W>800){
		textSize(W/75);
	} else {
		textSize(16);
	}
	fill(150,200,250,200);
	noStroke();
	rect(33-W/2,33-H/2+(priority-1)*100,W/5,66,2);
	fill(255);
	textAlign(CENTER,CENTER);
	text(MESSAGE,33-W/2+5,66-H/2+(priority-1)*100,W/5-10);
}

function note(MESSAGE, X, Y){
	textSize(20);
	noStroke();
	textAlign(CENTER,CENTER);
	fill(100,100,100);
	text(MESSAGE,X,Y);
}