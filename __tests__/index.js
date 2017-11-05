/* eslint-env mocha */

import assert from 'assert';

import Adapter from 'enzyme-adapter-react-16';
import { configure, mount, shallow } from 'enzyme';
import nock from 'nock';
import React from 'react';
import {StyleSheet} from 'react-native-web';

import RTCView from '../RTCView';


// Configure test environment

nock.disableNetConnect();
configure({ adapter: new Adapter() });


const TEST_DOMAIN = 'https://google.com'
const TEST_URI = `${TEST_DOMAIN}/favicon.ico`

const google = nock(TEST_DOMAIN)
.get('/favicon.ico')
.reply(200, function(uri, requestBody, cb)
{
  console.log(ur, requestBody)
  fs.readFile(__dirname + '/fixtures/favicon.ico', cb)
})
//.replyWithFile(200, __dirname + '/fixtures/favicon.ico',
//{ 'Content-Type': 'image/x-icon' });


describe('components/RTCView', () => {
  test('sets correct accessibility role"', () => {
    const rtcVideoView = shallow(<RTCView />);
    assert.equal(rtcVideoView.prop('accessibilityRole'), 'video');
  });

  test('prop "accessibilityLabel"', () => {
    const accessibilityLabel = 'accessibilityLabel';
    const rtcVideoView = shallow(<RTCView accessibilityLabel={accessibilityLabel} />);
    assert.equal(rtcVideoView.prop('accessibilityLabel'), accessibilityLabel);
  });

  test('prop "accessible"', () => {
    const accessible = false;
    const rtcVideoView = shallow(<RTCView accessible={accessible} />);
    assert.equal(rtcVideoView.prop('accessible'), accessible);
  });

  test('prop "children"', () => {
    const children = <div className='unique' />;
    const wrapper = shallow(<RTCView>{children}</RTCView>);
    assert.equal(wrapper.contains(children), true);
  });

  describe('prop "defaultSource"', () => {
    test('sets background rtcVideoView when value is an object', () => {
      const defaultSource = { uri: TEST_URI };
      const rtcVideoView = shallow(<RTCView defaultSource={defaultSource} />);
      const backgroundRTCView = StyleSheet.flatten(rtcVideoView.prop('style')).backgroundRTCView;
      assert(backgroundRTCView.indexOf(defaultSource.uri) > -1);
    });

    test('sets background rtcVideoView when value is a string', () => {
      // emulate require-ed asset
      const defaultSource = TEST_URI;
      const rtcVideoView = shallow(<RTCView defaultSource={defaultSource} />);
      const backgroundRTCView = StyleSheet.flatten(rtcVideoView.prop('style')).backgroundRTCView;
      assert(backgroundRTCView.indexOf(defaultSource) > -1);
    });
  });

  test.skip('prop "onError"', function (done) {
    const source = { uri: TEST_URI }
    mount(<RTCView onError={onError} source={source} />);
    function onError(e) {
      assert.equal(e.nativeEvent.type, 'error');
      done();
    }
  });

  test.skip('prop "onLoad"', function (done) {
    const source = { uri: TEST_URI }
    const rtcVideoView = mount(<RTCView onLoad={onLoad} source={source} />);
    function onLoad(e) {
      assert.equal(e.nativeEvent.type, 'load');
      const hasBackgroundRTCView = rtcVideoView.html()
      .indexOf(`url(&quot;${TEST_URI}&quot;)`) > -1;
      assert.equal(hasBackgroundRTCView, true);
      done();
    }
  });

  test.skip('prop "onLoadEnd"', function (done) {
    const source = { uri: TEST_URI }
    const rtcVideoView = mount(<RTCView onLoadEnd={onLoadEnd} source={source} />);
    function onLoadEnd() {
      const hasBackgroundRTCView = rtcVideoView.html()
      .indexOf(`'url(&quot;${TEST_URI}&quot;)'`) > -1;
      assert.equal(hasBackgroundRTCView, true);
      done();
    }
  });

  test('prop "onLoadStart"', function (done) {
    const source = { uri: TEST_URI }

    mount(<RTCView onLoadStart={done} source={source} />);
  });

  describe('prop "resizeMode"', () => {
    const getBackgroundSize = (rtcVideoView) => StyleSheet.flatten(rtcVideoView.prop('style')).backgroundSize;

    test('value "contain"', () => {
      const rtcVideoView = shallow(<RTCView resizeMode={RTCView.resizeMode.contain} />);
      assert.equal(getBackgroundSize(rtcVideoView), 'contain');
    });

    test('value "cover"', () => {
      const rtcVideoView = shallow(<RTCView resizeMode={RTCView.resizeMode.cover} />);
      assert.equal(getBackgroundSize(rtcVideoView), 'cover');
    });

    test('value "none"', () => {
      const rtcVideoView = shallow(<RTCView resizeMode={RTCView.resizeMode.none} />);
      assert.equal(getBackgroundSize(rtcVideoView), 'auto');
    });

    test('value "stretch"', () => {
      const rtcVideoView = shallow(<RTCView resizeMode={RTCView.resizeMode.stretch} />);
      assert.equal(getBackgroundSize(rtcVideoView), '100% 100%');
    });

    test('no value', () => {
      const rtcVideoView = shallow(<RTCView />);
      assert.equal(getBackgroundSize(rtcVideoView), 'cover');
    });
  });

  describe.skip('prop "source"', function () {
    test('sets background rtcVideoView when value is an object', (done) => {
      const source = { uri: TEST_URI };
      mount(<RTCView onLoad={onLoad} source={source} />);
      function onLoad(e) {
        const src = e.nativeEvent.target.src;
        assert.equal(src, source.uri);
        done();
      }
    });

    test('sets background rtcVideoView when value is a string', (done) => {
      // emulate require-ed asset
      const source = TEST_URI;
      mount(<RTCView onLoad={onLoad} source={source} />);
      function onLoad(e) {
        const src = e.nativeEvent.target.src;
        assert.equal(src, source);
        done();
      }
    });
  });

  describe('prop "style"', () => {
    test('converts "resizeMode" property to "backgroundSize"', () => {
      const rtcVideoView = shallow(<RTCView style={{ resizeMode: RTCView.resizeMode.contain }} />);
      assert.equal(StyleSheet.flatten(rtcVideoView.prop('style')).backgroundSize, 'contain');
    });

    test('removes "resizeMode" property', () => {
      const rtcVideoView = shallow(<RTCView style={{ resizeMode: RTCView.resizeMode.contain }} />);
      assert.equal(StyleSheet.flatten(rtcVideoView.prop('style')).resizeMode, undefined);
    });
  });

  test('prop "testID"', () => {
    const testID = 'testID';
    const rtcVideoView = shallow(<RTCView testID={testID} />);
    assert.equal(rtcVideoView.prop('testID'), testID);
  });
});
