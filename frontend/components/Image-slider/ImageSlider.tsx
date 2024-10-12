import React, { useState } from "react";
import { View, FlatList, Image, StyleSheet, Dimensions } from "react-native";
const { width } = Dimensions.get("window");

export const ImageSlider = ({ images }: any) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reference for the viewable items
  const onViewRef = React.useRef(({ changed }: any) => {
    if (changed[0]) {
      setCurrentIndex(changed[0].index);
    }
  });

  // Render each image
  const renderItem = ({ item }: any) => (
    <Image source={{ uri: item }} style={styles.eventImage} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        snapToInterval={width}
        decelerationRate="fast"
      />
      <View style={styles.dotsContainer}>
        {images.map((_: any, index: any) => (
          <View
            key={index}
            style={[styles.dot, { opacity: currentIndex === index ? 1 : 0.5 }]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
  },
  eventImage: {
    width: width, // Full width of the screen
    height: 200, // Adjust height as necessary
    resizeMode: "cover",
  },
  dotsContainer: {
    position: "absolute",
    bottom: 10,
    flexDirection: "row",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255, 255, 255, 0.7)", // Semi-transparent white
    marginHorizontal: 5,
  },
});
