class Routes {
	static allTopics() {
		return {
			component: require('./AllTopicsComponent'),
			title: 'cnodejs',
		};
	}

	static topic(topic) {
		return {
			component: require('./TopicDetailComponent'),
			title: topic.title,
			passProps: {topic: topic}
		}
	}
}

module.exports = Routes;
