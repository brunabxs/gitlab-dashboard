var ko = require('knockout');
var ksb = require('knockout-secure-binding');

ko.bindingProvider.instance = new ksb({
    attribute: 'data-bind',
    globals: window,
    bindings: ko.bindingHandlers,
    noVirtualElements: false,
});

module.exports = ko;