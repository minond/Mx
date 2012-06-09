/**
 * @name file module
 * @var Object
 */
mx.module.register("file", function (module, self) {
	/**
	 * @name cache
	 * @var Object
	 */
	module.cache = {};

	/**
	 * @name include
	 * @param String file name
	 * @return String file content
	 *
	 * loads a file if it has not been included before
	 */
	module.include = function (file) {
		return file in module.cache ? module.cache[ file ] : module.require(file);
	};

	/**
	 * @name require
	 * @param String file name
	 * @return String file content
	 *
	 * load a file
	 */
	module.require = function (file) {
		var content = self.ajax.get(file);
		var extension = module.get_extension(file);
	
		module.cache[ file ] = content;
	
		return module.append(content, extension), content;
	};

	/**
	 * @name get_extension
	 * @param String file name
	 * @return mixed String file extension, Boolean no match
	 */
	module.get_extension = function (file) {
		var extension = file.match(/^.+\.(.+)$/);

		return extension && extension.length > 1 ? extension[1] : false;
	};

	/**
	 * @name append
	 * @param String content
	 * @return mixed Node instance, Boolean if failure
	 *
	 * appends an element to head
	 */
	module.append = function (content, format) {
		var elem;
	
		switch (format) {
			case "js":
				elem = self.elem.create("script", {
					innerHTML: content,
					type: "text/javascript"
				});
				break;

			case "css":
				elem = self.elem.create("style", {
					innerHTML: content,
					type: "text/css"
				});
				break;

			default:
				elem = self.elem.create("link", {
					innerHTML: content,
					type: "text",
					rel: "alternate"
				});
				break;
		}

		return elem ? document.body.appendChild(elem) : false;
	};

	/**
	 * @name register
	 * @param String getter name
	 * @param Array files to load
	 * @return Boolean register success
	 */
	module.register = function (getter, files) {
	if (getter in module.include || getter in module.require) {
		return false;
	}

	return (function (getter, files) {
			// extend include and require
			module.include.__defineGetter__(getter, function () {
				self.util.foreach(files, function (i, file) {
					module.include(file);
				});
			});

			module.require.__defineGetter__(getter, function () {
				self.util.foreach(files, function (i, file) {
					module.require(file);
				});
			});
		})(getter, files);
	};
});
