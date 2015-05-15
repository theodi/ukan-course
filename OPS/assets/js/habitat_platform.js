(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

// Load our standard parent widget APIs into the content.
var apiRegistry = require('inkling-widget-api/container/availability')(window);
require('inkling-widget-api/container/params')(window);
require('inkling-widget-api/container/view')(window, {apiRegistry: apiRegistry});
require('inkling-widget-api/container/message')(window, {apiRegistry: apiRegistry});
require('inkling-widget-api/container/link')(window, {apiRegistry: apiRegistry});
require('inkling-widget-api/container/orientation')(window, {
    orientationLoadHandler: function(){
        return window.orientation;
    },
    apiRegistry: apiRegistry
});

},{"inkling-widget-api/container/availability":2,"inkling-widget-api/container/link":3,"inkling-widget-api/container/message":4,"inkling-widget-api/container/orientation":5,"inkling-widget-api/container/params":6,"inkling-widget-api/container/view":7}],2:[function(require,module,exports){
// Copyright 2015 Inkling Systems, Inc.
//
// Your use of this software is governed by your customer agreement with Inkling Systems, Inc.
// (e.g., the Master Subscription and Professional Services Agreement).  If you are acting as a
// subcontractor of an Inkling customer, than that customer's agreement shall apply to your use of
// the software.  In the case where no such agreement applies, then Inkling's Developer Rules,
// which can be found at https://www.inkling.com/store/terms/developer-rules-october-2014/, shall
// apply to your use of the software.

var api = require('../../lib/container');

module.exports = function(window){
    return new ContainerAvailabilityAPI(window);
};

/**
 * Widget container availability API that broadcasts the availability of all known container APIs to
 * this container's widgets. All other container APIs should register themselves with a
 * single instance of the availability API.
 *
 * @param {Window} window The window to which to add the Availability API.
 * @constructor
 */
function ContainerAvailabilityAPI(window){
    this.win_ = window;
    this.api_ = api(window);

    /**
     * Stores API availability. The mapping is an API type with a map of method availability.
     * @type {Object.<string, Object.<string, boolean>>}
     */
    this.registeredAPIs_ = {};

    this.api_.listen('availability', 'apiStatus', this.onAvailabilityAPIStatus_.bind(this));
}

/**
 * Remove the availability API.
 */
ContainerAvailabilityAPI.prototype.remove = function(){
    this.api_.remove();
};

/**
 * Register the availability of an API.
 *
 * @param {string} apiName The type for the API being registered.
 * @param {Object.<string, boolean|Object>} apiMethods Key value pairs of methods that are available.
 */
ContainerAvailabilityAPI.prototype.registerAPI = function(apiName, apiMethods){
    // Extend any existing API registrations.
    var apis = this.registeredAPIs_[apiName] || {};
    Object.keys(apiMethods).forEach(function(method){
        apis[method] = apiMethods[method];
    });

    this.registeredAPIs_[apiName] = apis;

    this.api_.broadcast('availability', 'apiStatus', this.registeredAPIs_);
};

/**
 * Respond to a request for the current availability status.
 *
 * @param {Object} payload The data with the request.
 * @param {Window} widgetWindow The window requesting the status.
 */
ContainerAvailabilityAPI.prototype.onAvailabilityAPIStatus_ = function(payload, widgetWindow){
    this.api_.send(widgetWindow, 'availability', 'apiStatus', this.registeredAPIs_);
};

},{"../../lib/container":9}],3:[function(require,module,exports){
// Copyright 2015 Inkling Systems, Inc.
//
// Your use of this software is governed by your customer agreement with Inkling Systems, Inc.
// (e.g., the Master Subscription and Professional Services Agreement).  If you are acting as a
// subcontractor of an Inkling customer, than that customer's agreement shall apply to your use of
// the software.  In the case where no such agreement applies, then Inkling's Developer Rules,
// which can be found at https://www.inkling.com/store/terms/developer-rules-october-2014/, shall
// apply to your use of the software.

var api = require('../../lib/container');

module.exports = function(window, options){
    return new ContainerLinkAPI(window, options);
};

/**
 * Widget container link API that handles requests to open link from the container's widgets.
 *
 * @param {Window} window The window to which to add the Link API.
 * @param {Object} options
 *      @param {Function} options.openLinkHandler (Optional) The handler to open links. If not
 *          specified links will open by changing the window location.
 *      @param {ContainerAvailabilityAPI} options.apiRegistry (Optional) The API Availability
 *          registry.
 * @constructor
 */
function ContainerLinkAPI(window, options){
    options = options || {};
    this.win_ = window;
    this.api_ = api(window);
    this.openLinkHandler_ = options.openLinkHandler || this.openLink_.bind(this);

    this.api_.listen('link', 'open', this.onLinkOpenMessage_.bind(this));

    if (options.apiRegistry){
        options.apiRegistry.registerAPI('link', {open: true});
    }
}

/**
 * Removes this implementation of the API from the window.
 */
ContainerLinkAPI.prototype.remove = function(){
    this.api_.remove();
};

/**
 * Opens the href url in the current window.
 */
ContainerLinkAPI.prototype.openLink_ = function(href){
    this.win_.location.href = href;
};

/**
 * Handles widget messages to open a link, delegating to the open link handler.
 */
ContainerLinkAPI.prototype.onLinkOpenMessage_ = function(payload, widgetWindow, widgetIframe){
    // The original widget API sent links as the main payload. Our documentation however
    // states that the API sends an object with an 'href' attribute.
    var href = (typeof payload === 'string') ? payload : payload.href;

    this.openLinkHandler_.call(null, href);
};

},{"../../lib/container":9}],4:[function(require,module,exports){
// Copyright 2015 Inkling Systems, Inc.
//
// Your use of this software is governed by your customer agreement with Inkling Systems, Inc.
// (e.g., the Master Subscription and Professional Services Agreement).  If you are acting as a
// subcontractor of an Inkling customer, than that customer's agreement shall apply to your use of
// the software.  In the case where no such agreement applies, then Inkling's Developer Rules,
// which can be found at https://www.inkling.com/store/terms/developer-rules-october-2014/, shall
// apply to your use of the software.

var api = require('../../lib/container');

var SYSTEM_LOADED_EVENT = '__system_pageLoaded';

module.exports = function(window, options){
    return new ContainerMessageAPI(window, options);
};

/**
 * Widget container message API that acts as a bridge for inter-widget communication. Also handles
 * system messages such as the page loaded message.
 *
 * @param {Window} window The window to which to add the Message API.
 * @param {Object} options
 *      @param {ContainerAvailabilityAPI} options.apiRegistry (Optional) The API Availability
 *          registry.
 *      @param {boolean=false} options.disableAutomaticLoadEvent (Optional) Whether to disable
 *          automatic handling of the pageLoad event.
 * @constructor
 */
function ContainerMessageAPI(window, options){
    options = options || {};
    this.topics_ = {};
    this.win_ = window;

    this.api_ = api(window);
    this.api_.listen('message', 'subscribe', this.onSubscribeMessage_.bind(this));
    this.api_.listen('message', 'unsubscribe', this.onUnsubscribeMessage_.bind(this));
    this.api_.listen('message', 'publish', this.onPublishMessage_.bind(this));

    if (!options.disableAutomaticLoadEvent){
        this.onWindowLoadEventBound_ = this.onWindowLoadEvent_.bind(this);
        this.win_.addEventListener('load', this.onWindowLoadEventBound_, false);
    }

    if (options.apiRegistry){
        var systemTopics = {};
        systemTopics[SYSTEM_LOADED_EVENT] = true;
        options.apiRegistry.registerAPI('message', {
            subscribe: true,
            unsubscribe: true,
            publish: true,
            systemTopics: systemTopics
        });
    }
}

/**
 * Removes this implementation of the API from the window.
 */
ContainerMessageAPI.prototype.remove = function(){
    if (this.onWindowLoadEventBound_){
        this.win_.removeEventListener('load', this.onWindowLoadEventBound_, false);
    }
    this.api_.remove();
};

/**
 * Broadcast the SYSTEM_LOADED_EVENT to all widgets.
 */
ContainerMessageAPI.prototype.publishLoad = function(){
    // Queued up the publish after any outstanding topic subscription messages from the widgets.
    this.api_.afterQueued(function(){
        this.publish_(SYSTEM_LOADED_EVENT, null, null);
    }.bind(this));
};

ContainerMessageAPI.prototype.subscribe_ = function(window, topic){
    if (!this.topics_[topic]) this.topics_[topic] = [];

    var subscribers = this.topics_[topic];
    if (subscribers.indexOf(window) === -1){
        subscribers.push(window);
    }
};

ContainerMessageAPI.prototype.unsubscribe_ = function(window, topic){
    var subscribers = this.topics_[topic] || [];

    var index = subscribers.indexOf(window);
    if (index !== -1){
        subscribers.splice(index, 1);
    }

    if (subscribers.length === 0){
        delete this.topics_[topic];
    }
};

ContainerMessageAPI.prototype.publish_ = function(topic, message, excludeWindow){
    var subscribers = this.topics_[topic] || [];

    subscribers.forEach(function(subscriber){
        if (excludeWindow && subscriber === excludeWindow) return;

        this.api_.send(subscriber, 'message', 'publish', {
            topic: topic,
            message: message
        });
    }, this);
};

ContainerMessageAPI.prototype.onSubscribeMessage_ = function(payload, window){
    this.subscribe_(window, payload.topic);
};

ContainerMessageAPI.prototype.onUnsubscribeMessage_ = function(payload, window){
    this.unsubscribe_(window, payload.topic);
};

ContainerMessageAPI.prototype.onPublishMessage_ = function(payload, window){
    this.publish_(payload.topic, payload.message, window);
};

/**
 * Handles window loading by publishing the SYSTEM_LOADED_EVENT. Window load completes only after
 * all the widget iframes have loaded.
 */
ContainerMessageAPI.prototype.onWindowLoadEvent_ = function(evt){
    this.publishLoad();
};

},{"../../lib/container":9}],5:[function(require,module,exports){
// Copyright 2015 Inkling Systems, Inc.
//
// Your use of this software is governed by your customer agreement with Inkling Systems, Inc.
// (e.g., the Master Subscription and Professional Services Agreement).  If you are acting as a
// subcontractor of an Inkling customer, than that customer's agreement shall apply to your use of
// the software.  In the case where no such agreement applies, then Inkling's Developer Rules,
// which can be found at https://www.inkling.com/store/terms/developer-rules-october-2014/, shall
// apply to your use of the software.

var api = require('../../lib/container');

module.exports = function(window, options){
    return new ContainerOrientationAPI(window, options);
};

/**
 * Widget container orientation API that detects orientation changes and broadcasts them to widgets.
 *
 * @param {Window} window The window to which to add the Orientation API.
 * @param {Object} options
 *      @param {function} options.orientationLoadHandler Function that returns the angle that the
 *          device is rotated: 0, 90, 180, or -90.
 *      @param {ContainerAvailabilityAPI} options.apiRegistry (Optional) The API Availability registry.
 * @constructor
 */
function ContainerOrientationAPI(window, options){
    options = options || {};
    this.onOrientationChangeEventBound_ = this.onOrientationChangeEvent_.bind(this);

    this.orientationLoadHandler_ = options.orientationLoadHandler;
    this.win_ = window;
    this.api_ = api(window);

    if (!this.orientationLoadHandler_){
        throw new Error('Orientation calculation handler required.');
    }

    this.win_.addEventListener('orientationchange', this.onOrientationChangeEventBound_, false);

    if (options.apiRegistry){
        options.apiRegistry.registerAPI('orientation', {orientationchange: true});
    }
}

/**
 * Removes this implementation of the API from the window.
 */
ContainerOrientationAPI.prototype.remove = function(){
    this.api_.remove();
    this.win_.removeEventListener('orientationchange', this.onOrientationChangeEventBound_, false);
};

ContainerOrientationAPI.prototype.onOrientationChangeEvent_ = function(evt){
    this.api_.broadcast('orientationchange', null, {
        orientation: this.orientationLoadHandler_.call(null)
    });
};

},{"../../lib/container":9}],6:[function(require,module,exports){
// Copyright 2015 Inkling Systems, Inc.
//
// Your use of this software is governed by your customer agreement with Inkling Systems, Inc.
// (e.g., the Master Subscription and Professional Services Agreement).  If you are acting as a
// subcontractor of an Inkling customer, than that customer's agreement shall apply to your use of
// the software.  In the case where no such agreement applies, then Inkling's Developer Rules,
// which can be found at https://www.inkling.com/store/terms/developer-rules-october-2014/, shall
// apply to your use of the software.

module.exports = function(window){
    return new ContainerParamAPI(window);
};

/**
 * Widget container param API that replaces all <object> tags within the given parent node with
 * properly configured <iframe> elements.
 *
 * @param {Window} window The window to which to add the Param API.
 */
function ContainerParamAPI(window){
    this.onLoadHandlerBound_ = this.onLoadHandler_.bind(this);
    this.doc_ = window.document;

    rewriteWidgets(this.doc_);

    this.doc_.addEventListener('DOMContentLoaded', this.onLoadHandlerBound_, false);
}

/**
 * Removes this implementation of the API from the window.
 */
ContainerParamAPI.prototype.remove = function(){
    this.doc_.removeEventListener('DOMContentLoaded', this.onLoadHandlerBound_, false);
};

ContainerParamAPI.prototype.onLoadHandler_ = function(evt){
    rewriteWidgets(this.doc_);
};

/**
 * Rewrites all object tags in the document with properly configured widget iframes.
 *
 * @param {Document} document The document to search within for widgets.
 *
 * @return {Array.<Object>} An array containing all of the pairs that were swapped so that
 *      further processing could be performed and nodes could cached for later reverting.
 */
function rewriteWidgets(document){
    var objectNodes = document.querySelectorAll('object[type="text/html"][data]');

    return Array.prototype.map.call(objectNodes, function(objectNode){
        var paramNodes = objectNode.querySelectorAll('param[name][value]');

        var queryParams = Array.prototype.map.call(paramNodes, function(paramNode){
            return encodeURIComponent(paramNode.getAttribute('name')) + '=' +
                    encodeURIComponent(paramNode.getAttribute('value'));
        }).join('&');

        var src = objectNode.getAttribute('data');
        if (queryParams){
            src += (src.indexOf('?') === -1 ? '?' : '&') + queryParams;
        }

        var iframeNode = document.createElement('iframe');

        // Copy over a basic whitelist of attributes.
        ['data-uuid', 'id', 'class', 'height', 'width'].forEach(function(attr){
            if (objectNode.hasAttribute(attr)){
                iframeNode.setAttribute(attr, objectNode.getAttribute(attr));
            }
        });

        iframeNode.setAttribute('src', src);

        objectNode.parentNode.replaceChild(iframeNode, objectNode);

        return {
            objectNode: objectNode,
            iframeNode: iframeNode
        };
    });
}

},{}],7:[function(require,module,exports){
// Copyright 2015 Inkling Systems, Inc.
//
// Your use of this software is governed by your customer agreement with Inkling Systems, Inc.
// (e.g., the Master Subscription and Professional Services Agreement).  If you are acting as a
// subcontractor of an Inkling customer, than that customer's agreement shall apply to your use of
// the software.  In the case where no such agreement applies, then Inkling's Developer Rules,
// which can be found at https://www.inkling.com/store/terms/developer-rules-october-2014/, shall
// apply to your use of the software.

var api = require('../../lib/container');

module.exports = function(window, options){
    return new ContainerViewAPI(window, options);
};

/**
 * Widget container view API that sets the size of widget iframe elements.
 *
 * @param {Window} window The window to which to add the View API.
 * @param {Object} options
 *      @param {Function} options.onResizeHandler (Optional) The handler to resize the view. Called
 *          after this api receives and handles the message to change a widget's size.
 *      @param {ContainerAvailabilityAPI} options.apiRegistry (Optional) The API Availability registry.
 * @constructor
 */
function ContainerViewAPI(window, options){
    options = options || {};
    this.onResizeHandler_ = options.onResizeHandler || function(){};

    this.api_ = api(window);
    this.api_.listen('view', 'set', this.onViewMessage_.bind(this));

    // Support the older 'size:set' API.
    this.api_.listen('size', 'set', this.onViewMessage_.bind(this));

    if (options.apiRegistry){
        options.apiRegistry.registerAPI('view', {set: true});
    }
}

/**
 * Removes this implementation of the API from the window.
 */
ContainerViewAPI.prototype.remove = function(){
    this.api_.remove();
};

ContainerViewAPI.prototype.onViewMessage_ = function(payload, widgetWindow){
    var widgetIframe = this.api_.findWidget(widgetWindow);
    var height, width;

    if (typeof payload.height === 'number'){
        height = payload.height + 'px';
    } else if (payload.height){
        height = payload.height;
    }

    if (typeof payload.width === 'number'){
        width = payload.width + 'px';
    } else if (payload.width){
        width = payload.width;
    }

    if (height) widgetIframe.style.height = height;
    if (width) widgetIframe.style.width = width;

    this.onResizeHandler_.call(null);
};

},{"../../lib/container":9}],8:[function(require,module,exports){
// Copyright 2015 Inkling Systems, Inc.
//
// Your use of this software is governed by your customer agreement with Inkling Systems, Inc.
// (e.g., the Master Subscription and Professional Services Agreement).  If you are acting as a
// subcontractor of an Inkling customer, than that customer's agreement shall apply to your use of
// the software.  In the case where no such agreement applies, then Inkling's Developer Rules,
// which can be found at https://www.inkling.com/store/terms/developer-rules-october-2014/, shall
// apply to your use of the software.

/**
 * Responds to a message event by invoking the callback if the event matches the
 * specified type and method.
 *
 * @param {string} listenerType The message event type.
 * @param {string} listenerMethod The message event method.
 * @param {function} listenerCallback The callback to invoke.
 * @param {Event} evt The event object to process.
 */
function onMessage(listenerType, listenerMethod, listenerCallback, evt){
    if (!evt.data.type) return;

    var type = evt.data.type;
    var method = evt.data.method || null;

    // Fall back to 'data' if it is present to support older clients.
    var payload = evt.data.payload || evt.data.data;

    if (type !== listenerType) return;
    if (method !== listenerMethod) return;

    listenerCallback(payload, evt.source);
}

/**
 * Sends a message to the target window.
 *
 * @param {Window} target The window to send the message to.
 * @param {string} type The main type of message to send.
 * @param {string} method The RPC method to trigger.
 * @param {object|undefined} payload The data payload to send.
 */
exports.send = function(target, type, method, payload){
    target.postMessage({
        type: type,
        method: method,
        // Some older clients expect 'data' instead of 'payload'.
        data: payload,
        payload: payload
    }, '*');
};

/**
 * Attaches an event handler for the given message type.
 *
 * @param {Window} target The window receiving messages.
 * @param {string} type The main type of message to send.
 * @param {string} method The RPC method to trigger.
 * @param {apiCallback} callback The callback to call when a message arrives.
 *
 * @return {Object} An object containing the 'target' window and the added
 *      'handler', which can be used to remove the listener later.
 */
exports.listen = function(target, type, method, callback){
    var handler = onMessage.bind(null, type, method, callback);

    target.addEventListener('message', handler, false);

    return {
        target: target,
        handler: handler
    };
};

/**
 * Detaches an event handler created by #listen.
 *
 * @param {Object} listener object returned by #listen.
 *      @param {Window} listener.target The window receiving messages.
 *      @param {function} listener.handler The event handler to remove.
 */
exports.stop = function(listener){
    listener.target.removeEventListener('message', listener.handler, false);
};

/**
 * This callback is called when an API message arrives.
 * @callback apiCallback
 * @param {Object|undefined} payload The data payload of the message.
 * @param {Window} widgetWindow The Window of the widget that sent the message.
 */

},{}],9:[function(require,module,exports){
// Copyright 2015 Inkling Systems, Inc.
//
// Your use of this software is governed by your customer agreement with Inkling Systems, Inc.
// (e.g., the Master Subscription and Professional Services Agreement).  If you are acting as a
// subcontractor of an Inkling customer, than that customer's agreement shall apply to your use of
// the software.  In the case where no such agreement applies, then Inkling's Developer Rules,
// which can be found at https://www.inkling.com/store/terms/developer-rules-october-2014/, shall
// apply to your use of the software.

var api = require('./api');

module.exports = function(window){
    return new Container(window);
};

/**
 * Container API helper with generic methods for managing widgets that live
 * in the window.
 *
 * @param {Window} window The widget container window.
 */
function Container(window){
    this.win_ = window;
    this.listeners_ = [];
}

/**
 * Removes this implementation of the API from the window.
 */
Container.prototype.remove = function(){
    this.stop();
};

Container.prototype.send = function(targetWindow, type, method, payload){
    api.send(targetWindow, type, method, payload);
};

Container.prototype.broadcast = function(type, method, payload, excludeWindow){
    this.getWidgets().forEach(function(iframe){
        if (excludeWindow && iframe.contentWindow === excludeWindow) return;

        api.send(iframe.contentWindow, type, method, payload);
    }, this);
};

Container.prototype.listen = function(type, method, callback){
    var listener = api.listen(this.win_, type, method, function(payload, sourceWindow){
        callback(payload, sourceWindow);
    }.bind(this));
    this.listeners_.push(listener);
    return listener;
};

Container.prototype.stop = function(singleListener){
    this.listeners_ = this.listeners_.filter(function(listener){
        if (singleListener && singleListener !== listener) return true;

        api.stop(listener);
        return false;
    });
};

Container.prototype.getWidgets = function(){
    return Array.prototype.slice.call(this.win_.document.querySelectorAll('iframe'), 0);
};

Container.prototype.findWidget = function(window){
    return this.getWidgets().filter(function(iframe){
        return iframe.contentWindow === window;
    }, this)[0] || null;
};

Container.prototype.afterQueued = function(callback){
    var id = 'queue-' + Math.round(Math.random() * 0xFFFFFFFF) + Math.round(Math.random() * 0xFFFFFFFF);
    var listener = api.listen(this.win_, '__internal', id, function(payload, sourceWindow){
        api.stop(listener);
        callback();
    }.bind(this));
    api.send(this.win_, '__internal', id);
};

},{"./api":8}]},{},[1]);
