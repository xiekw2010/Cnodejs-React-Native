const React = require('react-native');
const Routes = require('./iosComponents/Routes');

const {
  AppRegistry,
  StyleSheet,
  NavigatorIOS,
} = React;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

const RNCNNode = React.createClass({
  render() {
    return (
     <NavigatorIOS
        style={styles.container}
        initialRoute={Routes.allTopics()}
      />
    );
  },
});

AppRegistry.registerComponent('RN_CNNode', () => RNCNNode);


