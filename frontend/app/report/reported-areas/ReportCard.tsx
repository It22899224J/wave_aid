import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface ReportItem {
  id: string;
  beachName: string;
  date: string;
  wasteLevel: string;
  wasteLevelColor: string;
  status: string;
  statusColor: string;
  image: string;
}

interface ReportCardProps {
  item: ReportItem;
  onRemove: (id: string) => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({ item, onRemove }) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardInfo}>
        <Text style={styles.beachName}>{item.beachName}</Text>
        <InfoRow icon="calendar" text={item.date} />
        <InfoRow
          icon="trash"
          text={item.wasteLevel}
          textStyle={{ color: item.wasteLevelColor }}
        />
        <InfoRow
          icon="pencil"
          text={item.status}
          textStyle={{ color: item.statusColor }}
        />
      </View>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => onRemove(item.id)}
      >
        <Icon name="trash" size={24} color="#FF0000" />
      </TouchableOpacity>
    </View>
  );
};

const InfoRow: React.FC<{
  icon: string;
  text: string;
  textStyle?: object;
}> = ({ icon, text, textStyle }) => (
  <View style={styles.row}>
    <Icon name={icon} size={20} color="#000" />
    <Text style={[styles.rowText, textStyle]}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  cardInfo: {
    flex: 1,
    padding: 15,
  },
  beachName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  rowText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#555',
  },
  cardImage: {
    width: 150,
    resizeMode: 'cover',
    borderTopLeftRadius: 100,
    borderBottomLeftRadius: 100,
  },
  removeButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    padding: 5,
  },
});