// document.querySelectorAll
document.querySelectorAll||function(e,t){e=document,t=e.createStyleSheet(),e.querySelectorAll=function(l,r,o,u,n){for(n=e.all,r=[],o=(l=l.replace(/\[for\b/gi,"[htmlFor").split(",")).length;o--;){for(t.addRule(l[o],"k:v"),u=n.length;u--;)n[u].currentStyle.k&&r.push(n[u]);t.removeRule(0)}return r}}();

!function(doc, elm, arr, str, evt) {
    "use strict";

    // Element.prototype.classList
    if (typeof doc.documentElement.classList === "undefined" && typeof elm.classList === "undefined") {
        var DOMTokenList = function(node) {
            this.add = function(name) {
                if (this.contains(name)) return;
                node.className = node.className.trim() + " " + name;
            },
            this.remove = function(name) {
                node.className = node.className.replace(new RegExp("(^|\\s+)"+ name +"(\\s+|$)"),' ');
            },
            this.contains = function(name) {
                return new RegExp("(^|\\s+)"+ name +"(\\s+|$)").test(node.className);
            },
            this.toggle = function(name) {
                return this.contains(name) ? this.remove(name) : this.add(name);
            },
            this.item = function(index) {
                return node.className.split(/\s+/)[index] || null;
            }
        }
        window.DOMTokenList = DOMTokenList;
        Object.defineProperty(elm, "classList", {
            get: function() {
                return new DOMTokenList(this);
            }
        });
    }

    // Element.prototype.matches
    if (typeof elm.matches === "undefined") {
        elm.matches = elm.matchesSelector || elm.mozMatchesSelector || elm.msMatchesSelector || elm.oMatchesSelector || elm.webkitMatchesSelector || function(node) {
            for (var list = doc.querySelectorAll(node) , len = list.length; --len >= 0 && list.item(len)!==this;);
            return len > -1;
        }
    }

    // Element.prototype.nextElementSibling
    if (typeof doc.documentElement.nextElementSibling === "undefined") {
        Object.defineProperty(elm, "nextElementSibling", {
            get: function() {
                for (var node = this.nextSibling; node && 1!==node.nodeType;) node = node.nextSibling;
                return node;
            }
        });
    }

    // Element.prototype.previousElementSibling
    if (typeof doc.documentElement.previousElementSibling === "undefined") {
        Object.defineProperty(elm, "previousElementSibling", {
            get: function() {
                for (var node = this.previousSibling; node && 1!==node.nodeType;) node = node.previousSibling;
                return node;
            }
        });
    }

    // Element.prototype.firstElementChild
    if (typeof doc.documentElement.firstElementChild === "undefined") {
        Object.defineProperty(elm, "firstElementChild", {
            get: function() {
                for (var i = 0, node, child = this.children, len = child.length; i < len; i++) {
                    if (node = child[i],1 === node.nodeType) return child[i];
                }
                return null;
            }
        });
    }

    // Element.prototype.lastElementChild
    if (typeof doc.documentElement.lastElementChild === "undefined") {
        Object.defineProperty(elm, "lastElementChild", {
            get: function() {
                for (var node, child = this.children, len = child.length-1; len >= 0; len--) {
                    if (node = child[len],1 === node.nodeType) return node;
                }
                return null;
            }
        });
    }

    // Event.prototype.preventDefault
    if (typeof evt.preventDefault === "undefined") {
        evt.preventDefault = function() {
            this.returnValue = false;
        }
    }

    // Event.prototype.stopPropagation
    if (typeof evt.stopPropagation === "undefined") {
        evt.stopPropagation = function() {
            this.cancelBubble = true;
        }
    }

    // String.prototype.trim
    if (typeof str.trim === "undefined") {
        str.trim = function() {
            return this.replace(/^\s+|\s+$/g, "");
        }
    }

    // Array.prototype.map
    if (typeof arr.map === "undefined") {
        arr.map = function(callback, context) {
            for (var i = 0, len = this.length, res = []; i < len; i++) {
                if (this.hasOwnProperty(i)) {
                    res[i] = callback.call(context, this[i], i, this);
                }
            }
            return res;
        }
    }

    // Array.prototype.filter
    if (typeof arr.filter === "undefined") {
        arr.filter = function(callback, context) {
            for (var i = 0, len = this.length, res = []; i < len; i++) {
                if (this.hasOwnProperty(i)) {
                    if (callback.call(context, this[i], i, this)) res.push(this[i]);
                }
            }
            return res;
        }
    }

    // Array.prototype.indexOf
    if (typeof arr.indexOf === "undefined") {
      arr.indexOf = function(search, index) {
        var i, obj = Object(this), len = obj.length >>> 0, index = index | 0
        if (len === 0 || index >= len) return -1;
        i = Math.max(index >= 0 ? index : len - Math.abs(index), 0);
        for (; i < len; i++) if (obj[i] === search) return i;
        return -1;
      }
    }

    // Array.prototype.forEach.call
    if (typeof arr.forEach === "undefined") {
        arr.forEach = function(callback) {
            var arg, obj = Object(this), len = obj.length >>> 0;
            if (arguments.length > 1) arg = arguments[1];
            for (var i = 0; i < len; i++) callback.call(arg, obj[i], i, obj);
        }
    }

    // Array.prototype.slice.call
    var arrSlice = Array.prototype.slice;
    try {
        arrSlice.call(document.documentElement);
    }
    catch (e) {
        Array.prototype.slice = function(begin, end) {
            var i, len = this.length, res = [];
            for (var i = 0; i < len; i++) res[i] = (this.charAt) ? this.charAt(i) : this[i];
            return arrSlice.call(res, begin, end || res.length);
        }
    }

    // requestAnimationFrame
    if (typeof window.requestAnimationFrame === "undefined") {
        window.requestAnimationFrame = function() {
        	return (
        		window.requestAnimationFrame ||
        		window.webkitRequestAnimationFrame ||
        		window.mozRequestAnimationFrame ||
        		window.oRequestAnimationFrame ||
        		window.msRequestAnimationFrame ||
        		function(func) {
        			window.setTimeout(func, 1000 / 60);
        		}
        	);
        }();
    }
}(document, Element.prototype, Array.prototype, String.prototype, Event.prototype);
