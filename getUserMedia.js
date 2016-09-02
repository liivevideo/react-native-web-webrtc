'use strict';

var getUserMedia = (navigator.getUserMedia || navigator.mozGetUserMedia ||
navigator.webkitGetUserMedia || navigator.msGetUserMedia).bind(navigator);
export default getUserMedia;

