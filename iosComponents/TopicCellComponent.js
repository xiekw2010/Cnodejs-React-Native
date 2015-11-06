const React = require('react-native');
const Colors = require('../commonComponents/Colors');
const TopicTab = require('./TopicTabComponent');

const {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableHighlight,
} = React;

const styles = StyleSheet.create({
  cellContentView: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'stretch'
  },

  cellUp: {
    margin: 10,
    height: 40,
    flexDirection: 'column',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },

  avatar: {
    width: 40,
    height: 40,
    backgroundColor: Colors.backGray
  },

  username: {
    marginLeft: 10,
    height: 19,
    fontSize: 13,
    color: Colors.textGray
  },

  createAt: {
    marginLeft: 10,
    marginTop: 5,
    height: 14,
    fontSize: 11,
    color: Colors.textGray
  },

  cellDown: {
    color: Colors.textBlack,
    fontSize: 18,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 3,
    flex: 1
  },

  sepLine: {
    backgroundColor: Colors.lineGray,
    height: 1,
    marginLeft: 5
  },

  cellFooter: {
    alignSelf: 'flex-end',
    height: 16,
    marginRight: 10,
    marginBottom: 5
  },

  replyCount: {
    fontSize: 15,
    color: Colors.purple,
  },

  visitCount: {
    fontSize: 12,
    color: Colors.textGray,
  }
});

const TopicCellComponent = React.createClass({
  propTypes: {
    topic: React.PropTypes.object,
    onCellPress: React.PropTypes.func,
  },

  handleCellPress() {
    this.props.onCellPress(this.props.topic)
  },

  render() {
    const topic = this.props.topic;
    return (
      <TouchableHighlight onPress={this.handleCellPress} underlayColor={Colors.backGray}>
        <View style={styles.cellContentView}>
          <View style={styles.cellUp}>
            <Image
              source={{uri: topic.author.avatar_url}}
              style={styles.avatar}
            />
            <Text style={styles.username}>{topic.author.loginname}</Text>
            <Text style={styles.createAt}>{topic.create_at}</Text>
            <TopicTab topic={topic} />
          </View>
          <Text style={styles.cellDown}>{topic.title}</Text>
          <View style={styles.cellFooter}>
            <Text style={styles.replyCount}>
              {topic.reply_count}
              <Text style={style={fontSize:12, color:Colors.textBlack}}>{'/'}</Text>
              <Text style={styles.visitCount}>{topic.visit_count}</Text>
            </Text>
          </View>
          <View style={styles.sepLine}></View>
        </View>
      </TouchableHighlight>
    );
  },
});

module.exports = TopicCellComponent
