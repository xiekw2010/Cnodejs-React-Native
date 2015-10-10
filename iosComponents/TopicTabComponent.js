'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
} = React;

var TopicTabComponent = React.createClass({
  getInitialState: function() {
    return {
      highlight: false,
    };
  },

  componentDidMount: function() {
  	this.setState({
  		highlight: this.props.topic.top || this.props.topic.good
  	})
  },

  render: function() {
  	var appendStyle = {backgroundColor: '#E5E5E5', color: '#9A9A9A'};
    if (this.state.highlight) {
    	appendStyle = {backgroundColor: '#80BD01', color: '#FFFFFF'};
    }

		return (
      <Text style={[styles.base, appendStyle]}>{this.getTabText()}</Text>
  	);  
	},

  getTabText: function() {
  	if (this.props.topic.top) {
  		return '置顶';
  	};

  	if (this.props.topic.good) {
  		return '精华';
  	};

  	switch (this.props.topic.tab) {
  		case 'ask': 
  			return '问答';
  		case 'share': 
  			return '分享';
  		case 'job': 
  			return '招聘';
  	}

    return '问答';  
  }
});

var styles = StyleSheet.create({
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


module.exports = TopicTabComponent;
