var keyMirror = function(obj) {
    var ret = {};
    var key;
    if (!(obj instanceof Object && !Array.isArray(obj))) {
        throw new Error('keyMirror(...): Argument must be an object.');
    }
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            ret[key] = key;
        }
    }
    return ret;
};

const RTCViewResizeMode = keyMirror({
    center: null,
    contain: null,
    cover: null,
    none: null,
    repeat: null,
    stretch: null
});


module.exports = RTCViewResizeMode;
