import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, Image, TouchableOpacity} from 'react-native';
import {styles} from '../styles/GenericStyles';
import {Actions} from 'react-native-router-flux';
import jsonPlaceholderAPI from '../constants/APIcaller';
import Logger from './../logger/utilities/Log';

const Details = ({item}) => {
  const [users, setUsers] = useState([]);
  const [toDos, setToDos] = useState([]);

  useEffect(() => {
    getUserData();
    getTodosData();
  }, []);

  const getUserData = () => {
    jsonPlaceholderAPI('/users')
      .then(result => {
        Logger.log('Data fetched on Details page', result.data);
        setUsers(result.data);
      })
      .catch(error => {
        Logger.log('error on Details page', error);
      });
  };

  const getTodosData = () => {
    jsonPlaceholderAPI('/todos')
      .then(result => {
        setToDos(result.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const onPrevPress = () => {
    Actions.push('list');
  };

  return (
    <View style={{flex: 1}}>
      <View style={[styles.main, styles.headerStyle]}>
        <TouchableOpacity activeOpacity={0.5} onPress={onPrevPress}>
          <Image source={require('./../images/back_arrow.png')} />
        </TouchableOpacity>
        <Text style={styles.headerTextStyle}>Details</Text>
        <View />
      </View>
      <ScrollView style={{flex: 1}}>
        <View style={styles.listCard}>
          <View style={styles.detailsCard}>
            <Text style={styles.detailsCardText}>{item.title}</Text>
            <Text style={styles.detailsCardAuthorText}>
              - {users.filter(user => user?.id === item?.userId)[0]?.name}
            </Text>
          </View>
          <View>
            <Text style={styles.detailsCardNormalText}>{item.body}</Text>
          </View>
          <View>
            <View style={styles.detailsCard}>
              <Text style={styles.detailsCardText}>Author's To-Dos</Text>
            </View>
            {toDos
              .filter(todo => todo.userId === item.userId)
              .map((todo, idx) => {
                return (
                  <View key={idx}>
                    <Text style={styles.detailsCardNormalText}>
                      {idx + 1}. {todo.title}
                    </Text>
                  </View>
                );
              })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Details;
