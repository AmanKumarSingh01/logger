import {Router, Scene} from 'react-native-router-flux';
import React, {useEffect} from 'react';
import {Button, View} from 'react-native';
import {Actions} from 'react-native-router-flux';
import ErrorBoundary from './ErrorBoundaries';
import Initial from './src/components/Initial';
import List from './src/components/List';
import LoggerScreen from './src/logger/components/LoggerComponent';
import Details from './src/components/Details';
import Logger from './src/logger/utilities/Log';

const App = () => {
  useEffect(() => {
    Logger.log({
      date: new Date().toString(),
      data: 'App loaded',
    });
    Logger.log([
      'Log 1',
      'Log 2',
      'Log 3',
      {
        key: 'object log1',
        data: {
          date: new Date().toString(),
          message: 'Message logged',
          context: {
            name: 'ankur',
          },
        },
      },
      'Log 4',
      'Log 5',
    ]);
  }, []);

  const onLoadLogsPress = () => {
    Actions.push('logger');
    Logger.warning('Initial Screen - Load Press');
  };

  return (
    <ErrorBoundary>
      <View style={{flex: 1}}>
        <Router>
          <Scene key="root">
            <Scene key="initial" component={Initial} initial hideNavBar />
            <Scene key="list" component={List} hideNavBar />
            <Scene key="logger" component={LoggerScreen} hideNavBar />
            <Scene key="details" component={Details} hideNavBar />
          </Scene>
        </Router>
        <Button title="Load Logs" onPress={onLoadLogsPress} />
      </View>
    </ErrorBoundary>
  );
};

export default App;
