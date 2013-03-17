// delegate to body
var ev = new _Event(document.body);

var fooListener = ev.add('click', '.foo', function () {
	console.log(this, '.foo');
});

fooListener.remove();

ev.add('click', '[class=foo]', function(d) {
	console.log(this, '[class=foo]');
});

// no delegation
var ev2 = new _Event();

ev2.add('click', '#foo', function(d) {
	console.log(this, '#foo', d);
});