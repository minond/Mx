var map, vp, canvas;

mx.file.include.canvas;
mx.file.include.maps;
mx.file.include.viewport;

canvas = new mx.canvas.Create;
map = new mx.Map({ canvas: canvas });
vp = new mx.Viewport({ map: map, show: true });

mx.util.times(10, function (i) {
	mx.util.times(10, function (j) {
		map.point(j, i);
	});
});
