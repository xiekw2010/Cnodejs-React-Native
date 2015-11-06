const _ = require('underscore');
const config = require('../config');
const {EventEmitter} = require('events');

const TOPICS_API_PATH = config.apiHost + '/topics' + '?limit=' + config.loadPerPage;
const MAX_PAGE = config.loadMaxPages;

class CNodeService extends EventEmitter {
   url(append) {
    let page = 1;
    if (append) {
      this.topicsCurrentPage += 1;
      page = this.topicsCurrentPage;
    } else {
       this.topicsCurrentPage = 1;
       this.topics = [];
       this.isReachEnd = false;
    }
    const url = TOPICS_API_PATH + '&page=' + this.topicsCurrentPage;
    return url;
  }

  reloadTopics(handler) {
    return fetch(this.url(false))
      .then(response => response.json())
      .then(responseData => {
        this.topics = responseData.data;
        handler(null, this.topics);
      })
      .catch(error => handler(error, null));
  }

  appendTopics(handler) {
    if (this.topicsCurrentPage >= MAX_PAGE || this.topics.length == 0) {
      this.isReachEnd = true;
      return;
    }

    return fetch(this.url(true))
      .then(response => response.json())
      .then(responseData => {
        this.topics = this.topics;
        this.topics.push(...responseData.data);
        handler(null, this.topics);
      })
      .catch(error => handler(error, null));
  }

  constructor() {
    super();
    this.topics = [];
    this.topicsCurrentPage = 1;
    this.isReachEnd = false;
  }
}

module.exports = new CNodeService
