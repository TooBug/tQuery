/*!
*
* tQuery
* https://github.com/TooooBug/tQuery
* 
* @Author TooBug 
* @Version 0.0.1
* @License MIT
*
**/

(function(){

	'use strict';

	// 存储window.$以便后续可以用noConfict解救出来
	var _$ = window.$;

	// tQuery主函数，参数为选择器
	var tQuery = function(selector){

		// 如果不是以构造函数运行，则强制返回一个新实例
		// 即 tQuery() 等价于 new tQuery()
		if(!(this instanceof tQuery)){

			return new tQuery(selector);

		}

		var ifHTMLStrReg = /</;	// 用来判断选择器字符串是否是DOM字符串

		this.length = 0; // tQuery对象的length属性
		this._tQuery = true; // 用于标识是否tQuery对象

		// 处理selector的重载
		switch(typeof selector){

			// 字符串
			case 'string':

				if(ifHTMLStrReg.test(selector)){	// DOM字符串


				}else{	// 选择器

					tQuery.extend(this,document.querySelectorAll(selector));
					this.selector = selector;

				}

				break;

		}

	};

	// 复制对象属性
	// isDeep可选，target之后可以跟无限多个被复制属性的对象
	tQuery.extend = function(isDeep,target){

		var sources = [];

		if(helper.isBoolean(isDeep)){	// isDeep有值

			sources = Array.prototype.slice.call(arguments,2);

		}else{	// 省略isDeep

			target = isDeep;
			isDeep = false;
			sources = Array.prototype.slice.call(arguments,1);

		}

		// 如果没有source，则将唯一的对象复制到tQuery对象上
		if(sources.length === 0){

			sources.push(target);
			target = this;

		}

		sources.forEach(function(source){

			copyProperty(target,source,isDeep);

		});

		// 复制对象属性实现
		function copyProperty(target,source,isDeep){

			if(helper.isArray(source)){

				source.forEach(function(sourceElement){

					if(isDeep &&
							(helper.isArray(sourceElement) || 
							helper.isPlainObject(sourceElement))){

						var tempObj = {};
						copyProperty(tempObj,sourceElement,isDeep);
						target.push(sourceElement);

					}


					target.push(sourceElement);

				});


			}else if(helper.isPlainObject(source)){

				var keys = Object.keys(source);

				keys.forEach(function(key){

					if(isDeep && helper.isArray(source[key])){	// 数组

						if(!target[key]){
							target[key] = [];
						}

						copyProperty(target[key],source[key],isDeep);

					}else if( isDeep & helper.isPlainObject(source[key])){ // 对象

						if(!target[key]){
							target[key] = {};
						}

						copyProperty(target[key],source[key],isDeep);

					}else{	// 否则直接复制属性

						target[key] = source[key];

					}

				});

			}

		}


	};

	// 获取原生对象，如果index为空则返回DOM数组
	tQuery.prototype.get = function(index){

		var index = parseInt(index,10);

		if(helper.isNumber(index)){

			if(index >= 0){

				return this[index];

			}else{

				return this[this.length + index];

			}

		}else{

			return Array.prototype.map.call(this,function(domItem){

				return domItem;

			});

		}

	};

	// 获取或者改写DOM的HTML
	tQuery.prototype.html = function(htmlStr){

		if(typeof htmlStr === 'undefined'){

			return this[0].innerHTML;

		}else{

			this[0].innerHTML = htmlStr;
			return this;

		}

	};

	// 获取或者改写DOM的Text
	tQuery.prototype.text = function(textStr){

		if(typeof textStr === 'undefined'){

			return this[0].innerText;

		}else{

			this[0].innerText = textStr;
			return this;

		}

	};

	// 辅助方法，私有
	var helper = {};

	// 是否是布尔值
	helper.isBoolean = function(target){

		return typeof target === 'boolean';

	};

	// 是否是字符串
	helper.isString = function(target){

		return typeof target === 'string';

	};

	// 是否是数字
	helper.isNumber = function(target){

		return !isNaN(target);

	};

	// 是否是数组
	helper.isArray = function(target){

		return Array.isArray(target);

	};

	// 是否是tQuery对象
	helper.istQueryObject = function(target){

		return target._tQuery;

	};

	// 是否是对象（非tQuery对象）
	helper.isPlainObject = function(target){

		return typeof target === 'object' &&
				!helper.isArray(target) &&
				!helper.istQueryObject(target);

	};


	window.tQuery = window.$ = tQuery;

	
})(window);