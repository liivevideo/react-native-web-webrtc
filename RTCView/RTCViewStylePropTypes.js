import RTCViewResizeMode from './RTCViewResizeMode';
import ReactNativeWeb from 'react-native-web';

var BorderPropTypes = ReactNativeWeb.BorderPropTypes;
var ColorPropType = ReactNativeWeb.ColorPropType;
var LayoutPropTypes = ReactNativeWeb.LayoutPropTypes;
var TransformPropTypes = ReactNativeWeb.TransformPropTypes;
import { PropTypes } from 'react';

const hiddenOrVisible = PropTypes.oneOf([ 'hidden', 'visible' ]);

module.exports = {
  ...BorderPropTypes,
  ...LayoutPropTypes,
  ...TransformPropTypes,
  backfaceVisibility: hiddenOrVisible,
  backgroundColor: ColorPropType,
  resizeMode: PropTypes.oneOf(Object.keys(RTCViewResizeMode)),
  /**
   * @platform web
   */
  boxShadow: PropTypes.string,
  opacity: PropTypes.number,
  overflow: hiddenOrVisible,
  /**
   * @platform web
   */
  visibility: hiddenOrVisible,
  /**
   * ?
   */
  width: PropTypes.number,
  height: PropTypes.number,
};
