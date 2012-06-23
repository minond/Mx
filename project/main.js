var map, vp, canvas;

mx.file.include.canvas;
mx.file.include.maps;
mx.file.include.viewport;

vp = new mx.Viewport;
map = new mx.Map;
canvas = new mx.canvas.Create;

map.draw_on(canvas);
vp.geo(map);
vp.show();

mx.canvas.draw.img(canvas, "https://www.google.com/images/srpr/logo3w.png", 100, 10);

mx.util.times(10, function (i) {
	mx.util.times(10, function (j) {
		mx.canvas.draw.tsquare(canvas, j, i);
	});
});
