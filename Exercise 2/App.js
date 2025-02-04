import React,{useState, useEffect} from 'react';
import {StatusBar, Button, StyleSheet, Text, View} from 'react-native';

import {Audio} from "expo-av";
import soundfile from "./short1.wav";

const styles = StyleSheet.create({
  container: {

  },
});


export default function App() {

    const [mySound, setMySound] = useState();

    async function playSound() {
        const soundfile = require('./short1.wav');
        const {sound} = await Audio.Sound.createAsync(soundfile);
        setMySound(sound);
        await sound.playAsync();
    }

    // helps when users spam the sound button
    useEffect(() => {
        return mySound ? () => {
            console.log('Unloading Sound');
            mySound.unloadAsync();
        }
        : undefined;
    }, [mySound]);

  return (
    <View>
      <StatusBar />
      <Button title="Play Sound" onPress={
      ()=>{
          playSound();
      }}
      />
    </View>
  );
}
