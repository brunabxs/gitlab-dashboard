module.exports = function() {
    var _type;

    return {
        load: function (type) {
            _type = type;
        },
        $get: function () {
            function debug() {
                if (_type === 'debug') {
                    console.log.apply(this, arguments);
                }
            }

            function error() {
                if (_type === 'debug' || _type === 'error') {
                    console.log.apply(this, arguments);
                }
            }

            return {
                debug: debug,
                error: error
            };
        }
    };
};
