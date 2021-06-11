import React, {useEffect, useState, useCallback} from 'react';
import {
  Button,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableHighlight,
  Alert,
  Switch,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Logger from '../utilities/Log';
import RenderComponent from './RenderComponent';
import {styles} from '../../styles/GenericStyles';
import LocalStorage from '../utilities/LocalStorage';
import LogSizeComponent from './LogSizeComponent';

export default function LoggerScreen() {
  const [logs, setLogs] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [displayLogs, setDisplayLogs] = useState(false);
  const [loggerLimit, setLoggerlimit] = useState(10);
  const [currentHighlight, setcurrentHighlight] = useState('all');
  const [isCardVisible, setIsCardVisible] = useState(true);

  const onBackPress = () => {
    Actions.pop();
  };

  const onResetLogsPress = () => {
    Logger.reset();
    setLogs(Logger.display());
    setIsCardVisible(false);
  };

  const filterData = useCallback(() => {
    if (currentHighlight === 'all') {
      setLogs(Logger.display());
      return;
    }
    let data = Logger.logs.filter(element => element.type === currentHighlight);
    Logger.setCurrenttab(currentHighlight);
    setLogs(data);
  }, [currentHighlight]);

  useEffect(() => {
    filterData();
  }, [currentHighlight, filterData]);

  const handleCardLongPress = index => {
    Alert.alert('Delete Log', 'Are you sure you want to delete the log?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => {
          await Logger.deleteLog(index);
          setRefreshTrigger(prev => !prev);
        },
      },
    ]);
  };

  useEffect(() => {
    setLogs(Logger.display());
  }, [refreshTrigger]);

  useEffect(() => {
    Checker();
    setLimit();
    setIsCardVisible(true);
  }, []);

  const setLimit = async () => {
    await setLoggerlimit(Number(Logger.getCurrentLimit()));
  };

  const Checker = () => {
    LocalStorage.load({
      key: 'loggerdev',
    })
      .then(res => {
        setDisplayLogs(res);
      })
      .catch(err => {
        setDisplayLogs(false);
        throw err;
      });
  };

  const onToggleChange = async () => {
    setDisplayLogs(prev => !prev);
    if (displayLogs) {
      LocalStorage.save({
        key: 'loggerdev',
        data: false,
      });
    } else {
      LocalStorage.save({
        key: 'loggerdev',
        data: true,
      });
    }
  };

  const handleLoggertextChange = async text => {
    if (text.match(/^(\s*|\d+)$/)) {
      await setLoggerlimit(text);
      Logger.setLimit(Number(text));
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <View style={[styles.main, styles.headerStyle, styles.marginBotton]}>
          <View>
            <TouchableOpacity activeOpacity={0.5} onPress={onBackPress}>
              <Image source={require('../../images/back_arrow.png')} />
            </TouchableOpacity>
          </View>
          <View>
            <Text style={styles.headerTextStyle}>Logs</Text>
          </View>
          <View style={styles.main}>
            <Switch value={displayLogs} onChange={onToggleChange} />
          </View>
        </View>
        <ScrollView style={{flex: 1}}>
          {displayLogs && (
            <View>
              <View style={[styles.logsMenustyle]}>
                <Button title="Reset Logs" onPress={onResetLogsPress} />
                <View style={[styles.main]}>
                  <Text>Logger maximum value : </Text>
                  <TextInput
                    keyboardType="numeric"
                    style={styles.TextInput}
                    onChangeText={e => handleLoggertextChange(e)}
                    defaultValue={loggerLimit.toString()}
                    value={loggerLimit.toString()}
                    numeric
                  />
                </View>
              </View>
              {isCardVisible && (
                <View>
                  <LogSizeComponent />
                </View>
              )}
              <View style={[styles.main, styles.logsMenustyle]}>
                <TouchableOpacity
                  onPress={() => setcurrentHighlight('all')}
                  style={[
                    styles.TouchableButton,
                    currentHighlight === 'all' ? styles.information : '',
                  ]}>
                  <Text style={styles.centerAlign}>All</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setcurrentHighlight('information')}
                  style={[
                    styles.TouchableButton,
                    currentHighlight === 'information'
                      ? styles.information
                      : '',
                  ]}>
                  <Text style={styles.centerAlign}>Info</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setcurrentHighlight('error')}
                  style={[
                    styles.TouchableButton,
                    currentHighlight === 'error' ? styles.error : '',
                  ]}>
                  <Text style={styles.centerAlign}>Error</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setcurrentHighlight('warning')}
                  style={[
                    styles.TouchableButton,
                    currentHighlight === 'warning' ? styles.warning : '',
                  ]}>
                  <Text style={styles.centerAlign}>Warning</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          {logs.map((ele, index) => {
            return (
              <TouchableHighlight
                underlayColor="transparent"
                onLongPress={() => handleCardLongPress(index)}
                key={Math.random()}>
                <ScrollView
                  style={[styles.log, styles[ele.type], styles.relativeBlock]}>
                  <Text style={[styles.locationText]}>
                    screen : {ele.screen}
                  </Text>
                  <ScrollView style={styles.marginTop} horizontal>
                    <RenderComponent
                      component={typeof ele.data}
                      data={ele.data}
                      type={ele.type}
                    />
                  </ScrollView>
                </ScrollView>
              </TouchableHighlight>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
