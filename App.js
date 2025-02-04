import React,{useState, useEffect} from 'react';
import {StatusBar, StyleSheet, Text, View, Image} from 'react-native';

import { Accelerometer  } from "expo-sensors";
import {Audio} from "expo-av";

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#BADEFC',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    },
    textStyle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 70,
    },
    image: {
        width: 450,
        height: 450,
        alignSelf: 'center',
    },
});

const SHAKE_THRESHOLD= 1.4;
let lastShakeTime = 0;

export default function App() {

    const [{x, y, z}, setData] = useState({x:0,y:0, z:0});
    const [mySound, setMySound] = useState();

    const [shaken, setShaken] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    async function playSound() {
        const soundfile = require('./horseSound.wav');
        const {sound} = await Audio.Sound.createAsync(soundfile);
        setMySound(sound);
        setIsPlaying(true);

        sound.setOnPlaybackStatusUpdate((status) => {
            if (status.didJustFinish) {
                setIsPlaying(false);
            }
        });

        await sound.playAsync();
    }

    function handleShake(acceleration) {
        const {x, y , z} = acceleration;
        const accelerationMagnitude = Math.sqrt(x * x + y * y);

        if (accelerationMagnitude > SHAKE_THRESHOLD) {
            const currentTime = Date.now();

            if (currentTime - lastShakeTime > 1000) {
                lastShakeTime = currentTime;
                playSound();
                setShaken(true);

                setTimeout(() => setShaken(false), 2000);
            }
        }
    }

    useEffect(() => {
        Accelerometer.setUpdateInterval(100);

        const subscription = Accelerometer.addListener((data) => {
            setData(data);
            handleShake(data);
        });

        return () => {
            subscription.remove();
            if (mySound) {
                mySound.unloadAsync();
            }
        };
    }, [mySound]);

    return (
        <View style={styles.container}>
            <StatusBar/>
            <Text style={styles.textStyle}>{shaken ? 'SHAKE!' : 'Welcome to the shake game'}</Text>
            {isPlaying && (
                <Image source={require('./game1.jpg')} style={styles.image} />
            )}
        </View>
    );
}
