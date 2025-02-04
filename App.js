import React,{useState, useEffect} from 'react';
import {StatusBar, StyleSheet, Text, View, Image} from 'react-native';

import { Gyroscope } from 'expo-sensors';
import { Audio } from 'expo-av';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#BED8D4',
    },
    text: {
        fontSize: 21,
        fontWeight: 'bold',
        color: '#444444',
    },
    image: {
        width: 300,
        height: 300,
        resizeMode: 'contain',
    },
});

const images = [
    require('./Images/meme1.png'),
    require('./Images/meme2.png'),
    require('./Images/meme3.png'),
    require('./Images/meme4.png'),
    require('./Images/meme5.png'),
];

export default function App() {
    const [{ x, y, z }, setData] = useState({ x: 1, y: 0, z: 0 });
    const [mySound, setMySound] = useState(false);

    const [shakeDetected, setShakeDetected] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        Gyroscope.setUpdateInterval(100);

        const subscription = Gyroscope.addListener(data => {
            setData(data);
            if (Math.abs(data.x) > 2 || Math.abs(data.y) > 2 || Math.abs(data.z) > 2) {
                handleShake();
            }
        });

        return () => subscription.remove();
    }, [mySound]);

    async function playSound() {
        setMySound(true);

        const soundFile = require('./meowSound2.wav');
        const { sound } = await Audio.Sound.createAsync(soundFile);

        sound.setOnPlaybackStatusUpdate(status => {
            if (status.didJustFinish) {
                setMySound(false);
                setShakeDetected(false);
            }
        });

        await sound.playAsync();
    }

    const handleShake = () => {
        if (!mySound) {
            setShakeDetected(true);
            playSound();
            setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar />
            {!shakeDetected && <Text style={styles.text}>Shake for a surrrrprise!</Text>}
            {shakeDetected && <Image source={images[currentImageIndex]} style={styles.image} />}
        </View>
    );
}
