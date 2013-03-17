'use strict';

var _Event = function(element) {
	this.handlers = {};
	this.handlersLength = 0;
	this.root = element || null;
	this.enabled = null;
};

// add event listener
_Event.prototype.add = function(eventType, selector, callback) {

	if (!this.handlers[eventType]) this.handlers[eventType] = {};
	if (!this.handlers[eventType][selector]) this.handlers[eventType][selector] = [];
	
	this.handlers[eventType][selector].push(callback);
	this.handlersLength++;
	
	if (!this.enabled && this.root) {
		_Event._bind(this.root, eventType, this._onEvent.bind(this));
		this.enabled = true;
	}
	else _Event._bind(document.querySelectorAll(selector), eventType, this._onEvent.bind(this));
	
	
	// return method to remove the listener
	return (function(eventType, selector, callback, i) {
	
		return {
			remove: function() {
				delete this.handlers[eventType][selector][i];
			}.bind(this)
		}
		
	}.bind(this))(eventType, selector, callback, this.handlersLength-1);
};

// remove all listeners
_Event.prototype.removeAll = function(eventType, selector) {
	
	if (selector && eventType) delete this.handlers[eventType][selector];
	else {
		for (eventType in this.handlers) {
			if (eventType[selector]) delete eventType[selector];
		};
	};
};

// triggered on each event
_Event.prototype._onEvent = function(ev) {
	if (this.handlers[ev.type]) {
		for (var selector in this.handlers[ev.type]) {
			if (_Event._is(ev.target, selector)) {
				this.handlers[ev.type][selector].forEach(function(callback) {
					callback.apply(ev.target, [ev]);
				});
			};
		};
	};
};

// binding method
_Event._bind = function(element, eventType, callback) {
	(element.length > 1
		? Array.prototype.slice(element) 
		: (element.item
			? [element[0]]
			: [element]
		)
	).forEach(function(e) {
		if (e.addEventListener) e.addEventListener(eventType, callback, false);
		else if (e.attachEvent) e.attachEvent('on' + eventType, callback);
	});
};

// event triggering method
_Event._trigger = function(element, eventType) {

	var event;
	
	if (document.createEvent) {
		event = document.createEvent("HTMLEvents");
		event.initEvent(eventType, true, true);
	} else {
		event = document.createEventObject();
		event.eventType = eventType;
	};

	if (document.createEvent) element.dispatchEvent(event);
	else element.fireEvent("on" + event.eventType, event);

};

// static object extend helper
_Event._extend = function(subObject, superObject) {
	for (var prop in superObject) subObject[prop] = superObject[prop];
};

// basic element = selector check
_Event._is = function(element, selector) {

	var first = selector.substring(0,1),
		attribute;
	
	// ids
	if (first === '#') return element.id === selector.substr(1, selector.length);
	
	// class
	else if (first === '.') return element.className === selector.substr(1, selector.length);
	
	// attribute
	else if (first === '[') {
	
		attribute = function(key, value) {
			return {
				key: key === 'class' ? 'className' : key,
				value: value
			};
		}
		.apply(null, selector.substring(1, selector.length - 1).split('='));
		
		if (attribute.key === 'className') {
			return ( (" " + element[attribute.key] + " ")
					.replace(/[\n\t]/g, " ")
					.indexOf(" " + attribute.value + " ") > -1 );
		}
		else return element[attribute.key] ? element[attribute.key] === attribute.value : false;
		
	// tags / last shot
	} else return element.nodeName.toUpperCase() === selector.toUpperCase();
};