(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

console.warn('Compiled in DEV mode. Follow the advice at https://elm-lang.org/0.19.1/optimize for better performance and smaller assets.');


// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**_UNUSED/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**_UNUSED/
	if (typeof x.$ === 'undefined')
	//*/
	/**/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0_UNUSED = 0;
var _Utils_Tuple0 = { $: '#0' };

function _Utils_Tuple2_UNUSED(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3_UNUSED(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr_UNUSED(c) { return c; }
function _Utils_chr(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil_UNUSED = { $: 0 };
var _List_Nil = { $: '[]' };

function _List_Cons_UNUSED(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log_UNUSED = F2(function(tag, value)
{
	return value;
});

var _Debug_log = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString_UNUSED(value)
{
	return '<internals>';
}

function _Debug_toString(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash_UNUSED(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.start.line === region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'on lines ' + region.start.line + ' through ' + region.end.line;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap(value) { return { $: 0, a: value }; }
function _Json_unwrap(value) { return value.a; }

function _Json_wrap_UNUSED(value) { return value; }
function _Json_unwrap_UNUSED(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**_UNUSED/
	var node = args['node'];
	//*/
	/**/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		message: func(record.message),
		stopPropagation: record.stopPropagation,
		preventDefault: record.preventDefault
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.message;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.stopPropagation;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.preventDefault) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var view = impl.view;
			/**_UNUSED/
			var domNode = args['node'];
			//*/
			/**/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.setup && impl.setup(sendToApp)
			var view = impl.view;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.body);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.title) && (_VirtualDom_doc.title = title = doc.title);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.onUrlChange;
	var onUrlRequest = impl.onUrlRequest;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		setup: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.protocol === next.protocol
							&& curr.host === next.host
							&& curr.port_.a === next.port_.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		init: function(flags)
		{
			return A3(impl.init, flags, _Browser_getUrl(), key);
		},
		view: impl.view,
		update: impl.update,
		subscriptions: impl.subscriptions
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { hidden: 'hidden', change: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { hidden: 'mozHidden', change: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { hidden: 'msHidden', change: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { hidden: 'webkitHidden', change: 'webkitvisibilitychange' }
		: { hidden: 'hidden', change: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		scene: _Browser_getScene(),
		viewport: {
			x: _Browser_window.pageXOffset,
			y: _Browser_window.pageYOffset,
			width: _Browser_doc.documentElement.clientWidth,
			height: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		width: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		height: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			scene: {
				width: node.scrollWidth,
				height: node.scrollHeight
			},
			viewport: {
				x: node.scrollLeft,
				y: node.scrollTop,
				width: node.clientWidth,
				height: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			scene: _Browser_getScene(),
			viewport: {
				x: x,
				y: y,
				width: _Browser_doc.documentElement.clientWidth,
				height: _Browser_doc.documentElement.clientHeight
			},
			element: {
				x: x + rect.left,
				y: y + rect.top,
				width: rect.width,
				height: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



function _Time_now(millisToPosix)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(millisToPosix(Date.now())));
	});
}

var _Time_setInterval = F2(function(interval, task)
{
	return _Scheduler_binding(function(callback)
	{
		var id = setInterval(function() { _Scheduler_rawSpawn(task); }, interval);
		return function() { clearInterval(id); };
	});
});

function _Time_here()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(
			A2($elm$time$Time$customZone, -(new Date().getTimezoneOffset()), _List_Nil)
		));
	});
}


function _Time_getZoneName()
{
	return _Scheduler_binding(function(callback)
	{
		try
		{
			var name = $elm$time$Time$Name(Intl.DateTimeFormat().resolvedOptions().timeZone);
		}
		catch (e)
		{
			var name = $elm$time$Time$Offset(new Date().getTimezoneOffset());
		}
		callback(_Scheduler_succeed(name));
	});
}
var $elm$core$Basics$EQ = {$: 'EQ'};
var $elm$core$Basics$GT = {$: 'GT'};
var $elm$core$Basics$LT = {$: 'LT'};
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0.a;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 'Err', a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 'Failure', a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 'Index', a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 'Ok', a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 'OneOf', a: a};
};
var $elm$core$Basics$False = {$: 'False'};
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 'Just', a: a};
};
var $elm$core$Maybe$Nothing = {$: 'Nothing'};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 'Field':
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 'Nothing') {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'Index':
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'OneOf':
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 'Array_elm_builtin', a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 'SubTree', a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.nodeListSize) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.tail);
		} else {
			var treeLen = builder.nodeListSize * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.nodeList) : builder.nodeList;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.tail);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{nodeList: nodeList, nodeListSize: (len / $elm$core$Array$branchFactor) | 0, tail: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = {$: 'True'};
var $elm$core$Result$isOk = function (result) {
	if (result.$ === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 'Normal':
			return 0;
		case 'MayStopPropagation':
			return 1;
		case 'MayPreventDefault':
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 'External', a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 'Internal', a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = function (a) {
	return {$: 'NotFound', a: a};
};
var $elm$url$Url$Http = {$: 'Http'};
var $elm$url$Url$Https = {$: 'Https'};
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {fragment: fragment, host: host, path: path, port_: port_, protocol: protocol, query: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 'Nothing') {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Http,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Https,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0.a;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = function (a) {
	return {$: 'Perform', a: a};
};
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(_Utils_Tuple0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0.a;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return _Utils_Tuple0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(_Utils_Tuple0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0.a;
		return $elm$core$Task$Perform(
			A2($elm$core$Task$map, tagger, task));
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2($elm$core$Task$map, toMessage, task)));
	});
var $elm$browser$Browser$document = _Browser_document;
var $author$project$Main$Menu = {$: 'Menu'};
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Main$init = function (flags) {
	return _Utils_Tuple2($author$project$Main$Menu, $elm$core$Platform$Cmd$none);
};
var $author$project$Main$PokeSumsMsg = function (a) {
	return {$: 'PokeSumsMsg', a: a};
};
var $author$project$Main$ShootOutMsg = function (a) {
	return {$: 'ShootOutMsg', a: a};
};
var $elm$core$Platform$Sub$map = _Platform_map;
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $author$project$Game$PokeSums$LocalStorageOp = function (a) {
	return {$: 'LocalStorageOp', a: a};
};
var $author$project$Game$PokeSums$Tick = function (a) {
	return {$: 'Tick', a: a};
};
var $elm$time$Time$Every = F2(
	function (a, b) {
		return {$: 'Every', a: a, b: b};
	});
var $elm$time$Time$State = F2(
	function (taggers, processes) {
		return {processes: processes, taggers: taggers};
	});
var $elm$core$Dict$RBEmpty_elm_builtin = {$: 'RBEmpty_elm_builtin'};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$time$Time$init = $elm$core$Task$succeed(
	A2($elm$time$Time$State, $elm$core$Dict$empty, $elm$core$Dict$empty));
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1.$) {
					case 'LT':
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 'EQ':
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Dict$Black = {$: 'Black'};
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: 'RBNode_elm_builtin', a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = {$: 'Red'};
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Red')) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) && (left.d.$ === 'RBNode_elm_builtin')) && (left.d.a.$ === 'Red')) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1.$) {
				case 'LT':
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 'EQ':
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$time$Time$addMySub = F2(
	function (_v0, state) {
		var interval = _v0.a;
		var tagger = _v0.b;
		var _v1 = A2($elm$core$Dict$get, interval, state);
		if (_v1.$ === 'Nothing') {
			return A3(
				$elm$core$Dict$insert,
				interval,
				_List_fromArray(
					[tagger]),
				state);
		} else {
			var taggers = _v1.a;
			return A3(
				$elm$core$Dict$insert,
				interval,
				A2($elm$core$List$cons, tagger, taggers),
				state);
		}
	});
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _v0) {
				stepState:
				while (true) {
					var list = _v0.a;
					var result = _v0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _v2 = list.a;
						var lKey = _v2.a;
						var lValue = _v2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_v0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_v0 = $temp$_v0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _v3 = A3(
			$elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				$elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _v3.a;
		var intermediateResult = _v3.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v4, result) {
					var k = _v4.a;
					var v = _v4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$time$Time$Name = function (a) {
	return {$: 'Name', a: a};
};
var $elm$time$Time$Offset = function (a) {
	return {$: 'Offset', a: a};
};
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 'Zone', a: a, b: b};
	});
var $elm$time$Time$customZone = $elm$time$Time$Zone;
var $elm$time$Time$setInterval = _Time_setInterval;
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$time$Time$spawnHelp = F3(
	function (router, intervals, processes) {
		if (!intervals.b) {
			return $elm$core$Task$succeed(processes);
		} else {
			var interval = intervals.a;
			var rest = intervals.b;
			var spawnTimer = $elm$core$Process$spawn(
				A2(
					$elm$time$Time$setInterval,
					interval,
					A2($elm$core$Platform$sendToSelf, router, interval)));
			var spawnRest = function (id) {
				return A3(
					$elm$time$Time$spawnHelp,
					router,
					rest,
					A3($elm$core$Dict$insert, interval, id, processes));
			};
			return A2($elm$core$Task$andThen, spawnRest, spawnTimer);
		}
	});
var $elm$time$Time$onEffects = F3(
	function (router, subs, _v0) {
		var processes = _v0.processes;
		var rightStep = F3(
			function (_v6, id, _v7) {
				var spawns = _v7.a;
				var existing = _v7.b;
				var kills = _v7.c;
				return _Utils_Tuple3(
					spawns,
					existing,
					A2(
						$elm$core$Task$andThen,
						function (_v5) {
							return kills;
						},
						$elm$core$Process$kill(id)));
			});
		var newTaggers = A3($elm$core$List$foldl, $elm$time$Time$addMySub, $elm$core$Dict$empty, subs);
		var leftStep = F3(
			function (interval, taggers, _v4) {
				var spawns = _v4.a;
				var existing = _v4.b;
				var kills = _v4.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, interval, spawns),
					existing,
					kills);
			});
		var bothStep = F4(
			function (interval, taggers, id, _v3) {
				var spawns = _v3.a;
				var existing = _v3.b;
				var kills = _v3.c;
				return _Utils_Tuple3(
					spawns,
					A3($elm$core$Dict$insert, interval, id, existing),
					kills);
			});
		var _v1 = A6(
			$elm$core$Dict$merge,
			leftStep,
			bothStep,
			rightStep,
			newTaggers,
			processes,
			_Utils_Tuple3(
				_List_Nil,
				$elm$core$Dict$empty,
				$elm$core$Task$succeed(_Utils_Tuple0)));
		var spawnList = _v1.a;
		var existingDict = _v1.b;
		var killTask = _v1.c;
		return A2(
			$elm$core$Task$andThen,
			function (newProcesses) {
				return $elm$core$Task$succeed(
					A2($elm$time$Time$State, newTaggers, newProcesses));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v2) {
					return A3($elm$time$Time$spawnHelp, router, spawnList, existingDict);
				},
				killTask));
	});
var $elm$time$Time$Posix = function (a) {
	return {$: 'Posix', a: a};
};
var $elm$time$Time$millisToPosix = $elm$time$Time$Posix;
var $elm$time$Time$now = _Time_now($elm$time$Time$millisToPosix);
var $elm$time$Time$onSelfMsg = F3(
	function (router, interval, state) {
		var _v0 = A2($elm$core$Dict$get, interval, state.taggers);
		if (_v0.$ === 'Nothing') {
			return $elm$core$Task$succeed(state);
		} else {
			var taggers = _v0.a;
			var tellTaggers = function (time) {
				return $elm$core$Task$sequence(
					A2(
						$elm$core$List$map,
						function (tagger) {
							return A2(
								$elm$core$Platform$sendToApp,
								router,
								tagger(time));
						},
						taggers));
			};
			return A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$succeed(state);
				},
				A2($elm$core$Task$andThen, tellTaggers, $elm$time$Time$now));
		}
	});
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$time$Time$subMap = F2(
	function (f, _v0) {
		var interval = _v0.a;
		var tagger = _v0.b;
		return A2(
			$elm$time$Time$Every,
			interval,
			A2($elm$core$Basics$composeL, f, tagger));
	});
_Platform_effectManagers['Time'] = _Platform_createManager($elm$time$Time$init, $elm$time$Time$onEffects, $elm$time$Time$onSelfMsg, 0, $elm$time$Time$subMap);
var $elm$time$Time$subscription = _Platform_leaf('Time');
var $elm$time$Time$every = F2(
	function (interval, tagger) {
		return $elm$time$Time$subscription(
			A2($elm$time$Time$Every, interval, tagger));
	});
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$json$Json$Decode$fail = _Json_fail;
var $elm$json$Json$Decode$field = _Json_decodeField;
var $author$project$Game$PokeSums$Next = {$: 'Next'};
var $author$project$Game$PokeSums$keyMsg = function (string) {
	if (string === 'Enter') {
		return $elm$core$Maybe$Just($author$project$Game$PokeSums$Next);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$Game$PokeSums$keyDecoder = A2(
	$elm$json$Json$Decode$andThen,
	function (msg) {
		if (msg.$ === 'Nothing') {
			return $elm$json$Json$Decode$fail('key passed on');
		} else {
			var m = msg.a;
			return $elm$json$Json$Decode$succeed(m);
		}
	},
	A2(
		$elm$json$Json$Decode$map,
		$author$project$Game$PokeSums$keyMsg,
		A2($elm$json$Json$Decode$field, 'key', $elm$json$Json$Decode$string)));
var $elm$browser$Browser$Events$Document = {$: 'Document'};
var $elm$browser$Browser$Events$MySub = F3(
	function (a, b, c) {
		return {$: 'MySub', a: a, b: b, c: c};
	});
var $elm$browser$Browser$Events$State = F2(
	function (subs, pids) {
		return {pids: pids, subs: subs};
	});
var $elm$browser$Browser$Events$init = $elm$core$Task$succeed(
	A2($elm$browser$Browser$Events$State, _List_Nil, $elm$core$Dict$empty));
var $elm$browser$Browser$Events$nodeToKey = function (node) {
	if (node.$ === 'Document') {
		return 'd_';
	} else {
		return 'w_';
	}
};
var $elm$browser$Browser$Events$addKey = function (sub) {
	var node = sub.a;
	var name = sub.b;
	return _Utils_Tuple2(
		_Utils_ap(
			$elm$browser$Browser$Events$nodeToKey(node),
			name),
		sub);
};
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $elm$browser$Browser$Events$Event = F2(
	function (key, event) {
		return {event: event, key: key};
	});
var $elm$browser$Browser$Events$spawn = F3(
	function (router, key, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var actualNode = function () {
			if (node.$ === 'Document') {
				return _Browser_doc;
			} else {
				return _Browser_window;
			}
		}();
		return A2(
			$elm$core$Task$map,
			function (value) {
				return _Utils_Tuple2(key, value);
			},
			A3(
				_Browser_on,
				actualNode,
				name,
				function (event) {
					return A2(
						$elm$core$Platform$sendToSelf,
						router,
						A2($elm$browser$Browser$Events$Event, key, event));
				}));
	});
var $elm$core$Dict$union = F2(
	function (t1, t2) {
		return A3($elm$core$Dict$foldl, $elm$core$Dict$insert, t2, t1);
	});
var $elm$browser$Browser$Events$onEffects = F3(
	function (router, subs, state) {
		var stepRight = F3(
			function (key, sub, _v6) {
				var deads = _v6.a;
				var lives = _v6.b;
				var news = _v6.c;
				return _Utils_Tuple3(
					deads,
					lives,
					A2(
						$elm$core$List$cons,
						A3($elm$browser$Browser$Events$spawn, router, key, sub),
						news));
			});
		var stepLeft = F3(
			function (_v4, pid, _v5) {
				var deads = _v5.a;
				var lives = _v5.b;
				var news = _v5.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, pid, deads),
					lives,
					news);
			});
		var stepBoth = F4(
			function (key, pid, _v2, _v3) {
				var deads = _v3.a;
				var lives = _v3.b;
				var news = _v3.c;
				return _Utils_Tuple3(
					deads,
					A3($elm$core$Dict$insert, key, pid, lives),
					news);
			});
		var newSubs = A2($elm$core$List$map, $elm$browser$Browser$Events$addKey, subs);
		var _v0 = A6(
			$elm$core$Dict$merge,
			stepLeft,
			stepBoth,
			stepRight,
			state.pids,
			$elm$core$Dict$fromList(newSubs),
			_Utils_Tuple3(_List_Nil, $elm$core$Dict$empty, _List_Nil));
		var deadPids = _v0.a;
		var livePids = _v0.b;
		var makeNewPids = _v0.c;
		return A2(
			$elm$core$Task$andThen,
			function (pids) {
				return $elm$core$Task$succeed(
					A2(
						$elm$browser$Browser$Events$State,
						newSubs,
						A2(
							$elm$core$Dict$union,
							livePids,
							$elm$core$Dict$fromList(pids))));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$sequence(makeNewPids);
				},
				$elm$core$Task$sequence(
					A2($elm$core$List$map, $elm$core$Process$kill, deadPids))));
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (_v0.$ === 'Just') {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$browser$Browser$Events$onSelfMsg = F3(
	function (router, _v0, state) {
		var key = _v0.key;
		var event = _v0.event;
		var toMessage = function (_v2) {
			var subKey = _v2.a;
			var _v3 = _v2.b;
			var node = _v3.a;
			var name = _v3.b;
			var decoder = _v3.c;
			return _Utils_eq(subKey, key) ? A2(_Browser_decodeEvent, decoder, event) : $elm$core$Maybe$Nothing;
		};
		var messages = A2($elm$core$List$filterMap, toMessage, state.subs);
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Platform$sendToApp(router),
					messages)));
	});
var $elm$browser$Browser$Events$subMap = F2(
	function (func, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var decoder = _v0.c;
		return A3(
			$elm$browser$Browser$Events$MySub,
			node,
			name,
			A2($elm$json$Json$Decode$map, func, decoder));
	});
_Platform_effectManagers['Browser.Events'] = _Platform_createManager($elm$browser$Browser$Events$init, $elm$browser$Browser$Events$onEffects, $elm$browser$Browser$Events$onSelfMsg, 0, $elm$browser$Browser$Events$subMap);
var $elm$browser$Browser$Events$subscription = _Platform_leaf('Browser.Events');
var $elm$browser$Browser$Events$on = F3(
	function (node, name, decoder) {
		return $elm$browser$Browser$Events$subscription(
			A3($elm$browser$Browser$Events$MySub, node, name, decoder));
	});
var $elm$browser$Browser$Events$onKeyDown = A2($elm$browser$Browser$Events$on, $elm$browser$Browser$Events$Document, 'keydown');
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $author$project$LocalStoragePort$response = _Platform_incomingPort('response', $elm$json$Json$Decode$value);
var $the_sett$elm_localstorage$LocalStorage$Error = function (a) {
	return {$: 'Error', a: a};
};
var $elm$json$Json$Decode$decodeValue = _Json_run;
var $the_sett$elm_localstorage$LocalStorage$Item = F2(
	function (a, b) {
		return {$: 'Item', a: a, b: b};
	});
var $the_sett$elm_localstorage$LocalStorage$ItemNotFound = function (a) {
	return {$: 'ItemNotFound', a: a};
};
var $elm$json$Json$Encode$null = _Json_encodeNull;
var $the_sett$elm_localstorage$LocalStorage$stripPrefix = F2(
	function (prefix, key) {
		var len = function () {
			var _v0 = $elm$core$String$length(prefix);
			if (!_v0) {
				return 0;
			} else {
				var x = _v0;
				return x + 1;
			}
		}();
		return A2($elm$core$String$dropLeft, len, key);
	});
var $the_sett$elm_localstorage$LocalStorage$getItemDecoder = function (prefix) {
	return A3(
		$elm$json$Json$Decode$map2,
		F2(
			function (k, v) {
				return _Utils_eq(v, $elm$json$Json$Encode$null) ? $the_sett$elm_localstorage$LocalStorage$ItemNotFound(k) : A2($the_sett$elm_localstorage$LocalStorage$Item, k, v);
			}),
		A2(
			$elm$json$Json$Decode$map,
			$the_sett$elm_localstorage$LocalStorage$stripPrefix(prefix),
			A2($elm$json$Json$Decode$field, 'key', $elm$json$Json$Decode$string)),
		A2($elm$json$Json$Decode$field, 'value', $elm$json$Json$Decode$value));
};
var $the_sett$elm_localstorage$LocalStorage$KeyList = function (a) {
	return {$: 'KeyList', a: a};
};
var $elm$json$Json$Decode$list = _Json_decodeList;
var $the_sett$elm_localstorage$LocalStorage$listKeysDecoder = function (prefix) {
	return A2(
		$elm$json$Json$Decode$map,
		$the_sett$elm_localstorage$LocalStorage$KeyList,
		$elm$json$Json$Decode$list(
			A2(
				$elm$json$Json$Decode$map,
				$the_sett$elm_localstorage$LocalStorage$stripPrefix(prefix),
				$elm$json$Json$Decode$string)));
};
var $elm$json$Json$Decode$oneOf = _Json_oneOf;
var $the_sett$elm_localstorage$LocalStorage$responseDecoder = function (prefix) {
	return $elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				$the_sett$elm_localstorage$LocalStorage$getItemDecoder(prefix),
				$the_sett$elm_localstorage$LocalStorage$listKeysDecoder(prefix)
			]));
};
var $the_sett$elm_localstorage$LocalStorage$responseHandler = F3(
	function (wrapper, _v0, json) {
		var _v1 = _v0.a;
		var prefix = _v1.b;
		var _v2 = A2(
			$elm$json$Json$Decode$decodeValue,
			$the_sett$elm_localstorage$LocalStorage$responseDecoder(prefix),
			json);
		if (_v2.$ === 'Ok') {
			var resp = _v2.a;
			return wrapper(resp);
		} else {
			var err = _v2.a;
			return wrapper(
				$the_sett$elm_localstorage$LocalStorage$Error(
					$elm$json$Json$Decode$errorToString(err)));
		}
	});
