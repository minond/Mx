var map, vp, canvas;

mx.file.include.canvas;
mx.file.include.maps;
mx.file.include.viewport;

canvas = new mx.canvas.Create;
map = new mx.Map;
vp = new mx.Viewport;

map.draw_on(canvas);
vp.geo(map);
vp.show();


map.point(20, 20);

mx.util.times(10, function (i) {
	mx.util.times(10, function (j) {
		mx.canvas.draw.tsquare(canvas, j, i);
	});
});
