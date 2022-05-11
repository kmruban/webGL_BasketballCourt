"use strict";
var canvas, gl, program;
var projectionMatrix, modelViewMatrix, instanceMatrix, modelViewMatrixLoc;
var ambientProduct, diffuseProduct, specularProduct;
var specularProductLoc, diffuseProductLoc, ambientProductLoc, lightPositionLoc, shininessLoc;
var vBuffer, nBuffer;
var pointsArray = [];
var normalsArray = [];

var vertices = [
    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4(  0.5,  0.5,  0.5, 1.0 ),
    vec4(  0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4(  0.5,  0.5, -0.5, 1.0 ),
    vec4(  0.5, -0.5, -0.5, 1.0 )
];

var lightPosition = vec4(0.0, 0.0, 1.0, 0.0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
var materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0);
var materialSpecular = vec4( 1.0, 0.8, 0.0, 1.0 );
var materialShininess = 50.0;

//floor
var floorId = 0;
var floorId2 = 1;
//hoop 1
var poleId = 2;
var horizontalpoleId = 3;
var backboardId = 4;
var rimId = 5;
var netId = 6;
var netId2 = 7;
var netId3 = 8;
var netId4 = 9;
var netId5 = 10;
var netId6 = 11;
var netId7 = 12;
var netId8 = 13;
var netId9 = 14;
var netId10 = 15;
var netId11 = 16;
var netId12 = 17;
//hoop 2
var hoop2poleId = 18;
var hoop2horizontalpoleId = 19;
var hoop2backboardId = 20;
var hoop2rimId = 21;
var hoop2netId = 22;
var hoop2netId2 = 23;
var hoop2netId3 = 24;
var hoop2netId4 = 25;
var hoop2netId5 = 26;
var hoop2netId6 = 27;
var hoop2netId7 = 28;
var hoop2netId8 = 29;
var hoop2netId9 = 30;
var hoop2netId10 = 31;
var hoop2netId11 = 32;
var hoop2netId12 = 33;
//person1
var torsoId = 34;
var headId = 35;
var leftUpArmId = 36;
var rightUpArmId = 37;
var leftLowArmId = 38;
var rightLowArmId = 39;
var leftUpLegId = 40;
var rightUpLegId = 41;
var leftLowLegId = 42;
var rightLowLegId = 43;
//person2
var person2torsoId = 44;
var person2headId = 45;
var person2leftUpArmId = 46;
var person2rightUpArmId = 47;
var person2leftLowArmId = 48;
var person2rightLowArmId = 49;
var person2leftUpLegId = 50;
var person2rightUpLegId = 51;
var person2leftLowLegId = 52;
var person2rightLowLegId = 53;

var ballId = 54;
var p2ballId = 55;


var floorHeight = 0.25;
var floorWidth = 17.25;
var poleHeight = 10;
var poleWidth = 0.25;
var horizontalpoleHeight = 0.35;
var horizontalpoleWidth = 0.6;
var backboardHeight = 3.5;
var backboardWidth = 0.25;
var rimHeight = 0.25;
var rimWidth = 0.75;
var netHeight = 1.25;
var netWidth = 0.075;

var torsoHeight = 3.5;
var torsoWidth = 0.75;
var headHeight = 0.8;
var headWidth = 0.4;
var upArmWidth = 0.25;
var upArmHeight = 1.5;
var lowArmWidth = 0.2;
var lowArmHeight = 1.0;
var upLegWidth = 0.25;
var upLegHeight = 1.5;
var lowLegWidth = 0.2;
var lowLegHeight = 1.25;

var ballWidth = 0.55;
var ballHeight = 0.625;

var numNodes = 60;
var numAngles = 60;

var theta = [20, -20, 0, 0, 0, 0, 0, 0, 0, 0,    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,     0, 0, 0, 0, 0, 0, 0, 0, 0, 0,     0, 0, 0, 0, 0, 0, 200, 200, 0, 0,     0, 0, 0, 0, 0, 0, 160, 160, 0, 0,      0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];

var stack = [];
var figure = [];

for( var i=0; i<numNodes; i++) figure[i] = createNode(null, null, null, null);

var vBuffer, cBuffer;

var pointsArray = [];
var colorsArray = [];

//-------------------------------------------

function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}