var $author$project$Game$PokeSums$subscriptions = function (model) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				$elm$browser$Browser$Events$onKeyDown($author$project$Game$PokeSums$keyDecoder),
				A2($elm$time$Time$every, 100, $author$project$Game$PokeSums$Tick),
				$author$project$LocalStoragePort$response(
				A2($the_sett$elm_localstorage$LocalStorage$responseHandler, $author$project$Game$PokeSums$LocalStorageOp, model.storage))
			]));
};
var $author$project$Game$ShootOut$LocalStorageOp = function (a) {
	return {$: 'LocalStorageOp', a: a};
};
var $author$project$Game$ShootOut$Tick = function (a) {
	return {$: 'Tick', a: a};
};
var $author$project$Game$ShootOut$Next = {$: 'Next'};
var $author$project$Game$ShootOut$keyMsg = function (string) {
	if (string === 'Enter') {
		return $elm$core$Maybe$Just($author$project$Game$ShootOut$Next);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Game$ShootOut$keyDecoder = A2(
	$elm$json$Json$Decode$andThen,
	function (msg) {
		if (msg.$ === 'Nothing') {
			return $elm$json$Json$Decode$fail('key passed on');
		} else {
			var m = msg.a;
			return $elm$json$Json$Decode$succeed(m);
		}
	},
	A2(
		$elm$json$Json$Decode$map,
		$author$project$Game$ShootOut$keyMsg,
		A2($elm$json$Json$Decode$field, 'key', $elm$json$Json$Decode$string)));
var $author$project$Game$ShootOut$subscriptions = function (model) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				$elm$browser$Browser$Events$onKeyDown($author$project$Game$ShootOut$keyDecoder),
				A2($elm$time$Time$every, 100, $author$project$Game$ShootOut$Tick),
				$author$project$LocalStoragePort$response(
				A2($the_sett$elm_localstorage$LocalStorage$responseHandler, $author$project$Game$ShootOut$LocalStorageOp, model.storage))
			]));
};
var $author$project$Main$subscriptions = function (model) {
	switch (model.$) {
		case 'Menu':
			return $elm$core$Platform$Sub$none;
		case 'PokeSums':
			var pokesums = model.a;
			return A2(
				$elm$core$Platform$Sub$map,
				$author$project$Main$PokeSumsMsg,
				$author$project$Game$PokeSums$subscriptions(pokesums));
		default:
			var shootout = model.a;
			return A2(
				$elm$core$Platform$Sub$map,
				$author$project$Main$ShootOutMsg,
				$author$project$Game$ShootOut$subscriptions(shootout));
	}
};
var $author$project$Main$PokeSums = function (a) {
	return {$: 'PokeSums', a: a};
};
var $author$project$Main$ShootOut = function (a) {
	return {$: 'ShootOut', a: a};
};
var $author$project$Game$PokeSums$Achievements = F3(
	function (tafels, pokeballs, fruits) {
		return {fruits: fruits, pokeballs: pokeballs, tafels: tafels};
	});
var $author$project$Game$PokeSums$FruitBag = F5(
	function (razzBerries, nanabBerries, pinapBerries, goldenRazzBerries, silverPinapBerries) {
		return {goldenRazzBerries: goldenRazzBerries, nanabBerries: nanabBerries, pinapBerries: pinapBerries, razzBerries: razzBerries, silverPinapBerries: silverPinapBerries};
	});
var $author$project$Game$PokeSums$Load = {$: 'Load'};
var $author$project$Game$PokeSums$Report = F2(
	function (successes, fails) {
		return {fails: fails, successes: successes};
	});
var $elm$core$Set$Set_elm_builtin = function (a) {
	return {$: 'Set_elm_builtin', a: a};
};
var $elm$core$Set$empty = $elm$core$Set$Set_elm_builtin($elm$core$Dict$empty);
var $the_sett$elm_localstorage$LocalStorage$addPrefix = F2(
	function (prefix, key) {
		return (prefix === '') ? key : (prefix + ('.' + key));
	});
var $the_sett$elm_localstorage$LocalStorage$getItem = F2(
	function (_v0, key) {
		var _v1 = _v0.a;
		var ports = _v1.a;
		var prefix = _v1.b;
		return ports.getItem(
			A2($the_sett$elm_localstorage$LocalStorage$addPrefix, prefix, key));
	});
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$LocalStoragePort$clear = _Platform_outgoingPort('clear', $elm$json$Json$Encode$string);
var $author$project$LocalStoragePort$getItem = _Platform_outgoingPort('getItem', $elm$json$Json$Encode$string);
var $author$project$LocalStoragePort$listKeys = _Platform_outgoingPort('listKeys', $elm$json$Json$Encode$string);
var $the_sett$elm_localstorage$LocalStorage$LocalStorage = function (a) {
	return {$: 'LocalStorage', a: a};
};
var $the_sett$elm_localstorage$LocalStorage$make = F5(
	function (getPort, setPort, clearPort, listKeysPort, prefix) {
		var ports = {clear: clearPort, getItem: getPort, listKeys: listKeysPort, setItem: setPort};
		return $the_sett$elm_localstorage$LocalStorage$LocalStorage(
			_Utils_Tuple2(ports, prefix));
	});
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(_Utils_Tuple0),
				entries));
	});
var $author$project$LocalStoragePort$setItem = _Platform_outgoingPort(
	'setItem',
	function ($) {
		var a = $.a;
		var b = $.b;
		return A2(
			$elm$json$Json$Encode$list,
			$elm$core$Basics$identity,
			_List_fromArray(
				[
					$elm$json$Json$Encode$string(a),
					$elm$core$Basics$identity(b)
				]));
	});
var $author$project$LocalStoragePort$make = A4($the_sett$elm_localstorage$LocalStorage$make, $author$project$LocalStoragePort$getItem, $author$project$LocalStoragePort$setItem, $author$project$LocalStoragePort$clear, $author$project$LocalStoragePort$listKeys);
var $author$project$Game$PokeSums$init = function () {
	var storage = $author$project$LocalStoragePort$make('tafels');
	return _Utils_Tuple2(
		{
			achievements: A3(
				$author$project$Game$PokeSums$Achievements,
				$elm$core$Set$empty,
				0,
				A5($author$project$Game$PokeSums$FruitBag, 0, 0, 0, 0, 0)),
			exercises: _List_Nil,
			report: A2($author$project$Game$PokeSums$Report, _List_Nil, _List_Nil),
			state: $author$project$Game$PokeSums$Load,
			storage: storage,
			tafels: $elm$core$Set$empty,
			time: 0
		},
		A2($the_sett$elm_localstorage$LocalStorage$getItem, storage, 'achievements'));
}();
var $author$project$Game$ShootOut$Achievements = F3(
	function (successes, fails, speed) {
		return {fails: fails, speed: speed, successes: successes};
	});
var $author$project$Game$ShootOut$Load = {$: 'Load'};
var $author$project$Game$ShootOut$init = function () {
	var storage = $author$project$LocalStoragePort$make('tafels.shootout');
	return _Utils_Tuple2(
		{
			achievements: A3($author$project$Game$ShootOut$Achievements, 0, 0, 0.0),
			exercises: _List_Nil,
			factors: _List_fromArray(
				[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 20, 25]),
			sounds: _List_Nil,
			state: $author$project$Game$ShootOut$Load,
			storage: storage,
			time: 0
		},
		A2($the_sett$elm_localstorage$LocalStorage$getItem, storage, 'achievements'));
}();
var $elm$core$Platform$Cmd$map = _Platform_map;
var $author$project$Game$PokeSums$Prompt = F4(
	function (a, b, c, d) {
		return {$: 'Prompt', a: a, b: b, c: c, d: d};
	});
var $author$project$Game$PokeSums$Start = {$: 'Start'};
var $author$project$Game$PokeSums$Finish = {$: 'Finish'};
var $elm$json$Json$Encode$int = _Json_wrap;
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(_Utils_Tuple0),
			pairs));
};
var $elm$core$Set$foldl = F3(
	function (func, initialState, _v0) {
		var dict = _v0.a;
		return A3(
			$elm$core$Dict$foldl,
			F3(
				function (key, _v1, state) {
					return A2(func, key, state);
				}),
			initialState,
			dict);
	});
var $elm$json$Json$Encode$set = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$Set$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(_Utils_Tuple0),
				entries));
	});
var $the_sett$elm_localstorage$LocalStorage$setItem = F3(
	function (_v0, key, value) {
		var _v1 = _v0.a;
		var ports = _v1.a;
		var prefix = _v1.b;
		return ports.setItem(
			_Utils_Tuple2(
				A2($the_sett$elm_localstorage$LocalStorage$addPrefix, prefix, key),
				value));
	});
var $author$project$Game$PokeSums$GoldenRazzBerry = {$: 'GoldenRazzBerry'};
var $author$project$Game$PokeSums$NanabBerry = {$: 'NanabBerry'};
var $author$project$Game$PokeSums$PinapBerry = {$: 'PinapBerry'};
var $author$project$Game$PokeSums$RazzBerry = {$: 'RazzBerry'};
var $author$project$Game$PokeSums$SilverPinapBerry = {$: 'SilverPinapBerry'};
var $author$project$Game$PokeSums$treeForExercise = function (_v0) {
	var tafel = _v0.b;
	switch (tafel) {
		case 0:
			return _List_Nil;
		case 1:
			return _List_Nil;
		case 2:
			return _List_fromArray(
				[$author$project$Game$PokeSums$RazzBerry]);
		case 3:
			return _List_fromArray(
				[$author$project$Game$PokeSums$NanabBerry, $author$project$Game$PokeSums$RazzBerry]);
		case 4:
			return _List_fromArray(
				[$author$project$Game$PokeSums$NanabBerry, $author$project$Game$PokeSums$RazzBerry]);
		case 5:
			return _List_fromArray(
				[$author$project$Game$PokeSums$RazzBerry]);
		case 6:
			return _List_fromArray(
				[$author$project$Game$PokeSums$GoldenRazzBerry, $author$project$Game$PokeSums$SilverPinapBerry, $author$project$Game$PokeSums$PinapBerry, $author$project$Game$PokeSums$NanabBerry, $author$project$Game$PokeSums$RazzBerry]);
		case 7:
			return _List_fromArray(
				[$author$project$Game$PokeSums$GoldenRazzBerry, $author$project$Game$PokeSums$SilverPinapBerry, $author$project$Game$PokeSums$PinapBerry, $author$project$Game$PokeSums$NanabBerry, $author$project$Game$PokeSums$RazzBerry]);
		case 8:
			return _List_fromArray(
				[$author$project$Game$PokeSums$GoldenRazzBerry, $author$project$Game$PokeSums$SilverPinapBerry, $author$project$Game$PokeSums$PinapBerry, $author$project$Game$PokeSums$NanabBerry, $author$project$Game$PokeSums$RazzBerry]);
		case 9:
			return _List_fromArray(
				[$author$project$Game$PokeSums$GoldenRazzBerry, $author$project$Game$PokeSums$SilverPinapBerry, $author$project$Game$PokeSums$PinapBerry, $author$project$Game$PokeSums$NanabBerry, $author$project$Game$PokeSums$RazzBerry]);
		case 10:
			return _List_fromArray(
				[$author$project$Game$PokeSums$RazzBerry]);
		case 11:
			return _List_fromArray(
				[$author$project$Game$PokeSums$PinapBerry, $author$project$Game$PokeSums$NanabBerry, $author$project$Game$PokeSums$RazzBerry]);
		case 12:
			return _List_fromArray(
				[$author$project$Game$PokeSums$GoldenRazzBerry, $author$project$Game$PokeSums$SilverPinapBerry, $author$project$Game$PokeSums$PinapBerry, $author$project$Game$PokeSums$NanabBerry, $author$project$Game$PokeSums$RazzBerry]);
		default:
			return _List_Nil;
	}
};
var $elm$core$Set$union = F2(
	function (_v0, _v1) {
		var dict1 = _v0.a;
		var dict2 = _v1.a;
		return $elm$core$Set$Set_elm_builtin(
			A2($elm$core$Dict$union, dict1, dict2));
	});
var $author$project$Game$PokeSums$advance = function (model) {
	var _v0 = model.exercises;
	if (_v0.b) {
		var nextExercise = _v0.a;
		var exercises = _v0.b;
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{
					exercises: exercises,
					state: A4(
						$author$project$Game$PokeSums$Prompt,
						nextExercise,
						'',
						$author$project$Game$PokeSums$treeForExercise(nextExercise),
						model.time)
				}),
			$elm$core$Platform$Cmd$none);
	} else {
		var _v1 = $elm$core$List$reverse(model.report.fails);
		if (!_v1.b) {
			var fruitsEncoder = function (fruits) {
				return $elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'RazzBerries',
							$elm$json$Json$Encode$int(fruits.razzBerries)),
							_Utils_Tuple2(
							'NanabBerries',
							$elm$json$Json$Encode$int(fruits.nanabBerries)),
							_Utils_Tuple2(
							'PinapBerries',
							$elm$json$Json$Encode$int(fruits.pinapBerries)),
							_Utils_Tuple2(
							'GoldenRazzBerries',
							$elm$json$Json$Encode$int(fruits.goldenRazzBerries)),
							_Utils_Tuple2(
							'SilverPinapBerries',
							$elm$json$Json$Encode$int(fruits.silverPinapBerries))
						]));
			};
			var achievements = A2($elm$core$Set$union, model.tafels, model.achievements.tafels);
			var _v2 = _Utils_eq(
				$elm$core$Set$toList(achievements),
				A2($elm$core$List$range, 0, 12)) ? _Utils_Tuple2(model.achievements.pokeballs + 1, $elm$core$Set$empty) : _Utils_Tuple2(model.achievements.pokeballs, achievements);
			var pokeballs = _v2.a;
			var newAchievements = _v2.b;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{
						achievements: {fruits: model.achievements.fruits, pokeballs: pokeballs, tafels: newAchievements},
						state: $author$project$Game$PokeSums$Finish
					}),
				A3(
					$the_sett$elm_localstorage$LocalStorage$setItem,
					model.storage,
					'achievements',
					$elm$json$Json$Encode$object(
						_List_fromArray(
							[
								_Utils_Tuple2(
								'tafels',
								A2($elm$json$Json$Encode$set, $elm$json$Json$Encode$int, newAchievements)),
								_Utils_Tuple2(
								'pokeballs',
								$elm$json$Json$Encode$int(pokeballs)),
								_Utils_Tuple2(
								'fruits',
								fruitsEncoder(model.achievements.fruits))
							]))));
		} else {
			var fail = _v1.a;
			var fails = _v1.b;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{
						exercises: fails,
						report: A2($author$project$Game$PokeSums$Report, model.report.successes, _List_Nil),
						state: A4($author$project$Game$PokeSums$Prompt, fail, '', _List_Nil, model.time)
					}),
				$elm$core$Platform$Cmd$none);
		}
	}
};
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $author$project$Game$PokeSums$exercisesFromTafel = F2(
	function (range, tafel) {
		return A2(
			$elm$core$List$map,
			function (n) {
				return _Utils_Tuple2(n, tafel);
			},
			range);
	});
var $author$project$Game$PokeSums$exercisesFromTafels = function (range) {
	return A2(
		$elm$core$Basics$composeL,
		$elm$core$List$concat,
		$elm$core$List$map(
			$author$project$Game$PokeSums$exercisesFromTafel(range)));
};
var $elm$core$Set$insert = F2(
	function (key, _v0) {
		var dict = _v0.a;
		return $elm$core$Set$Set_elm_builtin(
			A3($elm$core$Dict$insert, key, _Utils_Tuple0, dict));
	});
var $elm$core$Set$fromList = function (list) {
	return A3($elm$core$List$foldl, $elm$core$Set$insert, $elm$core$Set$empty, list);
};
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $elm$core$Dict$isEmpty = function (dict) {
	if (dict.$ === 'RBEmpty_elm_builtin') {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Set$isEmpty = function (_v0) {
	var dict = _v0.a;
	return $elm$core$Dict$isEmpty(dict);
};
var $elm$core$Debug$log = _Debug_log;
var $elm$json$Json$Decode$map3 = _Json_map3;
var $elm$json$Json$Decode$map5 = _Json_map5;
var $elm$core$Dict$member = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$get, key, dict);
		if (_v0.$ === 'Just') {
			return true;
		} else {
			return false;
		}
	});
var $elm$core$Set$member = F2(
	function (key, _v0) {
		var dict = _v0.a;
		return A2($elm$core$Dict$member, key, dict);
	});
var $elm$core$Basics$not = _Basics_not;
var $elm$time$Time$posixToMillis = function (_v0) {
	var millis = _v0.a;
	return millis;
};
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.e.d.$ === 'RBNode_elm_builtin') && (dict.e.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				$elm$core$Dict$Red,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr.$ === 'Black') {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.d.d.$ === 'RBNode_elm_builtin') && (dict.d.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				$elm$core$Dict$Red,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr.$ === 'Black') {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Black')) {
					if (right.d.$ === 'RBNode_elm_builtin') {
						if (right.d.a.$ === 'Black') {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor.$ === 'Black') {
			if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === 'RBNode_elm_builtin') {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Black')) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === 'RBNode_elm_builtin') {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBNode_elm_builtin') {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === 'RBNode_elm_builtin') {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Set$remove = F2(
	function (key, _v0) {
		var dict = _v0.a;
		return $elm$core$Set$Set_elm_builtin(
			A2($elm$core$Dict$remove, key, dict));
	});
var $elm$core$Result$withDefault = F2(
	function (def, result) {
		if (result.$ === 'Ok') {
			var a = result.a;
			return a;
		} else {
			return def;
		}
	});
var $author$project$Game$PokeSums$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'Check':
				var tafel = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							tafels: A2($elm$core$Set$member, tafel, model.tafels) ? A2($elm$core$Set$remove, tafel, model.tafels) : A2($elm$core$Set$insert, tafel, model.tafels)
						}),
					$elm$core$Platform$Cmd$none);
			case 'NoCheck':
				var tafel = msg.a;
				var _v1 = A2(
					$elm$core$Debug$log,
					'NoCheck',
					$elm$core$String$fromInt(tafel));
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 'Next':
				var _v2 = model.state;
				switch (_v2.$) {
					case 'Load':
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					case 'Start':
						return (!$elm$core$Set$isEmpty(model.tafels)) ? $author$project$Game$PokeSums$advance(
							_Utils_update(
								model,
								{
									exercises: A2(
										$author$project$Game$PokeSums$exercisesFromTafels,
										A2($elm$core$List$range, 0, 12),
										$elm$core$Set$toList(model.tafels))
								})) : _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					case 'Prompt':
						var _v3 = _v2.a;
						var n1 = _v3.a;
						var n2 = _v3.b;
						var input = _v2.b;
						var tree = _v2.c;
						var _v4 = $elm$core$String$toInt(input);
						if (_v4.$ === 'Nothing') {
							return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
						} else {
							var n = _v4.a;
							if (_Utils_eq(n1 * n2, n)) {
								var incrementFruit = F2(
									function (fruit, fruits) {
										switch (fruit.$) {
											case 'RazzBerry':
												return _Utils_update(
													fruits,
													{razzBerries: fruits.razzBerries + 1});
											case 'NanabBerry':
												return _Utils_update(
													fruits,
													{nanabBerries: fruits.nanabBerries + 1});
											case 'PinapBerry':
												return _Utils_update(
													fruits,
													{pinapBerries: fruits.pinapBerries + 1});
											case 'GoldenRazzBerry':
												return _Utils_update(
													fruits,
													{goldenRazzBerries: fruits.goldenRazzBerries + 1});
											default:
												return _Utils_update(
													fruits,
													{silverPinapBerries: fruits.silverPinapBerries + 1});
										}
									});
								return $author$project$Game$PokeSums$advance(
									_Utils_update(
										model,
										{
											achievements: {
												fruits: A3($elm$core$List$foldl, incrementFruit, model.achievements.fruits, tree),
												pokeballs: model.achievements.pokeballs,
												tafels: model.achievements.tafels
											},
											report: {
												fails: model.report.fails,
												successes: A2(
													$elm$core$List$cons,
													_Utils_Tuple2(n1, n2),
													model.report.successes)
											}
										}));
							} else {
								return $author$project$Game$PokeSums$advance(
									_Utils_update(
										model,
										{
											report: {
												fails: A2(
													$elm$core$List$cons,
													_Utils_Tuple2(n1, n2),
													model.report.fails),
												successes: model.report.successes
											}
										}));
							}
						}
					case 'CheckedSuccess':
						return $author$project$Game$PokeSums$advance(model);
					case 'CheckedFail':
						return $author$project$Game$PokeSums$advance(model);
					default:
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{state: $author$project$Game$PokeSums$Start, tafels: $elm$core$Set$empty}),
							$elm$core$Platform$Cmd$none);
				}
			case 'Input':
				var input = msg.a;
				var _v6 = model.state;
				if (_v6.$ === 'Prompt') {
					var p = _v6.a;
					var t = _v6.c;
					var start = _v6.d;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								state: A4($author$project$Game$PokeSums$Prompt, p, input, t, start)
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 'Tick':
				var posix = msg.a;
				var millis = $elm$time$Time$posixToMillis(posix);
				var _v7 = model.state;
				if ((_v7.$ === 'Prompt') && _v7.c.b) {
					var p = _v7.a;
					var i = _v7.b;
					var _v8 = _v7.c;
					var fruit = _v8.a;
					var fruits = _v8.b;
					var start = _v7.d;
					return ((millis - start) > 1000) ? _Utils_Tuple2(
						_Utils_update(
							model,
							{
								state: A4($author$project$Game$PokeSums$Prompt, p, i, fruits, millis),
								time: millis
							}),
						$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
						_Utils_update(
							model,
							{
								state: A4(
									$author$project$Game$PokeSums$Prompt,
									p,
									i,
									A2($elm$core$List$cons, fruit, fruits),
									start),
								time: millis
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{time: millis}),
						$elm$core$Platform$Cmd$none);
				}
			default:
				var res = msg.a;
				switch (res.$) {
					case 'Item':
						var key = res.a;
						var value = res.b;
						var tafelsDecoder = A2(
							$elm$json$Json$Decode$andThen,
							A2($elm$core$Basics$composeL, $elm$json$Json$Decode$succeed, $elm$core$Set$fromList),
							$elm$json$Json$Decode$list($elm$json$Json$Decode$int));
						var fruitsDecoder = A6(
							$elm$json$Json$Decode$map5,
							$author$project$Game$PokeSums$FruitBag,
							A2($elm$json$Json$Decode$field, 'RazzBerries', $elm$json$Json$Decode$int),
							A2($elm$json$Json$Decode$field, 'NanabBerries', $elm$json$Json$Decode$int),
							A2($elm$json$Json$Decode$field, 'PinapBerries', $elm$json$Json$Decode$int),
							A2($elm$json$Json$Decode$field, 'GoldenRazzBerries', $elm$json$Json$Decode$int),
							A2($elm$json$Json$Decode$field, 'SilverPinapBerries', $elm$json$Json$Decode$int));
						var achievementsDecoder = A4(
							$elm$json$Json$Decode$map3,
							$author$project$Game$PokeSums$Achievements,
							A2($elm$json$Json$Decode$field, 'tafels', tafelsDecoder),
							A2($elm$json$Json$Decode$field, 'pokeballs', $elm$json$Json$Decode$int),
							A2($elm$json$Json$Decode$field, 'fruits', fruitsDecoder));
						var achievements = A2(
							$elm$core$Result$withDefault,
							model.achievements,
							A2($elm$json$Json$Decode$decodeValue, achievementsDecoder, value));
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{achievements: achievements, state: $author$project$Game$PokeSums$Start}),
							$elm$core$Platform$Cmd$none);
					case 'ItemNotFound':
						var key = res.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{state: $author$project$Game$PokeSums$Start}),
							$elm$core$Platform$Cmd$none);
					case 'KeyList':
						var keys = res.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{state: $author$project$Game$PokeSums$Start}),
							$elm$core$Platform$Cmd$none);
					default:
						var errMsg = res.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{state: $author$project$Game$PokeSums$Start}),
							$elm$core$Platform$Cmd$none);
				}
		}
	});
var $author$project$Game$ShootOut$Answer = F2(
	function (exercise, answers) {
		return {answers: answers, exercise: exercise};
	});
var $author$project$Game$ShootOut$Prompt = F3(
	function (a, b, c) {
		return {$: 'Prompt', a: a, b: b, c: c};
	});
