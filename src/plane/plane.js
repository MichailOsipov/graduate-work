//this class works with coordinates in canvas
var uniqueID = 0;
function Plane (loop, isOuter, id) {
	this.loop = loop;
	this.isOuter = isOuter;
	this.id = uniqueID;
	uniqueID++;
	
	//add chain to plane, divide it to two planes(edges)
	this.addChain = function (chain, helpPlaneInfo) {
		if (!this.isOuter || !helpPlaneInfo.isLoopBroken) {
			return this.addSimpleChain(chain);
		}
		return this.addChainInOuterLoop(chain, helpPlaneInfo.newStartEdge);
	}
	
	this.addSimpleChain = function (chain) {
		var loop1 = [];
		var loop2 = [];
		var chainToWorkWith = chain.slice();
		var i;
		for (i = 0; i < this.loop.length; i++) {
			loop1.push(this.loop[i]);
			if (this.loop[i] === chainToWorkWith[0] || this.loop[i] === chainToWorkWith[chainToWorkWith.length - 1]) {
				if (this.loop[i] === chainToWorkWith[chainToWorkWith.length - 1]) {
					chainToWorkWith.reverse();
				}
				loop2.push(this.loop[i]);
				i++;
				break;
			}
		}
		
		for (i; i < this.loop.length; i++) {
			loop2.push(this.loop[i]);
			if (this.loop[i] === chainToWorkWith[0] || this.loop[i] === chainToWorkWith[chainToWorkWith.length - 1]) {
				break;
			}
		}
		
		for (var j = 1; j < chainToWorkWith.length - 1; j++) {
			loop1.push(chainToWorkWith[j]);
		}
		
		for (var j = chainToWorkWith.length - 2; j > 0; j--) {
			loop2.push(chainToWorkWith[j]);
		}
		
		loop1.push(this.loop[i]);
		i++;
		
		for (i; i < this.loop.length; i++) {
			loop1.push(this.loop[i]);
		}
		
		return [new Plane(loop1, isPlaneOuter(loop1)), new Plane(loop2, isPlaneOuter(loop2))];
	}

	this.addChainInOuterLoop = function (chain, newStartEdge) {
		var loop1 = [];
		var loop2 = [];
		var chainToWorkWith = chain.slice();
		
		var i;
		for (i = 0; i < this.loop.length; i++) {
			loop1.push(this.loop[i]);
			if (this.loop[i] === chainToWorkWith[0] || this.loop[i] === chainToWorkWith[chainToWorkWith.length - 1]) {
				if (this.loop[i] === chainToWorkWith[chainToWorkWith.length - 1]) {
					chainToWorkWith.reverse();
				}
				break;
			}
		}
		for (var j = 1; j < chainToWorkWith.length - 1; j++) {
			loop2.unshift(chainToWorkWith[j]);
			if (chainToWorkWith[j] === newStartEdge)
				break;
		}
		
		loop2.push(this.loop[i]);
		i++;
		
		for (var j = 1; j < chainToWorkWith.length - 1; j++) {
			loop1.push(chainToWorkWith[j]);
		}
		
		for (i; i < this.loop.length; i++) {
			loop2.push(this.loop[i]);
			if (this.loop[i] === chainToWorkWith[0] || this.loop[i] === chainToWorkWith[chainToWorkWith.length - 1]) {
				loop1.push(this.loop[i]);
				i++;
				break;
			}
		}
		
		for (var j = chainToWorkWith.length - 2; j > 0; j--) {
			loop2.push(chainToWorkWith[j]);
			if (chainToWorkWith[j] === newStartEdge) {
				break;
			}
		}
		
		for (i; i < this.loop.length; i++) {
			if (this.loop[i] === this.loop[0]) {
				i++;
				break;
			}
			loop1.push(this.loop[i]);
		}
		
		for (i; i < this.loop.length; i++) {
			loop2.push(this.loop[i]);
		}
		
		return [new Plane(loop1, isPlaneOuter(loop1)), new Plane(loop2, isPlaneOuter(loop2))];
	}
	
	function isPlaneOuter(loop) {
		for (var i = 0; i < loop.length; i++) {
			if (loop[i] === "topRight") return true;
		}
		return false;
	}
}

export default Plane;