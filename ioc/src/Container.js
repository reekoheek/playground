(function(global) {
    "use strict";

    var Container = function() {
        this.data = {};
    };

    Container.resolvers = {
        'class': function(Clazz) {
            return new Clazz();
        },
        'function': function() {
            throw new Error('Unimplemented yet!');
        }
    };

    Container.prototype = {
        get: function(key) {
            if (!this.data) this.data = {};

            var keys = key.split('.'),
                context = this.data;

            for(var i = 0; i < keys.length; i++) {
                var k = keys[i];

                if (!context[k]) {
                    return null;
                }

                context = context[k];
            }
            return context;
        },

        set: function(key, value) {
            if (arguments.length === 1) {
                if (typeof key !== 'object') {
                    throw new Error('Cannot set non object data to global container.');
                }
                this.data = key;
            } else {
                if (!this.data) this.data = {};

                var keys = key.split('.'),
                    context = this.data;

                for(var i = 0; i < keys.length; i++) {
                    var k = keys[i];
                    if (i >= keys.length - 1) {
                        context[k] = value;
                        break;
                    }

                    if (!context[k]) {
                        context[k] = {};
                    }
                    context = context[k];
                }
            }
            return this;
        },

        resolve: function(key) {
            var that = this;

            return new Promise(function(resolve, reject) {
                var resolverKey, resolver;

                if (key.indexOf(':') < 0) {
                    var resultToGet = that.get(key);
                    if (typeof resultToGet !== 'function') {
                        return resolve(resultToGet);
                    }

                    var keys = key.split('.');

                    resolverKey = 'function:';
                    if (keys[keys.length - 1][0].match(/[A-Z]/)) {
                        resolverKey = 'class:';
                    }
                    key = resolverKey + key;
                    that.resolve(key).then(resolve, reject);
                }


                var segments = key.split(':'),
                    subKey = segments.slice(1).join(':');

                resolverKey = segments[0];
                resolver = Container.resolvers[resolverKey];

                if (!resolver) {
                    return reject(new Error('No resolver found:' + resolverKey));
                }

                if (segments.length === 2) {
                    var data = that.get(subKey);
                    data = resolver.apply(that, [data]);
                    return resolve(data);
                }

                that.resolve(subKey).then(function(data) {
                    resolve(resolver.apply(that, [data]));
                }, function() {
                    reject(e);
                });
            });
        }
    };

    global.Container = Container;
})(window);