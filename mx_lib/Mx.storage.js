"use strict";


Mx.storage = (new mSQL).use({});

Mx.storage.use({
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
