
function firstDraw(){
    background(245, 245, 245);
    applyCamera();
    translate(W/2,H/2);
    scene();
    addDraw();
    cameraMove();
}

function draw() {
	W = window.innerWidth;
	H = window.innerHeight;
	if (mouseIsPressed || keyIsPressed || windowResize){
    	firstDraw();
  }
  popUp("Press H for Help",1);
  windowResize = false;
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
//   println(talk);
};

function mouseClicked(){
	addMouseClicked();
}
