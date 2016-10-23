import _ from 'lodash';
import auth from './auth';

class API {
  constructor(opts){
    this.sessionId = _.uniq();
  }

  makeRequest(query) {
    return fetch(`${auth.baseUrl}sessionId=${this.sessionId}&query=${query}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': auth.authorization,
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson.result;
    })
    .catch((error) => {
      console.error(error);
    });
  }

}

export default API;