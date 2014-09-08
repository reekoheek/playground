(function() {
    "use strict";

    var proto = Object.create(HTMLElement.prototype);

    proto.createdCallback = function() {
        this.root = this.createShadowRoot();
        this.root.innerHTML = '<h1><content></h1>';
    };

    document.registerElement('x-typeahead', {
        prototype: proto
    });
})();