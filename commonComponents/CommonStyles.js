const React = require('react-native');
const Colors = require('./Colors');
const KengHeight = require('./KengComponentHeight');

const {
  StyleSheet,
} = React;

const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  floorTopName: {
    height: KengHeight.floorTopNameHeight,
    backgroundColor: Colors.backWhite,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },

  lineStyle: {
    width: 3,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 5,
    backgroundColor: Colors.red,
  },

  floorTopText: {
    fontSize: 16,
    marginLeft: 5,
    color: Colors.textBlack,
    alignSelf: 'center',
  },

  bottomLine: {
    backgroundColor: Colors.backGray,
    height: KengHeight.floorBottomLineHeight,
  },

  shadowLine: {
    shadowColor: '#999999',
    shadowOpacity: 0.8,
    shadowRadius: 1,
    shadowOffset: {
      height: 2,
      width: 1
    },
  },

  onHighlight: {

  },

});

module.exports = commonStyles;
