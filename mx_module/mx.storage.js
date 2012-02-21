"use strict";


mx.storage = (new mSQL).use({
    images: {
        "@description": {
            id: String,
			type: Number,
            offset: Array,
            section: String,
            image: String,
            node: Node,
			father: Node
        },
        "@data": []
    }
});


mx.storage.select.images = function (filters) {
	return mx.storage.select("*", "images", filters);
};

mx.storage.insert.images = function (newimage) {
	mx.storage.insert.apply(mx.storage, [newimage, "images"]);
};
