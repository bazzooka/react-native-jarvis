/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {AppRegistry, StyleSheet, Text, View, TouchableHighlight} from 'react-native';
import SpeechNotification from 'react-native-speech-notification';

import ComputeSpeech from './logic/ComputeSpeech.js';
import VoiceModule from './components/voice/VoiceModule';

class Jarvis extends Component {
  constructor(props) {
    super(props);

    this.computeSpeech = new ComputeSpeech();
  }

  async componentDidMount() {
    // SpeechNotification.speak({
    //   message: 'Démarrage des systèmes...',
    //   language: 'FR-fr'
    // });


    // let response = {};
    //
    // try {
    //   response = await this.speechResults(['Qui est à la maison ?']);
    // } catch(e) {
    //   console.log(e)
    // };
    //
    // SpeechNotification.speak({
    //   message: response.speech,
    //   language: 'FR-fr'
    // });

    // SpeechNotification.notify({
    //   title: 'Title',
    //   // icon: 'icon', // {icon}.png/.jpg must be present in each corresponding android/app/src/main/res/drawable-*dpi/ folders
    //   icon: 'lc_launcher.png',
    //   message: 'Monsieur je fais un test de notification',
    //   language: 'FR-fr'
    // });

    //requestCameraPermission();

    this.speechResults(['combien de temps pour aller au travail']);

  }

  async speechResults(results) {
    const response = await this.computeSpeech.compute(results[0]);

    SpeechNotification.speak({
      message: response.speech,
      language: 'FR-fr'
    })

  }

  render() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position);
        //this.setState({initialPosition});
      },
      (error) => alert(JSON.stringify(error)),
      //{enableHighAccuracy: false, timeout: 20000, maximumAge: 1000}
    );

    return (
      <View style={styles.container}>
        <VoiceModule
          onResult={this.speechResults.bind(this)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  }
});

AppRegistry.registerComponent('Jarvis', () => Jarvis);
