const React = require('react-native');
const Colors = require('../commonComponents/Colors');

const {
  StyleSheet,
  WebView,
} = React;

const styles = StyleSheet.create({
});

const TopicDetailComponent = React.createClass({
  propTypes: {
    topic: React.PropTypes.object,
  },

  render() {
    const topic = this.props.topic;
    return (
      <WebView
        // renderError={}
        // renderLoading={}
        html={topic.content}
      />
    );
  },
});

module.exports = TopicDetailComponent