var $author$project$Game$ShootOut$Reveal = function (a) {
	return {$: 'Reveal', a: a};
};
var $author$project$Game$ShootOut$Start = {$: 'Start'};
var $author$project$Game$ShootOut$Finish = {$: 'Finish'};
var $elm$json$Json$Encode$float = _Json_wrap;
var $author$project$Game$ShootOut$advance = function (model) {
	var _v0 = A2($elm$core$Debug$log, 'Ex', model.exercises);
	if (_v0.b) {
		var nextExercise = _v0.a;
		var exercises = _v0.b;
		var budget = 2500 + (750 * $elm$core$List$length(nextExercise.factors));
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{
					exercises: exercises,
					state: A3(
						$author$project$Game$ShootOut$Prompt,
						model.time,
						budget,
						{answers: _List_Nil, exercise: nextExercise})
				}),
			$elm$core$Platform$Cmd$none);
	} else {
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{state: $author$project$Game$ShootOut$Finish}),
			A3(
				$the_sett$elm_localstorage$LocalStorage$setItem,
				model.storage,
				'achievements',
				$elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'successes',
							$elm$json$Json$Encode$int(model.achievements.successes)),
							_Utils_Tuple2(
							'fails',
							$elm$json$Json$Encode$int(model.achievements.fails)),
							_Utils_Tuple2(
							'speed',
							$elm$json$Json$Encode$float(model.achievements.speed))
						]))));
	}
};
var $author$project$Game$ShootOut$correctAnswer = F2(
	function (factor, outcome) {
		return !(outcome % factor);
	});
var $author$project$Game$ShootOut$Exercise = F2(
	function (outcome, factors) {
		return {factors: factors, outcome: outcome};
	});
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (_v0.$ === 'Just') {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Game$ShootOut$addExercise = F3(
	function (tafel, factor, exercises) {
		return A3(
			$elm$core$Dict$update,
			factor * tafel,
			A2(
				$elm$core$Basics$composeL,
				A2(
					$elm$core$Basics$composeL,
					$elm$core$Maybe$Just,
					$elm$core$Maybe$withDefault(
						_List_fromArray(
							[tafel]))),
				$elm$core$Maybe$map(
					$elm$core$List$cons(tafel))),
			exercises);
	});
var $author$project$Game$ShootOut$exercisesFromTafel = F3(
	function (range, tafel, exercises) {
		return A3(
			$elm$core$List$foldl,
			$author$project$Game$ShootOut$addExercise(tafel),
			exercises,
			range);
	});
var $author$project$Game$ShootOut$exercisesFromTafels = F2(
	function (range, tafels) {
		return A2(
			$elm$core$List$map,
			function (_v0) {
				var outcome = _v0.a;
				var factors = _v0.b;
				return A2($author$project$Game$ShootOut$Exercise, outcome, factors);
			},
			$elm$core$Dict$toList(
				A3(
					$elm$core$List$foldl,
					$author$project$Game$ShootOut$exercisesFromTafel(range),
					$elm$core$Dict$empty,
					tafels)));
	});
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$json$Json$Decode$float = _Json_decodeFloat;
var $author$project$Game$ShootOut$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'Next':
				var _v1 = model.state;
				switch (_v1.$) {
					case 'Load':
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					case 'Start':
						return $author$project$Game$ShootOut$advance(
							_Utils_update(
								model,
								{
									exercises: A2(
										$author$project$Game$ShootOut$exercisesFromTafels,
										model.factors,
										A2($elm$core$List$range, 2, 12)),
									sounds: _List_Nil
								}));
					case 'Prompt':
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					case 'Reveal':
						return $author$project$Game$ShootOut$advance(model);
					default:
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{state: $author$project$Game$ShootOut$Start}),
							$elm$core$Platform$Cmd$none);
				}
			case 'Selected':
				var i = msg.a;
				var _v2 = model.state;
				if (_v2.$ === 'Prompt') {
					var start = _v2.a;
					var budget = _v2.b;
					var exercise = _v2.c.exercise;
					var answers = _v2.c.answers;
					if (_Utils_cmp(model.time - start, budget) < 0) {
						var sounds = _List_fromArray(
							[
								_Utils_Tuple2(
								model.time,
								A2($author$project$Game$ShootOut$correctAnswer, i, exercise.outcome))
							]);
						var attempt = A2(
							$author$project$Game$ShootOut$Answer,
							exercise,
							A2(
								$elm$core$List$cons,
								{factor: i, time: model.time - start},
								answers));
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									sounds: sounds,
									state: A3($author$project$Game$ShootOut$Prompt, start, budget, attempt)
								}),
							$elm$core$Platform$Cmd$none);
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 'Tick':
				var posix = msg.a;
				var millis = $elm$time$Time$posixToMillis(posix);
				var _v3 = model.state;
				if (_v3.$ === 'Prompt') {
					var start = _v3.a;
					var budget = _v3.b;
					var answer = _v3.c;
					var removeAfterDecay = $elm$core$List$filter(
						function (_v4) {
							var t = _v4.a;
							return (model.time - t) < 3000;
						});
					var sounds = removeAfterDecay(model.sounds);
					return (_Utils_cmp(millis - start, budget) > 0) ? _Utils_Tuple2(
						_Utils_update(
							model,
							{
								sounds: sounds,
								state: $author$project$Game$ShootOut$Reveal(answer),
								time: millis
							}),
						$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
						_Utils_update(
							model,
							{time: millis}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{time: millis}),
						$elm$core$Platform$Cmd$none);
				}
			default:
				var res = msg.a;
				switch (res.$) {
					case 'Item':
						var key = res.a;
						var value = res.b;
						var achievementsDecoder = A4(
							$elm$json$Json$Decode$map3,
							$author$project$Game$ShootOut$Achievements,
							A2($elm$json$Json$Decode$field, 'successes', $elm$json$Json$Decode$int),
							A2($elm$json$Json$Decode$field, 'fails', $elm$json$Json$Decode$int),
							A2($elm$json$Json$Decode$field, 'speed', $elm$json$Json$Decode$float));
						var achievements = A2(
							$elm$core$Result$withDefault,
							model.achievements,
							A2($elm$json$Json$Decode$decodeValue, achievementsDecoder, value));
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{achievements: achievements, state: $author$project$Game$ShootOut$Start}),
							$elm$core$Platform$Cmd$none);
					case 'ItemNotFound':
						var key = res.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{state: $author$project$Game$ShootOut$Start}),
							$elm$core$Platform$Cmd$none);
					case 'KeyList':
						var keys = res.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{state: $author$project$Game$ShootOut$Start}),
							$elm$core$Platform$Cmd$none);
					default:
						var errMsg = res.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{state: $author$project$Game$ShootOut$Start}),
							$elm$core$Platform$Cmd$none);
				}
		}
	});
