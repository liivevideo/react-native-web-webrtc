/* global window */

import {
    createElement,
    StyleSheet,
    View
} from 'react-native-web'

import PropTypes from 'prop-types'
import React, { Component } from 'react';

import resolveAssetSource from './resolveAssetSource';
import RTCViewResizeMode from './RTCViewResizeMode';


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
        muted: PropTypes.string,
        autoPlay: PropTypes.string,
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

        this._uri = resolveAssetSource(props && props.source);
        this.state = {rtcVideoViewState: this._uri ? STATUS_PENDING : STATUS_IDLE};
    }

    componentDidMount() {
        if (this.state.rtcVideoViewState === STATUS_PENDING) {
            this._createRTCViewLoader();
        }
    }

    componentDidUpdate() {
        if (this.rtcVideoView) return;

        this.componentDidMount()
    }

    componentWillReceiveProps(nextProps) {
        const nextUri = resolveAssetSource(nextProps.source);

        if (this._uri !== nextUri) {
            this._uri = nextUri
            this.setState({rtcVideoViewState: nextUri ? STATUS_PENDING : STATUS_IDLE});
        }
    }

    componentWillUnmount() {
        this._destroyRTCViewLoader();
    }

    render() {
        const { rtcVideoViewState } = this.state;
        const {
            accessibilityLabel,
            accessible,
            children,
            defaultSource,
            onLayout,
            source,
            testID
        } = this.props;

        const displayRTCView = resolveAssetSource((rtcVideoViewState === STATUS_LOADED) ? source : defaultSource);
        const backgroundRTCView = displayRTCView ? `url("${displayRTCView}")` : null;
        let style = StyleSheet.flatten(this.props.style) || {};

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
                {this.rtcVideoView}
                {children ? (
                    <View children={children} pointerEvents='box-none' style={styles.children} />
                ) : null}
            </View>
        );
    }

    _createRTCViewLoader() {
        this._destroyRTCViewLoader();

        const {streamURL, autoPlay, muted} = this.props;

        var attributes = {src: streamURL}
        if (muted) attributes.muted = true
        if (autoPlay) attributes.autoplay = true

        this.rtcVideoView = createElement('video', attributes);
        this.rtcVideoView.onerror = this._onError;
        this.rtcVideoView.onloadeddata = this._onLoad;
        this.rtcVideoView.src = this._uri;

        this._onLoadStart();
    }

    _destroyRTCViewLoader() {
        if (this.rtcVideoView) {
            this.rtcVideoView.onerror = null;
            this.rtcVideoView.onload = null;
            this.rtcVideoView = null;
        }
    }

    _onError = (nativeEvent) => {
        const { onError } = this.props;

        this._destroyRTCViewLoader();
        this.setState({rtcVideoViewState: STATUS_ERRORED});

        if (onError) onError({nativeEvent})
        this._onLoadEnd();
    }

    _onLoad = (nativeEvent) => {
        const { onLoad } = this.props;

        this._destroyRTCViewLoader();
        this.setState({rtcVideoViewState: STATUS_LOADED});

        if (onLoad) onLoad({nativeEvent})
        this._onLoadEnd();
    }

    _onLoadEnd() {
        const { onLoadEnd } = this.props;

        if (onLoadEnd) { onLoadEnd(); }
    }

    _onLoadStart() {
        const { onLoadStart } = this.props;

        this.setState({rtcVideoViewState: STATUS_LOADING});

        if (onLoadStart) { onLoadStart(); }
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
