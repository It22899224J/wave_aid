import React, { useCallback, useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Pressable } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Icon2 from "react-native-vector-icons/AntDesign";
import { BlurView } from "expo-blur";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@/context/AuthContext";
import { useAllUser, User } from "@/context/AllUserContext";

interface EventCard {
  item: {
    id: string;
    beachName: string;
    organizer: string;
    date: string;
    time: string;
    weather: string;
    tide: string;
    image: string;
  };
  onRemove: (id: string) => void;
}

export const EventCard: React.FC<EventCard> = ({ item, onRemove }) => {

  const navigate = useNavigation()
   const { signOut, user, loading: authLoading } = useAuth();
   const { users, loading: allUserLoading } = useAllUser();
   const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<User | undefined>(undefined);
  
  const markAsComplete = () => {
    navigate.navigate("EventCompleteForm" as never)
  }

    const initializeUserDetails = useCallback(() => {
      if (!allUserLoading && !authLoading && users && user) {
        return users.find((userDoc) => userDoc.userId === user.uid);
      }
      return undefined;
    }, [allUserLoading, authLoading, users, user]);
  
  
  useEffect(() => {
    setUserDetails(initializeUserDetails());
    const randomIndex = Math.floor(Math.random() * 5);
  }, [initializeUserDetails]);

  return (
    <View style={[styles.card, { borderRadius: 10 }]}>
      <View style={styles.cardInfo}>
        <Text style={styles.beachName}>{item.beachName}</Text>
        <View style={styles.row}>
          <Icon name="calendar" size={24} color="#000" />
          <Text style={styles.date}>{item.date}</Text>
        </View>
        <View style={styles.row}>
          <Icon name="time" size={24} color="#000" />
          <Text style={[styles.status]}>{item.time}</Text>
        </View>
        <View style={styles.row}>
          <Icon name="person" size={24} color="#000" />
          <Text style={[styles.wasteLevel]}>{item.organizer}</Text>
        </View>
      </View>

      <Image source={{ uri: item.image }} style={styles.cardImage} />
      {userDetails?.role === "Admin" && (
        <View>
          <TouchableOpacity
            style={styles.completeButton}
            onPress={() => markAsComplete()}
          >
            <Icon2 name="checkcircle" size={24} color="#00ff00" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => onRemove(item.id)}
          >
            <Icon name="trash" size={24} color="#FF0000" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginHorizontal: 5,
    marginTop: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 30,
    flexDirection: "row",
  },
  cardInfo: {
    flex: 1,
    padding: 15,
    gap: 5,
  },
  beachName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    gap: 10,
  },
  date: {
    marginLeft: 5,
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  wasteLevel: {
    marginLeft: 5,
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  status: {
    marginLeft: 5,
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  cardImage: {
    width: 150,
    resizeMode: "cover",
    borderTopLeftRadius: 100,
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
  },
  removeButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    // backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 12,
    padding: 5,
  },
  completeButton: {
    position: "absolute",
    bottom: 10,
    right: 45,
    // backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 12,
    padding: 5,
  },
});
