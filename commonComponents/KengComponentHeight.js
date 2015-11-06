var WindowSize = require('react-native').NativeModules.UIManager.Dimensions.window;

const KengComponentHeight = {
  floorBrandContainerHeight: WindowSize.width * 0.4 + 40,
  floorTopNameHeight: 35,
  floorBottomDetailHeight: 35,
  floorBottomLineHeight: 5,
  floorMidImageHeight: WindowSize.width * 0.4,
  floorDoubleItemContainerHeight: 280,
  floorSingleImageHeight: 180,
  floorSingleItemContainerHeight: 300,
}

module.exports = KengComponentHeight;
