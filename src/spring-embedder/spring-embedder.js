var nodes;
var edges;

//естественная длина пружины
var l = 100;
//коэффициент жесткости пружины
var k1 = 2;
//коэффициент силы отталкивания
var k2 = 200000;

var delta = 0.1;

function clear(nodesGroup, edgesGroup){
	nodesGroup.innerHTML="";
	edgesGroup.innerHTML="";
}
function getNodesAndEdges(nodesText){
	nodes={};
	edges={};
	for(var i = 0; i< nodesText.length; i++)
	{
		if ( nodesText[i]!="")
		{
			var currNode = nodesText[i].split("->");
			nodes[currNode[0]] = {name: currNode[0]};
			if(currNode[1])
			{		
				nodes[currNode[1]] = {name: currNode[1]};
				if(!edges[currNode[0]])
					edges[currNode[0]]={};
				edges[currNode[0]][currNode[1]]=true;
				
				//пусть пока работаем с неориентированными графами
				if(!edges[currNode[1]])
					edges[currNode[1]]={};
				edges[currNode[1]][currNode[0]]=true;
			}
		}
	}
}
function randomizeNodeCoordinates(height, width){
	for(var key in nodes){
		nodes[key].x =Math.floor(Math.random() * (width - 0 + 1)) + 0;
		nodes[key].y =Math.floor(Math.random() * (height - 0 + 1)) + 0;
	}
}
function drawGraph(nodesGroup, edgesGroup){
	for(var key in  nodes){
		var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
		circle.setAttribute('cx', nodes[key].x);
		circle.setAttribute('cy', nodes[key].y);
		circle.setAttribute('r', 15);
		circle.setAttribute('stroke', "black");
		circle.setAttribute('stroke-width', 2);
		circle.setAttribute('fill', "white");		
		nodesGroup.appendChild(circle);
		
		var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
		text.setAttribute('x', nodes[key].x-2);
		text.setAttribute('y', nodes[key].y+2);
		text.setAttribute('fill', "black");
		text.innerHTML= key;
		nodesGroup.appendChild(text);
	}
	
	for(var key1 in edges){		
		for(var key2 in edges[key1]){
			var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
			line.setAttribute('x1', nodes[key1].x);
			line.setAttribute('y1', nodes[key1].y);
			line.setAttribute('x2', nodes[key2].x);
			line.setAttribute('y2', nodes[key2].y);
			line.setAttribute('stroke', "black");
			line.setAttribute('stroke-width', 2);
			edgesGroup.appendChild(line);
		}
	}
}
function distance(node1, node2){
	var x = nodes[node1].x-nodes[node2].x;
	var y = nodes[node1].y-nodes[node2].y;
	return Math.sqrt(x*x + y*y);
}
function calculatePowerXForEachNode(){
	for(var p in nodes){
		var f=0;
		for(var q in edges[p]){
			if (edges[p][q]==undefined)continue;
			var d = distance(p,q);
			if (d == 0) continue;
			f+=k1 * (d - l) * (nodes[q].x - nodes[p].x) / d;
		}
		var g=0;
		for(var q in nodes){
			//if(edges[p][q]!=undefined||q==p)continue;
			if(q==p)continue;
			var d = distance(p,q);
			if (d == 0) continue;
			g+=k2 * (nodes[p].x - nodes[q].x) / (d * d)  / d;
		}
		nodes[p].FX=f+g;
	}
}
function calculatePowerYForEachNode(){
	for(var p in nodes){
		var f=0;
		for(var q in edges[p]){
			if (edges[p][q]==undefined)continue;
			var d = distance(p,q);
			if (d == 0) continue;
			f+=k1 * (d - l) * (nodes[q].y - nodes[p].y) / d;
		}
		var g=0;
		for(var q in nodes){
			//if(edges[p][q]!=undefined||q==p)continue;
			if(q==p)continue;
			var d = distance(p,q);
			if (d == 0) continue;
			g+=k2 * (nodes[p].y - nodes[q].y) / (d * d)   / d;
		}
		nodes[p].FY= f + g;
	}
}
function addExtention(){
	for(var node in nodes){
		nodes[node].x+=delta*nodes[node].FX;
		nodes[node].y+=delta*nodes[node].FY;
		//nodes[node].x=nodes[node].FX;
		//nodes[node].y=nodes[node].FY;
		if (nodes[node].x < 15) nodes[node].x = 15;
		if (nodes[node].y < 15) nodes[node].y = 15;
	}
}
function firstStep(nodesText, timerId, height, width, nodesGroup, edgesGroup){
	if(timerId)
		clearInterval(timerId);
	clear(nodesGroup, edgesGroup);
	getNodesAndEdges(nodesText);
	randomizeNodeCoordinates(height, width);
	drawGraph(nodesGroup, edgesGroup);
}
function makeOneStabilization(nodesGroup, edgesGroup){
	calculatePowerXForEachNode();
	calculatePowerYForEachNode();
	addExtention();
	clear(nodesGroup, edgesGroup);
	drawGraph(nodesGroup, edgesGroup);
}
function startStabilization(timerId, nodesGroup, edgesGroup){
	/*if(timerId)
		clearInterval(timerId);*/
	timerId = setInterval(makeOneStabilization, 150, nodesGroup, edgesGroup);
	return timerId;
}
export {firstStep, makeOneStabilization, startStabilization};