var $author$project$Main$update = F2(
	function (msg, model) {
		switch (model.$) {
			case 'Menu':
				switch (msg.$) {
					case 'SelectPokeSums':
						var _v2 = $author$project$Game$PokeSums$init;
						var m = _v2.a;
						var c = _v2.b;
						return _Utils_Tuple2(
							$author$project$Main$PokeSums(m),
							A2($elm$core$Platform$Cmd$map, $author$project$Main$PokeSumsMsg, c));
					case 'SelectShootOut':
						var _v3 = $author$project$Game$ShootOut$init;
						var m = _v3.a;
						var c = _v3.b;
						return _Utils_Tuple2(
							$author$project$Main$ShootOut(m),
							A2($elm$core$Platform$Cmd$map, $author$project$Main$ShootOutMsg, c));
					default:
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 'PokeSums':
				var pokesums = model.a;
				if (msg.$ === 'PokeSumsMsg') {
					var m = msg.a;
					var _v5 = A2($author$project$Game$PokeSums$update, m, pokesums);
					var pokesumsModel = _v5.a;
					var pokesumsCmd = _v5.b;
					return _Utils_Tuple2(
						$author$project$Main$PokeSums(pokesumsModel),
						A2($elm$core$Platform$Cmd$map, $author$project$Main$PokeSumsMsg, pokesumsCmd));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			default:
				var shootout = model.a;
				if (msg.$ === 'ShootOutMsg') {
					var m = msg.a;
					var _v7 = A2($author$project$Game$ShootOut$update, m, shootout);
					var shootoutModel = _v7.a;
					var shootoutCmd = _v7.b;
					return _Utils_Tuple2(
						$author$project$Main$ShootOut(shootoutModel),
						A2($elm$core$Platform$Cmd$map, $author$project$Main$ShootOutMsg, shootoutCmd));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
		}
	});
var $author$project$Main$SelectPokeSums = {$: 'SelectPokeSums'};
var $author$project$Main$SelectShootOut = {$: 'SelectShootOut'};
var $elm$html$Html$h1 = _VirtualDom_node('h1');
var $elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
var $elm$html$Html$map = $elm$virtual_dom$VirtualDom$map;
var $elm$html$Html$nav = _VirtualDom_node('nav');
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 'Normal', a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$p = _VirtualDom_node('p');
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $author$project$Game$PokeSums$Check = function (a) {
	return {$: 'Check', a: a};
};
var $author$project$Game$PokeSums$Input = function (a) {
	return {$: 'Input', a: a};
};
var $author$project$Game$PokeSums$NoCheck = function (a) {
	return {$: 'NoCheck', a: a};
};
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$autofocus = $elm$html$Html$Attributes$boolProperty('autofocus');
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$html$Html$Attributes$checked = $elm$html$Html$Attributes$boolProperty('checked');
var $elm$html$Html$Attributes$disabled = $elm$html$Html$Attributes$boolProperty('disabled');
var $elm$html$Html$div = _VirtualDom_node('div');
var $author$project$Game$PokeSums$fruitImage = function (fruit) {
	switch (fruit.$) {
		case 'RazzBerry':
			return 'GO_Razz_Berry.png';
		case 'NanabBerry':
			return 'GO_Nanab_Berry.png';
		case 'PinapBerry':
			return 'GO_Pinap_Berry.png';
		case 'GoldenRazzBerry':
			return 'GO_Golden_Razz_Berry.png';
		default:
			return 'GO_Silver_Pinap_Berry.png';
	}
};
var $elm$html$Html$img = _VirtualDom_node('img');
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 'MayStopPropagation', a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$pattern = $elm$html$Html$Attributes$stringProperty('pattern');
var $elm$html$Html$Attributes$src = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $elm$html$Html$table = _VirtualDom_node('table');
var $elm$html$Html$td = _VirtualDom_node('td');
var $elm$html$Html$tr = _VirtualDom_node('tr');
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$Game$PokeSums$viewFruit = function (_v0) {
	var x = _v0.a;
	var y = _v0.b;
	var fruit = _v0.c;
	return A2(
		$elm$html$Html$img,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$src(
				$author$project$Game$PokeSums$fruitImage(fruit)),
				A2($elm$html$Html$Attributes$style, 'height', '7vh'),
				A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
				A2(
				$elm$html$Html$Attributes$style,
				'top',
				$elm$core$String$fromInt(
					$elm$core$Basics$floor(7 + (40 * y))) + '%'),
				A2(
				$elm$html$Html$Attributes$style,
				'left',
				$elm$core$String$fromInt(
					$elm$core$Basics$floor(12 + (50 * x))) + '%')
			]),
		_List_Nil);
};
var $author$project$Game$PokeSums$viewTree = function (tree) {
	var prand = function (seed) {
		return A2($elm$core$Debug$log, 'rand', (3.95 * seed) * (1.0 - seed));
	};
	var randcoords = F2(
		function (fruit, _v0) {
			var cs = _v0.a;
			var seed = _v0.b;
			var r1 = seed;
			var r2 = prand(
				prand(r1));
			var r3 = prand(
				prand(
					prand(r2)));
			return _Utils_Tuple2(
				A2(
					$elm$core$List$cons,
					_Utils_Tuple3(r1, r2, fruit),
					cs),
				r3);
		});
	var coords = A3(
		$elm$core$List$foldl,
		randcoords,
		_Utils_Tuple2(_List_Nil, 0.3625634),
		tree).a;
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'position', 'relative'),
				A2($elm$html$Html$Attributes$style, 'display', 'inline-block')
			]),
		A2(
			$elm$core$List$cons,
			A2(
				$elm$html$Html$img,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$src('SwSh_Berry_tree.png'),
						A2($elm$html$Html$Attributes$style, 'height', '50vh')
					]),
				_List_Nil),
			A2($elm$core$List$map, $author$project$Game$PokeSums$viewFruit, coords)));
};
var $author$project$Game$PokeSums$view = function (model) {
	var _v0 = model.state;
	switch (_v0.$) {
		case 'Load':
			return A2(
				$elm$html$Html$p,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Momentje..')
					]));
		case 'Start':
			return A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Klaar voor de start? Welke tafels wil je doen?')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$table,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'width', '100%')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$tr,
										_List_Nil,
										_List_fromArray(
											[
												A2(
												$elm$html$Html$td,
												_List_fromArray(
													[
														A2($elm$html$Html$Attributes$style, 'vertical-align', 'top'),
														A2($elm$html$Html$Attributes$style, 'width', '5em')
													]),
												_List_fromArray(
													[
														A2(
														$elm$html$Html$table,
														_List_Nil,
														A2(
															$elm$core$List$map,
															function (tafel) {
																return A2(
																	$elm$html$Html$tr,
																	_List_Nil,
																	_List_fromArray(
																		[
																			A2(
																			$elm$html$Html$td,
																			_List_Nil,
																			_List_fromArray(
																				[
																					A2(
																					$elm$html$Html$input,
																					_List_fromArray(
																						[
																							$elm$html$Html$Attributes$type_('checkbox'),
																							$elm$html$Html$Events$onClick(
																							A2($elm$core$Set$member, tafel, model.achievements.tafels) ? $author$project$Game$PokeSums$NoCheck(tafel) : $author$project$Game$PokeSums$Check(tafel)),
																							$elm$html$Html$Attributes$checked(
																							A2($elm$core$Set$member, tafel, model.tafels) || A2($elm$core$Set$member, tafel, model.achievements.tafels)),
																							$elm$html$Html$Attributes$disabled(
																							A2($elm$core$Set$member, tafel, model.achievements.tafels))
																						]),
																					_List_Nil)
																				])),
																			A2(
																			$elm$html$Html$td,
																			_List_Nil,
																			_List_fromArray(
																				[
																					$elm$html$Html$text(
																					$elm$core$String$fromInt(tafel))
																				]))
																		]));
															},
															A2($elm$core$List$range, 0, 12)))
													])),
												A2(
												$elm$html$Html$td,
												_List_fromArray(
													[
														A2($elm$html$Html$Attributes$style, 'width', '60vw'),
														A2($elm$html$Html$Attributes$style, 'vertical-align', 'top')
													]),
												A2(
													$elm$core$List$map,
													function (_v1) {
														var fruitFun = _v1.a;
														var fruit = _v1.b;
														return A2(
															$elm$html$Html$div,
															_List_fromArray(
																[
																	A2($elm$html$Html$Attributes$style, 'text-align', 'left')
																]),
															_List_fromArray(
																[
																	A2(
																	$elm$html$Html$img,
																	_List_fromArray(
																		[
																			$elm$html$Html$Attributes$src(
																			$author$project$Game$PokeSums$fruitImage(fruit)),
																			A2($elm$html$Html$Attributes$style, 'height', '10vh')
																		]),
																	_List_Nil),
																	$elm$html$Html$text(
																	$elm$core$String$fromInt(
																		fruitFun(model.achievements.fruits)))
																]));
													},
													_List_fromArray(
														[
															_Utils_Tuple2(
															function ($) {
																return $.goldenRazzBerries;
															},
															$author$project$Game$PokeSums$GoldenRazzBerry),
															_Utils_Tuple2(
															function ($) {
																return $.silverPinapBerries;
															},
															$author$project$Game$PokeSums$SilverPinapBerry),
															_Utils_Tuple2(
															function ($) {
																return $.pinapBerries;
															},
															$author$project$Game$PokeSums$PinapBerry),
															_Utils_Tuple2(
															function ($) {
																return $.nanabBerries;
															},
															$author$project$Game$PokeSums$NanabBerry),
															_Utils_Tuple2(
															function ($) {
																return $.razzBerries;
															},
															$author$project$Game$PokeSums$RazzBerry)
														]))),
												A2(
												$elm$html$Html$td,
												_List_fromArray(
													[
														A2($elm$html$Html$Attributes$style, 'text-align', 'right'),
														A2($elm$html$Html$Attributes$style, 'vertical-align', 'top')
													]),
												A2(
													$elm$core$List$map,
													function (_v2) {
														return A2(
															$elm$html$Html$img,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$src('pokeball.png'),
																	A2($elm$html$Html$Attributes$style, 'padding', '0.5em')
																]),
															_List_Nil);
													},
													A2($elm$core$List$range, 1, model.achievements.pokeballs)))
											]))
									]))
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$Game$PokeSums$Next)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Start!')
									]))
							]))
					]));
		case 'Finish':
			return A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Hoera, alle sommen goed!')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$img,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$src('https://lorempokemon.fakerapi.it/pokemon')
									]),
								_List_Nil)
							]))
					]));
		case 'Prompt':
			var _v3 = _v0.a;
			var n1 = _v3.a;
			var n2 = _v3.b;
			var input = _v0.b;
			var tree = _v0.c;
			return A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text(
								'Hoeveel is ' + ($elm$core$String$fromInt(n1) + (' x ' + ($elm$core$String$fromInt(n2) + '?'))))
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Events$onInput($author$project$Game$PokeSums$Input),
										$elm$html$Html$Attributes$autofocus(true),
										$elm$html$Html$Attributes$pattern('\\d*'),
										$elm$html$Html$Attributes$value(input)
									]),
								_List_Nil)
							])),
						$author$project$Game$PokeSums$viewTree(tree)
					]));
		case 'CheckedSuccess':
			var _v4 = _v0.a;
			var n1 = _v4.a;
			var n2 = _v4.b;
			return A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text(
								$elm$core$String$fromInt(n1) + (' x ' + ($elm$core$String$fromInt(n2) + (' is inderdaad ' + ($elm$core$String$fromInt(n1 * n2) + '!')))))
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$Game$PokeSums$Next)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Volgende!')
									]))
							]))
					]));
		default:
			var _v5 = _v0.a;
			var n1 = _v5.a;
			var n2 = _v5.b;
			return A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text(
								'Helaas, dat is niet goed. ' + ($elm$core$String$fromInt(n1) + (' x ' + ($elm$core$String$fromInt(n2) + (' = ' + ($elm$core$String$fromInt(n1 * n2) + '!'))))))
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$Game$PokeSums$Next)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Volgende!')
									]))
							]))
					]));
	}
};
var $elm$svg$Svg$Attributes$d = _VirtualDom_attribute('d');
var $elm$svg$Svg$Attributes$height = _VirtualDom_attribute('height');
var $elm$svg$Svg$trustedNode = _VirtualDom_nodeNS('http://www.w3.org/2000/svg');
var $elm$svg$Svg$path = $elm$svg$Svg$trustedNode('path');
var $elm$svg$Svg$svg = $elm$svg$Svg$trustedNode('svg');
var $elm$svg$Svg$Attributes$version = _VirtualDom_attribute('version');
var $elm$svg$Svg$Attributes$viewBox = _VirtualDom_attribute('viewBox');
var $elm$svg$Svg$Attributes$width = _VirtualDom_attribute('width');
var $author$project$Game$ShootOut$Clone$drawing = A2(
	$elm$svg$Svg$svg,
	_List_fromArray(
		[
			$elm$svg$Svg$Attributes$width('100%'),
			$elm$svg$Svg$Attributes$height('100%'),
			$elm$svg$Svg$Attributes$version('1.1'),
			$elm$svg$Svg$Attributes$viewBox('0 0 766 969')
		]),
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$path,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$d('m512.83 966.82c-9.2927-2.4742-10.09-14.287-2.0802-30.817 7.6449-15.776 7.144-10.7 6.167-62.5-0.82796-43.899-1.3855-49.34-8.9675-87.5-2.6811-13.494-13.856-56.628-17.392-67.134-1.2277-3.6472-1.56-9.3736-1.56-26.885v-22.251l-4.1496-10.115c-6.5165-15.884-6.9718-40.615-0.7478-40.615 1.4657 0 1.8881-0.48787 1.5154-1.75-0.52458-1.7762-1.3605-9.3886-4.0906-37.25-1.7489-17.848-3.0789-28.785-5.0466-41.5-0.76605-4.95-1.9292-14.512-2.5849-21.25-1.5386-15.811-2.0158-15.867-12.811-1.48-9.2319 12.304-17.046 24.375-30.895 47.73-12.728 21.464-24.808 40.232-28.477 44.246-1.1294 1.2353-1.8642 2.3646-1.6328 2.5094 0.65768 0.41184 12.692 11.447 20.382 18.688l6.9614 6.556-0.28875 28c-0.52518 50.927 2.3882 71.816 14.462 103.69 1.8997 5.0154 2.2822 7.1657 1.5259 8.5788-0.97179 1.8158 2.436 25.157 4.2885 29.373 3.3583 7.6438 0.43958 10.053-14.411 11.897-14.108 1.7514-30.062 4.971-54.5 10.999-22.87 5.641-46.541 5.4404-51.414-0.43566-8.7086-10.501-1.2999-18.235 37.058-38.685l17.644-9.4068 1.7619-5.5067c7.075-22.113-10.049-83.715-28.042-100.88-32.557-31.061-36.668-35.951-43.164-51.354-4.2292-10.028-3.7832-10.483 6.6835-6.8197l8.4286 2.9499 1.2568-4.2004c0.69121-2.3102 1.2636-5.1004 1.2719-6.2004 0.0142-1.8698 1.7378-10.338 9.1575-44.993 2.7868-13.016 7.9126-33.779 12.715-51.507 7.6309-28.165 20.133-55.353 38.627-84 11.891-18.42 11.516-17.636 11.516-24.019v-5.9806h-10.656l-1.165-16.25c-0.64074-8.9375-1.4456-20.975-1.7885-26.75l-0.62357-10.5 5.6111-7c3.0861-3.85 5.6136-7.3206 5.6167-7.7125 0.0227-2.8979-4.8289-12.423-8.902-17.478-5.1978-6.4505-7.2274-13.201-11.307-37.607l-1.3034-7.7976-5.991 7.6247c-3.2951 4.1936-6.1562 8.3775-6.3582 9.2976-0.50159 2.2855-18.388 32.224-23.789 39.819-4.8547 6.8263-11.005 12.795-14.244 13.823-3.6311 1.1525-4.8889 5.1916-4.3696 14.032 0.81379 13.852-2.083 22.481-11.52 34.319-12.165 15.259-21.578 28.612-35.726 50.681-2.1155 3.3-4.2109 6.4913-4.6564 7.0918-0.47335 0.63803 0.47971 3.039 2.293 5.7765l3.103 4.6847 4.794-7.7765c5.1364-8.3318 6.4288-9.6554 15.3-15.669 13.992-9.4847 24.516-26.567 25.916-42.064 0.24243-2.6846 0.94005-3.2128 7.5831-5.7425 4.0238-1.5322 14.691-6.8748 23.705-11.872 19.5-10.811 25.43-13.278 28.821-11.989 10.172 3.8676-6.2887 27.397-34.138 48.796-25.309 19.447-31.326 26.225-34.281 38.612-0.80428 3.3714-3.4889 8.4339-7.7695 14.651-3.5973 5.225-9.4411 13.775-12.986 19-3.5452 5.225-7.2854 10.576-8.3117 11.891-1.2774 1.637-1.5544 2.7668-0.87829 3.5815 0.984 1.1856-1.2114 4.6598-19.487 30.836-3.7666 5.3951-8.1179 10.713-9.6695 11.818-2.372 1.689-2.8212 2.7181-2.8212 6.4631 0 5.5119-5.5834 12.219-12.558 15.085-3.1002 1.2739-4.9085 2.8063-5.9886 5.075-1.3472 2.8295-2.0417 3.25-5.3676 3.25-3.7319 0-9.086 5.3332-9.086 9.0505 0 0.60135-1.1512 3.0577-2.5582 5.4586-2.4262 4.1399-2.4778 4.5207-1 7.3784 3.8433 7.4322 1.0908 11.975-17.975 29.664-6.4904 6.0218-14.294 13.266-17.342 16.099l-5.5407 5.1504 3.7077 5.5842c2.0392 3.0713 3.7077 6.008 3.7077 6.5261 0 0.51804-9.9291 14.362-22.065 30.765-12.136 16.403-23.723 32.154-25.75 35.003-2.027 2.8486-10.355 14.205-18.507 25.236-11.303 15.295-14.671 20.531-14.188 22.055 0.4816 1.5174-1.3654 4.4455-7.6781 12.173-16.924 20.715-19.458 23.833-26.145 32.167-5.4636 6.809-7.8466 8.9516-11.892 10.692l-5.0588 2.1762-4.2943-5.3856-4.2903 5.0526c-6.6296 7.8076-14.435 9.0976-24.385 4.0299-16.665-8.488-21.638-23.19-11.12-32.874 1.4934-1.375 4.5534-4.975 6.8001-8 4.8439-6.522 16.931-22.045 29.588-38 8.6681-10.926 15.936-20.164 25.985-33.03 2.475-3.1686 9-11.448 14.5-18.399 36.3-45.876 34.38-43.061 30.095-44.136-9.101-2.2842-10.149-18.2-1.7012-25.839 1.1585-1.0477 2.1064-2.9898 2.1064-4.3157 0-3.9376 1.6379-5.8772 6.8601-8.1238l4.94-2.1251 0.68471-6.2652c2.5483-23.318 28.587-35.854 42.601-20.51 1.7626 1.9298 3.2256 2.7915 3.7453 2.206 0.46905-0.5285 3.7365-4.9915 7.2609-9.9178 9.0882-12.703 23.378-27.495 25.919-26.83 1.3161 0.34415 2.1877-0.1015 2.6397-1.3496 0.37119-1.0249 1.5016-3.0579 2.5122-4.5178 1.201-1.7352 1.8373-4.4361 1.8373-7.7997 0-6.2385 1.9534-10.322 6.0921-12.736 1.7103-0.99763 4.1733-3.912 5.4894-6.4952l2.387-4.6856-11.619-16.814c-6.3907-9.2479-12.234-17.525-12.984-18.393-2.3106-2.6729-1.6378-3.983 9.4175-18.338 11.871-15.414 11.011-14.694 20.63-17.262l6.9125-1.8448 2.8539-10.488c3.1429-11.55 5.7482-23.487 8.2917-37.988 0.91641-5.225 2.5611-13.775 3.6548-19 1.0937-5.225 2.265-11.075 2.6028-13 1.3745-7.8316 14.283-25.312 21.23-28.749 5.2806-2.6126 12.213-11.724 11.396-14.978-1.4419-5.745 9.8076-31.158 18.543-41.891l4.9795-6.1176-2.4383-1.111c-2.9401-1.3396-3.0293-3.0588-0.96804-18.659 6.2371-47.203 21.74-67.059 58.475-74.893 12.499-2.6657 12.959-3.3418 10.62-15.602-0.78699-4.125-1.7194-14.7-2.0719-23.5-0.35257-8.8-1.1088-17.903-1.6805-20.23-1.2631-5.1394-0.45459-8.9319 2.0754-9.7349 1.5448-0.49031 2.0043-1.9843 2.5576-8.3167 2.1119-24.168 16.846-47.714 34.908-55.786 3.3805-1.5107 22.796-10.359 43.146-19.663 42.98-19.65 42.096-19.353 42.683-14.333 0.41806 3.581 0.2929 3.727-7.8241 9.1278-9.4552 6.2913-14.522 11.696-17.988 19.185l-2.4296 5.2505 4.372 5.9134 2.9203-2.4572c9.6351-8.1074 23.025 15.432 28.752 50.543l1.2231 7.5 14.646 5.3075c20.065 7.2712 18.301 7.1124 20.845 1.8754 10.888-22.41 25.159-12.915 30.54 20.317 1.1131 6.875 2.4964 12.802 3.0739 13.171 0.71867 0.45927 0.35906 6.0872-1.1394 17.832-2.5185 19.74-2.7559 18.605 4.0781 19.485 28.645 3.6861 49.749 25.596 49.749 51.649 0 0.99934 1.2375 2.5807 2.75 3.5142 13.976 8.6257 19.811 13.622 22.824 19.546 0.92419 1.8168 1.8106 3.4532 1.9698 3.6365 0.15922 0.18334 1.2156-0.59272 2.3474-1.7246 1.9121-1.9121 6.7543-3.8221 7.552-2.9789 1.1223 1.1863 21.182 36.717 27.873 49.37 6.4934 12.279 8.2666 16.633 9.7753 24 1.0137 4.95 2.4977 11.925 3.2979 15.5 4.6623 20.829 5.7844 25.892 6.5391 29.5 0.99977 4.78 4.5547 21.336 6.6026 30.75 0.80764 3.7125 2.192 9.7875 3.0763 13.5l1.6079 6.75 10.995 9.4351c6.047 5.1893 11.248 10.139 11.558 11s1.7853 3.1399 3.2784 5.0649c8.8436 11.402 10.646 18.164 11.674 43.793 0.54017 13.467-0.50964 16.207-6.2091 16.207-3.822 0-5.5121-2.0139-5.5121-6.5682 0-3.5381-2.1-10.488-3.0009-9.9312-0.38718 0.23929-2.0973-1.688-3.8003-4.2828-5.7412-8.7477-10.586-13.217-14.333-13.223-5.0968-8e-3 -10.468-1.7893-13.766-4.5637l-2.9621-2.4924-4.4247 4.7809c-2.4336 2.6295-5.862 6.4408-7.6188 8.4696-7.5123 8.6757-13.89 11.196-18.594 7.3464l-3-2.4549 4.6204-4.0072c5.803-5.0328 7.8559-9.3274 8.5328-17.85 0.2937-3.6978 1.4132-9.7685 2.4878-13.49l1.9538-6.7671-2.1667-7.7329c-3.3362-11.907-12.133-28.738-26.776-51.233-12.223-18.777-13.583-20.997-19.985-32.642-5.5754-10.141-13.559-33.414-14.703-42.858-0.13323-1.1-0.82159-4.025-1.5297-6.5-0.70811-2.475-1.2242-4.7888-1.1469-5.1419 0.0773-0.35303-1.7588-0.92669-4.0802-1.2748-7.9704-1.1952-24.228-10.44-38.707-22.012-3.575-2.857-7.0036-5.4946-7.6191-5.8613s1.2855 3.9036 4.2243 9.4895c7.9857 15.178 4.5321 21.123-13.621 23.445-8.8597 1.1334-11.564-1.0677-12.641-10.29l-0.91794-7.8556-4.1662 13c-9.9579 31.073-11.563 37.659-10.31 42.31l1.1538 4.2849 3.6567-4.5158 3.8704 2.9302c2.1287 1.6116 6.0078 4.9179 8.6204 7.3473l4.75 4.4171v57.536l-4.5741 2.6806c-3.4361 2.0137-4.405 3.0947-3.8943 4.345 15.212 37.24 17.135 72.895 6.9996 129.81-1.6221 9.1098-6.1282 29.246-7.5753 33.852-0.51841 1.65-2.3229 7.725-4.0101 13.5s-4.4348 14.685-6.106 19.801l-3.0385 9.3007 2.4404 3.6993c4.8445 7.3437 7.3265 13.929 8.7442 23.199 0.4626 3.025 4.0823 16.075 8.0439 29l7.2028 23.5-1.5858 18c-1.9081 21.658-4.2612 50.889-5.6377 70.034-1.3509 18.788-1.2828 73.119 0.11432 91.257 0.85057 11.042 0.83553 17.027-0.0619 24.646-1.0166 8.6308-0.96789 10.58 0.34202 13.698 5.952 14.166 2.0182 37.91-7.1376 43.083-9.642 5.4474-32.4 7.8028-44.433 4.5989zm39.608-6.3169c3.2673-1.65 6.6035-4.0408 7.4137-5.3129l1.4731-2.3129-3.5682 2.1053c-8.8883 5.2442-30.76 8.296-42.924 5.9891-6.2226-1.1801-7.3613-0.54675-2.7362 1.5219 6.6821 2.9886 33.059 1.6871 40.342-1.9906zm-31.545-30.798c3.6202-11.351 6.1099-20.49 6.1011-22.395-0.0118-2.5406-4.3034 6.8756-5.9725 13.104-1.0839 4.0446-4.2326 11.979-6.9972 17.633-6.4636 13.217-6.5946 17.975-0.52653 19.118 1.8129 0.34148 2.0703-0.35453 2.7518-7.4405 0.42066-4.3741 2.4659-13.192 4.6434-20.019zm21.155 26.767c1.0609-0.65567 1.1299-31.072 0.10066-44.39-1.0782-13.952-9.6493-14.688-12.089-1.0385-0.71224 3.9854-3.0483 12.465-5.1912 18.844-2.6622 7.9243-4.0998 14.246-4.5389 19.959l-0.64271 8.3613 10.705-0.5742c5.888-0.31581 11.133-0.83839 11.655-1.1613zm12.619-4.0042c4.2351-1.7311 5.6805-4.7184 5.0132-10.361-0.29941-2.532 0.12248-7.8892 0.93753-11.905 1.7326-8.5364 1.4054-10.12-2.5554-12.366-1.6172-0.91726-3.8698-3.4897-5.0058-5.7166-1.9502-3.8228-5.5922-6.9159-6.7636-5.7444-0.29331 0.2933-0.20149 11.368 0.20403 24.611 0.82878 27.064-0.0206 24.831 8.1701 21.483zm5.3305-45.371v-5.7877l-10.75-2.8523c-18.521-4.9143-26.36-3.4308-27.074 5.1241l-0.32402 3.8796 2.1623-2.7489c7.072-8.9905 26.217-6.1765 31.861 4.683 2.979 5.7321 4.1245 5.094 4.1245-2.2978zm6e-3 -34.552c-1.5258-27.076-0.9027-68.529 1.4666-97.542 0.87583-10.725 2.0039-24.9 2.5068-31.5 0.50288-6.6 1.4502-18.75 2.1051-27l1.1907-15-5.7308-19c-6.0906-20.193-6.9142-22.061-8.0914-18.352-0.41014 1.2922-3.6211 5.3279-7.1355 8.9682l-6.3898 6.6187-3.1717 14.105c-3.69 16.41-2.1161 15.176-18.425 14.451l-12.862-0.57204-12.369-29.219-0.0499 17.784-0.0499 17.784 6.0356 21.216c16.132 56.706 21.964 93.152 21.964 137.26v23.597l2.9044-2.0681c4.2118-2.9991 13.929-2.7199 26.596 0.76412 12.086 3.3242 11.083 5.6759 9.5064-22.29zm-190.01-46.517c4.675-0.99182 15.475-3.3961 24-5.3428 16.907-3.8609 27.766-5.9107 41.25-7.7867 8.182-1.1384 8.75-1.3704 8.75-3.5754 0-1.9279-0.41039-2.2662-2.25-1.8544-1.2375 0.27703-7.2 1.1697-13.25 1.9838s-15.275 2.3654-20.5 3.4474c-44.959 9.3105-47.175 9.6878-62.61 10.661-8.2704 0.52162-10.682 0.34219-13.25-0.98589-3.0117-1.5574-3.1396-1.5425-3.1396 0.36694 0 1.9957 2.1646 3.6093 6.9416 5.1747 3.7832 1.2398 24.3-0.0186 34.058-2.089zm-33.683-8.8623c0.75886-3.7943 4.558-6.5129 21.043-15.058 20.283-10.514 30.246-17.274 27.187-18.448-2.577-0.9889-46.628 22.947-52.798 28.689-3.6065 3.3561-1.8679 7.2787 3.375 7.6145 0.34375 0.022 0.88037-1.2368 1.1925-2.7974zm30.557 0.2918c7.5866-1.3155 24.753-4.9038 35.984-7.522 6.079-1.417 18.894-3.5113 30.194-4.9345l9.5531-1.2031-1.411-9.1474c-1.8361-11.903-4.1961-11.906-9.8701-0.0132-6.6478 13.934-16.228 13.549-35.267-1.4205l-7.442-5.851-7.1993 5.1652c-3.9596 2.8409-13.631 8.4707-21.492 12.511-27.975 14.377-25.886 18.109 6.95 12.416zm56.316-17.704c0.86487-0.6875 2.2781-2.375 3.1406-3.75l1.5681-2.5-8.1994-0.11645c-6.4913-0.0922-9.9181-0.75471-16.449-3.1802-9.9544-3.6966-10.036-3.5786-1.6517 2.404 11.501 8.2066 17.681 10.251 21.592 7.1426zm5.8077-11.249c3.0841-1.5949 6.7263-5.9451 9.3932-11.219 1.5952-3.1548 1.5198-3.539-3.8288-19.5-9.5356-28.456-10.854-38.891-10.88-86.077l-0.0186-34.795-21.396-19.884-0.61101 4.4578c-0.33606 2.4518-1.9726 7.4608-3.6368 11.131-2.4662 5.4392-2.7964 6.9498-1.7851 8.1683 2.6959 3.2483-17.023 17.647-27.663 20.199l-5.5719 1.3367v5.1974c0 4.1566 0.92464 7.0783 4.6174 14.59 15.806 32.154 25.498 76.518 20.018 91.628l-1.536 4.2351 10.2 5.0452c13.759 6.8053 26.132 8.8811 32.698 5.4856zm102-85.253c0-0.96378 1.1197-6.2513 2.4882-11.75 1.3685-5.4987 2.4935-10.818 2.5-11.821 7e-3 -1.003 2.503-4.1004 5.5477-6.8831 8.0204-7.3302 10.723-12.418 10.676-20.094-0.0571-9.238-7.0755-29.302-7.1799-20.526-0.0538 4.5188-16.057 19.165-18.972 17.364-0.54092-0.33431-4.6797-7.3306-9.1973-15.547-7.0099-12.75-8.5179-14.878-10.288-14.517-1.1408 0.23235-6.6408 1.1818-12.222 2.1098l-10.148 1.6873-0.67812 6.3322c-1.3697 12.79 0.1196 18.175 13.246 47.898 3.8863 8.8 7.9467 18.25 9.0231 21 1.9111 4.8823 2.0719 5.014 6.8309 5.5929 11.185 1.3607 18.374 1.03 18.374-0.84523zm-167.7-44.761c7.7336-1.2399 28.269-13.072 28.647-16.505 0.0315-0.2855-2.2478-3.2778-5.065-6.6496l-5.1222-6.1305-5.2552 5.2552c-14.302 14.302-34.091 15.835-49.5 3.8335l-3.5-2.7258 2.3994 2.9681c1.3197 1.6325 9.1947 9.587 17.5 17.677l15.101 14.709 0.29564-5.8784 0.29563-5.8784zm17.276-36.487c11.223-5.3571 20.746-17.758 46.496-60.549 8.8649-14.731 19.278-31.298 23.14-36.815 4.1267-5.8952 6.0468-9.3185 4.6573-8.3035-18.808 13.739-33.602 5.4942-49.273-27.458-10.04-21.114-13.208-34.105-12.349-50.649 0.55014-10.597 1.2126-10.98-8.2701 4.7755-13.974 23.217-24.767 49.731-32.566 80-4.4997 17.463-12.286 50.986-13.436 57.847-0.49295 2.9407-1.1542 6.3157-1.4695 7.5-0.4096 1.5386-0.11372 1.3458 1.0366-0.67563 1.8704-3.2868 2.0951-3.2352 10.88 2.5 4.5344 2.9602 6.579 4.925 6.57 6.3133-7e-3 1.1086 0.98145 8.0308 2.1971 15.383l2.2102 13.367 7.6242-0.44136c5.2165-0.30197 9.1807-1.1843 12.553-2.794zm166.3-18.125c14.103-43.667 23.84-102 21.668-129.81-2.029-25.978-11.619-59.734-15.949-56.141-1.0882 0.90316-1.9865 0.93027-3.5259 0.1064-8.9858-4.809-63.264 46.389-68.585 64.693-4.984 17.144-4.6834 26.716 2.4108 76.773 0.54563 3.85 1.7355 14.2 2.6441 23 0.90865 8.8 1.9482 18.611 2.31 21.802l0.65793 5.8025 4.3203-12.302c5.1845-14.764 12.333-34.152 12.788-34.687 0.29876-0.35076 23.586 2.7417 24.028 3.1908 0.22451 0.22829 3.9574 24.685 5.5243 36.194 2.4576 18.051 6.1817 18.488 11.709 1.374zm-92.619-100.12c-4.1396-1.328-4.1301-1.4065 1.3491-11.109l4.5991-8.1441-4.289-8c-9.455-17.636-8.4102-16.52-17.921-19.148-11.2-3.0954-10.909-3.2348-13.56 6.4845-6.1369 22.497 6.5933 41.082 28.072 40.983 4.8918-0.0226 4.9297-0.0457 1.75-1.0657zm11.055-26.692c6.8905-11.665 30.263-30.95 69.15-57.058 7.3403-4.9282 7.7847-5.4169 5.75-6.3248-1.7777-0.79322-2.2051-1.8151-2.2051-5.2721 0-5.9214-0.37623-5.9351-11.383-0.41505-18.901 9.4794-29.734 12.009-51.417 12.007-33.52-0.00292-67.201-11.281-67.201-22.502 0-0.82342-0.50756-1.4971-1.1279-1.4971-2.5946 0-0.40281 32.539 2.8627 42.5 8.0615 24.589 10.459 28.461 12.361 19.962 1.9902-8.8934 1.7602-8.8067 14.404-5.4274 6.05 1.617 11.311 2.9457 11.692 2.9528 0.3805 7e-3 3.7247 5.4128 7.4315 12.013 7.5026 13.358 7.271 13.142 9.6813 9.0615zm-206.59-22.706c12.606-1.5144 10.873-16.314-2.0034-17.103-13.865-0.84922-18.104 3.4295-12.044 12.156 4.1568 5.9855 4.4736 6.097 14.047 4.947zm461.89-2.8572c9.1748-2.3274 21.289-6.4977 24.118-8.3027 0.82141-0.52403-2.2769-3.8248-9.446-10.063l-10.668-9.2835-6.054 0.69216c-6.3763 0.729-10.031 2.1816-15.181 6.034l-3.1272 2.3392 2.3772 7.2576c1.3075 3.9917 2.3772 7.5816 2.3772 7.9776 0 6.1905 2.3847 6.7023 15.604 3.3489zm-424.66-52.999c2.4294-3.3 7.7392-10.151 11.8-15.225 20.2-25.242 13.496-50.418-13.863-52.059-22.465-1.348-31.982 13.607-40.443 63.552-2.6356 15.558-5.8875 30.384-7.9541 36.264l-1.2412 3.5319 5.6287-0.91787c6.4359-1.0495 16.2 0.5298 18.204 2.9445 1.0274 1.2379 3.0488-1.269 12.341-15.305 6.1117-9.232 13.1-19.485 15.529-22.785zm417.82 23.005c8.4899-1.1003 9.3932-1.4371 8.819-3.2882-0.2929-0.94418-1.8722-8.0167-3.5094-15.717-4.1842-19.678-14.812-68.625-16.718-77-2.4324-10.684-15.956-36.623-18.759-35.979-1.152 0.26447-5.1733 1.1749-8.9362 2.0231-13.039 2.9392-20.077 6.1237-30.285 13.704l-5.1271 3.8069 4.3302 14.646c2.3816 8.0553 5.7797 17.38 7.5514 20.723 4.5788 8.6375 15.66 27.266 19.378 32.577 10.173 14.53 28.495 47.258 28.495 50.9 0 0.53074 2.2555-0.55283 5.0121-2.4079 3.1254-2.1032 6.7956-3.6041 9.75-3.987zm-238.75-7.7549c7e-3 -1.7875-0.52137-9.6158-1.175-17.396l-1.1884-14.146-8.575-0.68175c-4.7162-0.37496-9.5875-0.92041-10.825-1.2121-3.9594-0.93328-3.3582 10.104 0.62602 11.493 5.0259 1.752 6.4216 16.193 1.565 16.193-5.0448 0-3.4022 6.7513 1.809 7.4351 16.578 2.1751 17.748 2.0641 17.763-1.6851zm21.798 1.0959c5.0582-0.96481 5.284-1.14 4.7422-3.6795-0.3129-1.4665-1.4638-9.1523-2.5575-17.079-2.3046-16.704-1.7375-15.489-6.6449-14.232-2.118 0.54249-6.5548 1.2786-9.8595 1.6359l-6.0085 0.64955 1.1843 14.18c0.65135 7.7989 1.2177 15.665 1.2586 17.48l0.0743 3.2996 6.25-0.62018c3.4375-0.3411 8.64-1.0761 11.561-1.6332zm-47.811-5.3459c0-4.2604 0.14889-4.5 2.796-4.5 4.5727 0 3.2126-8.9893-1.546-10.218l-3.25-0.83916v-14.697l-5.75-1.5496c-3.1625-0.8523-6.6908-1.8414-7.8407-2.198-1.8961-0.58805-4.8808 32.363-3.0933 34.151 0.53837 0.53837 14.949 4.1678 16.934 4.265 1.4201 0.0695 1.75-0.76262 1.75-4.4143zm100.6-18.75-0.69018-23.25-2.7031-2.3009c-1.4867-1.2655-3.991-3.2445-5.565-4.3978l-2.8619-2.0968 0.59017 2.8978c0.32459 1.5938 1.0877 12.298 1.6959 23.788 1.2911 24.393 2.4625 27.975 9.3311 28.537 0.51902 0.0425 0.60412-9.6681 0.2031-23.177zm-29.831 16.37c2.3385-1.193 3.9763-2.6742 3.7299-3.3733-0.24159-0.68551-0.93137-5.0714-1.5328-9.7464-3.5988-27.972-1.998-25.089-11.44-20.607-4.179 1.9836-8.0311 3.6066-8.5601 3.6066-1.3067 0-1.2923 0.22675 1.2156 19.13l2.2063 16.63 5.1062-1.7568c2.8084-0.96624 6.9824-2.7139 9.2754-3.8837zm41.985 0.6658c2.8919-1.4222 3.6035-27.786 0.75-27.786-1.1936 0-1.5-1.4617-1.5-7.155 0-7.0916-0.0177-7.139-2-5.345-1.6998 1.5383-2 3.08-2 10.272 0 8.1036-0.0889 8.4384-2.1 7.9125-2.0708-0.54152-2.0951-0.35629-1.75 13.321l0.34999 13.87 3-1.9915c1.65-1.0954 4.0125-2.4895 5.25-3.0981zm-135.39-4.4251c0.34975-2.5518 0.63592-10.374 0.63592-17.382v-12.742l-9.5-6.1949-0.63609 4.7291c-0.34986 2.601-0.97369 10.428-1.3863 17.392l-0.7502 12.663 4.8863 3.0677c6.2095 3.8984 5.9992 3.9462 6.7504-1.5339zm106.19-2.6 4.6096-2.2395-0.55589-7.5105c-0.30573-4.1308-0.83881-12.82-1.1846-19.31s-0.92718-11.665-1.292-11.5c-0.36477 0.16468-3.2548 1.8735-6.4223 3.7974l-5.7591 3.498 0.60616 4.502c0.33339 2.4761 1.2073 8.327 1.942 13.002s1.6254 10.638 1.9792 13.25c0.35385 2.6125 0.82874 4.75 1.0553 4.75s2.4863-1.0078 5.0216-2.2395zm-130.93-9.5105c-0.48542-2.4856-1.4534-13-3.4293-37.25-0.67899-8.3333-0.74649-8.5062-3.4426-8.8164-3.2604-0.37515-3.1041-2.4675-1.7415 23.316 1.3746 26.011 1.2621 25.5 5.6163 25.5 3.319 0 3.5014-0.16744 2.9971-2.75zm10.578-17.75c0.14827-13.435-0.64305-21.5-2.1096-21.5-3.0993 0-4.3468 15.475-2.1525 26.701 0.51595 2.6396 1.2528 7.0492 1.6375 9.7992 1.1778 8.4199 2.4462 1.1708 2.6246-15zm71.872-31.732c7.1522-7.1522 7.1347-6.3869 0.17787-7.7658-3.1625-0.62687-6.4672-1.3418-7.3438-1.5887-1.1676-0.32889-2.405 1.3607-4.6279 6.3189-4.1283 9.2084-4.1526 9.2923-6.3263 21.806-1.0546 6.0711-2.1911 12.596-2.5256 14.5-0.36207 2.0607 2.4931-2.7718 7.0548-11.941 6.3287-12.72 8.6952-16.434 13.591-21.33zm13.192 32.8c20.581-6.7778 47.558-25.378 45.308-31.24-0.31476-0.82026-0.5899-2.2421-0.61143-3.1596-0.0215-0.91751-0.71373-0.11313-1.5382 1.7875-5.7976 13.365-18.698 17.212-26.002 7.7538-2.9946-3.8777-6.0006-6.2922-11.302-9.0779l-7.2221-3.7951-5.4893 4.235c-6.4144 4.9487-22.407 31.046-22.407 36.564 0 1.6803 21.779-0.60272 29.264-3.0676zm-37.344-2.8179c0.58487-2.8875 1.9336-9.7608 2.9972-15.274 1.8938-9.8163 4.8732-18.892 7.5752-23.075 2.0481-3.1705-26.064-6.0367-37.255-3.7984l-3.013 0.6026 4.3201 9.1474c4.4704 9.4657 8.0472 21.37 9.0984 30.282 0.59438 5.039 0.68198 5.1525 4.7315 6.1299 9.2576 2.2344 10.358 1.8519 11.546-4.014zm-20.526-4.9589c-2.8154-14.776-10.799-34.791-13.877-34.791-3.6062 0-3.204 2.6622 1.662 11 6.223 10.663 8.3711 15.475 10.396 23.289 1.5556 6.0032 2.1908 7.7112 2.868 7.7112 0.17865 0-0.29331-3.244-1.0488-7.2089zm-5.8897-1.4242c-1.8288-6.2909-4.1127-11.114-10.345-21.846l-4.0526-6.9789-2.0316 4.4789c-5.3652 11.828-1.7748 21.49 10.215 27.488 8.3669 4.1858 8.3469 4.1959 6.2136-3.1422zm126-3.3669c2.1482-2.2 3.6809-4 3.4059-4s-2.2577 1.8-4.4059 4-3.6809 4-3.4059 4 2.2577-1.8 4.4059-4zm-2.1809-3.8172 5.7565-5.8172-12.385-10.772-3.4376 3.9533c-1.8907 2.1743-4.2996 5.1528-5.3532 6.6188l-1.9155 2.6655 5.2408 4.5845c6.402 5.6004 5.2125 5.7216 12.094-1.2327zm-26.588-9.6829c5.0092-2.959 6.7269-7.4601 20.388-53.424 5.5061-18.526 5.45-18.231 3.3092-17.41-0.86847 0.33327-2.8904-0.37129-4.5172-1.5741l-2.945-2.1774-2.076 4.7927c-1.1418 2.636-5.2046 12.893-9.0284 22.793-8.3327 21.574-7.6825 20.748-15.386 19.552-8.7291-1.3544-26.206-3.8418-31.975-4.551-12.177-1.4968-17.5-2.7366-17.5-4.076 0-0.80827-2.3562-2.0486-5.75-3.0269-6.9033-1.9899-11.007-4.7083-12.477-8.266-0.98153-2.375-1.1316-2.4368-1.5338-0.63246-0.65107 2.9206-3.0845 5.3145-6.7492 6.6397-2.2788 0.82403-3.0926 1.6647-2.7776 2.8692 0.57476 2.1979-2.0072 2.6201-25.213 4.1228-19.57 1.2673-19.286 1.2168-17.688 3.1422 0.60357 0.72725 2.2993 5.5756 3.7682 10.774 4.2293 14.967 8.4007 20.866 9.9067 14.01 5.3869-24.526 81.888-21.339 104.05 4.3349 5.0947 5.9012 7.2305 6.2183 14.19 2.1071zm-130.89-10.047c2.1136-4.6388 0.34233-4.9214-2.8395-0.45295-2.0448 2.8717-2.0546 3-0.22861 3 1.0737 0 2.4149-1.1134 3.0681-2.547zm-71.845-6.4492c6.1137-4.3534 9.682-9.5194 30.189-43.707l1.9212-3.2029-4.251-2.1687c-2.3381-1.1928-6.6909-3.7887-9.6731-5.7688-4.9708-3.3004-5.9411-3.5767-11.659-3.3199-4.3199 0.194-8.1613-0.368-12.496-1.8281-8.0105-2.6985-9.7382-1.2026-19.914 17.242-10.994 19.927-11.258 24.601-1.8615 32.931 14.709 13.04 20.397 15.054 27.745 9.8213zm199.56-25.754c2.0163-4.2625 6.953-14.97 10.97-23.794l7.3044-16.044-2.5398-14.456c-3.5189-20.029-3.7162-49.195-0.43885-64.857 1.1971-5.7207 2.0571-10.504 1.9112-10.63-2.8276-2.4337-17.31-7.9295-28.515-10.821l-5.25-1.3548-0.0175 4.1035c-0.13663 32.123-21.641 56.604-49.72 56.604h-3.9491l-0.65323 15.75c-2.7144 65.446-3.216 64.133 25.84 67.626 30.262 3.6375 38.998 4.7893 39.404 5.1949 1.199 1.199 2.296-0.2212 5.6542-7.3204zm-107.06 3.888 11-0.67734-39.225-1.9607 1.6127 2.2323c1.4832 2.0531 2.1749 2.1862 8.6128 1.6577 3.85-0.31607 11.95-0.87946 18-1.252zm21.738-6.1873c6.0991-1.6938 5.3008 3.6621 10.368-69.569l0.63098-9.1187-4.8438-0.72637c-2.6641-0.39951-8.905-2.1645-13.869-3.9221-8.0198-2.8399-9.6374-3.1006-14.525-2.3416-6.7843 1.0536-20.513-0.52446-28.515-3.2778-3.1888-1.0971-6.1358-1.9947-6.5488-1.9947-6.5848 0-3.1443 83.003 3.7305 90 1.6377 1.6668 48.029 2.4901 53.572 0.95067zm199.04-14.303c11.517-4.8401 18.058-21.709 12.854-33.148-2.8371-6.2362-23.331-23.518-21.712-18.309 0.22377 0.72 0.65491 4.0447 0.9581 7.3883l0.55126 6.0792-6.7485 5.1305c-9.9117 7.5353-14.689 9.3712-23.98 9.2147-4.2378-0.0714-9.1633 0.23614-10.945 0.68336l-3.2404 0.81312 7.4286 5.4666c21.941 16.146 34.76 20.915 44.834 16.681zm40.302-3.5457c1.8064-0.51208-10.486-24.775-15.209-30.019-1.8105-2.0103-0.9158 1.8839 1.5593 6.787 3.6816 7.2933 3.7267 7.8713 0.72015 9.2412-2.3133 1.054-1.9909 6.4817 0.87313 14.701 0.44655 1.2815 6.2318 0.94059 12.056-0.71047zm-339.08-18.492c16.759-7.9452 27.127-25.82 31.536-54.367l1.1207-7.2574-3.0923-3.9044c-7.187-9.0744-7.9764-16.487-2.444-22.95l3.62-4.2292-2.87 0.68751c-32.044 7.6761-45.592 20.686-53.505 51.379-1.6648 6.4576-6.1232 35.107-5.5522 35.678 6.1923 6.1923 22.965 8.862 31.187 4.964zm231.25-6.8704c3.2344-2.5476 0.45776-5.2031-6.6248-6.3356l-4.1252-0.65966v4.0583c0 5.0195 6.0184 6.6638 10.75 2.937zm38.245 0.76223c3.9381-1.3894 16.217-9.4178 17.447-11.407 0.2974-0.48121-0.14327-5.7475-0.97926-11.703-6.0808-43.318-17.147-53.45-64.212-58.791l-10.25-1.1632 3e-3 4.031c0.032 40.391 34.474 87.33 57.991 79.033zm-209.49-48.473c-1.65-0.42163-5.025-1.5304-7.5-2.4639-6.9956-2.6386-8-2.8684-8-1.8304 0 1.17 12.49 5.1492 16 5.0976 2.2615-0.0332 2.2138-0.10986-0.5-0.80335zm35.924-5.5601c11.416-3.7842 38.988-18.078 44.45-23.044 0.20611-0.18738-0.52377-1.7598-1.622-3.4943-1.2282-1.9398-2.2612-2.7257-2.6838-2.0419-1.4233 2.303-4.2204 1.0652-5.9622-2.6383-0.97001-2.0625-2.8292-5.589-4.1316-7.8366l-2.368-4.0866-6.8036 3.34c-8.7426 4.2918-18.692 7.438-34.304 10.848-15.882 3.4688-15.331 2.263-7.5904 16.618 13.645 25.304 3.6595 18.445-25.921-17.808l-2.0118-2.4655-6.4882 3.0694c-3.5685 1.6882-7.2757 3.0698-8.2382 3.0702-7.6253 3e-3 1.5046 16.607 12.019 21.859 17.882 8.9308 34.222 10.389 51.655 4.6104zm28.251-6.9406c6.1177-3.0097 14.431-8.1066 18.474-11.327 10.084-8.0313 12.048-10.808 2.8431-4.0185-8.9033 6.5667-14.543 10.088-25.992 16.226-11.764 6.3076-8.8022 5.7493 4.6757-0.88124zm-63.59-23.878c-3.0404-5.314-3.0528-5.3962-1.8234-12.106l1.2378-6.7562 9-3.3129c4.95-1.8221 17.325-6.2893 27.5-9.9271 10.175-3.6378 20.075-7.1803 22-7.8722s3.455-1.8018 3.4-2.4664-0.1675-3.2816-0.25-5.8154c-0.10635-3.2662-0.51379-4.4504-1.4-4.0689-0.6875 0.29594-5.857 2.6316-11.488 5.1903-10.685 4.8556-30.322 10.148-46.41 12.508l-8.6482 1.2686-1.4164 23.575 5.2314 7.5674c6.1222 8.8561 7.3899 9.7725 3.0672 2.2171zm85.623 0.91114c-0.2485-1.1334-0.78283-2.8483-1.1874-3.8108-0.56119-1.3351-0.25202-1.75 1.304-1.75 1.1614 0 2.3129 0.86121 2.6744 2 0.78058 2.4594 1.7194 2.5217 3.7687 0.25 1.3763-1.5257 1.3962-1.9988 0.15499-3.6911-0.78302-1.0676-1.4237-2.5301-1.4237-3.25 0-1.992 2.8254-1.5613 4.2003 0.64029 0.87159 1.3956 1.5671 1.6588 2.4492 0.92673 0.96-0.79672 0.81497-1.7081-0.65697-4.1285-1.0389-1.7084-1.6607-3.4754-1.3817-3.9267 1.0288-1.6647 3.3652-0.74448 4.7317 1.8636l1.4064 2.6843 3.0698-5.375c6.6644-11.669 4.1414-26.3-6.7237-38.994l-2.9959-3.5 1.0138 3.8095c0.55759 2.0952 1.8506 10.573 2.8734 18.84l1.8596 15.031-6.673 6.2261c-3.6702 3.4243-8.7656 8.1246-11.323 10.445l-4.6503 4.219 2.6503 2.7561c2.9555 3.0735 5.6564 2.3697 4.8593-1.2661zm-55.851-4.9951c9.2624-2.2231 17.5-4.9392 23.211-7.6531l8.8525-4.207-0.58662-4.6028c-0.32264-2.5316-1.0924-7.1155-1.7107-10.186l-1.1241-5.5836-20.5 7.4225c-11.275 4.0824-23.875 8.6709-28 10.197l-7.5 2.7744-0.69297 4.3868c-0.53234 3.3699-0.21477 5.4626 1.37 9.0279l2.0629 4.6412 5.13-1.3852c2.8215-0.76185 11.591-2.936 19.488-4.8314zm56.892-9.4243c10.705-9.707 10.51-8.9979 7.7568-28.217-3.139-21.913-7.8222-31.972-14.846-31.885l-3.1611 0.0391 3.1217 1.3586c9.7133 4.2275 7.8895 17.563-2.4019 17.563-6.736 0-10.44-6.0452-7.7669-12.677l1.5411-3.8234-2.4025 2.696c-6.5002 7.294-5.2155 24.937 4.524 62.128 1.178 4.4981 0.1643 5.0321 13.634-7.1825zm79.957 4.6202c-0.23919-1.2439-0.44398-0.46166-0.45508 1.7383s0.18461 3.2178 0.4349 2.2617 0.25937-2.7561 0.0202-4zm-184.75-7.7617c-5e-3 -3.025-1.0972-9.55-2.4267-14.5l-2.4174-9 0.53563 8c0.29459 4.4 0.94101 9.575 1.4365 11.5s0.91026 5.525 0.92175 8c0.0152 3.2754 0.28469 4.0918 0.99026 3 0.53316-0.825 0.96517-3.975 0.96002-7zm142.04 1.5c0-2.6634-0.41832-3.5021-1.75-3.5087-0.9625-5e-3 -4.0684-0.28725-6.9021-0.6277-10.967-1.3176-3.3084 5.9828 7.9021 7.5327 0.4125 0.057 0.75-1.4713 0.75-3.3963zm47.547-10.134 0.68453-6.1335-2.674 0.51116c-1.7281 0.33035-2.4894 0.99232-2.152 1.8713 0.28707 0.74808 0.82489 3.6439 1.1952 6.4352 0.84624 6.3793 2.058 5.2753 2.9463-2.6842zm-8.499-4.9224c-2.4925-9.0853-4.1682-12.51-8.8766-18.143-4.2242-5.0535-7.4322-6.8508-4.5838-2.5682 6.243 9.3866 11.709 19.539 13.195 24.509 2.5042 8.3744 2.7276 5.1776 0.26536-3.7975zm3.0382-14.989c2.7378-1.4158 2.9313-1.8542 2.3177-5.25-0.85266-4.7184-0.84365-4.7113-3.5621-2.8072-1.2579 0.8811-3.312 1.602-4.5647 1.602-2.7974 0-2.8141 0.39569-0.19593 4.632 2.4137 3.9055 2.1395 3.8222 6.005 1.8233zm-133.25-4.9774c5.1349-0.83277 12.767-2.4336 16.961-3.5574 4.1937-1.1238 8.4299-1.8328 9.4139-1.5755 1.4537 0.38016 1.789-0.15515 1.789-2.8562v-3.324l-8.75 2.9779c-19.931 6.783-51.738 7.7173-66.557 1.9549-4.7763-1.8572-2.0004 0.83936 3.1673 3.0769 10.877 4.7094 27.573 5.9636 43.976 3.3034zm111.61-6.4136c-3.311-3.2614-42.673-18.064-48.034-18.064-5.9212 0 1.6827 3.5298 22.843 10.604 26.099 8.7253 26.636 8.8843 25.191 7.4604zm-102.13-2.9676c9.8369-2.6031 9.6746-2.4874 9.6808-6.9057 8e-3 -5.7761 3.825-10.771 14.598-19.105 16.852-13.035 18.752-17.696 12.367-30.34-6.3951-12.664-13.153-20.362-18.522-21.098-19.393-2.6582-31.301 2.9139-52.545 24.587-14.162 14.449-19.868 15.219-17.115 2.3082 1.197-5.6125 0.93965-5.6471-2.1839-0.29356-10.119 17.344-12.113 44.85-3.571 49.267 9.4798 4.9022 41.408 5.7823 57.291 1.5792zm-62.559-0.84664c-1.4346-1.5125-3.0532-4.325-3.5969-6.25-0.82122-2.9076-1.0015-3.0768-1.0651-1-0.12916 4.2191 0.8959 6.4842 3.7046 8.1862 3.7917 2.2976 3.9125 2.1794 0.95735-0.93621zm100.66 1.1786c1.8597-1.8597 2.0704-6.5296 0.37143-8.2286-1.9093-1.9093-5.5497-1.3954-7.2433 1.0225-3.6444 5.2031 2.4666 11.611 6.8719 7.2061zm10.492-16.966-1.1791-6.7711-1.8483 2.4041c-2.4092 3.1336-2.3795 3.4073 0.85725 7.9107 3.483 4.846 3.5984 4.6577 2.1702-3.5437zm-16.92 0.03705c3.1813-1.2251 3.267-1.3548 0.94113-1.4239-1.4074-0.04184-3.4324 0.58461-4.5 1.3921-2.3845 1.8036-1.0724 1.8153 3.5589 0.0318zm21.721-8.3061c1.3958-0.88688 4.3866-8.7534 3.6196-9.5204-1.0233-1.0233-7.3401 3.5752-7.3401 5.3435 0 4.125 1.3742 5.6677 3.7206 4.1769zm-0.94307-11.751c1.2224-0.85619 2.2225-2.1493 2.2225-2.8735 0-1.7702-6.9208 1.3888-6.9674 3.1802-0.0445 1.7066 2.0652 1.5703 4.7449-0.3067zm-75.443-31.971c15.229-12.185 28.379-15.725 44.165-11.889 1.6074 0.39056 2.5709-0.6138 4.9079-5.1162 4.6958-9.0465 17.271-20.995 25.075-23.825 0.55937-0.20282 0.76347-0.64644 0.45356-0.98581s-7.5099 2.5626-16 6.4488c-8.4901 3.8862-27.812 12.669-42.937 19.516-30.746 13.92-31.267 14.294-37.395 26.861-3.4554 7.0862-4.3146 10.474-2.9918 11.797 0.33735 0.33735 4.2406-3.2186 8.674-7.9021 4.4333-4.6835 11.655-11.391 16.048-14.906z')
				]),
			_List_Nil)
		]));
