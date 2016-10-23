import moment from 'moment';
import auth from './auth';

const places = {
  home: {
    longitude: '48.989191',
    latitude: '2.301989'
  },
  work: {
    longitude: '48.871928',
    latitude: '2.337708'
  }
}


async function currentPosition() {
  return await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        return resolve ({ latitude: coords.latitude, longitude: coords.longitude });
      },
      (error) => {
        console.error('resolve position', error);
        return reject(error);
      },
      {enableHighAccuracy: false, timeout: 20000, maximumAge: 10000}
    );
  });
}

async function durationToPoint(destination) {
  try {
    const startPoint = await currentPosition();
    const endPoint = places[destination];
    const url = `${auth.baseUrl}&mode=transit&origin=${startPoint.latitude},${startPoint.longitude}&destination=${endPoint.longitude},${endPoint.latitude}`;

    const way = await fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson.routes[0].legs[0];
      })
      .catch((error) => {
        console.error(error);
      });

    const duration = way.duration.value * 1000;
    const arrivalTime = way.arrival_time.value  * 1000;

    const duration_hours = moment.duration(duration).get('hours');
    const duration_minutes = moment.duration(duration).get('minutes');
    const duration_secondes = moment.duration(duration).get('seconds');
    let final_duration = duration_hours ? duration_hours + ' heures ' : '';
    final_duration += duration_minutes ? duration_minutes + ' minutes ' : '';
    final_duration += duration_secondes ? duration_secondes + ' secondes ' : '';

    let final_time = moment(arrivalTime).format('H') + ' heure ';
    final_time += moment(arrivalTime).format('mm');

    return {
      speech: `Monsieur d'après mes calculs vous devriez mettre ${final_duration} et arriver vers ${final_time}.`
    }

  } catch(e) {
    console.error(e);
    return {
      speech: `Désolé monsieur, je n'arrive pas à vous localiser.`
    }
  }
}

function durationBetweenPoint(startPoint, endPoint) {

}

export { durationBetweenPoint, durationToPoint };