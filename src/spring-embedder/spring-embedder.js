var l = 100;
var k1 = 2;
var k2 = 200000;

var delta = 0.1;

function SpringEmbedderWorker (svgField) {
	this.nodes = {};
	this.edges = {};
	this.timers = [];
	this.svgField = svgField;
	
	this.initializeField = function () {
		this.svgField.innerHTML = "";
		
		this.nodesGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
		this.nodesGroup.setAttribute('id', 'nodes');

		this.edgesGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
		this.edgesGroup.setAttribute('id', 'edges');
		
		this.svgField.appendChild(this.edgesGroup);
		this.svgField.appendChild(this.nodesGroup);
	}
	
	this.getNodesAndEdges = function (nodesText) {
	this.nodes = {};
	this.edges = {};
	for (var i = 0; i < nodesText.length; i++)
	{
		if (nodesText[i] !== "") {
			var currNode = nodesText[i].split("->");
			this.nodes[currNode[0]] = {name: currNode[0]};
			if (currNode[1]) {
				this.nodes[currNode[1]] = {name: currNode[1]};
				if (!this.edges[currNode[0]])
					this.edges[currNode[0]] = {};
				this.edges[currNode[0]][currNode[1]] = true;
				
				if(!this.edges[currNode[1]])
					this.edges[currNode[1]] = {};
				this.edges[currNode[1]][currNode[0]] = true;
			}
		}
	}
}
	
	this.randomizeNodeCoordinates = function (height, width) {
		for(var key in this.nodes){
			this.nodes[key].x = Math.floor(Math.random() * (width - 0 + 1)) + 0;
			this.nodes[key].y = Math.floor(Math.random() * (height - 0 + 1)) + 0;
		}
	}
	
	this.drawGraph = function () {
		for (var key in  this.nodes) {
			var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
			circle.setAttribute('cx', this.nodes[key].x);
			circle.setAttribute('cy', this.nodes[key].y);
			circle.setAttribute('r', 15);
			circle.setAttribute('stroke', "black");
			circle.setAttribute('stroke-width', 2);
			circle.setAttribute('fill', "white");
			this.nodesGroup.appendChild(circle);
			
			var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
			text.setAttribute('x', this.nodes[key].x - 2);
			text.setAttribute('y', this.nodes[key].y + 2);
			text.setAttribute('fill', "black");
			text.innerHTML = key;
			this.nodesGroup.appendChild(text);
		}
		
		for (var key1 in this.edges) {
			for (var key2 in this.edges[key1]) {
				var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
				line.setAttribute('x1', this.nodes[key1].x);
				line.setAttribute('y1', this.nodes[key1].y);
				line.setAttribute('x2', this.nodes[key2].x);
				line.setAttribute('y2', this.nodes[key2].y);
				line.setAttribute('stroke', "black");
				line.setAttribute('stroke-width', 2);
				this.edgesGroup.appendChild(line);
			}
		}
	}
	
	this.clearTimers = function () {
		for (var i = 0; i < this.timers.length; i++) {
			clearInterval(this.timers[i]);
		}
	}
	
	this.firstStep = function (nodesText, height, width) {
		this.clearTimers();
		this.initializeField();
		this.getNodesAndEdges(nodesText);
		this.randomizeNodeCoordinates(height, width);
		this.drawGraph();
	}
	
	this.oneIteration = function () {
		calculatePowerXForEachNode.call(this);
		calculatePowerYForEachNode.call(this);
		addExtention.call(this);
		
		function calculatePowerXForEachNode() {
			for(var p in this.nodes) {
				var f = 0;
				for (var q in this.edges[p]) {
					if (this.edges[p][q] === undefined) ontinue;
					var d = distance.call(this, p, q);
					if (d == 0) continue;
					f += k1 * (d - l) * (this.nodes[q].x - this.nodes[p].x) / d;
				}
				var g = 0;
				for (var q in this.nodes) {
					if (q === p) continue;
					var d = distance.call(this, p, q);
					if (d === 0) continue;
					g += k2 * (this.nodes[p].x - this.nodes[q].x) / (d * d) / d;
				}
				this.nodes[p].FX = f + g;
			}
			
			function distance(node1, node2) {
				var x = this.nodes[node1].x - this.nodes[node2].x;
				var y = this.nodes[node1].y - this.nodes[node2].y;
				return Math.sqrt(x*x + y*y);
			}
		}
		function calculatePowerYForEachNode() {
			for (var p in this.nodes) {
				var f = 0;
				for (var q in this.edges[p]) {
					if (this.edges[p][q] === undefined) continue;
					var d = distance.call(this, p,q);
					if (d === 0) continue;
					f += k1 * (d - l) * (this.nodes[q].y - this.nodes[p].y) / d;
				}
				var g = 0;
				for (var q in this.nodes) {
					if (q === p) continue;
					var d = distance.call(this, p,q);
					if (d === 0) continue;
					g += k2 * (this.nodes[p].y - this.nodes[q].y) / (d * d) / d;
				}
				this.nodes[p].FY = f + g;
			}
			
			function distance(node1, node2) {
				var x = this.nodes[node1].x - this.nodes[node2].x;
				var y = this.nodes[node1].y - this.nodes[node2].y;
				return Math.sqrt(x*x + y*y);
			}
		}
		function addExtention() {
			for (var node in this.nodes) {
				this.nodes[node].x += delta * this.nodes[node].FX;
				this.nodes[node].y += delta * this.nodes[node].FY;
				if (this.nodes[node].x < 15) this.nodes[node].x = 15;
				if (this.nodes[node].y < 15) this.nodes[node].y = 15;
			}
		}
	}
	
	this.makeOneStabilization = function () {
		this.oneIteration();
		this.initializeField();
		this.drawGraph();
	}
	
	this.startStabilization = function () {
		var timerId = setInterval(() => {
			this.makeOneStabilization.call(this);
		}, 150);
		this.timers.push(timerId);
	}
}

export default SpringEmbedderWorker;