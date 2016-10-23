import API from './api/';
import SpeechNotification from 'react-native-speech-notification';

import { whoIsHere, tvStatus } from '../modules/freebox/';
import { durationToPoint } from '../modules/maps/';


class ComputeSpeech {
  constructor(props) {
    this.api = new API();

  }

  async compute(speech){
    SpeechNotification.speak({
      message: 'Je m\'en occupe.',
      language: 'FR-fr'
    });

    const apiResult = await this.api.makeRequest(speech);

    console.log('apiResult', apiResult);

    if(apiResult.metadata.intentName === 'presence') {
      const response = await whoIsHere();

      return response;
    }

    if(apiResult.metadata.intentName === 'TV_State') {
      const response = await tvStatus();

      return response;
    }

    if(apiResult.action === 'Time_to_famous_place') {
      const destination = apiResult.parameters.famous_places;
      const response = await durationToPoint(destination);

      return response;
    }

    return {
      speech: 'Je n\'ai pas compris'
    }
  }

}

export default ComputeSpeech;
