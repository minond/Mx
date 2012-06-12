mx.file.include.canvas;

mx.canvas.create(2000, 2000, true, true)

mx.canvas.draw.img("https://www.google.com/images/srpr/logo3w.png", 100, 10);

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

mx.util.times(10, function (i) {
	mx.util.times(10, function (j) {
		mx.canvas.draw.tsquare(j, i);
	});
});
