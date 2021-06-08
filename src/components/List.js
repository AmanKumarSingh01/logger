import React, {useCallback} from 'react';
import {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  TouchableHighlight,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import jsonPlaceholderAPI from '../constants/APIcaller';
import Logger from './../logger/utilities/Log';
import {styles} from './../styles/GenericStyles';

export default function List() {
  const [data, setData] = useState([]);
  const [isActive, setIsActive] = useState(true);
  const [users, setUsers] = useState([]);
  const [start, setStart] = useState(0);
  const title = 'Posts';

  useEffect(() => {
    const obj = {
      node1: 'node1 Data',
      node2: 'node2 Data',
      node3: {
        'node3.1': 'node3.1 data',
        'node3.2': 'node3.2 data',
        'node3.3': {
          'node3.3.1': 'node3.1 data',
          'node3.3.2': 'node3.2 data',
          'node3.3.3': {
            'node3.3.3.1': 'node3.1 data',
            'node3.3.3.2': 'node3.2 data',
          },
        },
      },
    };
    Logger.log(obj);

    let error = new Error('New Error');
    loadMore();
    getuserData();
    Logger.err(error, 'New error encountered in useEffect');
  }, [loadMore, getuserData]);

  const onPrevPress = () => {
    Actions.push('initial');
  };

  const getuserData = useCallback(() => {
    jsonPlaceholderAPI('/users')
      .then(result => {
        setUsers(result.data);
      })
      .catch(error => {
        setIsActive(false);
        console.error(error);
      });
  }, []);

  const loadMore = useCallback(() => {
    jsonPlaceholderAPI
      .get(`/posts?_start=${start}&_limit=30`)
      .then(result => {
        setStart(prev => prev + 30);
        setData(prev => [...prev, ...result.data]);
        setIsActive(false);
        Logger.log({
          data: 'Api call sucessfully happened, called json placeholder api',
          time: new Date().toString(),
          context: {
            startdata: start,
            limit: 30,
          },
        });
      })
      .catch(error => {
        setIsActive(prev => !prev);
        Logger.err(error);
      });
  }, [start]);

  return (
    <SafeAreaView style={{flex: 1}}>
      {isActive ? (
        <View style={[stylesheet.container, stylesheet.horizontal]}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <View style={{flex: 1}}>
          <View style={[styles.main, styles.headerStyle]}>
            <TouchableOpacity activeOpacity={0.5} onPress={onPrevPress}>
              <Image source={require('./../images/back_arrow.png')} />
            </TouchableOpacity>
            <Text style={styles.headerTextStyle}>{title}</Text>
            <View />
          </View>

          <FlatList
            data={data}
            renderItem={({item}) => (
              <TouchableHighlight
                style={styles.listCard}
                underlayColor="transparent"
                onPress={() => {
                  Actions.push('details', {item});
                }}
                key={Math.random()}>
                <View key={Math.random()}>
                  <Text style={{marginVertical: 5}}>{item.title}</Text>
                  <Text style={styles.authorName}>
                    - {users.filter(user => user?.id === item?.userId)[0]?.name}
                  </Text>
                </View>
              </TouchableHighlight>
            )}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const stylesheet = StyleSheet.create({
  list: {
    padding: 10,
  },
  text: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  card: {
    // height : 50,
    // width : 90,
    padding: 10,
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 10,
    backgroundColor: '#d5e1df',
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 10,
    // position: 'relative',
  },
  authorName: {
    position: 'absolute',
    zIndex: 100,
    bottom: 3,
    right: 5,
    color: 'red',
    fontSize: 12,
  },
});