//--------------------------------------------

function createNode(transform, render, sibling, child){
    var node = {
    transform: transform,
    render: render,
    sibling: sibling,
    child: child,
    }
    return node;
}

//START AT FLOOR UP
function initNodes(Id) {

    var m = mat4();

    switch(Id) {
    	
    case floorId:
    case floorId2:
   	    m = rotate(theta[floorId], 1, 0, 0 );
		m = mult(m, rotate(theta[floorId2], 0, 1, 0 ));
		m = mult(m, translate(0, -10, 0));
		figure[floorId] = createNode( m, floor, null, poleId);
    break;
    case poleId:
		m = rotate(theta[poleId], 0, 1, 0 );
		m = mult(m, translate(-8.75, 4.375, 0));
		figure[poleId] = createNode( m, pole, hoop2poleId, horizontalpoleId);
    break;
    case horizontalpoleId:
    	m = translate(0.425, 4.8, 0);
    	m = mult(m, rotate(theta[horizontalpoleId], 0, 1, 0 ));
		figure[horizontalpoleId] = createNode( m, horizontalpole, null, backboardId);
    break;
    case backboardId:
    	m = translate(0.425, 1.5, 0);
    	m = mult(m, rotate(theta[backboardId], 0, 1, 0 ));
		figure[backboardId] = createNode( m, backboard, null, rimId);
    break;
    case rimId:
    	m = translate(0.5, -1.25, 0);
    	m = mult(m, rotate(theta[rimId], 0, 1, 0 ));
		figure[rimId] = createNode( m, rim, null, netId);
    break;
    case netId:
    	m = translate(-0.2, -0.6, 0.25);
    	m = mult(m, rotate(theta[netId], 1, 0, 0 ));
		figure[netId] = createNode( m, net, null, netId2);
    break;
    case netId2:
    	m = translate(0.14, 0, 0);
    	m = mult(m, rotate(theta[netId2], 0, 1, 0 ));
		figure[netId2] = createNode( m, net2, null, netId3);
    break;
    case netId3:
    	m = translate(0.14, 0, 0);
    	m = mult(m, rotate(theta[netId3], 0, 1, 0 ));
		figure[netId3] = createNode( m, net3, null, netId4);
    break;
    case netId4:
    	m = translate(0.14, 0, 0);
    	m = mult(m, rotate(theta[netId4], 0, 1, 0 ));
		figure[netId4] = createNode( m, net4, null, netId5);
    break;
    case netId5:
    	m = translate(0, 0.0, -0.16);
    	m = mult(m, rotate(theta[netId5], 0, 1, 0 ));
		figure[netId5] = createNode( m, net5, null, netId6);
    break;
    case netId6:
    	m = translate(0, 0.0, -0.16);
    	m = mult(m, rotate(theta[netId6], 0, 1, 0 ));
		figure[netId6] = createNode( m, net6, null, netId7);
    break;
    case netId7:
    	m = translate(0, 0.0, -0.16);
    	m = mult(m, rotate(theta[netId7], 0, 1, 0 ));
		figure[netId7] = createNode( m, net7, null, netId8);
    break;
    case netId8:
    	m = translate(-0.14, 0.0, 0);
    	m = mult(m, rotate(theta[netId8], 0, 1, 0 ));
		figure[netId8] = createNode( m, net8, null, netId9);
    break;
    case netId9:
    	m = translate(-0.14, 0.0, 0);
    	m = mult(m, rotate(theta[netId9], 0, 1, 0 ));
		figure[netId9] = createNode( m, net9, null, netId10);
    break;
    case netId10:
    	m = translate(-0.14, 0.0, 0);
    	m = mult(m, rotate(theta[netId10], 0, 1, 0 ));
		figure[netId10] = createNode( m, net10, null, netId11);
    break;
    case netId11:
    	m = translate(0, 0.0, 0.16);
    	m = mult(m, rotate(theta[netId11], 0, 1, 0 ));
		figure[netId11] = createNode( m, net11, null, netId12);
    break;
    case netId12:
    	m = translate(0, 0.0, 0.16);
    	m = mult(m, rotate(theta[netId12], 0, 1, 0 ));
		figure[netId12] = createNode( m, net12, null, null);
    break;
    
    //hoop 2
    case hoop2poleId:
		m = rotate(theta[hoop2poleId], 0, 1, 0 );
		m = mult(m, translate(8.75, 4.35, 0));
		figure[hoop2poleId] = createNode( m, hoop2pole, torsoId, hoop2horizontalpoleId);
    break;
    case hoop2horizontalpoleId:
		m = rotate(theta[hoop2horizontalpoleId], 0, 1, 0 );
		m = mult(m, translate(-0.425, 4.75, 0));
		figure[hoop2horizontalpoleId] = createNode( m, hoop2horizontalpole, null, hoop2backboardId);
    break;
    case hoop2backboardId:
    	m = translate(-0.425, 1.5, 0);
    	m = mult(m, rotate(theta[hoop2backboardId], 0, 1, 0 ));
		figure[hoop2backboardId] = createNode( m, hoop2backboard, null, hoop2rimId);
    break;
    case hoop2rimId:
    	m = translate(-0.5, -1.25, 0);
    	m = mult(m, rotate(theta[hoop2rimId], 0, 1, 0 ));
		figure[hoop2rimId] = createNode( m, hoop2rim, null, hoop2netId);
    break;
    case hoop2netId:
    	m = translate(0.2, -0.6, 0.25);
    	m = mult(m, rotate(theta[hoop2netId], 1, 0, 0 ));
		figure[hoop2netId] = createNode( m, hoop2net, null, hoop2netId2);
    break;
    case hoop2netId2:
    	m = translate(-0.14, 0, 0);
    	m = mult(m, rotate(theta[hoop2netId2], 1, 0, 0 ));
		figure[hoop2netId2] = createNode( m, hoop2net2, null, hoop2netId3);
    break;
    case hoop2netId3:
    	m = translate(-0.14, 0, 0);
    	m = mult(m, rotate(theta[hoop2netId3], 1, 0, 0 ));
		figure[hoop2netId3] = createNode( m, hoop2net3, null, hoop2netId4);
    break;
    case hoop2netId4:
    	m = translate(-0.14, 0, 0);
    	m = mult(m, rotate(theta[hoop2netId4], 1, 0, 0 ));
		figure[hoop2netId4] = createNode( m, hoop2net4, null, hoop2netId5);
    break;
    case hoop2netId5:
    	m = translate(0, 0, -0.16);
    	m = mult(m, rotate(theta[hoop2netId5], 1, 0, 0 ));
		figure[hoop2netId5] = createNode( m, hoop2net5, null, hoop2netId6);
    break;
    case hoop2netId6:
    	m = translate(0, 0, -0.16);
    	m = mult(m, rotate(theta[hoop2netId6], 1, 0, 0 ));
		figure[hoop2netId6] = createNode( m, hoop2net6, null, hoop2netId7);
    break;
    case hoop2netId7:
    	m = translate(0, 0, -0.16);
    	m = mult(m, rotate(theta[hoop2netId7], 1, 0, 0 ));
		figure[hoop2netId7] = createNode( m, hoop2net7, null, hoop2netId8);
    break;
    case hoop2netId8:
    	m = translate(0.14, 0, 0);
    	m = mult(m, rotate(theta[hoop2netId8], 1, 0, 0 ));
		figure[hoop2netId8] = createNode( m, hoop2net8, null, hoop2netId9);
    break;
    case hoop2netId9:
    	m = translate(0.14, 0, 0);
    	m = mult(m, rotate(theta[hoop2netId9], 1, 0, 0 ));
		figure[hoop2netId9] = createNode( m, hoop2net9, null, hoop2netId10);
    break;
    case hoop2netId10:
    	m = translate(0.14, 0, 0);
    	m = mult(m, rotate(theta[hoop2netId10], 1, 0, 0 ));
		figure[hoop2netId10] = createNode( m, hoop2net10, null, hoop2netId11);
    break;
    case hoop2netId11:
    	m = translate(0, 0, 0.16);
    	m = mult(m, rotate(theta[hoop2netId11], 1, 0, 0 ));
		figure[hoop2netId11] = createNode( m, hoop2net11, null, hoop2netId12);
    break;
    case hoop2netId12:
    	m = translate(0, 0, 0.16);
    	m = mult(m, rotate(theta[hoop2netId12], 1, 0, 0 ));
		figure[hoop2netId12] = createNode( m, hoop2net12, null, null);
    break;
    
    //PERSON 1
    case torsoId:
    	m = translate(-4.5, 3.75, 0);
    	m = mult(m, rotate(theta[torsoId], 1, 0, 0 ));
		figure[torsoId] = createNode( m, torso, person2torsoId, headId);
    break;
    case headId:
    	m = translate(0, 2.2, 0);
    	m = mult(m, rotate(theta[headId], 1, 0, 0 ));
		figure[headId] = createNode( m, head, leftUpArmId, null);
    break;
    case leftUpArmId:
    	m = translate(0, 2.25, -0.5);
    	m = mult(m, rotate(theta[leftUpArmId], 0, 0, 1 ));
		figure[leftUpArmId] = createNode( m, leftUpArm, rightUpArmId, leftLowArmId);
    break;
    case rightUpArmId:
    	m = translate(0, 2.25, 0.5);
    	m = mult(m, rotate(theta[rightUpArmId], 0, 0, 1 ));
		figure[rightUpArmId] = createNode( m, rightUpArm, leftUpLegId, rightLowArmId);
    break;
	case leftLowArmId:
    	m = translate(0, 1.25, 0);
    	m = mult(m, rotate(theta[leftLowArmId], 1, 0, 0 ));
		figure[leftLowArmId] = createNode( m, leftLowArm, rightLowArmId, ballId);
    break;
    case rightLowArmId:
    	m = translate(0, 1.25, 0);
    	m = mult(m, rotate(theta[rightLowArmId], 1, 0, 0 ));
		figure[rightLowArmId] = createNode( m, rightLowArm, null, null);
    break;
    case leftUpLegId:
    	m = translate(0, -2.25, -0.5);
    	m = mult(m, rotate(theta[leftUpLegId], 1, 0, 0 ));
		figure[leftUpLegId] = createNode( m, leftUpLeg, rightUpLegId, leftLowLegId);
    break;
    case rightUpLegId:
    	m = translate(0, -2.25, 0.5);
    	m = mult(m, rotate(theta[rightUpLegId], 1, 0, 0 ));
		figure[rightUpLegId] = createNode( m, rightUpLeg, null, rightLowLegId);
    break;
	case leftLowLegId:
    	m = translate(0, -1.35, 0);
    	m = mult(m, rotate(theta[leftLowLegId], 1, 0, 0 ));
		figure[leftLowLegId] = createNode( m, leftLowLeg, rightLowLegId, null);
    break;
    case rightLowLegId:
    	m = translate(0, -1.35, 0);
    	m = mult(m, rotate(theta[rightLowLegId], 1, 0, 0 ));
		figure[rightLowLegId] = createNode( m, rightLowLeg, null, null);
    break;
    case ballId:
    	m = translate(ballplacementX, ballplacementY, 0.15);
    	m = mult(m, rotate(theta[ballId], 1, 0, 0 ));
		figure[ballId] = createNode( m, ball, null, null);
    break;

    //PERSON 2
    case person2torsoId:
    	m = translate(4.5, 3.75, 0);
    	m = mult(m, rotate(theta[person2torsoId], 1, 0, 0 ));
		figure[person2torsoId] = createNode( m, person2torso, null, person2headId);
    break;
    case person2headId:
    	m = translate(0, 2.2, 0);
    	m = mult(m, rotate(theta[person2headId], 1, 0, 0 ));
		figure[person2headId] = createNode( m, person2head, person2leftUpArmId, null);
    break;
	case person2leftUpArmId:
    	m = translate(0, 2.25, -0.5);
    	m = mult(m, rotate(theta[person2leftUpArmId], 0, 0, 1 ));
		figure[person2leftUpArmId] = createNode( m, person2leftUpArm, person2rightUpArmId, person2leftLowArmId);
    break;
    case person2rightUpArmId:
    	m = translate(0, 2.25, 0.5);
    	m = mult(m, rotate(theta[person2rightUpArmId], 0, 0, 1 ));
		figure[person2rightUpArmId] = createNode( m, person2rightUpArm, person2leftUpLegId, person2rightLowArmId);
    break;
    case person2leftLowArmId:
    	m = translate(0, 1.25, 0);
    	m = mult(m, rotate(theta[person2leftLowArmId], 1, 0, 0 ));
		figure[person2leftLowArmId] = createNode( m, person2leftLowArm, person2rightLowArmId, p2ballId);
    break;
    case person2rightLowArmId:
    	m = translate(0, 1.25, 0);
    	m = mult(m, rotate(theta[person2rightLowArmId], 1, 0, 0 ));
		figure[person2rightLowArmId] = createNode( m, person2rightLowArm, null, null);
    break;
    case person2leftUpLegId:
    	m = translate(0, -2.25, -0.5);
    	m = mult(m, rotate(theta[person2leftUpLegId], 1, 0, 0 ));
		figure[person2leftUpLegId] = createNode( m, person2leftUpLeg, person2rightUpLegId, person2leftLowLegId);
    break;
    case person2rightUpLegId:
    	m = translate(0, -2.25, 0.5);
    	m = mult(m, rotate(theta[person2rightUpLegId], 1, 0, 0 ));
		figure[person2rightUpLegId] = createNode( m, person2rightUpLeg, null, person2rightLowLegId);
    break;
    case person2leftLowLegId:
    	m = translate(0, -1.35, 0);
    	m = mult(m, rotate(theta[person2leftLowLegId], 1, 0, 0 ));
		figure[person2leftLowLegId] = createNode( m, person2leftLowLeg, person2rightLowLegId, null);
    break;
    case person2rightLowLegId:
    	m = translate(0, -1.35, 0);
    	m = mult(m, rotate(theta[person2rightLowLegId], 1, 0, 0 ));
		figure[person2rightLowLegId] = createNode( m, person2rightLowLeg, null, null);
    break;
    case p2ballId:
    	m = translate(p2ballplacementX, p2ballplacementY, -0.15);
    	m = mult(m, rotate(theta[p2ballId], 1, 0, 0 ));
		figure[p2ballId] = createNode( m, ball2, null, null);
    break;
    }
}

