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

(function(window){

	'use strict';

	// 存储window.$以便后续可以用noConfict解救出来
	var _$ = window.$;

	/********************* Core Start *********************/
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

			// DOM列表
			case 'object':

				if(selector.type === 'NodeList'){	// 自定义的NodeList对象

					var tempObj = {

						length:selector.length

					};

					selector.nodeList.forEach(function(node,index){

						tempObj[index] = node;

					});

					tQuery.extend(this,tempObj);

				}else if(helper.isDomList(selector)){	// DOM NodeList

					tQuery.extend(this,selector);

				}else if(helper.isDomNode(selector)){	// DOM节点

					tQuery.extend(this,{
						'0':selector,
						length:1
					});

				}

				break;

		}

	};

	/********************** Core End **********************/


	/****************** Core Method Start *****************/

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


	// tQuery对象中的DOM遍历
	tQuery.each = function(domList,callback){

		Array.prototype.forEach.call(domList,function(domItem,index){

			callback.call(domItem,index,domItem);

		});

		return domList;

	};

	
	// tQuery原型中的each方法
	tQuery.prototype.each = function(callback){

		return tQuery.each(this,callback);

	};

	/******************* Core Method End ******************/


	/********************** DOM Start *********************/

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

	// 在现有对象中加入新的DOM
	tQuery.prototype.add = function(obj){

		if(!obj.length){
			if(helper.isDomNode(obj)){
				this[this.length] = obj;
				this.length++;
			}else{
				return this;
			}
		}
			
		for(var i=i;i<obj.length;i++){

			this[this.length] = obj[i];
			this.length++;

		}

		return this;

	};

	// 获取父元素
	tQuery.prototype.parent = function(selector){

		var parentSet = {

			type:'NodeList',
			nodeList:[],
			length:0

		};

		var allSelectorDom = document.querySelectorAll(selector);

		this.each(function(){

			if(this.parentNode &&
					Array.prototype.indexOf.call(parentSet.nodeList,this.parentNode) === -1 &&
					(!selector || Array.prototype.indexOf.call(allSelectorDom,this.parentNode) !== -1)){

				parentSet.nodeList.push(this.parentNode);
				parentSet.length ++;

			}


		});

		return tQuery(parentSet);

	};

	// 获取所有的父（祖先）元素
	tQuery.prototype.parents = function(selector){

		var parentSet = {

			type:'NodeList',
			nodeList:[],
			length:0

		};

		var allSelectorDom = document.querySelectorAll(selector);

		this.each(function(){

			var currdom = this.parentNode;

			while(currdom){

				if(Array.prototype.indexOf.call(parentSet.nodeList,currdom) === -1 &&
						(!selector || Array.prototype.indexOf.call(allSelectorDom,currdom) !== -1)){

					parentSet.nodeList.push(currdom);
					parentSet.length ++;
				}

				currdom = currdom.parentNode;

			}


		});

		return tQuery(parentSet);

	};

	// 获取或者改写DOM的HTML
	tQuery.prototype.html = function(htmlStr){

		if(typeof htmlStr === 'undefined'){

			return this[0].innerHTML;

		}else{

			this.each(function(){
				this.innerHTML = htmlStr;
			})
			return this;

		}

	};

	// 获取或者改写DOM的Text
	tQuery.prototype.text = function(textStr){

		if(typeof textStr === 'undefined'){

			return this[0].innerText;

		}else{

			this.each(function(){
				this.innerText = textStr;
			})
			return this;

		}

	};

	// 显示DOM
	tQuery.prototype.show = function(){

		return this.each(function(){

			this.style.display = '';

		});

	};

	// 隐藏DOM
	tQuery.prototype.hide = function(){

		return this.each(function(){

			this.style.display = 'none';

		});

	};

	/*********************** DOM End **********************/


	/********************* Helper Start *******************/

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

	// 是否是函数
	helper.isFunction = function(target){

		return typeof target === 'function';

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

	// 是否是DOM节点
	helper.isDomNode = function(target){

		var ifHTMLElementReg = /Element$/;	// 判断一个对象是否是DOM节点
		return ifHTMLElementReg.test(target.constructor.name);

	};

	// 是否是DOM节点列表
	helper.isDomList = function(target){

		return target.constructor.name === 'NodeList';

	};

	/******************* Helper end ******************/


	window.tQuery = window.$ = tQuery;

	
})(window);