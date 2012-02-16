"use strict";


Mx.storage = (new mSQL).use({});

Mx.storage.use({
    images: {
        "@description": {
            id: String,
            offset: Array,
            section: String,
            image: String,
            node: Node
        },
        "@data": []
    }
});
