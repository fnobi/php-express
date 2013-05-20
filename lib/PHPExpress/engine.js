var path = require('path'),
    util = require('util'),
    querystring = require('querystring'),
    child_process = require('child_process');

var engine = function (filePath, opts, callback) {
    var binPath = this.binPath,
        runnerPath = this.runnerPath,

        method = opts.method || 'GET',
        get = opts.get || {},
        post = opts.post || {},

        query = opts.query || querystring.stringify(get),
        body = opts.body || querystring.stringify(post),

        env = {
            REQUEST_METHOD: method,
            CONTENT_LENGTH: body.length,
            QUERY_STRING: query
        },
        encodedEnv = [];

    for (var key in env) {
        if (env[key]) {
            encodedEnv.push(util.format('%s="%s"', key, env[key]));
        }
    }

    var command = util.format(
        '%s %s %s %s %s',
        encodedEnv.length ? 'export ' + encodedEnv.join(' ') + ';' : '',
        (body ? util.format('echo "%s" | ', body) : '') + binPath,
        runnerPath,
        path.dirname(filePath),
        filePath
    );

    child_process.exec(command, function (error, stdout, stderr) {
        if (error) {
            callback(error);
        } else if (stdout) {
            callback(null, stdout);
        } else if (stderr) {
            callback(stderr);
        }
    });
};

module.exports = engine;