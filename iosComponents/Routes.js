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

	static search() {
		return {
			component: require('./SearchComponent'),
			title: '搜索'
		}
	}

	static personal() {
		return {
			component: require('./PersonalComponent'),
			title: '我'
		}
	}

	static post() {
		return {
			component: require('./PostComponent'),
			title: '发布'
		}
	}

	static message() {
		return {
			component: require('./MessageComponent'),
			title: '消息'
		}
	}
}

module.exports = Routes;
