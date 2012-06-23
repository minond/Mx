/**
 * @name img
 * @param mixed String/Node
 * @return Promise
 */
mx.canvas.register("img", function (src, x, y) {
	var node, loc_this = this;
	var promise = new mx.util.Promise;

	if (mx.util.is.node(src)) {
		node = src;
	}
	else {
		node = mx.elem.create("img");
		node.src = src;
	}

	node.addEventListener("load", function () {
		loc_this.drawImage(this, x, y);
		promise.fullfil(loc_this, this, src, x, y);
	});

	return promise;
});

/**
 * @name tsquare
 * @param integer x offset
 * @param integer y offset
 */
mx.canvas.register("tsquare", function (x, y) {
	this.beginPath();
	this.moveTo(x * 10, y * 4); 
	this.lineTo(x * 10 - 10, y * 4 - 4); 
	this.lineTo(x * 10 - 20, y * 4 - 4); 
	this.lineTo(x * 10 - 10, y * 4); 
	this.lineTo(x * 10, y * 4); 
	this.fill();
	this.closePath();
});
