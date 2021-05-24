var doc = function(selector, context) {
    this.selector = selector;

    if (this instanceof doc === false) {
        return new doc(selector, context);
    }
    if (selector instanceof doc) {
        return selector;
    }

    if (typeof selector === "undefined") {
        return false;
    } else if (typeof selector === "function") {
        _bindEvent(document, "DOMContentLoaded", selector);
    } else if (typeof selector === "string") {
        if (typeof context === "string") {
            var result = [];
            document.querySelectorAll(context).forEach(function(node) {
                node.querySelectorAll(selector).forEach(function(e) {
                    result.push(e);
                });
            });
            this.nodes = Array.prototype.slice.call(result);
        } else if (context && context.nodeType && context.nodeType === 1) {
            var result = [];
            context.querySelectorAll(selector).forEach(function(e) {
                result.push(e);
            });
            this.nodes = Array.prototype.slice.call(result);
        } else {
            this.nodes = Array.prototype.slice.call(document.querySelectorAll(selector));
        }
    } else if (selector.nodeType && selector.nodeType === 1) {
        this.nodes = [selector]
    } else {
        this.nodes = selector;
    }
}

doc.fn = doc.prototype = {
    each: function(callback) {
        Array.prototype.forEach.call(this.nodes, callback);
        return this;
    },

    map: function(callback) {
        var result = [], i;
        for (i = 0; i < this.nodes.length; i++) {
            result.push(callback(this.nodes[i], i));
        }
        return doc(result);
    },

    filter: function(callback) {
        var result = [], i;
        if (typeof callback === "function") {
            result = this.nodes.filter(callback);
        } else {
            for (i = 0; i < this.nodes.length; i++) {
                if (this.nodes[i].matches(callback)) {
                    result.push(this.nodes[i]);
                }
            }
        }
        return doc(result);
    },

    show: function() {
        return this.each(function(node) {
            node.style.display = "block";
        });
    },

    hide: function() {
        return this.each(function(node) {
            node.style.display = "none";
        });
    },

    not: function(match) {
        var result = [], i;
        for (i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].matches(match) === false) {
                _objectPush(result, this.nodes[i]);
            }
        }
        return doc(result);
    },

    eq: function(index) {
        return doc(this.nodes[index]);
    },

    index: function() {
        var node = this.nodes[0], i = 0;
        if (typeof node === "undefined") {
            return -1;
        }
        while((node = node.previousElementSibling) !== null) {
            i++;
        }
        return i;
    },

    first: function() {
        return doc(this.nodes[0]);
    },

    last: function() {
        return doc(this.nodes[this.nodes.length-1]);
    },

    next: function(type, match) {
        return doc(_nodeList(this, true, match, "nextElementSibling"));
    },

    nextAll: function(match) {
        return doc(_nodeList(this, true, match, "nextElementSibling"));
    },

    nextUntil: function(match) {
        return doc(_nodeList(this, false, match, "nextElementSibling"));
    },

    prev: function(match) {
        return doc(_nodeList(this, null, match, "previousElementSibling"));
    },

    prevAll: function(match) {
        return doc(_nodeList(this, true, match, "previousElementSibling"));
    },

    prevUntil: function(match) {
        return doc(_nodeList(this, false, match, "previousElementSibling"));
    },

    parent: function(match) {
        return doc(_nodeList(this, null, match, "parentNode"));
    },

    parentAll: function(match) {
        return doc(_nodeList(this, true, match, "parentNode"));
    },

    parentUntil: function(match) {
        return doc(_nodeList(this, false, match, "parentNode"));
    },

    siblings: function(match) {
        var result = [], i;
        this.each(function(node) {
            for (i = 0; i < node.parentNode.children.length; i++) {
                if ((typeof match === "undefined" || node.parentNode.children[i].matches(match)) && node !== node.parentNode.children[i]) {
                    _objectPush(result, node.parentNode.children[i]);
                }
            }
        });
        return doc(result);
    },

    children: function(match) {
        var result = [], i;
        this.each(function(node) {
            for (i = 0; i < node.children.length; i++) {
                if (typeof match === "undefined" || node.children[i].matches(match)) {
                    _objectPush(result, node.children[i]);
                }
            }
        });
        return doc(result);
    },

    find: function(match) {
        return doc(match, this.selector);
    },

    addAttr: function(value, prop) {
        return this.each(function(node) {
            if (typeof value === "object") {
                for (var key in value) {
                    node.setAttribute(key, value[key])
                }
            } else {
                node.setAttribute(value, prop)
            }
        });
    },

    removeAttr: function(value) {
        return this.each(function(node) {
            node.removeAttribute(value);
        });
    },

    getAttr: function(value) {
        return this.nodes[0].getAttribute(value);
    },

    hasAttr: function(value) {
        return!!this.nodes[0].getAttribute(value);
    },

    addClass: function(value) {
        var result = value.split(" "), i;
        return this.each(function(node) {
            for (i = 0; i < result.length; i++) {
                node.classList.add(result[i]);
            }
        });
    },

    removeClass: function(value) {
        var result = value.split(" "), i;
        return this.each(function(node) {
            for (i = 0; i < result.length; i++) {
                node.classList.remove(result[i]);
            }
        });
    },

    getClass: function() {
        return this.nodes[0].getAttribute("class");
    },

    hasClass: function(value) {
        return!!this.nodes[0].classList.contains(value);
    },

    append: function(value) {
        return doc(_insertElement(this, value, "beforeEnd"));
    },

    prepend: function(value) {
        return doc(_insertElement(this, value, "afterBegin"));
    },

    after: function(value) {
        return doc(_insertElement(this, value, "afterEnd"));
    },

    before: function(value) {
        return doc(_insertElement(this, value, "beforeBegin"));
    },

    on: function(status, callback, once) {
        var result = status.split(" "), i;
        return this.each(function(node) {
            for (i = 0; i < result.length; i++) {
                _bindEvent(node, result[i], callback, once);
            }
        });
    },

    off: function(status, callback) {
        var result = status.split(" "), i;
        return this.each(function(node) {
            for (i = 0; i < result.length; i++) {
                _removeEvent(node, result[i], callback);
            }
        });
    }
}