var $elm$svg$Svg$Attributes$fill = _VirtualDom_attribute('fill');
var $elm$svg$Svg$Attributes$strokeWidth = _VirtualDom_attribute('stroke-width');
var $author$project$Game$ShootOut$Droid$drawing = A2(
	$elm$svg$Svg$svg,
	_List_fromArray(
		[
			$elm$svg$Svg$Attributes$width('100%'),
			$elm$svg$Svg$Attributes$height('100%'),
			$elm$svg$Svg$Attributes$version('1.1'),
			$elm$svg$Svg$Attributes$viewBox('0 0 100 212')
		]),
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$path,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$d('m95.174 211.6c-2.0501-0.31731-3.4849-1.7766-3.3865-3.4443 0.05021-0.85164-0.1427-1.5532-0.67879-2.468-0.71714-1.2237-0.74911-1.4653-0.75121-5.6792-0.0022-4.4011-0.0022-4.4011-0.92467-4.8343-1.5221-0.71479-2.065-3.2924-0.93204-4.4254 0.60188-0.60188-4.6219-10.696-10.872-21.01-4.714-7.7784-5.9597-13.197-4.1774-18.172 0.4135-1.1541 0.41698-1.3359 0.03111-1.6247-0.23896-0.17884-0.80972-1.4134-1.2683-2.7435-0.45863-1.3301-1.1532-3.1981-1.5434-4.1511-1.1846-2.8928-1.2028-3.1994-0.20757-3.4972 1.0235-0.3063 0.10566-3.0428-1.129-3.3657-0.38921-0.10172-0.83684-0.67439-1.2183-1.5584-2.1133-4.898-2.5638-5.6173-3.8834-6.2011-1.7032-0.7534-2.2078-2.2103-3.7139-10.722-0.21115-1.1932-1.0759-1.1491-1.4643 0.0748-0.4408 1.3888-2.8444 0.78325-3.4375-0.86606-0.51115-1.4215-1.0388-1.9086-1.0388-0.95907 0 0.26669 0.14888 0.89659 0.33084 1.3998 0.38592 1.0672-0.73495 3.5501-1.8745 4.1522-0.34227 0.18084-1.0639 0.65091-1.6036 1.0446-1.3878 1.0123-2.8322 0.97755-3.2334-0.0778-0.16596-0.43649-0.50241-1.0154-0.74767-1.2864-0.36262-0.40069-0.38584-0.66508-0.12429-1.4154 0.1769-0.50745 0.32163-0.96822 0.32163-1.0239 0-0.2608-2.8521-0.0642-2.9411 0.20277-0.17552 0.52656-2.174 0.81076-3.4405 0.48928-1.2951-0.32873-1.6914-0.0696-1.7 1.1115-0.01375 1.8834-11.49 13.648-18.082 18.537-2.953 2.19-2.953 2.19-2.238 3.1274 0.9587 1.2569 0.82289 4.2149-0.25384 5.5283-0.21653 0.26414-0.09616 0.52091 0.44289 0.94496 3.1524 2.4797 3.434 11.472 0.61834 19.747-1.0908 3.2055-1.2021 4.6241-0.5688 7.2469 0.5184 2.1469 0.53836 3.1496 0.08754 4.3963-0.33375 0.92298-0.30389 1.0163 0.59394 1.8554 0.97368 0.90998 1.0711 2.0632 0.2595 3.07-0.18621 0.23099-0.23159 1.3664-0.12121 3.0323 0.40063 6.0468-0.85204 7.981-5.1821 8.0014-0.49645 2e-3 -1.666 0.34234-2.5991 0.75556-4.9811 2.206-9.8562 2.3985-12.021 0.47472-0.5887-0.52323-0.69959-1.1691-0.11783-0.68632 0.21316 0.17691 0.47307 0.23614 0.57758 0.13163 0.34639-0.3464 0.19738-0.62997-0.38015-0.72345-0.85678-0.13867-0.51139-0.45753 3.7994-3.5076 2.7988-1.9803 4.3149-3.2718 5.1982-4.4285 1.5585-2.0407 2.7626-2.9932 3.098-2.4506 0.17503 0.28322 0.27493 0.22658 0.39236-0.22242 0.08666-0.33132 0.03973-0.52956-0.10435-0.44055-0.14402 0.0889-0.26186-0.0331-0.26186-0.27135s0.12038-0.50758 0.26751-0.59851c0.16004-0.0989 0.16557-0.52079 0.01375-1.0502-0.27109-0.94522-0.96452-7.7309-1.4434-14.124-0.7225-9.6463-1.1329-14.707-1.3173-16.244-0.14583-1.2158-0.10566-1.6605 0.14999-1.6605 0.22775 0 0.19039-0.15879-0.1074-0.45661-0.25113-0.25114-0.43159-0.80344-0.40101-1.2274 0.030561-0.42389-0.098124-1.0546-0.28598-1.4015-0.42624-0.78711-0.44896-2.6903-0.03209-2.6903 0.1702 0 0.28577 0.2924 0.25682 0.64977-0.12389 1.5296 0.099653 1.6748 0.33339 0.21659 0.14002-0.87359 0.6308-2.327 1.0906-3.2298 0.86943-1.707 0.55457-2.6899-0.47028-1.4681-0.37929 0.45219-0.37996 0.42807-0.0055-0.21157 0.23221-0.39708 0.86372-1.0003 1.4034-1.3404 0.53964-0.34015 1.3471-0.98311 1.7944-1.4288 0.44726-0.44571 0.77215-0.64181 0.72197-0.43578-0.05021 0.20603-0.59972 0.88196-1.2212 1.5021-0.6215 0.62011-1.0763 1.1744-1.0108 1.2317 0.27494 0.24025 1.4727 0.79915 1.5242 0.71121 0.55575-0.94988 3.5092-5.2074 3.6898-5.3191 0.13633-0.0843 0.24788-0.34812 0.24788-0.58636 0-0.25391-0.138-0.3479-0.33342-0.22713-0.20656 0.12766-0.25501 0.0792-0.12734-0.12736 0.12182-0.19712 0.02347-0.3334-0.24055-0.3334-0.24563 0-0.76785 0.50889-1.1605 1.1309-0.90616 1.4354-1.5196 1.8483-0.71171 0.47896 0.46591-0.78968 0.56039-1.283 0.41289-2.1561-0.19664-1.1639 0.87325-3.4968 1.6037-3.4968 0.16622 0 0.23431-0.10987 0.15132-0.24414-0.08295-0.13429 0.4675-1.0115 1.2233-1.9493 0.75582-0.93784 1.6283-2.0209 1.9388-2.4067 0.83083-1.0324 7.1294-7.8095 8.2698-8.898 0.89885-0.858 1.0636-0.91211 1.9783-0.64977 1.3246 0.3799 1.2244 0.40539 2.2462-0.57112 0.85291-0.81507 0.88994-0.94302 0.75232-2.5991-0.08383-1.0087-0.02936-1.7418 0.1295-1.7418 0.15082 0 0.20903 0.24932 0.12935 0.55404-0.07968 0.30472-0.0044 0.79204 0.16648 1.083 0.24809 0.42144 0.27386 0.32907 0.12684-0.45455-0.12644-0.67383-0.08568-0.92238 0.12938-0.78946 0.17265 0.10675 0.39554 0.0619 0.4953-0.0994 0.09976-0.16142-0.0537-0.30173-0.34103-0.31181-0.39126-0.0138-0.34116-0.0945 0.19954-0.32173 0.47039-0.19768 0.58737-0.35359 0.33572-0.44736-0.21244-0.0791-0.53083 5.8e-4 -0.70753 0.17733-0.58974 0.58974-1.8918 0.3722-2.3982-0.40069-0.3713-0.56668-0.71632-0.72197-1.6041-0.72197-0.73893 0-1.1886-0.15017-1.2972-0.43318-0.09147-0.23826-0.46331-0.43319-0.8264-0.43319-0.36309 0-0.73498-0.19493-0.82641-0.43318-0.09147-0.23826-0.41007-0.43318-0.70811-0.43318-0.90874 0-1.3849-0.87043-2.3511-4.2977-0.50967-1.8078-0.9949-3.4647-1.0783-3.682-0.09791-0.25508 0.05807-0.39516 0.4398-0.39516 0.79665 0 1.0474-0.4754 0.34732-0.65847-0.30827-0.08066-0.6079-0.0044-0.66585 0.16953-0.07357 0.2208-0.16806 0.21467-0.31329-0.0203-0.20907-0.3383 2.0279-1.9949 2.5061-1.8559 0.13093 0.03809 0.15765-0.0609 0.05938-0.21993-0.09823-0.159 0.01201-0.64955 0.24505-1.0901 0.3787-0.71589 0.44592-0.74422 0.63247-0.2665 0.12577 0.32208 0.06494 0.62339-0.15295 0.75808-0.22674 0.14012-0.25374 0.29027-0.07237 0.40238 0.15914 0.09834 0.36441-0.01681 0.45615-0.25585 0.22083-0.57545-0.11134-2.192-0.41221-2.0061-0.12958 0.08011-0.2283-0.38336-0.21938-1.0299 0.01943-1.4041 1.7435-4.5216 2.7557-4.9828 0.36163-0.16477 0.6575-0.46303 0.6575-0.66279 0-0.70068-0.3547-1.2768-0.78608-1.2768-0.38118 0-0.3841-0.0811-0.02347-0.64978 0.47528-0.74962 0.37489-1.1806-1.0931-4.6928-0.53108-1.2707-1.238-3.0251-1.5709-3.8986-0.80185-2.1041-2.0545-4.8327-3.4897-7.6014-0.9622-1.8562-1.1795-2.5768-1.2191-4.043-0.05697-2.11-0.84363-2.6448-1.0052-0.68339-0.12938 1.5704-0.6256 1.2069-1.3717-1.0051-0.95557-2.8328-1.1515-4.7192-0.58058-5.5905 0.82706-1.2623 2.0914-0.50318 1.6939 1.0169-0.12166 0.46523-0.07313 0.60641 0.15923 0.46283 0.22153-0.13692 0.34112 0.06702 0.35457 0.60462 0.0179 0.71354 0.05021 0.74167 0.26849 0.23363 0.3354-0.78052 0.35194-2.6704 0.0251-2.8724-0.14501-0.08962-0.35288-0.69103-0.46193-1.3365-0.14192-0.84001-0.31319-1.1294-0.6027-1.0183-0.22246 0.08535-0.40446 0.03179-0.40446-0.11902 0-0.15082 0.35737-0.35253 0.79417-0.44824 0.43679-0.09571 0.96602-0.22767 1.1761-0.29326 1.1034-0.34449 1.491 0.39772 1.4652 2.8057-0.0143 1.3387 0.10974 2.4665 0.29132 2.648 0.22917 0.22917 0.31627 0.17636 0.31627-0.19172 0-0.27939 0.12995-0.42766 0.28878-0.3295 0.15883 0.09812 0.2888-0.09834 0.2888-0.43677 0-0.54689 0.04814-0.56712 0.43318-0.18207 0.23825 0.23825 0.43319 0.57242 0.43319 0.7426 0 0.17017 0.09747 0.30866 0.21658 0.30774 0.11912-8.73e-4 0.22351-1.203 0.23196-2.6713 0.0087-1.5988 0.16394-2.9412 0.38577-3.3467 0.48452-0.8857-0.65324-0.61001-1.4584 0.35338-0.41703 0.49901-0.51366 0.52542-0.5215 0.14249-0.01539-0.75213 0.64765-1.1053 2.9169-1.5535 1.17-0.23113 2.4197-0.50282 2.7771-0.60377 0.35738-0.10094 0.64978-0.06442 0.64978 0.08117 0 0.36117-0.62456 0.9588-0.99633 0.95338-0.16677-0.0023-0.10828-0.1304 0.12996-0.28437 0.23825-0.15397 0.2924-0.28193 0.12032-0.28437-0.17207-0.0023-0.40441 0.08713-0.5163 0.19902-0.11189 0.11189-0.5559 0.24924-0.98669 0.30522-1.6062 0.20871-2.3567 3.5219-1.553 6.8554 0.27852 1.1552 0.27852 1.1552 0.30754-0.21659 0.01615-0.76158 0.16611-1.3717 0.33726-1.3717 0.1749 0 0.23852 0.2811 0.14706 0.64978-0.08863 0.35737-0.08634 0.48652 0.0055 0.28698 0.09157-0.19953 0.28526-0.28933 0.43052-0.19954 0.14526 0.08983 0.2661-0.07182 0.26854-0.35918 0.0022-0.29268 0.09769-0.39542 0.21659-0.23363 0.32187 0.43809 1.9058 0.54834 1.6373 0.11396-0.15264-0.247-0.03351-0.30163 0.40684-0.18649 0.59312 0.1551 0.6241 0.06462 0.65152-1.9038 0.04562-3.272 0.48618-3.9787 0.52-0.83402 0.05108 4.7477 2.9031 4 2.9486-0.77308 0.04246-4.4406-0.11419-5.8751-0.51853-4.7499-0.06527 0.18168-0.37238 0.26399-0.68243 0.18291-0.38944-0.10184-0.56373-0.0014-0.56373 0.32495 0 0.35965 0.17227 0.42913 0.72196 0.29116 0.82158-0.2062 1.0725 0.63141 0.28018 0.93543-0.27881 0.107-0.37817 0.36998-0.26932 0.71291 0.09485 0.29886 0.08994 0.80329-0.01091 1.121-0.21592 0.68028-1.0108 0.78042-1.0108 0.12735 0-0.27021 0.13508-0.36674 0.33786-0.24141 0.23036 0.14236 0.2763 0.04838 0.1444-0.29536-0.10642-0.2773-0.19348-0.6844-0.19348-0.90468 0-0.24015-0.1762-0.33288-0.44009-0.23162-0.35485 0.13617-0.41608-0.02466-0.31615-0.83045 0.06822-0.54963 0.0087-1.182-0.13306-1.4053-0.17411-0.27503-0.25843-0.01562-0.26143 0.80434-0.0065 1.7111-0.44745 1.775-1.1621 0.16826-0.45592-1.025-0.56748-1.6883-0.43498-2.5862 0.10893-0.73828 0.04475-1.4214-0.16517-1.7575-0.4341-0.69511 0.04606-2.2887 0.63879-2.12 0.21839 0.06213 0.96346 0.24969 1.6557 0.41679 1.2586 0.30383 1.2586 0.30383 1.1202 1.6198-0.07608 0.72376-0.07935 1.1535-0.0076 0.95495 0.07215-0.19854 0.51792-0.36098 0.99055-0.36098 0.50338 0 0.78489-0.12047 0.6796-0.29083-0.09889-0.15996 0.03089-0.37166 0.28837-0.47046 0.39515-0.15163 0.36779-0.23009-0.17548-0.50334-0.35398-0.17804-0.68195-0.45366-0.72883-0.6125-0.12197-0.41333 0.71429-1.4431 0.96684-1.1906 0.11617 0.11617 0.02117 0.32869-0.21119 0.47227-0.33641 0.20791-0.3494 0.33406-0.06385 0.61963 0.28556 0.28557 0.35856 0.25515 0.35856-0.14941 0-0.31431 0.12882-0.42837 0.33787-0.29917 0.2393 0.14789 0.2695 0.04754 0.10358-0.34394-0.12887-0.30401-0.28109-0.94262-0.33826-1.4191-0.10293-0.85778-0.1002-0.85652 0.27751 0.1275 0.30939 0.8061 0.4186 0.89712 0.57797 0.48176 0.29271-0.76278 0.23233-1.2559-0.09223-0.75366-0.16821 0.26028-0.28171 0.2959-0.28436 0.08924-0.0022-0.18917 0.12553-0.42426 0.28436-0.52242 0.49198-0.30406 0.31927-0.67745-0.35803-0.77408-0.84216-0.12015-1.0118-0.97954-0.23353-1.1831 0.49855-0.13037 0.59155-0.38598 0.59155-1.6257 0-0.84278 0.13062-1.471 0.30583-1.471 0.16821 0 0.22255 0.13476 0.12076 0.29946-0.10184 0.1647-0.09288 1.2827 0.01965 2.4845 0.12149 1.2965 0.2992 2.0322 0.43701 1.8093 0.45035-0.72868-0.1062 2.217-0.77149 4.0838-0.81516 2.2871-1.0865 3.8473-0.84 4.8296 0.29199 1.1634 1.0317 0.1712 1.2609-1.6912 0.16328-1.3269 0.28743-1.5611 0.90473-1.7066 0.65013-0.15325 0.7062-0.2863 0.61387-1.4567-0.05588-0.70843-0.1202-1.9378-0.14294-2.732-0.0227-0.79417-0.15662-1.6265-0.29751-1.8495-0.17599-0.27865-0.15181-0.34111 0.07728-0.19955 0.18337 0.11333 0.34998 0.10092 0.37026-0.02758 0.16128-1.0224 0.13683-1.5702-0.07597-1.7017-0.32883-0.20323-0.32122-0.69781 0.01091-0.69781 0.14324 0 0.53091 0.42235 0.8615 0.93856 0.33059 0.51621 0.60326 0.79058 0.60594 0.60972 0.0022-0.18086 0.43782-0.41007 0.96699-0.50934 1.2633-0.23699 2.5032-1.5764 1.8156-1.9612-0.28117-0.15735-0.46741-0.63558-0.46741-1.2002 0-0.51626-0.12127-1.0621-0.26949-1.213-0.4782-0.48682-0.49178-2.5527-0.01932-2.9365 0.65809-0.53445-0.04682-0.46026-1.9361 0.20375-0.89809 0.31566-1.6801 0.5267-1.7378 0.46898-0.20537-0.20537 1.9852-1.3319 2.6075-1.3409 0.62772-0.0091 0.62821-0.01305 0.05567-0.45222-0.5514-0.42295-0.5383-0.43533 0.28878-0.27296 0.77357 0.15186 0.79475 0.13869 0.19773-0.12302-0.69693-0.30551-1.6301 0.02947-3.2476 1.1658-1.7315 1.2164-3.8227-0.22731-3.0614-2.1136 0.08011-0.1984 0.16497-0.03584 0.18867 0.36124 0.04028 0.67473 0.06101 0.68418 0.31751 0.14439 0.25896-0.54504 0.26768-0.54173 0.15464 0.05878-0.20438 1.0858 0.50976 1.7633 1.3177 1.25 0.36706-0.2332 1.5121-0.84984 2.5445-1.3703 1.7419-0.87811 1.7991-0.93612 0.79416-0.80493-1.332 0.1739-1.4073-0.03409-0.14439-0.39875 0.93857-0.271 0.93857-0.271 0.07215-0.30147-0.67015-0.02357-0.76825-0.09387-0.43318-0.31041 0.23825-0.15397 0.29154-0.28194 0.11842-0.28437-0.46367-0.0065-0.93836-1.8575-1.1491-4.4806-0.10205-1.2707-0.3343-2.403-0.51602-2.5163-0.18173-0.11332-0.33773-0.84157-0.34667-1.6183-0.01506-1.3133-0.12446-1.5205-1.56-2.956-0.86401-0.86401-1.3916-1.5944-1.1983-1.6589 0.33662-0.11221 1.7638 1.2045 1.7638 1.6273 0 0.11661 0.2599 0.21203 0.57757 0.21203 0.68555 0 0.80138-0.96364 0.14605-1.2151-0.23733-0.09107-0.34744-0.30164-0.24467-0.46793 0.10282-0.16628-0.0076-0.44507-0.24531-0.61951-0.23769-0.17445-0.5033-0.95053-0.59025-1.7246-0.08699-0.7741-0.28281-1.4889-0.43527-1.5883-0.632-0.41238-0.60312-1.769 0.03777-1.7736 0.47047-0.0034 0.51659-0.063382 0.20192-0.26257-0.33012-0.20897-0.30261-0.28372 0.14439-0.39239 0.3037-0.073839 0.12983-0.093802-0.38637-0.04438-0.51621 0.049422-0.93856-0.031915-0.93856-0.18076 0-0.14885 0.12995-0.27063 0.28878-0.27063 0.15883 0 0.28878-0.14304 0.28878-0.31787 0-0.19829-0.47528-0.27977-1.2635-0.21659-1.6411 0.13154-1.647-0.60789-0.0087-1.1023 5.5531-1.6759 9.3381 2.3668 11.536 12.322 0.22798 1.0324 0.68915 3.0467 1.0248 4.4762 0.38928 1.6578 0.66537 4.0386 0.76232 6.5738 0.152 3.9747 0.152 3.9747 0.90903 4.1394 0.41636 0.09058 0.91946 0.21474 1.118 0.2759 0.67015 0.20645 0.59182-1.2574-0.64208-12-0.53828-4.6857-1.1284-10.339-1.3115-12.562-0.18307-2.2237-0.46051-4.5435-0.6165-5.1551-0.44705-1.7528-0.61501-3.6102-0.37615-4.1598 0.12046-0.27716 0.23158-0.63388 0.24694-0.79272 0.062-0.64159 0.63055-0.46342 1.0239 0.32088 0.26724 0.53285 0.49785 2.3472 0.63824 5.0217 0.50548 9.6285 2.79 27.897 3.6081 28.852 0.41957 0.49001 1.9407 0.57865 2.3911 0.13933 0.37795-0.36864-1.6929-15.606-2.5664-18.884-0.88083-3.3054-0.71993-4.9094 0.49248-4.9094 0.65774 0 1.2271 1.8879 1.2271 4.0691 0 1.9243-0.03471 2.0393-0.50538 1.6748-0.42581-0.32974-0.42029-0.29154 0.03504 0.24267 0.29899 0.35081 0.46173 0.83906 0.36429 1.093-0.09681 0.25242-0.06603 0.3909 0.06855 0.30774 0.13455-0.08316 0.33259 0.91724 0.44009 2.2231 0.10751 1.3059 0.51574 4.6202 0.90721 7.3651 0.39146 2.7449 0.71175 5.3678 0.71175 5.8285 0 0.58407 0.17488 0.8932 0.57758 1.021 0.42017 0.13335 0.57757 0.43695 0.57757 1.1139 0 1.2633 0.80133 4.2541 1.2855 4.7978 0.54273 0.60947 1.8086 6.5451 2.0496 9.6107 0.20164 2.5646 0.31418 2.758 1.2986 2.2311 0.92086-0.49283 2.0261-0.02132 2.4764 1.0565 1.074 2.5705 1.8839 11.263 1.2171 13.064-1.126 3.0422-1.4772 21.858-0.41551 22.264 3.8858 1.4867 1.984 8.6662-2.1867 8.2552-2.2576-0.22246-3.7292 0.34729-5.1877 2.0084-0.47079 0.53619-1.4338 1.34-2.1401 1.7861-1.9702 1.2447-1.7446 3.4414 0.4199 4.0899 1.0862 0.32543 1.1828 0.43539 1.1828 1.3463 0 1.0902-0.24997 1.0367 2.6574 0.56875 0.50858-0.0819 1.2167-0.42318 1.5736-0.75851 1.0147-0.95326 1.2965-0.58761 2.9562 3.8359 0.97187 2.5903 1.8933 4.544 2.4547 5.205 3.5416 4.1694 8.5844 18.31 6.9535 19.498-1.1242 0.81894 0.20938 4.0726 1.4395 3.512 0.89736-0.40887 0.67947-0.73027 2.0869 3.0783 0.64564 1.7472 1.4746 3.8547 1.8421 4.6834 0.64211 1.4479 0.64816 1.5288 0.15486 2.0739-0.49667 0.54882-0.46888 0.63574 0.85697 2.6808 3.624 5.5897 5.5887 10.202 8.4666 19.874 5.0804 17.075 5.1644 17.325 6.2258 18.5 1.0385 1.1496 1.5078 2.6539 1.2047 3.8618-0.09747 0.38839-0.05534 0.78151 0.09365 0.8736 0.45432 0.28079 1.2061 3.2935 1.4782 5.9241 0.20022 1.9353 0.50049 3.001 1.3486 4.7867 2.5668 5.4042 1.3794 7.7832-3.5073 7.0268zm-92.723-14.573c0-0.30443 0.12996-0.64899 0.2888-0.76568 0.19253-0.14144 0.19253-0.21058 0-0.2074-0.61162 0.01-1.3686 0.83374-1.1912 1.2961 0.23828 0.62098 0.90243 0.38328 0.90243-0.32299zm3.6208-3.1658c0.20373-0.24547 0.55128-0.37691 0.77233-0.29209 0.22105 0.0848 0.32251 0.0258 0.22548-0.13125-0.097033-0.15701-0.26623-0.28259-0.37599-0.27906-0.35658 0.0115-1.6536 1.1357-1.3179 1.1423 0.17909 3e-3 0.49231-0.19442 0.69604-0.43991zm5.608-4.344c1.5553-1.5678 1.9064-2.1406 1.312-2.1406-0.15883 0-0.2888-0.22093-0.2888-0.49094 0-0.37186-0.0811-0.40985-0.3343-0.15664-0.25322 0.25323-0.24464 0.44236 0.03536 0.77974 0.20331 0.24498 0.2994 0.44542 0.21353 0.44542-0.0859 0-0.39419 0.0773-0.68514 0.17164-0.44179 0.14334-0.45758 0.11954-0.09583-0.1444 0.36362-0.26528 0.36927-0.35722 0.03526-0.57253-0.23847-0.1537-0.30661-0.41413-0.17002-0.64977 0.30903-0.53314-1.2354 0.80012-2.3812 2.0556-1.1082 1.2142-1.1592 1.549-0.29962 1.9636 0.96337 0.46463 0.93209 0.47946 2.6588-1.2612zm-0.29335-40.107c-0.30831-0.2332-0.69053-0.424-0.84936-0.424-0.15883 0-0.03656 0.1908 0.27179 0.424 0.30831 0.23319 0.69053 0.42399 0.84936 0.42399 0.15883 0 0.03656-0.1908-0.27179-0.42399zm1.0826-1.4531c-0.06494-0.55592 6.6e-5 -1.0108 0.14436-1.0108 0.1443 0 0.42641-0.45364 0.62689-1.0081 0.2005-0.55444 0.80261-1.659 1.338-2.4547 0.9735-1.4466 0.9735-1.4466 0.25242-1.4466-1.8469 0-4.2285 6.0959-2.6331 6.7397 0.19854 0.0801 0.36738 0.15592 0.3752 0.16846 0.0076 0.0126-0.03886-0.43204-0.1038-0.98796zm-1.1522-1.6461c-0.1853-0.1853-0.43278-0.24104-0.54996-0.12387s-0.02565 0.32887 0.20341 0.47042c0.53935 0.33333 0.78289 0.0898 0.34655-0.34655zm61.659-3.1079c-0.17756-0.47044-0.37681-0.80137-0.44277-0.73542-0.20608 0.20609 0.23561 1.5908 0.50743 1.5908 0.14201 0 0.11291-0.38491-0.06462-0.85535zm2.7116-1.1086c-0.17441-0.0582-0.3171-0.26496-0.3171-0.45962s-0.19665-0.60619-0.43702-0.9145c-0.30891-0.39625-0.26658-0.11301 0.14439 0.96626 0.31978 0.83976 0.59912 1.6195 0.62074 1.7327 0.02161 0.11324 0.09932-0.11475 0.1727-0.50663 0.07335-0.3919-0.0098-0.76011-0.18372-0.81824zm-55.407-8.1691c0.29839-0.20523-0.16943-0.5929-1.4852-1.2307-1.2448-0.60344-1.35-0.59824-2.0493 0.10107-0.31767 0.31768-0.57758 0.455-0.57758 0.30517s0.28883-0.47472 0.64184-0.72197c0.3681-0.25783 0.47405-0.44956 0.24843-0.44956-0.44053 0-1.1558 0.82765-1.1699 1.3537-0.02216 0.82721 3.2748 2.0837 3.7283 1.4208 0.22904-0.33476 0.52759-0.68509 0.66344-0.77854zm0.79724-1.1417c0-0.16548 0.25036-0.56959 0.55636-0.89804 0.30949-0.33222 0.47946-0.79758 0.38304-1.0488-0.12552-0.3271-0.04584-0.40273 0.28889-0.27428 0.4822 0.18503 1.3023-0.53065 0.97877-0.85417-0.10205-0.10205-0.18555-0.0339-0.18555 0.15137 0 0.18531-0.12995 0.33692-0.28878 0.33692s-0.28878-0.25991-0.28878-0.57757c0-0.33192 0.19253-0.57758 0.45264-0.57758 0.3146 0 0.39909-0.16875 0.27704-0.55328-0.0966-0.3043-0.04039-0.63685 0.12493-0.73901 0.16529-0.10216 0.30054-0.0481 0.30054 0.12009 0 0.16821 0.13565 0.30583 0.30145 0.30583 0.1658 0 0.26327-0.22742 0.21659-0.50538-0.06538-0.38927 0.09758-0.49289 0.70931-0.45101 1.0012 0.0686 1.0413-0.41451 0.05501-0.66207-0.47406-0.11898-0.68378-0.32994-0.58469-0.58818 0.17041-0.44408-0.6708-2.414-1.0309-2.414-0.12443 0-0.15143 0.19493-0.06003 0.43318 0.09147 0.23825 0.02336 0.43319-0.15126 0.43319-0.39646 0-1.7658 1.1709-1.7658 1.5099 0 0.13781-0.32003 0.53672-0.71119 0.88648-0.39116 0.34975-0.74853 0.82577-0.79417 1.0578-0.12205 0.62056-0.62135 1.1296-0.92622 0.94435-0.14668-0.0892-0.1805 0.0605-0.07553 0.33411 0.10456 0.27255 0.0764 0.42526-0.06254 0.33934-0.3493-0.21588-0.98841 0.60906-0.7592 0.97993 0.10249 0.16579 0.07029 0.30144-0.07138 0.30144-0.14173 0-0.2577 0.20052-0.2577 0.44561 0 0.26105 0.1657 0.38203 0.40005 0.2921 0.2206-0.0847 0.32034-0.0246 0.22236 0.134-0.09769 0.15813 0.05796 0.36118 0.34598 0.45122 0.28803 0.09 0.84857 0.34557 1.2457 0.56785 0.87179 0.48802 1.1552 0.51713 1.1552 0.11866zm7.1308-5.9224c0.36604-0.36604 0.34341-0.41892-0.17928-0.41892-0.32902 0-0.59821 0.13415-0.59821 0.2981s-0.2924 0.42684-0.64977 0.58421c-0.57714 0.25414-0.5571 0.26766 0.17928 0.12083 0.45599-0.0909 1.0176-0.3538 1.248-0.58422zm-1.2487-1.0368c0.52141 9e-3 0.52177-3e-3 0.01092-0.37702-0.46826-0.3424-0.48097-0.44787-0.11134-0.9232 0.39012-0.50167 0.37531-0.5008-0.2275 0.0135-0.35463 0.30257-0.64479 0.44018-0.64479 0.30578 0-0.31539-0.84502 0.79569-0.85719 1.1271-0.0055 0.13764 0.28322 0.15893 0.64059 0.0473 0.35737-0.11164 0.89257-0.19868 1.1893-0.19346zm0.83931-4.0748c1.3935-1.5281 1.9014-1.9098 2.3517-1.7668 0.5223 0.16578 0.53319 0.14114 0.12022-0.27183-0.56649-0.56649-1.7191-0.33601-1.4768 0.29531 0.12866 0.33528 0.02805 0.3936-0.42886 0.24858-0.33758-0.10718-0.68593-0.0455-0.80175 0.14191-0.15128 0.24477-0.26272 0.23765-0.42644-0.0273-0.15752-0.25487-0.32669-0.15934-0.58472 0.33015-0.19968 0.37885-0.50604 0.78427-0.68081 0.90097-0.22376 0.14941-0.22522 0.21347-0.0055 0.21658 0.17207 2e-3 0.40325-0.086 0.51374-0.19646 0.31038-0.31038 1.0744-0.36017 0.88756-0.0578-0.09114 0.14749-0.30879 0.17973-0.48364 0.0717-0.19542-0.12079-0.25578-0.0346-0.15665 0.22375 0.1106 0.28821-0.05545 0.43817-0.5285 0.47732-0.37938 0.0314-0.68976-0.092-0.68976-0.27423 0-0.18221-0.29493-0.0183-0.65539 0.36423-0.36892 0.39152-0.53559 0.78009-0.3813 0.88901 0.33493 0.23647 0.45612 1.4271 0.12439 1.222-0.12993-0.0803-0.15104 0.076-0.04693 0.34738 0.163 0.42478 0.28539 0.37668 0.8804-0.34599 0.3801-0.46165 1.4909-1.7165 2.4684-2.7885zm1.3868 0.64956c0.14664 0 0.26663 0.12997 0.26663 0.2888s0.14586 0.28878 0.32415 0.28878c0.23842 0 0.23909-0.10249 0.0022-0.38755-0.39693-0.47828-0.14325-0.7768 0.49574-0.58337 0.26242 0.0795 0.15226-0.0549-0.24482-0.29844-0.92767-0.56909-1.3251-0.58293-0.86636-0.0301 0.29753 0.35849 0.26629 0.43592-0.18124 0.44915-0.2974 9e-3 -0.86502 0.43114-1.2614 0.93857-0.72065 0.92257-0.72065 0.92257 0.23874 0.12841 0.52767-0.43679 1.0794-0.79417 1.226-0.79417zm1.9994-1.4103c0-0.14032-0.32603-0.31745-0.72449-0.39361-0.58641-0.11211-0.66224-0.0635-0.39782 0.25511 0.36493 0.43972 1.1223 0.53318 1.1223 0.1385zm2.8583-4.0045c0.64121-0.61858 1.6047-2.0937 1.3676-2.0937-0.30962 0-2.2044 1.9651-2.2044 2.2862 0 0.44315 0.23358 0.38942 0.83682-0.19252zm5.8009-1.9253c0.0055-1.1171-0.16086-0.87401-0.3797 0.55352-0.1206 0.78664-0.08896 1.017 0.09911 0.72196 0.1519-0.23825 0.27818-0.81222 0.2806-1.2755zm-2.9123-3.5788c0.01583-0.36675-0.09551-0.59002-0.2474-0.49614-0.15189 0.0939-0.19479 0.38278-0.09529 0.642 0.13061 0.34036 0.07455 0.40563-0.20162 0.23492-0.24359-0.15055-0.31319-0.12427-0.19168 0.0724 0.10489 0.1698 0.03296 0.36134-0.15988 0.42563-0.25993 0.0867-0.2417 0.23494 0.0704 0.57294 0.46529 0.5039 0.76372-0.0209 0.82549-1.4517zm-7.0396-2.3437c-0.13359-0.4209-0.01561-0.58661 0.48592-0.68264 0.41797-0.08 0.25651-0.14131-0.43766-0.16613-1.1084-0.0396-1.1545 0.0784-0.40801 1.0436 0.4068 0.52598 0.56188 0.44198 0.35975-0.19487zm-1.3568-1.5881c0.07247-0.61592 0.2169-0.76774 0.62816-0.6602 0.31691 0.0828 0.49126 7e-3 0.42874-0.18863-0.74108-2.3094-0.04824-3.6646 1.1701-2.2887 0.58833 0.66446 0.58833 0.66446 0.63349-0.46768 0.05021-1.2584 0.31526-1.2235-2.5214-0.33237-0.39708 0.12473-0.68755 0.38033-0.64547 0.56795 0.25339 1.13 0.03798 2.696-0.41063 2.986-0.41575 0.26865-0.14554 1.4354 0.2987 1.2898 0.17833-0.0585 0.36655-0.4662 0.4183-0.90612zm8.8826-1.7956c-0.14035-0.36574-0.0955-0.40234 0.19622-0.16022 0.29196 0.24231 0.39086 0.15972 0.43408-0.36246 0.04159-0.50241-0.12817-0.72248-0.66029-0.85604-0.39395-0.0989-0.71626-0.35235-0.71626-0.56327 0-1.1301-1.7842-1.876-2.8749-1.2019-0.27047 0.16716-0.32381 0.13292-0.17302-0.11106 0.13356-0.21612 0.06702-0.332-0.17197-0.2992-0.66448 0.0912-1.1135-5e-3 -1.0777-0.23149 0.01877-0.11912 0.01332-0.28156-0.01222-0.36099-0.24199-0.75302-0.16412-5.2038 0.09288-5.3099 0.17505-0.07226-0.04672-0.14168-0.49285-0.15423-0.81114-0.02281-0.81114-0.02281-0.72939 2.7207 0.05927 1.989 0.18304 2.7435 0.45014 2.7435 0.35609 0 0.4853 0.49479 0.38839 1.4874-0.02554 0.2621 0.21886 0.91189 0.54324 1.4439 0.38668 0.63425 0.59014 0.79334 0.59085 0.46199 5.67e-4 -0.27795 0.13103-0.50538 0.28986-0.50538s0.28878 0.12996 0.28878 0.28879c0 0.66832 0.83472 0.21748 1.1218-0.60586 0.3006-0.86233 1.7661 0.0465 1.7661 1.0952 0 0.26142 0.58865 0.95463 0.81063 0.95463 0.06462 0 0.03569-0.21332-0.0644-0.47403zm2.6682-1.066c0.05523-0.28496-0.09201-0.48145-0.36099-0.48145-0.26788 0-0.45435 0.24691-0.45435 0.60165 0 0.70378 0.67483 0.60431 0.81534-0.1202zm-13.79-0.77024c0.30602 0 0.55641-0.11778 0.55641-0.26175 0-0.14396-0.24054-0.19885-0.53453-0.12197-0.29398 0.0768-0.74882-0.0746-1.0108-0.33645-0.56934-0.56934-0.578-0.51791-0.12633 0.74928 0.24214 0.6793 0.38208 0.82599 0.45436 0.47627 0.05741-0.27795 0.35483-0.50538 0.66085-0.50538zm3.5887-1.1552c0.09812-0.15883-0.08907-0.28879-0.41614-0.28879-0.32704 0-0.59462 0.12996-0.59462 0.28879 0 0.15884 0.18727 0.28879 0.41614 0.28879s0.49645-0.12995 0.59462-0.28879zm6.3454-1.1913c-0.13781-0.62745-0.10074-0.84228 0.12146-0.70493 0.17582 0.10871 0.31966 0.44214 0.31966 0.74105 0 0.29893 0.10642 0.60928 0.23654 0.68968 0.13009 0.0804 0.17787-0.25348 0.1062-0.74195-0.08121-0.55357-0.33355-0.94128-0.66971-1.0292-0.29665-0.0776-0.53937-0.26352-0.53937-0.4132 0-0.14968 0.12995-0.19183 0.28878-0.0936 0.50022 0.30915 0.31654-1.3667-0.21659-1.9762-0.27796-0.31776-0.3577-0.4919-0.17722-0.38697 0.18675 0.1086 0.39288-0.05665 0.47834-0.38354 0.11359-0.43433 0.0065-0.57433-0.43766-0.57433-0.6426 0-0.57604 2.9482 0.11106 4.9192 0.39278 1.1267 0.62979 1.098 0.37854-0.046zm-7.0674 0.30845c0.3577-0.24476 0.33368-0.28172-0.13791-0.21216-0.40827 0.0602-0.5692-0.0804-0.56445-0.49334 0.0033-0.31767 0.1307-0.55753 0.2823-0.53303 0.41153 0.0665 1.0364-0.70848 0.72592-0.90036-0.14627-0.09037-0.34758-0.03231-0.44734 0.12913-0.23429 0.37907-1.3025 0.38295-1.3025 0.0044 0-0.37257-1.3549-0.37766-1.5846-0.0055-0.32758 0.53003 0.43944 1.5147 1.0546 1.3538 0.39868-0.10424 0.53037-0.0325 0.42835 0.23333-0.28053 0.73107 0.70264 1.0007 1.5456 0.42389zm23.376-6.4386c0.2213-0.58207 2.3549-2.2662 3.2483-2.564 0.29606-0.09867 0.81512-4.4969 0.88679-7.5142 0.0525-2.2122-0.15949-2.3833-2.458-1.983-1.0189 0.17743-2.413 0.3226-3.0981 0.3226-1.4556 0-1.4669 0.35731-0.25792 8.1583 0.66602 4.2975 1.0748 5.1693 1.679 3.5804zm-17.735-2.1516c-0.17113-0.17113-1.0226 1.7751-1.0133 2.3162 0.0033 0.20365 0.26571-0.20139 0.58271-0.90009 0.317-0.69869 0.51078-1.3359 0.43062-1.4161zm-7.5664-0.29168c-0.22644-0.22644-0.49922-0.3242-0.60619-0.21724-0.10696 0.10696-0.03144 0.29527 0.16792 0.41845 0.21238 0.13125 0.2825 0.45353 0.16938 0.77847-0.18782 0.53954-0.18124 0.53936 0.24378-0.0065 0.37814-0.48586 0.38152-0.61652 0.0251-0.97294zm12.9-1.5449c0-0.85498 0-0.85498-1.3717-0.65588-1.6519 0.23974-1.6271 0.22134-1.4183 1.0532 0.28726 1.1446 2.79 0.78813 2.79-0.39734zm2.1369-3.7797c-0.36004-3.733-0.1175-3.462-2.9979-3.3491-3.096 0.12138-2.9482-0.01484-2.7143 2.5025 0.19085 2.0534 0.19085 2.0534 2.8216 2.1482 1.4469 0.05217 2.7221 0.12173 2.8338 0.1547 0.11164 0.03296 0.13718-0.62233 0.05676-1.4562zm-7.6293-2.0215c0.03122-1.2324-0.01583-1.3454-0.48528-1.1653-0.30697 0.11779-0.36105 0.23157-0.14439 0.30378 0.19051 0.06352 0.34638 0.23459 0.34638 0.38018 0 0.3992-0.79963 0.31773-0.94489-0.09627-0.06964-0.19854-0.12923-0.01921-0.13236 0.39856-0.0055 0.7165 1.3424 0.89385 1.3605 0.17902zm25.414-0.86636c0.0022-0.27796-0.12553-0.50538-0.28436-0.50538-0.15883 0-0.2868 0.42235-0.28436 0.93856 0.0033 0.71222 0.07193 0.8341 0.28436 0.50538 0.15396-0.23825 0.28193-0.6606 0.28436-0.93856zm-27.093-1.0574c0.02761-0.7057 0.28184-1.5227 0.59934-1.9263 0.48438-0.61578 0.50902-0.83227 0.20294-1.7826-0.49988-1.552-0.78469-1.8036-2.0412-1.8036-1.0662 0-1.454 0.33694-0.83101 0.72196 0.15883 0.09812 0.2888 0.77185 0.2888 1.4971 0 1.1598 1.3282 4.9239 1.6307 4.6214 0.05632-0.05632 0.12407-0.65391 0.15048-1.3279zm26.818-4.8269c-0.55263-4.6627-0.57736-4.7542-1.1955-4.4234-0.7038 0.37666-0.80449 3.7419-0.12874 4.3027 0.22989 0.19079 0.63852 0.92436 0.90806 1.6301 0.67996 1.7805 0.76822 1.4604 0.41623-1.5094zm-29.577-1.4798c-0.08252-0.27796-0.21976-1.601-0.30495-2.9401-0.08513-1.3391-0.23847-2.8803-0.34064-3.4249-0.12957-0.69068-0.06505-1.0697 0.2133-1.2529 0.33372-0.21965 0.32421-0.32085-0.05807-0.61815-0.34026-0.2646-0.44575-0.81703-0.41257-2.1604 0.02456-0.9927-0.06221-1.8049-0.19262-1.8049-0.58839 0 0.05512 9.8655 0.79572 12.199 0.20999 0.66165 0.49631 0.6639 0.29986 0.0022zm12.673-7.8695c-0.09812-0.15883-1.113-0.26538-2.2551-0.23676-2.0767 0.05206-2.0767 0.05206 0.08928 0.23676 1.1912 0.10162 2.2061 0.20814 2.2551 0.23675 0.04912 0.0286 0.0087-0.07793-0.08928-0.23675zm-14.295-2.5991c0-2.5991 0-2.5991-0.86636-2.5991-1.0485 0-1.0441-0.14685-0.08492 2.7985 0.965 2.9632 0.95123 2.9661 0.95123-0.19939zm12.865-1.3989c1.1136-0.20147 2.3867-0.96044 2.5299-1.5083 0.18336-0.70113 0.04126-0.70186-0.70813-0.0033-0.3274 0.305-1.2432 0.64368-2.0351 0.7526-1.2928 0.17779-1.4229 0.26128-1.2737 0.81717 0.09136 0.34053 0.18065 1.074 0.19841 1.6299 0.03231 1.0108 0.03231 1.0108 0.37842-0.28743 0.24058-0.9024 0.51809-1.3293 0.91021-1.4002zm-2.1798 0.0098c-2.84e-4 -0.39566-0.30172-0.49408-1.5883-0.51863-0.87338-0.0167-1.588 0.0656-1.588 0.18291 0 0.25592 1.0482 0.55994 1.9493 0.56541 0.35737 0.0022 0.64977 0.14157 0.64977 0.30977 0 0.16821 0.12996 0.22551 0.2888 0.12736 0.15883-0.09813 0.28862-0.39824 0.28841-0.66682zm-8.3745-0.29548c0-0.81472 1.9647-1.3445 2.6583-0.71682 0.28508 0.258 0.51834 0.32667 0.51834 0.15259 0-0.17407-0.12995-0.39682-0.28878-0.49499-0.57591-0.35592-0.28376-0.78331 0.41548-0.60781 0.9405 0.23604 1.0268 0.0087 0.67405-1.775-0.62146-3.143-5.6173-1.9889-5.9217 1.3681-0.1725 1.9023 0.04137 2.2687 0.46601 0.79819 0.27099-0.93857 0.27099-0.93857 0.29705 0.26472 0.02325 1.0759 0.25658 1.4429 0.96461 1.5174 0.11912 0.01255 0.21658-0.21531 0.21658-0.50632zm4.7415-0.72743c-0.09976-0.26008-0.3041-0.39706-0.454-0.30441-0.1625 0.10042-0.13366 0.33579 0.07138 0.5829 0.42247 0.50904 0.62752 0.35978 0.3826-0.27848zm3.349-1.5591c0.0033-0.80555 0.07619-0.972 0.28436-0.64978 0.20378 0.31533 0.2817 0.07968 0.28642-0.86636 0.0033-0.71475 0.08874-2.17 0.18919-3.234 0.17302-1.8319 0.15101-1.932-0.41523-1.8894-0.32886 0.02478-0.53508 0.14675-0.45825 0.27105 0.07684 0.1243 0.04748 1.3622-0.06516 2.7508-0.16527 2.0369-0.26097 2.3991-0.49517 1.8742-0.19814-0.44405-0.18984-0.97795 0.02609-1.6816 0.41218-1.343 0.19596-2.0168-0.44232-1.3786-0.26149 0.26149-0.33688 0.5322-0.17888 0.64235 0.2275 0.15859 0.32795 3.0667 0.11381 3.2949-0.48021 0.51166-0.13909 1.9493 0.46254 1.9493 0.60192 0 0.68874-0.13575 0.6926-1.0829zm2.3411-0.36099c0.13946 0 0.25356 0.17978 0.25356 0.39949 0 0.44102 0.93821 0.78939 1.3565 0.50366 0.14589-0.09965 0.2374-0.83097 0.20336-1.6251-0.08393-1.9599-0.07804-1.9346-0.40467-1.7327-0.15883 0.09813-0.28878-0.02008-0.28878-0.26269 0-0.24264 0.16256-0.37878 0.36123-0.30254 0.61243 0.23501 1.2421-1.8144 1.113-3.6222-0.02139-0.2985-0.24195-0.18786-0.70957 0.35586-0.37323 0.43397-0.76295 0.70471-0.86602 0.60164-0.28821-0.28821-0.22204-0.72421 0.08143-0.53665 0.28361 0.17528 0.75251-0.36214 0.51938-0.59527-0.56306-0.56306-1.658 0.64505-1.705 1.8813-0.05043 1.3254-0.05043 1.3254-0.161 0.09804-0.18139-2.014-0.65472-1.3903-0.65742 0.86637-0.0011 1.1515-0.07236 2.8085-0.15774 3.682-0.15008 1.5355-0.13921 1.5667 0.32652 0.93856 0.26497-0.35737 0.59587-0.64977 0.73533-0.64977zm-0.32402-2.1659c0-0.39708 0.04977-0.72197 0.11073-0.72197 0.0609 0 0.17283 0.32489 0.24874 0.72197 0.07586 0.39708 0.02609 0.72197-0.11073 0.72197-0.13681 0-0.24874-0.32489-0.24874-0.72197zm2.1873-2.6474c-0.10162-0.26481-0.05054-0.61569 0.11349-0.77973 0.20516-0.20515 0.29826-0.05485 0.29826 0.48147 0 0.89087-0.14425 0.99536-0.41175 0.29826zm6.1352 3.8847c-0.42077-3.0766-5.1845-3.5898-5.1256-0.55217 0.0263 1.3584 0.5061 2.6169 0.53699 1.4086 0.02816-1.1033 2.3107-1.243 2.3594-0.14439 0.0274 0.61888 0.03831 0.6156 0.22893-0.06931 0.14192-0.50992 0.26699-0.61089 0.42999-0.34716 0.12642 0.20454 0.15744 0.56061 0.06898 0.79126-0.1975 0.51467 0.15494 0.54648 0.64667 0.05839 0.29158-0.28943 0.32551-0.26081 0.17125 0.1444-0.14233 0.37383-0.0465 0.50538 0.36827 0.50538 0.52124 0 0.54342-0.12627 0.31521-1.795zm-2.258-0.23585c0-0.15371-0.51982-0.27949-1.1551-0.27949-0.63534 0-1.1552-0.12995-1.1552-0.28878 0-0.15883 0.26399-0.2888 0.58664-0.2888s0.66145-0.19493 0.75287-0.43318c0.09147-0.23825 0.35493-0.43319 0.58556-0.43319 0.23063 0 0.34549 0.11948 0.25523 0.26552-0.09027 0.14603 0.04126 0.47091 0.29238 0.72196 0.50231 0.50232 1.1321 0.6268 0.84839 0.16768-0.09813-0.15883-0.03002-0.2888 0.15142-0.2888 0.18144 0 0.27989 0.15004 0.21876 0.3334-0.14366 0.43102-1.3809 0.90019-1.3809 0.52366zm-12.567-2.0569c0.17297-0.16033-0.36305-0.242-1.3717-0.20905-1.0829 0.03536-1.6556 0.17627-1.6556 0.40725 0 0.40811 2.5536 0.24091 3.0274-0.1982zm-14.926-0.20177c0.29925-0.18983 0.28471-0.31231-0.07215-0.60852-0.24577-0.20396-0.44685-0.30058-0.44685-0.21472 0 0.0859-0.07891 0.3617-0.17529 0.61293-0.19066 0.49688 0.1026 0.58569 0.69435 0.21031zm28.071-0.65265c0-0.21652-0.4162-0.25917-1.2739-0.13054-0.78304 0.11742-1.346 0.07444-1.461-0.1116-0.18291-0.29595 0.35192-0.42061 1.3632-0.31775 0.31305 0.03184 0.50706-0.14782 0.5098-0.47212 0.0033-0.43512 0.04977-0.45179 0.27309-0.09871 0.38884 0.61486 0.50125 0.3537 0.64898-1.5078 0.12315-1.5518-0.08481-2.1309-0.46659-1.2995-0.09114 0.19854-0.09321 0.06859-0.0044-0.28879 0.09147-0.36868 0.02783-0.64977-0.14706-0.64977-0.16954 0-0.30825 0.12995-0.30825 0.28879s-0.2029 0.28879-0.45088 0.28879c-0.37072 0-0.41623-0.23104-0.256-1.2995 0.12268-0.81815 0.08579-1.2995-0.09965-1.2995-0.162 0-0.2399 0.2924-0.1731 0.64977 0.0668 0.35738-0.05414 0.1958-0.26874-0.35906-0.3902-1.0088-0.3902-1.0088-0.6125 1.0108-0.62925 5.7164-0.58999 5.9182 1.1511 5.9182 0.96534 0 1.5761-0.12461 1.5761-0.32157zm1.1736-2.9018c-0.23667-0.59057-0.27178-0.5304-0.28012 0.47993-0.0076 0.88082 0.05698 1.0412 0.27059 0.67522 0.1766-0.30256 0.18012-0.72948 0.0098-1.1552zm8.0898 1.2128c0.09158-6e-3 0.10936-0.40077 0.0394-0.87727-0.0763-0.52005 0.0011-0.86636 0.19442-0.86636 0.17686 0 0.32156-0.19493 0.32156-0.43318 0-0.23825-0.23392-0.43318-0.51982-0.43318s-0.67576-0.15594-0.86636-0.34655c-0.26953-0.26953-0.34655-0.17928-0.34655 0.40615 0 0.61051-0.10915 0.72416-0.57758 0.60165-0.50984-0.13333-0.57757-0.0088-0.57757 1.0614 0 1.2124 0 1.2124 1.083 1.0553 0.59562-0.08638 1.1579-0.16196 1.2495-0.16795zm4.815-0.15669c1.4572-0.29328 1.1696-1.4426-0.36099-1.4426-1.1405 0-1.4207-1.155-0.38131-1.5718 0.38452-0.15418 0.4821-0.2765 0.22897-0.287-0.90281-0.03746-1.7248 0.84494-1.7248 1.8516 0 1.3431 0.27241 1.9252 0.82837 1.7701 0.25915-0.07229 0.89353-0.21645 1.4097-0.32034zm0.93856-2.7421c-0.17001-0.31767-0.43449-0.57758-0.58773-0.57758-0.39245 0-0.34793 0.17824 0.17518 0.70134 0.61914 0.61914 0.78372 0.56977 0.41255-0.12377zm-7.446-0.4761c-0.10096-0.52799-0.04377-0.7016 0.18445-0.56054 0.39056 0.24138 0.4259-0.09856 0.06887-0.66234-0.18627-0.29412-0.30497-0.16272-0.45016 0.49833-0.10849 0.49377-0.11491 1.0309-0.01441 1.1936 0.30042 0.4861 0.36599 0.34051 0.21122-0.46906zm2.5322-0.84751c0.0022-0.17207-0.19051-0.31286-0.42876-0.31286-0.47567 0-0.5271 0.18932-0.2486 0.91509 0.19418 0.50603 0.66764 0.08507 0.67735-0.60224zm-19.589-2.3671c0.09365-0.9926 0.02958-1.2197-0.32499-1.1524-0.32605 0.06194-0.46374 0.53676-0.52601 1.8138-0.10227 2.0973 0.64548 1.5161 0.851-0.66148zm2.0412 0.87527c0.12342-0.71772 0.11999-2.0629-0.01997-7.8165-0.04366-1.7932-0.0573-1.8226-0.80754-1.7327-0.7147 0.08557-1.1589 9.0474-0.50116 10.112 0.34722 0.56182 1.1972 0.20204 1.3287-0.56238zm1.2116 0.33009c0.47853-0.18363 0.68902-2.7126 0.22576-2.7126-0.53031 0-0.92412 0.76301-0.92412 1.7905 0 1.1771 0.0076 1.1872 0.69835 0.9221zm1.8048-4.5897c-0.5796-1.1793-0.87116-1.9787-0.81626-2.2381 0.02521-0.11912-0.18157-0.21858-0.45952-0.22101-0.28539-0.0026-0.37967-0.09678-0.21659-0.21659 0.52637-0.38672 0.45534-1.1498-0.12106-1.3005-0.40813-0.10673-0.51958-0.31546-0.40415-0.75687 0.08786-0.33617 0.02248-0.6095-0.14578-0.6095-0.16784 0-0.2628 0.35738-0.211 0.79417 0.05174 0.43679 0.10904 1.8013 0.12709 3.0323 0.0322 2.186 0.04977 2.2381 0.7549 2.2381 0.39708 0 0.73635 0.09747 0.75392 0.21659 0.01757 0.11912 0.05774 0.84339 0.08939 1.6095 0.03493 0.84796 0.22016 1.4941 0.47343 1.6515 0.614 0.38166 0.75622-3.0182 0.17566-4.1995zm-9.7273 2.2381c-0.0022-0.31173-0.08568-0.38365-0.21658-0.1877-0.1167 0.17473-0.40711 0.39189-0.64536 0.48258-0.28945 0.11018-0.21758 0.17246 0.21659 0.1877 0.43655 0.0153 0.64832-0.14305 0.64535-0.48258zm2.0259-41.369c0-0.15883-0.35737-0.27965-0.79417-0.26849-0.70372 0.017988-0.72839 0.04856-0.21658 0.26849 0.78878 0.33895 1.0108 0.33895 1.0108 0zm-4.1397 36.818c-1.6466-0.45248-1.7654-0.54394-1.524-1.1731 0.1386-0.3612 0.27744-0.40018 0.56763-0.15935 0.21128 0.17534 0.49048 0.22247 0.62045 0.10472 0.12998-0.11774 0.1452-0.05545 0.03384 0.13843-0.23477 0.40868 0.83745 0.75696 1.8764 0.6095 0.45986-0.06527 0.70586 0.06489 0.77444 0.40973 0.11974 0.60218-0.36033 0.6165-2.3488 0.07006zm5.6506-5.6292c0-0.55592 0.05949-0.78334 0.13207-0.50538 0.07269 0.27796 0.07269 0.7328 0 1.0108s-0.13207 0.05053-0.13207-0.50538zm-3.0993-2.0373c0.63533-0.30065 1.5775-0.55004 2.0937-0.5542 1.047-0.0084 1.0981-0.12596 0.50538-1.1627-0.60162-1.0524-0.52457-1.1928 0.26745-0.48738 0.48824 0.43489 0.59768 0.68955 0.36099 0.84009-0.24525 0.15598-0.22994 0.21725 0.05501 0.22045 0.25182 0.0028 0.34 0.21348 0.24363 0.582-0.08306 0.31767-0.02554 0.57758 0.12776 0.57758 0.15333 0 0.19848 0.12996 0.10031 0.28879-0.26975 0.43646-0.72197 0.34602-0.72197-0.14439 0-0.49041-0.45222-0.58086-0.72197-0.1444-0.09812 0.15883-0.30843 0.28879-0.46728 0.28879-0.15883 0-0.21143-0.12516-0.1169-0.27812 0.09452-0.15297-0.4501-0.08939-1.2103 0.14127-1.8006 0.54635-1.9336 0.50313-0.51584-0.16774zm0.05545-7.4205c-0.0859-0.27796-0.4976-1.3212-0.91479-2.3184-0.41719-0.99715-0.80696-2.1956-0.86612-2.6632-0.05916-0.4676-0.18462-0.9748-0.27876-1.1271-0.09419-0.15232-0.03908-0.35857 0.12234-0.45834 0.16142-0.09976 0.2935 0.0053 0.2935 0.23347 0 0.22818 0.19493 0.57664 0.43318 0.77438 0.23825 0.19773 0.43119 0.50604 0.42877 0.68513-0.0022 0.17909-0.1304 0.13069-0.28438-0.10756-0.39325-0.60852-0.3625 0.07324 0.04803 1.0642 0.3398 0.82024 0.42395 1.0675 0.4979 1.4627 0.02227 0.11912 0.14278 0.0556 0.26775-0.14118 0.1359-0.21399 0.23942 0.07256 0.25757 0.71304 0.0167 0.58894 0.17237 1.1181 0.34594 1.176 0.37495 0.12498 0.42919 1.2122 0.06047 1.2122-0.14031 0-0.32543-0.22742-0.41136-0.50538zm-5.1914-4.2014c-0.07913-0.2062-0.11087-1.1484-0.07051-2.0937 0.04562-1.0691-0.01321-1.5005-0.15551-1.1412-0.15805 0.39889-0.22622 0.13085-0.22035-0.86636 0.0065-1.1389 0.0573-1.2914 0.2397-0.72197 0.22081 0.68948 0.23251 0.6805 0.26-0.19955 0.01583-0.50684-0.10118-1.0018-0.26-1.1-0.53386-0.32994-0.29614-0.79126 0.32415-0.62905 0.61293 0.16029 0.61293 0.16029 0-0.41075-0.78527-0.73158-0.77515-0.92188 0.03689-0.69348 0.35945 0.1011 0.50779 0.07754 0.33202-0.05274-0.60503-0.44843-1.1109-1.6464-0.6149-1.4561 0.32499 0.12471 0.39972 0.0087 0.29733-0.46159-0.11395-0.52344-0.08077-0.55595 0.19906-0.19498 0.38229 0.49312 0.29904 0.19294-0.24652-0.88892-0.34041-0.67504-0.28958-0.87176 0.54464-2.1078 0.56687-0.83995 0.86302-1.5815 0.77145-1.9317-0.10544-0.4031 0.11681-0.76453 0.76418-1.2428 1.4368-1.0615 1.8776-1.2096 0.78094-0.26224-0.99317 0.85796-0.99501 0.86407-0.36099 1.2034 0.74612 0.39931 0.80247 0.94869 0.20606 2.0089-1.1617 2.065-1.3891 4.849-0.55851 6.8369 0.56208 1.3453 0.51822 2.3124-0.18966 4.1816-0.82668 2.183-1.726 3.145-2.0794 2.2242zm0.83498-11.601c-0.10456-0.71216-0.46412-0.86781-0.46412-0.20088 0 0.34414 0.11846 0.62571 0.26323 0.62571 0.14479 0 0.23518-0.19117 0.20089-0.42482zm5.0806 7.5868c-0.42532-0.42532-0.45447-1.0974-0.04759-1.0974 0.51891 0 1.7247 0.91807 1.5586 1.1867-0.22798 0.36888-1.1047 0.31705-1.511-0.08935zm1.4209-1.1463c-1.1783-0.58325-1.1063-1.7041 0.08394-1.3073 0.24301 0.081 1.4383 1.9342 1.2471 1.9336-0.03646-1.26e-4 -0.63548-0.28195-1.3311-0.62628zm-3.2114-6.1771c0-0.24762-0.11509-0.37909-0.25576-0.29215-0.14068 0.08694-0.3237-0.19726-0.40672-0.63155-0.15094-0.78962-0.15094-0.78962 0.40016-0.10904 0.50966 0.62939 0.74375 1.483 0.40672 1.483-0.07946 0-0.1444-0.2026-0.1444-0.45023z'),
					$elm$svg$Svg$Attributes$fill('#5d4f40'),
					$elm$svg$Svg$Attributes$strokeWidth('.28879')
				]),
			_List_Nil)
		]));
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $elm$html$Html$span = _VirtualDom_node('span');
var $author$project$Game$ShootOut$viewAnswer = F4(
	function (outcome, guesses, factors, factor) {
		var styleHit = function (color) {
			return A2($elm$core$List$member, factor, guesses) ? _List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'background', color)
				]) : _List_Nil;
		};
		var styleFactor = _List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
				A2($elm$html$Html$Attributes$style, 'bottom', '0'),
				A2($elm$html$Html$Attributes$style, 'left', '0'),
				A2($elm$html$Html$Attributes$style, 'right', '0'),
				A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
				A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
				A2($elm$html$Html$Attributes$style, 'font-size', '5vh')
			]);
		var styleBase = _List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'position', 'relative'),
				A2($elm$html$Html$Attributes$style, 'height', '9rem'),
				A2($elm$html$Html$Attributes$style, 'width', '4rem'),
				A2($elm$html$Html$Attributes$style, 'margin', '0.5rem')
			]);
		return _Utils_eq(outcome, factor) ? A2(
			$elm$html$Html$div,
			_Utils_ap(
				styleBase,
				styleHit('yellow')),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					styleFactor,
					_List_fromArray(
						[
							$elm$html$Html$text(
							$elm$core$String$fromInt(factor))
						]))
				])) : (A2($author$project$Game$ShootOut$correctAnswer, factor, outcome) ? A2(
			$elm$html$Html$div,
			_Utils_ap(
				styleBase,
				styleHit('lime')),
			_List_fromArray(
				[
					$author$project$Game$ShootOut$Droid$drawing,
					A2(
					$elm$html$Html$div,
					styleFactor,
					_List_fromArray(
						[
							$elm$html$Html$text(
							$elm$core$String$fromInt(factor)),
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'font-size', '3vh')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									'x' + $elm$core$String$fromInt((outcome / factor) | 0))
								]))
						]))
				])) : A2(
			$elm$html$Html$div,
			_Utils_ap(
				styleBase,
				styleHit('red')),
			_List_fromArray(
				[
					$author$project$Game$ShootOut$Clone$drawing,
					A2(
					$elm$html$Html$div,
					styleFactor,
					_List_fromArray(
						[
							$elm$html$Html$text(
							$elm$core$String$fromInt(factor))
						]))
				])));
	});
