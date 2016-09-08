# react-native-web-webrtc

A WebRTC module for React Native Web.

[![Build Status](https://travis-ci.org/liivevideo/react-native-web-webrtc.svg?branch=master)](https://travis-ci.org/liivevideo/react-native-web-webrtc)

## Support
- Supports browsers and chromeOS.  
- Support video and audio communication.  
- Supports data channels.  
- You can use it to build a client side application using react-native-web that can use WebRTC.

## Installation

### react-native-web-webrtc:

- [Web](https://github.com/liivevideo/react-native-web-webrtc/blob/master/Documentation/WebInstallation.md)
- [ChromeOS](https://github.com/liivevideo/react-native-web-webrtc/blob/master/Documentation/ChromeOSInstallation.md)

## Usage
Now, you can use WebRTC using react-native in a browser or chromeOS.
In your `index.web.js`/`index.chromeos.js`

```javascript
var WebRTC = require('react-native-web-webrtc');
var {
  RTCPeerConnection,
  RTCMediaStream,
  RTCIceCandidate,
  RTCSessionDescription,
  MediaStreamTrack,
  getUserMedia,
  RTCView
} = WebRTC;
```

## TODO:

* Example project
* Documentation of implementation
* Clean up RTCView: unnecessary code.

## Sister Projects:

This is a sister project to: [react-native-webrtc](https://github.com/oney/react-native-webrtc) and [react-native-web](git://github.com/necolas/react-native-web.git)
