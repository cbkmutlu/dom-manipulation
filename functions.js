function _addEvent(node, status, callback) {
    if (window.addEventListener) {
        node.addEventListener(status, callback, false);
    } else {
        if (status === "DOMContentLoaded") {
            document.attachEvent("onreadystatechange", function() {
                if (document.readyState !== "loading") {
                    document.onreadystatechange = null;
                    callback();
                }
            });
        } else {
            node.attachEvent("on" + status, callback);
        }
    }
}

function _removeEvent(node, status, callback) {
    if (window.removeEventListener) {
        node.removeEventListener(status, callback);
    } else {
        node.detachEvent("on" + status, callback);
    }
}

function _bindEvent(node, status, callback, once) {
    var bind = function(value) {
        callback.call(node, value);
        if (once === true) {
            _removeEvent(node, status, bind);
        }
    }
    _addEvent(node, status, bind);
}

// type null = single, type true = all, type false = until
function _nodeList(that, type, match, sibling) {
    var result = [];
    that.each(function(node) {
        while((node = node[sibling]) !== null && node !== document) {
            if (typeof match === "undefined" || node.matches(match)) {
                if (type === false) {
                    return false;
                } else {
                    _objectPush(result, node);
                }
            }
            if (type === null) {
                return false;
            } else if (type === false) {
                _objectPush(result, node);
            }
        }
    });
    return result;
}

function _objectPush(array, value) {
    for (var i = 0; i < array.length; i++) {
        if(array[i] === value) {
            return;
        }
    }
    return array.push(value);
}

function _insertElement(that, value, position) {
    if (value instanceof doc || (typeof value === "object" && value.nodes.length > 0)) {
        var clone, i;
        for (i = 0; i < value.nodes.length; i++) {
            clone = value.nodes[i].cloneNode(true);
            value.nodes[i].parentNode.removeChild(value.nodes[i]);
            that.each(function(node) {
                node.insertAdjacentElement(position, clone);
            });
        }
    } else {
        var div = document.createElement("div");
        div.innerHTML = value.trim();
        value = div.firstElementChild;
        that.each(function(node) {
            node.insertAdjacentElement(position, value);
        });
    }
}
