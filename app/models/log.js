module.exports = {
    debug: function () {
        // TODO (brunabxs): verify this
        var logType = undefined;
        try {
            logType = LOG_TYPE;
        }
        catch (ReferenceError) { }

        if (logType === 'debug') {
            console.log.apply(this, arguments);
        }
    },

    error: function () {
        // TODO (brunabxs): verify this
        var logType = undefined;
        try {
            logType = LOG_TYPE;
        }
        catch (ReferenceError) { }
        if (logType === 'debug' || logType === 'error') {
            console.log.apply(this, arguments);
        }
    }
};
