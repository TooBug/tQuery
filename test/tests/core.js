module('core');

test('tQuery函数存在测试', function () {
	ok(tQuery,'tQuery对象');
	ok($,'$对象');
	ok(tQuery === $,'tQuery与$等价')
});

test('tQuery函数测试',function(){

	ok(typeof tQuery === 'function','tQuery类型');
	ok(tQuery.prototype === tQuery.fn,'原型');
	ok(typeof tQuery().length === 'number','length属性存在');
	ok(typeof tQuery()._tQuery === 'boolean','_tQuery属性存在');
	ok(tQuery('body').selector === 'body','selector属性');
	ok(tQuery().length === 0,'空选择器长度为0');
	ok(tQuery('body').length === 1,'字符串选择器');
	ok(tQuery(document.body).length === 1,'body对象选择器');
	ok(tQuery(window).length === 1,'window对象选择器');
	ok(tQuery([]).length === 0,'空数组');
	ok(tQuery([1,2,3]).length === 3,'非空数组');
	ok(tQuery({}).length === 1,'对象');

});

test('$.extend函数测试',function(){

	// 扩展到tQuery对象上
	$.extend({testExtend:'ok'});

	ok(tQuery.testExtend === 'ok','扩展到tQuery对象上');
	
	// 测试数组与对象复制
	var test1 = {
			a:1,
			b:2
		},
		test2 = {
			a:21,
			b:22
		},
		test3 = {
			a:3,
			c:{
				a:1,
				b:[1,2,3]
			},
			d:[1,2,3]
		};

	$.extend(test1,test3);
	$.extend(true,test2,test3);

	ok(typeof test1.c === 'object','浅复制对象');
	ok(Array.isArray(test1.d),'浅复制数组');
	ok(typeof test2.c === 'object','深复制对象');
	ok(Array.isArray(test2.d),'深复制数组');

	// 测试深浅复制的不同影响

	test3.d.push(222);
	test1.c.a = 3;

	ok(test1.d.length === 4,'浅复制数组修改');
	ok(test1.c.a === 3,'浅复制对象修改');
	ok(test2.d.length === 3,'深复制数组修改');
	ok(test2.c.a === 1,'深复制对象修改');



});

test('$.each函数测试',function(){

	var test_this;
	var test_index;
	var test_domItem;
	var domList = $('body');
	var arrayList = $([11,22,33]);
	var plainArray = [21,22,23];
	var plainObject = {a:1,b:2};

	$.each(domList,function(index,domItem){

		test_this = this;
		test_index = index;
		test_domItem = domItem;

	});

	ok(test_this === document.body,'DOM元素this指向测试');
	ok(test_index === 0,'DOM元素index指向测试');
	ok(test_domItem === document.body,'DOM元素each中元素指向测试');

	$.each(arrayList,function(index,domItem){

		test_this = this;
		test_index = index;
		test_domItem = domItem;

	});

	ok(test_this.constructor === Number,'数组this指向测试');
	ok(test_index === 2,'数组index指向测试');
	ok(test_domItem === 33,'数组each中元素指向测试');

	$.each(plainArray,function(index,domItem){

		test_this = this;
		test_index = index;
		test_domItem = domItem;

	});

	ok(test_this.constructor === Number,'纯数组this指向测试');
	ok(test_index === 2,'纯数组index指向测试');
	ok(test_domItem === 23,'纯数组each中元素指向测试');


	$.each(plainObject,function(key,val){

		test_index = key;
		test_domItem = val;

	});

	ok(test_index === 'b','纯对象key指向测试');
	ok(test_domItem === 2,'纯对象value中元素指向测试');


});

