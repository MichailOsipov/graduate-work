import SVGCatmullRomSpline from 'svg-catmull-rom-spline';

function SvgGraphDrawer (svgField) {
	this.svgField = svgField;
	this.draw = function (nodes, edges) {
		this.initializeField();
		this.drawNodes(nodes);
		this.drawEdges(nodes, edges);
	}
	this.initializeField = function () {
		this.svgField.innerHTML = "";
		
		this.nodesGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
		this.nodesGroup.setAttribute('id', 'nodes');

		this.edgesGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
		this.edgesGroup.setAttribute('id', 'edges');
		
		this.svgField.appendChild(this.edgesGroup);
		this.svgField.appendChild(this.nodesGroup);
	}
	
	this.drawNodes = function (nodes) {
		for(var key in  nodes){
			var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
			circle.setAttribute('cx', nodes[key].x);
			circle.setAttribute('cy', nodes[key].y);
			if(nodes[key].type === "fictive") {
				circle.setAttribute('stroke-dasharray', "5");
			}
			circle.setAttribute('stroke', "black");
			circle.setAttribute('stroke-width', 2);
			
			if (nodes[key].type === "helpNode") {
				circle.setAttribute('fill', "black");
				circle.setAttribute('r', 5);
			} else {
				circle.setAttribute('fill', "white");
				circle.setAttribute('r', 15);
			}
			this.nodesGroup.appendChild(circle);
			
			if (nodes[key].type !== "helpNode") {
				var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
				text.setAttribute('x', nodes[key].x-2);
				text.setAttribute('y', nodes[key].y+2);
				text.setAttribute('fill', "black");
				text.innerHTML= key;
				this.nodesGroup.appendChild(text);
			}
		}
	}
	
	this.drawEdges = function (nodes, edges) {
		for (var i = 0; i < edges.length; i++) {
			var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
			line.setAttribute('x1', nodes[edges[i].begin].x);
			line.setAttribute('y1', nodes[edges[i].begin].y);
			line.setAttribute('x2', nodes[edges[i].end].x);
			line.setAttribute('y2', nodes[edges[i].end].y);
			line.setAttribute('stroke', "black");
			line.setAttribute('stroke-width', 2);
			this.edgesGroup.appendChild(line);
		}
	}
	
	this.drawHelpLines = function (edges) {
		this.helpEdgesGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
		this.svgField.insertBefore(this.helpEdgesGroup, this.svgField.children[0]);
		for (var i = 0; i < edges.length; i++) {
			var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
			line.setAttribute('x1', edges[i].begin.x);
			line.setAttribute('y1', edges[i].begin.y);
			line.setAttribute('x2', edges[i].end.x);
			line.setAttribute('y2', edges[i].end.y);
			line.setAttribute('stroke-dasharray', "5");
			line.setAttribute('stroke', "black");
			line.setAttribute('stroke-width', 2);
			this.helpEdgesGroup.appendChild(line);
		}
	}
}

export default SvgGraphDrawer;