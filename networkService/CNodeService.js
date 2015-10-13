const _ = require('underscore');
const urlJoin = require('url-join');
const config = require('../config');
const {EventEmitter} = require('events');

const TOPICS_API_PATH = config.apiHost + '/topics' + '?limit=' + config.loadPerPage;
const MAX_PAGE = config.loadMaxPages;

class CNodeService extends EventEmitter {
   url(append) {
    let page = 1;
    if (append) {
      if (this.topicsCurrentPage >= MAX_PAGE) {
        return;
      }

      this.topicsCurrentPage += 1;
      page = this.topicsCurrentPage;
    } else {
       this.topicsCurrentPage = 1;
       this.topics = [];
    }
    const url = TOPICS_API_PATH + '&page=' + page;
    console.log('url is '+ url);
    return url;
  }

  reloadTopics(handler) {
    return fetch(this.url(false))
      .then(response => response.json())
      .then(responseData => {
        this.topics = responseData.data;
        handler(this.topics);
      })
      .done()
  }

  appendTopics(handler) {
    if (this.topicsCurrentPage >= MAX_PAGE) {
      return;
    }

    return fetch(this.url(true))
      .then(response => response.json())
      .then(responseData => {
        this.topics.push(...responseData.data);
        handler(this.topics);
      })
      .done()
  }

  cconstrutor() {
    this.topics = [];
    this.topicsCurrentPage = 1;
  }
}

module.exports = new CNodeService
