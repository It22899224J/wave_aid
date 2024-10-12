import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";

export default function ReverseLottie() {
  const animationRef = useRef<LottieView>(null);
  const [progress, setProgress] = useState(1); // Start at 1 for reverse playback
  const [isPlaying, setIsPlaying] = useState(true); // Control autoPlay

  useEffect(() => {
    let reverseInterval: NodeJS.Timeout;

    // Play animation in reverse when progress is greater than 0
    if (isPlaying && progress > 0) {
      reverseInterval = setInterval(() => {
        setProgress((prevProgress) => Math.max(prevProgress - 0.01, 0)); // Decrease to 0
      }, 20); // Approx. 50fps
    }

    return () => clearInterval(reverseInterval); // Cleanup interval on unmount
  }, [progress, isPlaying]);

  useEffect(() => {
    // Reset to autoPlay after reverse completes
    if (progress === 0) {
      setTimeout(() => {
        setIsPlaying(false); // Pause reverse animation
        animationRef.current?.play(); // Start the autoPlay forward animation
      }, 1000); // Wait 1 second before restarting autoPlay
    }
  }, [progress]);

  return (
    <View style={styles.container}>
      <LottieView
        ref={animationRef}
        source={require("../assets/loader/loader.json")}
        style={styles.animation}
        progress={progress} // Control animation progress for reverse play
        autoPlay={isPlaying === false} // AutoPlay after reverse completes
        loop
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  animation: {
    width: 300,
    marginTop: 180,
    height: 300,
  },
});
