describe('Container', function() {
    var container;

    container = new Container();

    it('should be able to instantiated', function() {
        expect(container instanceof Container).toBeTruthy();
    });

    describe('setter/getter', function() {
        it('should be able to get', function() {
            expect(container.set).toBeDefined();
            expect(typeof container.set).toEqual('function');
            container.set('hello', 'world');

        });

        it('also should be able to get', function() {
            expect(container.get).toBeDefined();

            var data = container.get('hello');
            expect(data).toEqual('world');
        });

        it('should be able to be chained', function() {
            var returnedObject = container.set('user', {
                username: 'reekoheek',
                age: 32
            });
            expect(returnedObject).toEqual(container);
        });

        describe('can take single argument', function() {
            it('that object argument', function() {

                var data = {
                    title: 'This is title',
                    model: {
                        'username': 'reekoheek',
                        'address': 'Jl Cilandak Tengah'
                    }
                };
                container.set(data);
                var model = container.get('model');
                expect(model).toEqual(data.model);
            });

            it('that is not non object argument', function() {
                var throwException = function() {
                    container.set('non object but string');
                };

                expect(throwException).toThrow();
            });

            it('that null argument', function() {
                container.set('a', 'this is exists');
                container.set(null);

                var val = container.get('a');
                expect(val).toBeNull();
                var dontThrowException = function() {
                    container.set('b', 'new one');
                };
                expect(dontThrowException).not.toThrow();
            });

        });

        it('can take dotted namespaced set', function() {
            container.set('a', null);
            container.set('a.b.c', 'this is a.b.c');

            expect(container.get('a.b').c).toEqual('this is a.b.c');
        });
    });

    describe('resolve', function() {
        container = new Container();

        it('can resolve', function() {
            expect(container.resolve).toBeDefined();
        });

        it('accept var', function(done) {
            var val = 'this is var';
            container.set('take.me.to.var', val);

            var callback = {
                done: function(data) {
                    expect(data).toEqual(val);
                    done();
                },
                fail: function(e) {
                    expect('do not rejected by promise').toEqual(false);
                    done();
                }
            };

            container.resolve('take.me.to.var').then(callback.done, callback.fail);
        });

        it('accept Class', function(done) {
            var Class = function() {
                this.prop1 = 'Property1';
            };

            container.set('take.me.to.MyClass', Class);

            var callback = {
                done: function(data) {
                    expect(data.prop1).toEqual('Property1');
                    done();
                },
                fail: function(e) {
                    expect('do not rejected by promise').toEqual(false);
                    done();
                }
            };

            container.resolve('take.me.to.MyClass').then(callback.done, callback.fail);

        });

        it('accept function', function() {
            var fn = function() {
                return 'this is from function';
            };

            container.set('take.me.to.function', fn);

            var callback = {
                done: function(data) {
                    expect(data).toEqual('this is from function');
                    done();
                },
                fail: function(e) {
                    expect('do not rejected by promise').toEqual(false);
                    done();
                }
            };

            container.resolve('take.me.to.function').then(callback.done, callback.fail);

        });





    });
});