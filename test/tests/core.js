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
	ok(tQuery('<div></div>').length === 1,'单个DOM字符串解析')
	ok(tQuery('<div></div><span></span>').length === 2,'多个DOM字符串解析')

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

test('DOM操作函数测试',function(){

	ok($('<div></div>').append('<span>1</span>').html() === '<span>1</span>','append字符串测试');
	ok($('<div></div>').append($('<span>1</span>')).html() === '<span>1</span>','append tQuery对象测试');
	ok($('<div><span>1</span></div>').append('<span>2</span>').html() === '<span>1</span><span>2</span>','append有子对象的情况下插入');
	ok($('<div></div>').append('<span>1</span><span>2</span>').html() === '<span>1</span><span>2</span>','append插入多个子元素');
	ok($('<div></div>').prepend('<span>1</span>').html() === '<span>1</span>','prepend字符串测试');
	ok($('<div></div>').prepend($('<span>1</span>')).html() === '<span>1</span>','prepend tQuery对象测试');
	ok($('<div><span>1</span></div>').prepend('<span>2</span>').html() === '<span>2</span><span>1</span>','prepend有子对象的情况下插入');
	ok($('<div></div>').prepend('<span>1</span><span>2</span>').html() === '<span>1</span><span>2</span>','prepend插入多个子元素');
	ok($('<div><span>3</span></div>').prepend('<span>1</span><span>2</span>').html() === '<span>1</span><span>2</span><span>3</span>','prepend插入多个子元素顺序');

	var testDom = $('<div test1="test"></div>');
	ok(testDom.attr('test1') === 'test','attr读取测试');
	testDom.attr('test2','test2');
	ok(testDom.attr('test2') === 'test2','attr写入测试');
	testDom.attr({
		test3:'test3'
	});
	ok(testDom.attr('test3') === 'test3','attr多属性读写测试');
	testDom.prop('test1','test11');
	ok(testDom.prop('test1') === 'test11','prop读写测试');
	testDom.prop({
		test3:'test3'
	});
	ok(testDom.prop('test3') === 'test3','prop多属性读写测试');
	ok(testDom.attr('test1') === 'test','prop读写不影响attr测试');


});

test('CSS操作函数测试',function(){

	var testCss = $('<div class="test1 test2" style="line-height:10px;position:relative"></div>');

	ok(testCss.hasClass('test1'),'hasClass单个class测试');
	ok(!testCss.hasClass('test3'),'hasClass单个class负测试');
	ok(testCss.hasClass('test1 test2'),'hasClass多个class测试');
	ok(!testCss.hasClass('test1 test3'),'hasClass多个class负测试');
	ok(testCss.hasClass('test1 .test2'),'hasClass点号容错测试');
	testCss.addClass('test3');
	testCss.addClass('.test4');
	testCss.addClass('test5 .test6');
	ok(testCss.hasClass('test3'),'addClass单个class测试');
	ok(testCss.hasClass('test3'),'addClass单个class容错测试');
	ok(testCss.hasClass('test5 test6'),'addClass多个class容错测试');
	testCss.removeClass('test3');
	testCss.removeClass('.test4');
	testCss.removeClass('test5 .test6');
	ok(!testCss.hasClass('test3'),'removeClass单个class测试');
	ok(!testCss.hasClass('test4'),'removeClass单个class容错测试');
	ok(!testCss.hasClass('test5'),'removeClass多个class容错测试');
	ok(!testCss.hasClass('test6'),'removeClass多个class容错测试');

	testCss.toggleClass('test7');
	ok(testCss.hasClass('test7'),'toggleClass add测试')
	testCss.toggleClass('test7');
	ok(!testCss.hasClass('test7'),'toggleClass remove测试')

	testCss.toggleClass('test8 test9');
	ok(testCss.hasClass('test8'),'toggleClass多个class add测试');
	ok(testCss.hasClass('test9'),'toggleClass多个class add测试');
	testCss.toggleClass('test8 test9');
	ok(!testCss.hasClass('test8'),'toggleClass多个class remove测试');
	ok(!testCss.hasClass('test9'),'toggleClass多个class remove测试');


	ok(testCss.css('position') === 'relative','css读简单属性测试');
	ok(testCss.css('line-height') === '10px','css读带横杠属性测试');

	testCss.css('color','#123');
	testCss.css({
		width:'10px',
		height:'10px'
	});
	ok(testCss.css('color') === 'rgb(17, 34, 51)','css写入单个简单属性测试');
	ok(testCss.css('width') === '10px','css写入多个简单属性测试');

	testCss.css('font-size','12px');
	testCss.css({
		'z-index':'10'
	});
	ok(testCss.css('font-size') === '12px','css写入单个带横框属性测试');
	ok(testCss.css('z-index') === '10','css写入多个带横框属性测试');

});

test('杂项函数测试',function(){

	tQuery.noConflict();
	ok(typeof $ === 'undefined','noConflict释放$');
	$ = tQuery;

	var test = tQuery;
	tQuery.noConflict(true);
	ok(typeof tQuery === 'undefined','noConflict释放tQuery');
	$ = tQuery = test;

});

asyncTest('Deferred对象测试',function(){

	ok(typeof tQuery.Deferred === 'function','Deferred构造函数存在性测试');
	var test1 = new $.Deferred();
	var test2 = $.Deferred();
	ok(test1.constructor === tQuery.Deferred,'带new初始化测试');
	ok(test2.constructor === tQuery.Deferred,'不带new初始化测试');
	ok(test1._status === 'pending','初始状态测试');
	ok(typeof test1.done === 'function','原型函数存在性测试');
	ok(typeof test1.done === 'function','原型函数存在性测试');

	var testVal;
	var testTime;

	tQuery.when(1).then(function(data){
		testVal = data;
		ok(testVal === 1,'when传基本数据时数据正确性测试');
		start();
	});

	stop();
	tQuery.when(function(){return 2}).then(function(data){
		testVal = data;
		ok(testVal === 2,'when传同步函数时数据正确性测试');
		start();
	});

	stop();
	tQuery.when(function(){
		var startTime = +new Date();
		var dfd = tQuery.Deferred();
		setTimeout(function(){
			dfd.resolve(+new Date() - startTime);
		},1000);
		return dfd;
	}).then(function(data){
		testVal = data;
		ok(testVal >= 1000,'when传异步函数时异步性和数据正确性测试');
		start();
	});


});

asyncTest('DOM Ready测试',function(){

	var count = 0;

	tQuery().ready(function(){
		count++;
		ok(count === 1,'空对象');
		start();
	});

	tQuery(document).ready(function(){
		count++;
		ok(count === 2,'document.ready');
	});

	tQuery(function(){
		count++;
		ok(count === 3,'直接传函数');
	});

	tQuery(function($){
		ok($ === tQuery,'测试DOM Ready回调的$指向');
		stop();
	});

	setTimeout(function(){
		tQuery(function(){

			count++;
			ok(count === 4,'延时执行');
			start();
			
		});
	},200);

});

