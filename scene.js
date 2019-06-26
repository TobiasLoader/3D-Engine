
var edgeThicknessResize = true;

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
	    
	    {x:400, y:50, z:1400},
	 	];

function scene(){
		
 		axis(color(184, 87, 87),"X");
    axis(color(0, 143, 0),"Y");
    axis(color(0, 115, 255),"Z");
//     circleWire(Rel[0],20000);
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
    
//     cuboidWire(Rel[18],20,20,20,{x:0,y:90,z:atan(Rel[18].z/Rel[18].x)+90});
		personWire(Rel[18],100);
			    
    strokeWeight(1);
    stroke(255, 0, 0);
    line(-10,0,10,0);
    line(0,-10,0,10);
    
}

function addDraw(){
	note("Tobias Codes", 0, H/2-50);
}

function addKeyPressed(){

}

function addMouseClicked(){
	
}