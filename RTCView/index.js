/* global window */

import resolveAssetSource from './resolveAssetSource';
import RTCViewResizeMode from './RTCViewResizeMode';

import {
    createDOMElement,
    StyleSheet,
    View
} from 'react-native-web'

import React, { Component, PropTypes } from 'react';

const STATUS_ERRORED = 'ERRORED';
const STATUS_LOADED = 'LOADED';
const STATUS_LOADING = 'LOADING';
const STATUS_PENDING = 'PENDING';
const STATUS_IDLE = 'IDLE';

const RTCViewSourcePropType = PropTypes.oneOfType([
    PropTypes.shape({
        uri: PropTypes.string.isRequired
    }),
    PropTypes.string
]);

class RTCView extends Component {
    static displayName = 'RTCView'

    static propTypes = {
        ...View.propTypes,
        width: PropTypes.number,
        height: PropTypes.number,
        streamURL: PropTypes.string,
        children: PropTypes.any,
        defaultSource: RTCViewSourcePropType,
        onError: PropTypes.func,
        onLayout: PropTypes.func,
        onLoad: PropTypes.func,
        onLoadEnd: PropTypes.func,
        onLoadStart: PropTypes.func,
        source: RTCViewSourcePropType,
    };

    static defaultProps = {};

    static resizeMode = RTCViewResizeMode;

    constructor(props, context) {
        super(props, context);
        const uri = resolveAssetSource(props.source);
        this._rtcVideoViewState = uri ? STATUS_PENDING : STATUS_IDLE;
        this.state = { isLoaded: false };
    }

    componentDidMount() {
        if (this._rtcVideoViewState === STATUS_PENDING) {
            this._createRTCViewLoader();
        }
    }

    componentDidUpdate() {
        if (this._rtcVideoViewState === STATUS_PENDING && !this.rtcVideoView) {
            this._createRTCViewLoader();
        }
    }

    componentWillReceiveProps(nextProps) {
        const nextUri = resolveAssetSource(nextProps.source);
        if (resolveAssetSource(this.props.source) !== nextUri) {
            this._updateRTCViewState(nextUri ? STATUS_PENDING : STATUS_IDLE);
        }
    }

    componentWillUnmount() {
        this._destroyRTCViewLoader();
    }

    render() {
        const { isLoaded } = this.state;
        const {
            streamURL,
            accessibilityLabel,
            accessible,
            children,
            defaultSource,
            onLayout,
            source,
            testID
        } = this.props;

        const displayRTCView = resolveAssetSource(!isLoaded ? defaultSource : source);
        const backgroundRTCView = displayRTCView ? `url("${displayRTCView}")` : null;
        let style = StyleSheet.flatten(this.props.style);

        const resizeMode = this.props.resizeMode || style.resizeMode || RTCViewResizeMode.cover;
        // remove 'resizeMode' style, as it is not supported by View (N.B. styles are frozen in dev)
        style = process.env.NODE_ENV !== 'production' ? { ...style } : style;
        delete style.resizeMode;

        /**
         * RTCView is a non-stretching View. The rtcVideoView is displayed as a background
         * rtcVideoView to support `resizeMode`. The HTML rtcVideoView is hidden but used to
         * provide the correct responsive rtcVideoView dimensions, and to support the
         * rtcVideoView context menu. Child content is rendered into an element absolutely
         * positioned over the rtcVideoView.
         */
        return (
            <View
                accessibilityLabel={accessibilityLabel}
                accessibilityRole='video'
                accessible={accessible}
                onLayout={onLayout}
                style={[
          styles.initial,
          style,
          backgroundRTCView && { backgroundRTCView },
          resizeModeStyles[resizeMode]
        ]}
                testID={testID}
            >
                {createDOMElement('video', { autoPlay: 'autoPlay', src: streamURL })}
                {children ? (
                    <View children={children} pointerEvents='box-none' style={styles.children} />
                ) : null}
            </View>
        );
    }

    _createRTCViewLoader() {
        const uri = resolveAssetSource(this.props.source);

        this._destroyRTCViewLoader();
        this.rtcVideoView = new window.RTCView();
        this.rtcVideoView.onerror = this._onError;
        this.rtcVideoView.onload = this._onLoad;
        this.rtcVideoView.src = uri;
        this._onLoadStart();
    }

    _destroyRTCViewLoader() {
        if (this.rtcVideoView) {
            this.rtcVideoView.onerror = null;
            this.rtcVideoView.onload = null;
            this.rtcVideoView = null;
        }
    }

    _onError = (e) => {
        const { onError } = this.props;
        const event = { nativeEvent: e };

        this._destroyRTCViewLoader();
        this._updateRTCViewState(STATUS_ERRORED);
        this._onLoadEnd();
        if (onError) { onError(event); }
    };

    _onLoad = (e) => {
        const { onLoad } = this.props;
        const event = { nativeEvent: e };

        this._destroyRTCViewLoader();
        this._updateRTCViewState(STATUS_LOADED);
        if (onLoad) { onLoad(event); }
        this._onLoadEnd();
    };

    _onLoadEnd() {
        const { onLoadEnd } = this.props;
        if (onLoadEnd) { onLoadEnd(); }
    }

    _onLoadStart() {
        const { onLoadStart } = this.props;
        this._updateRTCViewState(STATUS_LOADING);
        if (onLoadStart) { onLoadStart(); }
    }

    _updateRTCViewState(status) {
        this._rtcVideoViewState = status;
        const isLoaded = this._rtcVideoViewState === STATUS_LOADED;
        if (isLoaded !== this.state.isLoaded) {
            this.setState({ isLoaded });
        }
    }
}

const styles = StyleSheet.create({
    initial: {
        alignSelf: 'flex-start',
        backgroundColor: 'transparent',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
    },
    video: {
        borderWidth: 0,
        height: 'auto',
        maxHeight: '100%',
        maxWidth: '100%',
        opacity: 0
    },
    children: {
        bottom: 0,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0
    }
});

const resizeModeStyles = StyleSheet.create({
    center: {
        backgroundSize: 'auto',
        backgroundPosition: 'center'
    },
    contain: {
        backgroundSize: 'contain'
    },
    cover: {
        backgroundSize: 'cover'
    },
    none: {
        backgroundSize: 'auto'
    },
    repeat: {
        backgroundSize: 'auto',
        backgroundRepeat: 'repeat'
    },
    stretch: {
        backgroundSize: '100% 100%'
    }
});

module.exports = RTCView;

