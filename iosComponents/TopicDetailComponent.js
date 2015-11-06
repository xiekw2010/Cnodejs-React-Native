const React = require('react-native');
const Colors = require('../commonComponents/Colors');
const Configs = require('../config');
const CommonStyles = require('../commonComponents/CommonStyles');
const CommonComponents = require('./CommonComponents');
const DXRefreshControl = require('./DXRefreshControl');

const {
  StyleSheet,
  WebView,
  ActivityIndicatorIOS,
  View,
  Text,
  TouchableHighlight,
} = React;

const styles = StyleSheet.create({
});

const WEBVIEWREF = 'webview';

const TopicDetailComponent = React.createClass({
  propTypes: {
    topic: React.PropTypes.object,
  },

  getTopicUrl() {
    return Configs.topicPath + this.props.topic.id;
  },

  render() {
    return (
      <WebView
        ref={WEBVIEWREF}
        renderError={this.renderError}
        renderLoading={CommonComponents.renderLoadingView}
        url={this.getTopicUrl()}
      />
    );
  },
});

module.exports = TopicDetailComponent
