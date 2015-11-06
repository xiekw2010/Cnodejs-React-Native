const React = require('react-native');
const CNodeService = require('../networkService/CNodeService');
const TopicCell = require('./TopicCellComponent');
const Routes = require('./Routes');
const CommonComponents = require('../iosComponents/CommonComponents');
const DXRefreshControl = require('./DXRefreshControl');
const DXTopMessage = require('./DXTopMessage');
const DXTextMenu = require('./DXTextMenu');

const OPTIONS = ['你好', '问号', '狗带', '好玩', '你好', '问号', '狗带', '好玩', '你好', '问号', '狗带', '好玩'];


const {
  ListView,
  View,
  Text,
} = React;

const LISTVIEWREF = 'listview';
const CONTAINERREF = 'container';

const sectionIDs = ['精华', '置顶', '其他'];

const SearchComponent = React.createClass({
  getInitialState() {
    const dataSourceParam = {
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (section1, section2) => section1 !== section2,
    }
    return {
      dataSource: new ListView.DataSource(dataSourceParam),
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
    console.log('responseData is' + responseData);
    const goodTopics = [];
    const topTopics = [];
    const otherTopics = [];

    responseData.forEach((topic, index) => {
      if (topic.good) {
        goodTopics.push(topic);
      } else if (topic.top) {
        topTopics.push(topic);
      } else {
        otherTopics.push(topic);
      }
    });

    const sectionData = {'精华': goodTopics, '置顶': topTopics, '其他': otherTopics};

    this.setState({
      dataSource: this.state.dataSource.cloneWithRowsAndSections(sectionData, sectionIDs),
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
      headerViewClass: 'UIRefreshControl',
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
          renderSectionHeader={this.renderTopicsTabHeader}
        />
      </View>
    );
  },

  renderTopicsTabHeader(sectionData, sectionID) {
    return (
      <DXTextMenu
        options={OPTIONS}
        style={{height: 38, backgroundColor:'red',flex: 0, position: 'absolute', top: 100}}
        selectedColor={'blue'}
        blur={true}
        blurEffectStyle={2}
        contentInset={{top: 0, left: 0, bottom: 0, right: 0}}
      />
    )
  },

  renderTopic(topic, sectionID, rowID, highlightRow) {
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

module.exports = SearchComponent;