var $author$project$Game$ShootOut$viewAnswers = F2(
	function (_v0, factors) {
		var exercise = _v0.exercise;
		var answers = _v0.answers;
		var guesses = A2(
			$elm$core$List$map,
			function ($) {
				return $.factor;
			},
			answers);
		return A2(
			$elm$core$List$map,
			A3($author$project$Game$ShootOut$viewAnswer, exercise.outcome, guesses, exercise.factors),
			factors);
	});
var $author$project$Game$ShootOut$Selected = function (a) {
	return {$: 'Selected', a: a};
};
var $author$project$Game$ShootOut$viewFactor = F3(
	function (outcome, guesses, factor) {
		var styleFactor = _List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
				A2($elm$html$Html$Attributes$style, 'bottom', '0'),
				A2($elm$html$Html$Attributes$style, 'left', '0'),
				A2($elm$html$Html$Attributes$style, 'right', '0'),
				A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
				A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
				A2($elm$html$Html$Attributes$style, 'font-size', '5vh')
			]);
		var styleBase = _List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'position', 'relative'),
				A2($elm$html$Html$Attributes$style, 'height', '9rem'),
				A2($elm$html$Html$Attributes$style, 'width', '4rem'),
				A2($elm$html$Html$Attributes$style, 'margin', '0.5rem')
			]);
		var shadow = A2($elm$html$Html$Attributes$style, 'box-shadow', 'gray 0 1px 3px');
		return A2($elm$core$List$member, factor, guesses) ? A2(
			$elm$html$Html$div,
			styleBase,
			_Utils_eq(outcome, factor) ? _List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					A2($elm$core$List$cons, shadow, styleFactor),
					_List_fromArray(
						[
							$elm$html$Html$text(
							$elm$core$String$fromInt(factor))
						]))
				]) : (A2($author$project$Game$ShootOut$correctAnswer, factor, outcome) ? _List_fromArray(
				[
					$author$project$Game$ShootOut$Droid$drawing,
					A2(
					$elm$html$Html$div,
					styleFactor,
					_List_fromArray(
						[
							$elm$html$Html$text(
							$elm$core$String$fromInt(factor)),
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'font-size', '3vh')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									'x' + $elm$core$String$fromInt((outcome / factor) | 0))
								]))
						]))
				]) : _List_fromArray(
				[
					$author$project$Game$ShootOut$Clone$drawing,
					A2(
					$elm$html$Html$div,
					styleFactor,
					_List_fromArray(
						[
							$elm$html$Html$text(
							$elm$core$String$fromInt(factor))
						]))
				]))) : A2(
			$elm$html$Html$div,
			A2(
				$elm$core$List$cons,
				$elm$html$Html$Events$onClick(
					$author$project$Game$ShootOut$Selected(factor)),
				A2($elm$core$List$cons, shadow, styleBase)),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					A2(
						$elm$core$List$cons,
						A2($elm$html$Html$Attributes$style, 'top', '30%'),
						styleFactor),
					_List_fromArray(
						[
							$elm$html$Html$text(
							$elm$core$String$fromInt(factor))
						]))
				]));
	});
