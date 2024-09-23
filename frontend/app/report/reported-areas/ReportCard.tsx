import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // For icons

interface ReportCardProps {
  item: {
    id: string;
    beachName: string;
    date: string;
    wasteLevel: string;
    wasteLevelColor: string;
    status: string;
    statusColor: string;
    image: string;
  };
  onRemove: (id: string) => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({ item, onRemove }) => {
    return (
      <View style={styles.card}>
        <View style={styles.cardInfo}>
          <Text style={styles.beachName}>{item.beachName}</Text>
          <View style={styles.row}>
            <Icon name="calendar" size={20} color="#000" />
            <Text style={styles.date}>{item.date}</Text>
          </View>
          <View style={styles.row}>
            <Icon name="trash" size={20} color="#000" />
            <Text style={[styles.wasteLevel, { color: item.wasteLevelColor }]}>{item.wasteLevel}</Text>
          </View>
          <View style={styles.row}>
            <Icon name="pencil" size={20} color="#000" />
            <Text style={[styles.status, { color: item.statusColor }]}>{item.status}</Text>
          </View>
        </View>
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <TouchableOpacity style={styles.removeButton} onPress={() => onRemove(item.id)}>
          <Icon name="trash" size={24} color="#FF0000" />
        </TouchableOpacity>
      </View>
    );
};

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
      date: {
        marginLeft: 5,
        fontSize: 14,
        color: '#555',
      },
      wasteLevel: {
        marginLeft: 5,
        fontSize: 14,
        fontWeight: 'bold',
      },
      status: {
        marginLeft: 5,
        fontSize: 14,
        fontWeight: 'bold',
      },
      cardImage: {
        width: 150,
        resizeMode: "cover",
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

