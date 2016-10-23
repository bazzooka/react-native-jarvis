import jsSHA  from "jssha";
import _ from 'lodash';

import auth from './auth.js';


const login = () => {
  return fetch(`${auth.baseUrl}login`)
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson.result;
    })
    .catch((error) => {
      console.error(error);
    });
}

const session = async () => {
  const { challenge } = await login();
  let shaObj = new jsSHA("SHA-1", "TEXT");

  shaObj.setHMACKey(auth.app_token, "TEXT");
  shaObj.update(challenge);

  const password = shaObj.getHMAC("HEX");

  return fetch(`${auth.baseUrl}login/session`, {
    method: 'POST',
    body: JSON.stringify({
      app_id: auth.app_id,
      password,
    })
  })
  .then((response) => response.json())
    .then((responseJson) => {
      return responseJson.result;
    })
    .catch((error) => {
      console.error(error);
    });
}

const presence = async () => {
  const { session_token } = await session();

  return fetch(`${auth.baseUrl}lan/browser/pub/`, {
    headers: {
      'X-Fbx-App-Auth': session_token
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

const whoIsHere = async () => {
  const everybody = await presence();

  const activeSmartphones = _.filter(everybody, (person) => (
    person.active && person.host_type === 'smartphone'
  ));

  if(!activeSmartphones.length) {
    return {
      speech: 'Je ne décèle pas d\'activité monsieur'
    }
  }

  const smartphones = activeSmartphones.map((smartphone) => (
    smartphone.primary_name
  ));

  return {
    speech: `Je détecte les smartphones suivant : ${smartphones.join(' ')}`
  }
}

const isSomebody = async () => {
  const everybody = await presence();

  const activeSmartphones = _.filter(everybody, (person) => (
    person.active && person.host_type === 'smartphone'
  ));

  if(!activeSmartphones.length) {
    return {
      speech: 'Je ne décèle pas d\'activité monsieur'
    }
  }
  return {
    speech: `Je décèle ${activeSmartphones.length} à votre domicile.`
  }
}

const tvStatus = async () => {
  const { session_token } = await session();

  return fetch(`${auth.baseUrl}airmedia/receivers/Freebox%20Player`, {
    method: 'POST',
    body: JSON.stringify({ "action": "stop", "media_type": "video" }),
    headers: {
      'X-Fbx-App-Auth': session_token
    }
  })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.success === true) {
       return {
         speech: `Monsieur, la télé est allumée`
       }
      } else {
        return {
          speech: `Monsieur la télé est éteinte`
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });
}



export { whoIsHere, tvStatus };