var $author$project$Game$ShootOut$viewFactors = F2(
	function (_v0, factors) {
		var exercise = _v0.exercise;
		var answers = _v0.answers;
		return A2(
			$elm$core$List$map,
			A2(
				$author$project$Game$ShootOut$viewFactor,
				exercise.outcome,
				A2(
					$elm$core$List$map,
					function ($) {
						return $.factor;
					},
					answers)),
			factors);
	});
var $elm$html$Html$audio = _VirtualDom_node('audio');
var $elm$html$Html$Attributes$autoplay = $elm$html$Html$Attributes$boolProperty('autoplay');
var $elm$core$Basics$modBy = _Basics_modBy;
var $author$project$Game$ShootOut$viewSounds = $elm$core$List$map(
	function (_v0) {
		var t = _v0.a;
		var correct = _v0.b;
		var _v1 = function () {
			if (correct) {
				return _Utils_Tuple2('clone-shot-', 5);
			} else {
				return _Utils_Tuple2('aargh-', 6);
			}
		}();
		var prefix = _v1.a;
		var max = _v1.b;
		return A2(
			$elm$html$Html$audio,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$autoplay(true),
					$elm$html$Html$Attributes$src(
					prefix + ($elm$core$String$fromInt(
						A2($elm$core$Basics$modBy, max, t) + 1) + '.mp3'))
				]),
			_List_Nil);
	});
