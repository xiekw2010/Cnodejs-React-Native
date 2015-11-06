const React = require('react-native');
const CNodeService = require('../networkService/CNodeService');
const TopicCell = require('./TopicCellComponent');
const Routes = require('./Routes');
const CommonComponents = require('../iosComponents/CommonComponents');
const DXRefreshControl = require('./DXRefreshControl');
const DXTopMessage = require('./DXTopMessage');

const {
  ListView,
  View,
  ActivityIndicatorIOS,
} = React;

const LISTVIEWREF = 'listview';
const CONTAINERREF = 'container'

const PostComponent = React.createClass({
  getInitialState() {
    return {
      dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
      loaded: false,
    };
  },

  showError(error) {
    console.log('reloadTopics is' + error);
    DXTopMessage.showTopMessage(this.refs[CONTAINERREF], error.toString(), {offset: 64.0}, () => {
      console.log('did Tap message');
    });
  },

  reloadTopics() {
    CNodeService.reloadTopics((error, responseData) => {
      if (!error) {
        this.updateDataSourceHandler(responseData);
      } else {
        this.showError(error);
      }
      let listNode = this.refs[LISTVIEWREF];
      if (listNode) {
        DXRefreshControl.endRefreshing(listNode);
      }
    });
  },

  appendTopics() {
     CNodeService.appendTopics((error, responseData) => {
      if (!error) {
        this.updateDataSourceHandler(responseData);
      } else {
        this.showError(error);
      }
    });
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

  componentDidUpdate(prevProps, prevState) {
    let node = this.refs[LISTVIEWREF];
    if (!node || this.props.didAddRefreshControl) {
      return;
    }
    let refreshConfig = {
      // options: UIRefreshControl, JHSPullToRefreshControl
      headerViewClass: 'JHSPullToRefreshControl',
      // options: JHSCartoonPullToRefreshView, JHSMagicLampPullToRefreshView
      contentViewClass: 'JHSCartoonPullToRefreshView',
      color: '#AA00FF'
    };
    DXRefreshControl.configureCustom(node, refreshConfig, this.reloadTopics);
    this.props.didAddRefreshControl = true;
  },

  render() {
    if (!this.state.loaded) {
      return CommonComponents.renderLoadingView();
    }

    return (
      <View style={{flex: 1}} ref={CONTAINERREF}>
        <ListView
          ref={LISTVIEWREF}
          dataSource={this.state.dataSource}
          renderRow={this.renderTopic}
          onEndReached={this.appendTopics}
          scrollRenderAheadDistance={50}
          renderFooter={this.renderFooter}
        />
      </View>
    );
  },

  renderFooter() {
    if (!CNodeService.isReachEnd) {
      return (
        <View style={{flex: 1, alignItems: 'center', height: 40, justifyContent: 'center'}} >
          <ActivityIndicatorIOS size='small' />
        </View>
      )
    }
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

module.exports = PostComponent;
