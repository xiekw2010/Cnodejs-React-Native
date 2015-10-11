const React = require('react-native');
const TopicTab = require('./TopicTabComponent');
const RefreshableListView = require('react-native-refreshable-listview');
const Colors = require('../commonComponents/Colors');

const {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
} = React;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },

  listView: {
    backgroundColor: '#FFFFFF',
  },

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
    height: 40
  },

  username: {
    marginLeft: 10,
    height: 19,
    fontSize: 15,
    color: Colors.textGray
  },

  createAt: {
    marginLeft: 10,
    marginTop: 5,
    height: 14,
    fontSize: 13,
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
    fontSize: 13,
    color: '#444ACC',
    marginRight: 10,
    marginBottom: 5
  }
});

let currentPage = 1;
let MAX_PAGE = 3;
let REQUEST_URL_TOPICS = 'https://cnodejs.org/api/v1/topics?limit=15';
let topics = [];

const AllTopicsComponent = React.createClass({
  getInitialState() {
      return {
        dataSource: new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1 !== row2,
        }),
        loaded: false,            
      };
  },

  componentDidMount() {
    this.fetchData();     
  },

  getRequestURL(append) {
    let page = 1;
    if (append) {
      if (currentPage > MAX_PAGE) {
        return;
      }

      currentPage += 1;
      page = currentPage;
    } else {
      currentPage = 1;
      topics = [];
    }
    const url = REQUEST_URL_TOPICS + '&page=' + page;

    return url;
  },

  fetchData() {
    fetch(this.getRequestURL(false))
    .then((response) => response.json())
    .then((responseData) => {
      topics = responseData.data;
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(topics),
        loaded: true,
      });
    })
    .done();
  },

  appendData() {
    if (currentPage > MAX_PAGE) {
      return;
    }
    console.log('appendData now');
    fetch(this.getRequestURL(true))
      .then((response) => response.json())
      .then((responseData) => {
        topics.push.apply(topics, responseData.data);
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(topics),
          loaded: true,
        });
      })
      .done();
  },

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return (
      <RefreshableListView
        style={styles.listView}
        dataSource={this.state.dataSource}
        renderRow={this.renderTopic}
        loadData={this.fetchData}
        onEndReached={this.appendData}
        scrollRenderAheadDistance={50}
      />
    );
  },

  renderLoadingView() {
    return (
      <View style={styles.container}>
        <Text>
          Loading topics...
        </Text>
      </View>
    );
  },

  renderTopic(topic) {
    return (
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
        <Text style={styles.cellFooter}>{topic.reply_count + '/' + topic.visit_count}</Text>
        <View style={styles.sepLine}></View>
      </View>
    );
  },

});

module.exports = AllTopicsComponent;


