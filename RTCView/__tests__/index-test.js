/* eslint-env mocha */

import assert from 'assert';
import RTCView from '../';
import React from 'react';
import StyleSheet from '../../../apis/StyleSheet';
import { mount, shallow } from 'enzyme';

suite('components/RTCView', () => {
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

  suite('prop "defaultSource"', () => {
    test('sets background rtcVideoView when value is an object', () => {
      const defaultSource = { uri: 'https://google.com/favicon.ico' };
      const rtcVideoView = shallow(<RTCView defaultSource={defaultSource} />);
      const backgroundRTCView = StyleSheet.flatten(rtcVideoView.prop('style')).backgroundRTCView;
      assert(backgroundRTCView.indexOf(defaultSource.uri) > -1);
    });

    test('sets background rtcVideoView when value is a string', () => {
      // emulate require-ed asset
      const defaultSource = 'https://google.com/favicon.ico';
      const rtcVideoView = shallow(<RTCView defaultSource={defaultSource} />);
      const backgroundRTCView = StyleSheet.flatten(rtcVideoView.prop('style')).backgroundRTCView;
      assert(backgroundRTCView.indexOf(defaultSource) > -1);
    });
  });

  test('prop "onError"', function (done) {
    this.timeout(5000);
    mount(<RTCView onError={onError} source={{ uri: 'https://google.com/favicon.icox' }} />);
    function onError(e) {
      assert.equal(e.nativeEvent.type, 'error');
      done();
    }
  });

  test('prop "onLoad"', function (done) {
    this.timeout(5000);
    const rtcVideoView = mount(<RTCView onLoad={onLoad} source={{ uri: 'https://google.com/favicon.ico' }} />);
    function onLoad(e) {
      assert.equal(e.nativeEvent.type, 'load');
      const hasBackgroundRTCView = (rtcVideoView.html()).indexOf('url(&quot;https://google.com/favicon.ico&quot;)') > -1;
      assert.equal(hasBackgroundRTCView, true);
      done();
    }
  });

  test('prop "onLoadEnd"', function (done) {
    this.timeout(5000);
    const rtcVideoView = mount(<RTCView onLoadEnd={onLoadEnd} source={{ uri: 'https://google.com/favicon.ico' }} />);
    function onLoadEnd() {
      assert.ok(true);
      const hasBackgroundRTCView = (rtcVideoView.html()).indexOf('url(&quot;https://google.com/favicon.ico&quot;)') > -1;
      assert.equal(hasBackgroundRTCView, true);
      done();
    }
  });

  test('prop "onLoadStart"', function (done) {
    this.timeout(5000);
    mount(<RTCView onLoadStart={onLoadStart} source={{ uri: 'https://google.com/favicon.ico' }} />);
    function onLoadStart() {
      assert.ok(true);
      done();
    }
  });

  suite('prop "resizeMode"', () => {
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

  suite('prop "source"', function () {
    this.timeout(5000);

    test('sets background rtcVideoView when value is an object', (done) => {
      const source = { uri: 'https://google.com/favicon.ico' };
      mount(<RTCView onLoad={onLoad} source={source} />);
      function onLoad(e) {
        const src = e.nativeEvent.target.src;
        assert.equal(src, source.uri);
        done();
      }
    });

    test('sets background rtcVideoView when value is a string', (done) => {
      // emulate require-ed asset
      const source = 'https://google.com/favicon.ico';
      mount(<RTCView onLoad={onLoad} source={source} />);
      function onLoad(e) {
        const src = e.nativeEvent.target.src;
        assert.equal(src, source);
        done();
      }
    });
  });

  suite('prop "style"', () => {
    test('converts "resizeMode" property', () => {
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
