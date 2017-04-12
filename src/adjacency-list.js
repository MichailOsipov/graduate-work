function AdjacencyList() {
	this.nodes = {};
	
	this.addNode = function (nodeName) {
		if(this.nodes[nodeName]==undefined)
				this.nodes[nodeName] = {
					isFictious: false,
					neighbors: []
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
	
	this.removeEdge = function (node1Name, node2Name) {
		delete this.nodes[node1Name];
		delete this.nodes[node2Name];
		for (var node in this.nodes) {
			delete this.nodes[node].neighbors[node1Name];
			delete this.nodes[node].neighbors[node2Name];
		}
	}
}

export default AdjacencyList;