function traverse(Id) {
    if(Id == null) return;
    stack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
    figure[Id].render();
    if(figure[Id].child != null) traverse(figure[Id].child);
    modelViewMatrix = stack.pop();
    if(figure[Id].sibling != null) traverse(figure[Id].sibling);
}

function floor() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( floorWidth, floorHeight, floorWidth - 5));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function pole() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( poleWidth, poleHeight, poleWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function horizontalpole() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale4(horizontalpoleWidth, horizontalpoleHeight, horizontalpoleWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function backboard() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(backboardWidth, backboardHeight, backboardWidth + 2) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function rim() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 , 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(rimWidth, rimHeight, rimWidth + 0.1) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function net() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(netWidth, netHeight, netWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function net2() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(netWidth, netHeight, netWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function net3() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(netWidth, netHeight, netWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function net4() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(netWidth, netHeight, netWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function net5() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(netWidth, netHeight, netWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function net6() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(netWidth, netHeight, netWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function net7() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(netWidth, netHeight, netWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function net8() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(netWidth, netHeight, netWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function net9() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(netWidth, netHeight, netWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function net10() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(netWidth, netHeight, netWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function net11() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(netWidth, netHeight, netWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function net12() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(netWidth, netHeight, netWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
//hoop 2
function hoop2pole() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(poleWidth, poleHeight, poleWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function hoop2horizontalpole() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale4(horizontalpoleWidth, horizontalpoleHeight, horizontalpoleWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function hoop2backboard() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(backboardWidth, backboardHeight, backboardWidth + 2) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function hoop2rim() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 , 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(rimWidth, rimHeight, rimWidth + 0.1) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function hoop2net() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(netWidth, netHeight, netWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function hoop2net2() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(netWidth, netHeight, netWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function hoop2net3() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(netWidth, netHeight, netWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function hoop2net4() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(netWidth, netHeight, netWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function hoop2net5() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(netWidth, netHeight, netWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function hoop2net6() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(netWidth, netHeight, netWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function hoop2net7() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(netWidth, netHeight, netWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function hoop2net8() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(netWidth, netHeight, netWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function hoop2net9() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(netWidth, netHeight, netWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function hoop2net10() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(netWidth, netHeight, netWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function hoop2net11() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(netWidth, netHeight, netWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function hoop2net12() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(netWidth, netHeight, netWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

//PERSON 1
function torso() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(torsoWidth, torsoHeight, torsoWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function head() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(headWidth, headHeight, headWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function leftUpArm() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upArmWidth, upArmHeight, upArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function rightUpArm() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upArmWidth, upArmHeight, upArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function leftLowArm() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowArmWidth, lowArmHeight, lowArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function rightLowArm() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowArmWidth, lowArmHeight, lowArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function leftUpLeg() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upLegWidth, upLegHeight, upLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function rightUpLeg() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upLegWidth, upLegHeight, upLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function leftLowLeg() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowLegWidth, lowLegHeight, lowLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function rightLowLeg() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowLegWidth, lowLegHeight, lowLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function ball() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(ballWidth, ballHeight, ballWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

//PERSON 2
function person2torso() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(torsoWidth, torsoHeight, torsoWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function person2head() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(headWidth, headHeight, headWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function person2leftUpArm() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upArmWidth, upArmHeight, upArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function person2rightUpArm() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upArmWidth, upArmHeight, upArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function person2leftLowArm() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowArmWidth, lowArmHeight, lowArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function person2rightLowArm() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowArmWidth, lowArmHeight, lowArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function person2leftUpLeg() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upLegWidth, upLegHeight, upLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function person2rightUpLeg() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upLegWidth, upLegHeight, upLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function person2leftLowLeg() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowLegWidth, lowLegHeight, lowLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function person2rightLowLeg() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowLegWidth, lowLegHeight, lowLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function ball2() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(ballWidth, ballHeight, ballWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}




function quad(a, b, c, d) {

	var t1 = subtract(vertices[b], vertices[a]);
    var t2 = subtract(vertices[c], vertices[b]);
    var normal = cross(t1, t2);
	var normal = vec3(normal);
    
	pointsArray.push(vertices[a]);
	normalsArray.push(normal);
	pointsArray.push(vertices[b]);
	normalsArray.push(normal);
	pointsArray.push(vertices[c]);
	normalsArray.push(normal);
	pointsArray.push(vertices[d]);
	normalsArray.push(normal);
}

function cube() {
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

//////////// dribble vars ////////////
var p1dribble = false;
var p1readydribble = false;
var p1dribble2 = false;
var p1dribbledown = false;
var ballplacementX = -100;
var ballplacementY = 0.65;

var p2dribble = false;
var p2readydribble = false;
var p2dribble2 = false;
var p2dribbledown = false;
var p2ballplacementX = -100;
var p2ballplacementY = 0.65;
//////////////////////////////////////
//////////// shoot vars ////////////
var p1shoot = false;
var p1readyshoot = false;
var p1shootarmtop = false;
var p1shoottop = false;
var p1shootgodown = false;
var p1shootinhoop = false;
var p1ground = false;

var p2shoot = false;
var p2readyshoot = false;
var p2shootarmtop = false;
var p2shoottop = false;
var p2shootgodown = false;
var p2shootinhoop = false;
var p2ground = false;
//////////////////////////////////////
var reset = false;
var reset2 = false;

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.8, 0.8, 0.8, 1.0 );

    gl.enable(gl.DEPTH_TEST);
    
    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader");

    gl.useProgram(program);

    instanceMatrix = mat4();

    projectionMatrix = ortho(-15.0,15.0,-15.0, 15.0,-15.0,15.0);
    modelViewMatrix = mat4();

    gl.uniformMatrix4fv(gl.getUniformLocation( program, "modelViewMatrix"), false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( gl.getUniformLocation( program, "projectionMatrix"), false, flatten(projectionMatrix) );

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");

	ambientProductLoc = gl.getUniformLocation(program,"ambientProduct");
	diffuseProductLoc = gl.getUniformLocation(program,"diffuseProduct");
	specularProductLoc = gl.getUniformLocation(program,"specularProduct");
	lightPositionLoc = gl.getUniformLocation(program,"lightPosition");
	shininessLoc = gl.getUniformLocation(program, "shininess");

    cube();
    
    //nBuffer
    nBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );
    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );
    
    //vBuffer
    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
	
	document.getElementById("slider0").onchange = function(event) {
        theta[floorId] = event.target.value;
        initNodes(floorId);
    };
    document.getElementById("slider1").onchange = function(event) {
        theta[floorId2] = event.target.value;
        initNodes(floorId2);
    };
    
	document.getElementById("dribble").onclick = function(){ 
		p1dribble = !p1dribble;
	};	
	document.getElementById("shoot").onclick = function(){ 
        p1shoot = !p1shoot;
	};	
    document.getElementById("reset").onclick = function(){ 
		reset = !reset;
	};

    document.getElementById("dribble2").onclick = function(){ 
		p2dribble = !p2dribble;
	};	
	document.getElementById("shoot2").onclick = function(){ 
        p2shoot = !p2shoot;
	};
    document.getElementById("reset2").onclick = function(){ 
		reset2 = !reset2;
	};

    for(i=0; i<numNodes; i++) {
    	initNodes(i);
    }
    render();
}

var render = function() {
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
        
	ambientProduct = mult(lightAmbient, materialAmbient);
	diffuseProduct = mult(lightDiffuse, materialDiffuse);
	specularProduct = mult(lightSpecular, materialSpecular);
	gl.uniform4fv( ambientProductLoc, flatten(ambientProduct) );
	gl.uniform4fv( diffuseProductLoc, flatten(diffuseProduct) );
	gl.uniform4fv( specularProductLoc, flatten(specularProduct) );
	gl.uniform4fv( lightPositionLoc, flatten(lightPosition) );
	gl.uniform1f( shininessLoc, materialShininess );

///////////////////// DRIBBLE //////////////////////
    //PERSON 1 DRIBBLE
    if(p1dribble == true){
        theta[leftUpArmId] = 200;
        theta[rightUpArmId] = 200;
        ballplacementX = 0;
        ballplacementY = 0.65;
        p1readydribble = true;
    }
    if(p1readydribble == true){
        p1dribble = false;
        theta[leftUpArmId] += 2;
        if(theta[leftUpArmId] > 240){
            ballplacementX = 0;
            p1dribbledown = true;
            p1readydribble = false;
        }
    }
    if(p1dribbledown == true){
        theta[leftUpArmId] -= 4;
        if(theta[leftUpArmId] < 215){
            p1dribbledown = false;
            p1dribble2 = true;
            ballplacementY += 2.25;
            ballplacementX += 2.25;
        }
    }
    if(p1dribble2 == true){
        theta[leftUpArmId] += 2;
        if(theta[leftUpArmId] > 240){
            p1dribbledown = true;
            p1dribble2 = false;
            ballplacementY -= 2.25;
            ballplacementX -= 2.25;
        }
    }

    //PERSON 2 DRIBBLE
    if(p2dribble == true){
        theta[person2leftUpArmId] = 160;
        theta[person2rightUpArmId] = 160;
        p2ballplacementX = 0;
        p2ballplacementY = 0.65;
        p2readydribble = true;
    }
    if(p2readydribble == true){
        p2dribble = false;
        theta[person2leftUpArmId] -= 2;
        if(theta[person2leftUpArmId] < 120){
            p2ballplacementX = 0;
            p2dribbledown = true;
            p2readydribble = false;
        }
    }
    if(p2dribbledown == true){
        theta[person2leftUpArmId] += 4;
        if(theta[person2leftUpArmId] > 145){
            p2dribbledown = false;
            p2dribble2 = true;
            p2ballplacementY += 2.25;
            p2ballplacementX -= 2;
        }
    }
    if(p2dribble2 == true){
        theta[person2leftUpArmId] -= 2;
        if(theta[person2leftUpArmId] < 120){
            p2dribbledown = true;
            p2dribble2 = false;
            p2ballplacementY -= 2.25;
            p2ballplacementX += 2;
        }
    }
////////////////////////////////////////////////////
///////////////////// SHOOT ////////////////////////
    //PERSON 1
    if(p1shoot == true){
        ballplacementX = 0;
        ballplacementY = 0.65;
        theta[leftUpArmId] = 200;
        p1readyshoot = true;
        p1shoot = false;
        p1dribble2 = false;
        p1dribble = false;
        p1dribbledown = false;
    }
    if(p1readyshoot == true){
        theta[leftUpArmId] += 8;
        theta[rightUpArmId] += 8;
        theta[ballId] += 1;
        ballplacementX = 0;
        ballplacementY = 0.45;
        if(theta[leftUpArmId] > 320){
            p1shootarmtop = true;
            p1readyshoot = false;
        }
    }
    if(p1shootarmtop == true){
        ballplacementX -= 0.15;
        ballplacementY += 0.5;
        theta[ballId] += 1;
        if(ballplacementY > 7.5){
            p1shootarmtop = false;
            p1shoottop = true;
        }
    }
    if(p1shoottop == true){
        ballplacementX += 0.3;
        ballplacementY += 0.15;
        theta[ballId] += 1;
        if(ballplacementX > 2){
            p1shootgodown = true;
            p1shoottop = false;
        }
    }
    if(p1shootgodown == true){
        ballplacementY -= 0.1;
        ballplacementX += 0.3;
        theta[ballId] += 1;
        if(ballplacementY < 8.5){
            p1shootinhoop = true;
            p1shootgodown = false;
        }
    }
    if(p1shootinhoop == true){
        ballplacementY -= 0.3;
        ballplacementX += 0.2;
        theta[ballId] += 1;
        if(ballplacementY < 1){
            p1shootinhoop = false;
            //p1ground = true;
        }
    }

    //PERSON 2
    if(p2shoot == true){
        p2ballplacementX = 0;
        p2ballplacementY = 0.95;
        theta[person2leftUpArmId] = 160;
        p2readyshoot = true;
        p2shoot = false;
        p2dribble2 = false;
        p2dribble = false;
        p2dribbledown = false;
    }
    if(p2readyshoot == true){
        theta[person2leftUpArmId] -= 8;
        theta[person2rightUpArmId] -= 8;
        p2ballplacementX = 0;
        p2ballplacementY = 0.45;
        theta[p2ballId] += 1;
        if(theta[person2leftUpArmId] < 40){
            p2shootarmtop = true;
            p2readyshoot = false;
        }
    }
    if(p2shootarmtop == true){
        p2ballplacementX -= 0.1;
        p2ballplacementY += 0.5;
        theta[p2ballId] += 1;
        if(p2ballplacementY > 9.5){
            p2shootarmtop = false;
            p2shoottop = true;
        }
    }
    if(p2shoottop == true){
        p2ballplacementX -= 0.3;
        p2ballplacementY += 0.15;
        theta[p2ballId] += 1;
        if(p2ballplacementX < -3.6){
            p2shootgodown = true;
            p2shoottop = false;
        }
    }
    if(p2shootgodown == true){
        p2ballplacementY -= 0.2;
        p2ballplacementX -= 0.3;
        theta[p2ballId] += 1;
        if(p2ballplacementY < 8){
            p2shootinhoop = true;
            p2shootgodown = false;
        }
    }
    if(p2shootinhoop == true){
        p2ballplacementY -= 0.3;
        p2ballplacementX -= 0.2;
        theta[p2ballId] += 1;
        if(p2ballplacementY < 1){
            p2shootinhoop = false;
            //p2ground = true;
        }
    }
////////////////////////////////////////////////////

    if(reset == true){
        //dribble//
        p1dribble = false;
        p1dribbledown = false;
        p1dribble2 = false;
        ballplacementY = 0.65;
        ballplacementX = -100;
        theta[leftUpArmId] = 200;
        theta[rightUpArmId] = 200;
        ///////////

    }

    if(reset2 == true){
        //dribble//
        p2dribble = false;
        p2dribbledown = false;
        p2dribble2 = false;
        p2ballplacementY = 0.65;
        p2ballplacementX = -100;
        theta[person2leftUpArmId] = 160;
        theta[person2rightUpArmId] = 160;
        ///////////

    }

    reset = false;
    reset2 = false;

	initNodes(leftUpArmId);
    initNodes(person2leftUpArmId);
    initNodes(ballId);
    initNodes(p2ballId);
    initNodes(rightUpArmId);
    initNodes(person2rightUpArmId);
    initNodes(leftUpLegId);
    initNodes(rightUpLegId);




    traverse(floorId);
    
    requestAnimFrame(render);
}