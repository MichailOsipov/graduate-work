//this class works with coordinates in canvas
var uniqueID = 0;
function Plane (loop, isOuter, id) {
	this.loop = loop;
	this.isOuter = isOuter;
	this.id = uniqueID;
	uniqueID++;
	
	//add chain to plane, divide it to two planes(edges)
	this.addChain = function (chain, chainWithNodes) {
		var loop1 = [];
		var loop2 = [];
		
		var i;
		for (i = 0; i < this.loop.length; i++) {
			loop1.push(this.loop[i]);
			if (this.loop[i] === chain[0] || this.loop[i] === chain[chain.length - 1]) {
				loop2.push(this.loop[i]);
				i++;
				break;
			}
		}
		
		for (i; i < this.loop.length; i++) {
			loop2.push(this.loop[i]);
			if (this.loop[i] === chain[0] || this.loop[i] === chain[chain.length - 1]) {
				break;
			}
		}
		
		for (var j = 1; j < chain.length - 1; j++) {
			loop1.push(chain[j]);
		}
		
		for (var j = chain.length - 2; j > 0; j--) {
			loop2.push(chain[j]);
		}
		
		loop1.push(this.loop[i]);
		i++;
		
		for (i; i < this.loop.length; i++) {
			loop1.push(this.loop[i]);
		}
		
		return [new Plane(loop1, isPlaneOuter(loop1)), new Plane(loop2, isPlaneOuter(loop2))];
		
		function isPlaneOuter(loop) {
			for (var i = 0; i < loop.length; i++) {
				if (loop[i] === "topRight") return true;
			}
			return false;
		}
	}
}

function areCrossingWithTouch (p1, p2, p3, p4) {
	var v1 = vectorMult(p4.x - p3.x, p4.y - p3.y, p1.x - p3.x, p1.y - p3.y);
	var v2 = vectorMult(p4.x - p3.x, p4.y - p3.y, p2.x - p3.x, p2.y - p3.y);
	var v3 = vectorMult(p2.x - p1.x, p2.y - p1.y, p3.x - p1.x, p3.y - p1.y);
	var v4 = vectorMult(p2.x - p1.x, p2.y - p1.y, p4.x - p1.x, p4.y - p1.y);
	if (v1 == 0 && v2 == 0 && v3 == 0 && v4 == 0) {
		var l1 = Math.sqrt(sqr(p1.x - p2.x) + sqr(p1.y - p2.y));
		var l2 = Math.sqrt(sqr(p3.x - p4.x) + sqr(p3.y - p4.y));
		return sqr((p1.x + p2.x) - (p3.x + p4.x)) + sqr((p1.y + p2.y) - (p3.y + p4.y)) <= sqr(l1 + l2);
	}
	if ((v1 * v2) <= 0 && (v3 * v4) <= 0 ) {
		return true;
	}
	return false;
	
	function vectorMult (ax, ay, bx, by) {
		return ax * by - bx * ay;
	}
	
	function sqr (x) {
		return x*x;
	}
}

export default Plane;