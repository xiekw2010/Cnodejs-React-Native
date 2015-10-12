var TopicWatchMixin = {
  watchTopic(topicService, eventKey, handler) {
    this.topicService = topicService;
    this.watchHandlers = this.watchHandlers || new Map
    this.watchHandlers.set(eventKey, handler || this.defaultTopicHandler)
  },

  componentDidMount() {
    this.getTopicWatches()

    if (!this.watchHandlers) return
    for (var watch of this.watchHandlers) {
      var [key, handler] = watch
      this.topicService.addListener(key, handler);
    }
  },

  componentWillUnmount() {
    if (!this.watchHandlers) return
    for (var watch of this.watchHandlers) {
      var [key, handler] = watch
      this.topicService.removeListener(key, handler);
    }
  },

  defaultTopicHandler() {
    if (this.mounted) {
      this.forceUpdate();
    }
  },
}

module.exports = TopicWatchMixin
