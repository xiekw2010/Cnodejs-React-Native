const React = require('react-native');
const RefreshableListView = require('react-native-refreshable-listview');
const CNodeService = require('../networkService/CNodeService');
const TopicCell = require('./TopicCellComponent');
const Routes = require('./Routes');

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
});

const AllTopicsComponent = React.createClass({
  getInitialState() {
    return {
      dataSource: new RefreshableListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
      loaded: false,
    };
  },

  reloadTopics() {
    return CNodeService.reloadTopics((responseData) => this.updateDataSourceHandler(responseData));
  },

  appendTopics() {
    return CNodeService.appendTopics((responseData) => this.updateDataSourceHandler(responseData));
  },

  updateDataSourceHandler(responseData) {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(responseData),
      loaded: true
    });
  },

  componentDidMount() {
    this.reloadTopics();
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
        loadData={this.reloadTopics}
        onEndReached={this.appendTopics}
        scrollRenderAheadDistance={50}
      />
    );
  },

  renderLoadingView() {
    return (
      <View style={styles.container}>
        <Text>
          加载主题中...
        </Text>
      </View>
    );
  },

  renderTopic(topic) {
    return (
      <TopicCell
        topic={topic}
        onCellPress={this.onCellPress}
      />
    );
  },

  onCellPress(topic) {
    this.props.navigator.push(Routes.topic(topic));
  },

});

module.exports = AllTopicsComponent;
