const React = require('react-native');
const Colors = require('../commonComponents/Colors');

const {
  StyleSheet,
  Text,
} = React;

const styles = StyleSheet.create({
  base: {
    position: 'absolute',
    right: 10,
    top: 0,
    borderRadius: 2,
    width: 40,
    fontSize: 16,
    height: 18,
    textAlign: 'center',
  },
});

const TopicTabComponent = React.createClass({
  propTypes: {
    topic: React.PropTypes.object,
  },

  getInitialState() {
    return {
      highlight: false,
    };
  },

  componentWillMount() {
    this.setState({
      highlight: this.props.topic.top || this.props.topic.good,
    });
  },

  getTabText() {
    if (this.props.topic.top) {
      return '置顶';
    }

    if (this.props.topic.good) {
      return '精华';
    }

    switch (this.props.topic.tab) {
    case 'ask':
      return '问答';
    case 'share':
      return '分享';
    case 'job':
      return '招聘';
    default:
    }

    return null;
  },

  render() {
    let appendStyle = {backgroundColor: Colors.backGray, color: Colors.textGray};
    if (this.state.highlight) {
      appendStyle = {backgroundColor: Colors.green, color: '#FFFFFF'};
    }

    const tabText = this.getTabText();
    if (tabText === null) {
      return null;
    }

    return (
      <Text style={[styles.base, appendStyle]}>{tabText}</Text>
    );
  },
});

module.exports = TopicTabComponent;