var $author$project$Game$ShootOut$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		$elm$core$List$concat(
			_List_fromArray(
				[
					$author$project$Game$ShootOut$viewSounds(model.sounds),
					_List_fromArray(
					[
						function () {
						var _v0 = model.state;
						switch (_v0.$) {
							case 'Load':
								return A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Momentje..')
										]));
							case 'Start':
								return A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$p,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('Klaar voor de start?')
												])),
											A2(
											$elm$html$Html$p,
											_List_Nil,
											_List_fromArray(
												[
													A2(
													$elm$html$Html$button,
													_List_fromArray(
														[
															$elm$html$Html$Events$onClick($author$project$Game$ShootOut$Next)
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Start!')
														]))
												]))
										]));
							case 'Finish':
								return A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$p,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('Hoera, alle sommen goed!')
												]))
										]));
							case 'Prompt':
								var input = _v0.a;
								var attempt = _v0.c;
								var exercise = attempt.exercise;
								var answers = attempt.answers;
								return A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$p,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text(
													'Uit welke tafel(s) komt ' + ($elm$core$String$fromInt(exercise.outcome) + '?'))
												])),
											A2(
											$elm$html$Html$p,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'display', 'flex'),
													A2($elm$html$Html$Attributes$style, 'flex-direction', 'row'),
													A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap'),
													A2($elm$html$Html$Attributes$style, 'justify-content', 'space-evenly')
												]),
											A2($author$project$Game$ShootOut$viewFactors, attempt, model.factors))
										]));
							default:
								var attempt = _v0.a;
								var exercise = attempt.exercise;
								var answers = attempt.answers;
								return A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$p,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text(
													'Uit welke tafel(s) komt ' + ($elm$core$String$fromInt(exercise.outcome) + '?'))
												])),
											A2(
											$elm$html$Html$p,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'display', 'flex'),
													A2($elm$html$Html$Attributes$style, 'flex-direction', 'row'),
													A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap'),
													A2($elm$html$Html$Attributes$style, 'justify-content', 'space-evenly')
												]),
											A2($author$project$Game$ShootOut$viewAnswers, attempt, model.factors)),
											A2(
											$elm$html$Html$p,
											_List_Nil,
											_List_fromArray(
												[
													A2(
													$elm$html$Html$button,
													_List_fromArray(
														[
															$elm$html$Html$Events$onClick($author$project$Game$ShootOut$Next)
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Volgende!')
														]))
												]))
										]));
						}
					}()
					])
				])));
};
var $author$project$Main$view = function (model) {
	switch (model.$) {
		case 'Menu':
			return {
				body: _List_fromArray(
					[
						A2(
						$elm$html$Html$h1,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Tafels')
							])),
						A2(
						$elm$html$Html$nav,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$p,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$Main$SelectPokeSums)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('PokeSommen')
									])),
								A2(
								$elm$html$Html$p,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$Main$SelectShootOut)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Shootout')
									]))
							]))
					]),
				title: 'Spellen met tafels'
			};
		case 'PokeSums':
			var pokesums = model.a;
			return {
				body: _List_fromArray(
					[
						A2(
						$elm$html$Html$map,
						$author$project$Main$PokeSumsMsg,
						$author$project$Game$PokeSums$view(pokesums))
					]),
				title: 'Tafels - PokeSommen'
			};
		default:
			var shootout = model.a;
			return {
				body: _List_fromArray(
					[
						A2(
						$elm$html$Html$map,
						$author$project$Main$ShootOutMsg,
						$author$project$Game$ShootOut$view(shootout))
					]),
				title: 'Tafels - Shootout'
			};
	}
};
var $author$project$Main$main = $elm$browser$Browser$document(
	{init: $author$project$Main$init, subscriptions: $author$project$Main$subscriptions, update: $author$project$Main$update, view: $author$project$Main$view});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(_Utils_Tuple0))(0)}});}(this));