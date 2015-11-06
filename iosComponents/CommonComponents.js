const React = require('react-native');
const Colors = require('../commonComponents/Colors');
const CommonStyles = require('../commonComponents/CommonStyles');

const {
  StyleSheet,
  View,
  ActivityIndicatorIOS,
  Text,
} = React;

class CommonComponents {
  static renderLoadingView() {
    return (
      <View style={CommonStyles.container}>
        <ActivityIndicatorIOS size="large" />
      </View>
    );
  }

  static renderPlaceholder(text, image, onPress) {
    return (
      <View>
      </View>
    )
  }

  static renderFloorHeader(floorName) {
    return (
      <View style={CommonStyles.floorTopName}>
        <View style={CommonStyles.lineStyle}>
        </View>
        <Text style={CommonStyles.floorTopText}>
          {floorName}
        </Text>
      </View>
    );
  }

  static renderKengSep() {
    return (
      <View style={CommonStyles.bottomLine}>
      </View>
    )
  }
}

module.exports = CommonComponents;
