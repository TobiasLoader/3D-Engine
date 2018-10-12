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
	popUp("Use WASDZX to move");
}

function seconds(){
	return millis()/1000;
}


function popUp(MESSAGE){
	if (W>800){
		textSize(W/50);
	} else {
		textSize(16);
	}
	fill(150,200,250,200);
	noStroke();
	rect(50-W/2,50-H/2,W/4,100,3);
	fill(255);
	textAlign(CENTER,CENTER);
	text(MESSAGE,50-W/2+5,100-H/2,W/4-10);
}

function note(MESSAGE){
	textSize(20);
	noStroke();
	textAlign(CENTER,CENTER);
	fill(100,100,100);
	text(MESSAGE,0,H/2-50);
}