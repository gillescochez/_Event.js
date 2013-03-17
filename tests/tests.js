test('Structure', function() {

    expect(7);
	
	var _event = new _Event(),
		_eventDelegate = new _Event(document.body);
	
    ok(_Event === window._Event, '_Event is globally defined');
    ok(_Event.constructor == Function, '_Event is a function');
	
	// test new instance defaults for non delegation
	deepEqual(_event.handlers, {}, '_Event handlers object available');
	equal(_event.handlersLength, 0, '_Event handlersLength is 0');
	equal(_event.root, null, '_Event root is null (no delegation)');
	equal(_event.enabled, null, '_Event enabled is null');

	
	// test new instance defaults for delegation
	equal(_eventDelegate.root, document.body, '_Event root is document.body');
	
});

test('Static methods', function() {

    expect(8);

	var target = {
			boo:"boo"
		},
		object = {
			foo:"foo"
		},
		result = {
			boo:"boo",
			foo:"foo"
		},
		el = document.createElement('div'),
		triggered = null;
		
	el.className = "Foo";
	el.id = "Boo";
	el.lang = "en";
	
	_Event._bind(el, 'click', function() {
		triggered = true;
	});
	
	// for IE we need to add the element to the body
	document.body.appendChild(el);

	_Event._extend(target, object);
	
	deepEqual(target, result, "_Event._extend");
	
	_Event._trigger(el, 'click');
	equal(triggered, true, '_Event._trigger && _Event._bind');
	
	equal(_Event._is(el, '.Foo'), true, '.Foo yep');
	equal(_Event._is(el, '#Boo'), true, '#Boo yep');
	equal(_Event._is(el, '[lang=en]'), true, '[lang=en] yep');
	
	equal(_Event._is(el, '.xyz'), false, '.xyz nope');
	equal(_Event._is(el, '#xyz'), false, '#xyz nope');
	equal(_Event._is(el, '[lang=fr]'), false, '[lang=fr] nope');

});

test('Event binding and delegation', function() {

	expect(8);

	var div = document.createElement('div'),
		_event = new _Event(),
		_eventDelegate = new _Event(div),
		classEvent, idEvent, attrEventDelegated,
		classTriggered = null,
		idTriggered = null,
		attrTriggered = null,
		classEl, idEl, attrEl,
		eventType = 'click';
		
	div.innerHTML = '<span class="foo"></span>\
					<span id="boo"></span>\
					<span lang="fr"></span>';
					
	document.body.appendChild(div);
	
	classEl = div.getElementsByClassName('foo')[0];
	idEl = document.getElementById('boo');
	attrEl = div.getElementsByTagName('span')[2];
	
	// class 
	classEvent = _event.add(eventType, '.foo', function(ev) {
		classTriggered = true;
	});
	
	// test handler storing
	ok(_event.handlers[eventType]['.foo'], 'Handler stored');
	equal(_event.handlers[eventType]['.foo'].length, 1, '1 handler for .foo as expected');
	
	// trigger the event
	_Event._trigger(classEl, eventType);
	equal(classTriggered, true, 'class event triggered');
	
	
	// id
	idEvent = _event.add(eventType, '#boo', function(ev) {
		idTriggered = true;
	});
	
	// stored
	equal(_event.handlers[eventType]['#boo'].length, 1, '1 handler for #boo as expected');
	ok(_event.handlers[eventType]['.foo'], '.foo still present');
	
	// trigger the event
	_Event._trigger(idEl, eventType);
	equal(idTriggered, true, 'class event triggered');
	
	
	// attr delegated
	attrEvent = _eventDelegate.add(eventType, '[lang=fr]', function(ev) {
		attrTriggered = true;
	});
	
	
	// trigger the event
	_Event._trigger(attrEl, eventType);
	equal(attrTriggered, true, 'class event triggered');
	equal(_eventDelegate.enabled, true, 'enabled property true');

});





