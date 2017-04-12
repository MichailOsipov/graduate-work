function createTSpan(text, x, y) {
	var tspan = document.createElementNS("http://www.w3.org/2000/svg", "text");
	tspan.setAttribute("x", x);
	tspan.setAttribute("y", y);
	tspan.textContent = text;
	return tspan;
}

//print adjacency list and bridges
function printNodesAndBridgesText(nodes, bridges, textGroup) {
	    while (textGroup.lastChild) {
            textGroup.removeChild(textGroup.lastChild);
        }
	var count = 0;
	
	var tspan = createTSpan("Списки смежности:", 50, (count + 1) * 50);
	textGroup.appendChild(tspan);
	count++;
	
	for (var key1 in nodes) {
		var currText = key1 + ": ";
		for (var key2 in nodes[key1].neighbors) {
			currText+=key2+", ";
		}
		tspan = createTSpan(currText, 50, (count + 1) * 50);
		textGroup.appendChild(tspan);
		
		count++;
	}	
	
	tspan = createTSpan("Мосты:", 50, (count + 1) * 50);
	textGroup.appendChild(tspan);
	count++;
	
	for (var i = 0; i < bridges.length; i++, count++) {		
		tspan = createTSpan(bridges[i].first + " -> " + bridges[i].second + "; ", 50, (count + 1) * 50);
		textGroup.appendChild(tspan);		
	}
}

function calculateDepthSearchAndFindBridges(nodes) {
	var number = 1;
	
	var num = {};
	var top = {};
	var bypassEdges = [];
	
	for (var key in nodes) {
		num[key] = 0;
	}
	
	for (var key in nodes) {
		if (num[key] != 0) continue;
		
		searchNode(undefined, key);
	}
	
	function searchNode(parentNode, currNode) {
		num[currNode] = number; 
		top[currNode] = number;
		number++;
		
		for (var key in nodes[currNode].neighbors) {
			if(num[key] == 0) {
				bypassEdges.push({
					first: currNode,
					second: key
				});
				searchNode(currNode, key);
				top[currNode] = Math.min(top[currNode], top[key]);
			}
			else {
				if(parentNode != key)
					top[currNode] = Math.min(top[currNode], num[key]);
			}
		}		
	}
	
	return bypassEdges.filter((edge) => {
		return top[edge.second] == num[edge.second];
	});
}

//nodes text: ["a->b", "b->c", ""]
function findBridges(nodes, textGroup) {
	var bridges = calculateDepthSearchAndFindBridges(nodes);
	printNodesAndBridgesText(nodes, bridges, textGroup);
	return bridges;
}

export {findBridges};