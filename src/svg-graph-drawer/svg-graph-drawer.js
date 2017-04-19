function SvgGraphDrawer () {
	this.draw = function (nodes, edges, svgField) {
		this.svgField = svgField;
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
			circle.setAttribute('r', 15);
			if(nodes[key].type === "fictive") {
				circle.setAttribute('stroke-dasharray', "5");
			}
			circle.setAttribute('stroke', "black");
			circle.setAttribute('stroke-width', 2);
			circle.setAttribute('fill', "white");
			this.nodesGroup.appendChild(circle);
			
			var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
			text.setAttribute('x', nodes[key].x-2);
			text.setAttribute('y', nodes[key].y+2);
			text.setAttribute('fill', "black");
			text.innerHTML= key;
			this.nodesGroup.appendChild(text);
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
}

export default SvgGraphDrawer;