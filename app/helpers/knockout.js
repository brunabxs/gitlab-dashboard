var ko = require('knockout');
var ksb = require('knockout-secure-binding');

ko.bindingProvider.instance = new ksb({
    attribute: 'data-bind',
    globals: window,
    bindings: ko.bindingHandlers,
    noVirtualElements: false,
});

// Knockout onDemandObservable
// Forked from http://jsfiddle.net/rniemeyer/BDrvT/
// See also original post: http://www.knockmeout.net/2011/06/lazy-loading-observable-in-knockoutjs.html
// (c) Ryan Niemeyer - http://knockmeout.net
// (c) Evgeny Sinitsyn
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

(function () {
    //an observable that retrieves its value when first bound
    var onDemandObservableFactory = function (observableType) {
        return function (callback, target) {

            var _value = observableType(); //private observable

            var result = ko.dependentObservable({
                read: function () {
                    //if it has not been loaded, execute the supplied function
                    if (!result.loaded()) {
                        callback.call(target);
                    }
                    //always return the current value
                    return _value();
                },
                write: function (newValue) {
                    //indicate that the value is now loaded and set it
                    result.loaded(true);
                    _value(newValue);
                },
                deferEvaluation: true  //do not evaluate immediately when created
            });

            //expose the current state, which can be bound against
            result.loaded = ko.observable();
            //load it again
            result.refresh = function () {
                result.loaded(false);
            };

            return result;
        };

    };

    ko.onDemandObservable = onDemandObservableFactory(ko.observable);
    ko.onDemandObservableArray = onDemandObservableFactory(ko.observableArray);

})();

module.exports = ko;