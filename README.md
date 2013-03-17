# _Event.js

Small event class allowing direct or delegated element binding on modern browsers.

## Usage

Start new instance and use the add(eventType, selector, listener) method to add listeners.
The add method will return an object with a remove method to remove the listener.

Use .removeAll(sEventType [, sSelector])  method to remove all listeners.


```javascript

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


```