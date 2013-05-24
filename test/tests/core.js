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