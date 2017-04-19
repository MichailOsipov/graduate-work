function AdjacencyList() {
	this.nodes = {};
	
	this.addNode = function (nodeName) {
		if(this.nodes[nodeName]==undefined)
				this.nodes[nodeName] = {
					type: "normal",
					neighbors: {}
					};
	}
	
	this.addEdge = function (node1Name, node2Name) {
		this.nodes[node1Name].neighbors[node2Name] = true;
		this.nodes[node2Name].neighbors[node1Name] = true;
	}
	
	this.initializeFromText = function (nodesText) {
		this.nodes = {};
		for(var i = 0; i < nodesText.length; i++) {
			if (nodesText[i]!=="") {
				var currNode = nodesText[i].split("->");
				this.addNode(currNode[0]);
				
				if(currNode[1])	{
					this.addNode(currNode[1]);
					this.addEdge(currNode[0], currNode[1]);
				}
			}
		}
	}
	
	this.removeNode = function (nodeName) {
		delete this.nodes[nodeName];
		for (var node in this.nodes) {
			delete this.nodes[node].neighbors[nodeName];
		}
	}
	
	this.removeEdge = function (node1Name, node2Name) {
		delete this.nodes[node1Name].neighbors[node2Name];
		delete this.nodes[node2Name].neighbors[node1Name];
	}
	
	this.removeEdges = function (edges) {
		for (var i = 0; i < edges.length; i++) {
			this.removeEdge(edges[i].begin, edges[i].end);
		}
	}
	
	this.getConnectedComponents = function () {
		var components = [];
		var checkedNodes = [];
		
		for (var key in this.nodes) {
			if(checkedNodes[key]) continue;
			
			checkedNodes[key] = true;
			
			var component = new AdjacencyList();
			
			component.addNode(key);
			addNeighbors.call(this, key, component, checkedNodes);
			components.push(component);
		}
		
		function addNeighbors(nodeName, component, checkedNodes) {
			for (var key in this.nodes[nodeName].neighbors) {
				component.addNode(key);
				component.addEdge(nodeName, key);
				
				if (!checkedNodes[key]) {
					checkedNodes[key] = true;
					addNeighbors.call(this, key, component, checkedNodes);
				}
			}
		}
		
		return components;
	}
	
	this.print = function (textGroup) {
		while (textGroup.lastChild) {
			textGroup.removeChild(textGroup.lastChild);
		}

		var count = 0;
	
		var tspan = createTSpan("Списки смежности:", 50, (count + 1) * 50);
		textGroup.appendChild(tspan);
		count++;
		
		for (var key1 in this.nodes) {
			var currText = key1 + ": ";
			for (var key2 in this.nodes[key1].neighbors) {
				currText+=key2+", ";
			}
			tspan = createTSpan(currText, 50, (count + 1) * 50);
			textGroup.appendChild(tspan);
			
			count++;
		}
		
		function createTSpan(text, x, y) {
			var tspan = document.createElementNS("http://www.w3.org/2000/svg", "text");
			tspan.setAttribute("x", x);
			tspan.setAttribute("y", y);
			tspan.textContent = text;
			return tspan;
		}
	}
}

export default AdjacencyList;