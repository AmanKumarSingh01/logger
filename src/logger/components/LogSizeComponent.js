import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import Logger from '../utilities/Log';

const {width} = Dimensions.get('window');

const LogSizeComponent = () => {
  const [type, setType] = useState(Logger.getSizeLimit());
  const [dataSize, setDataSize] = useState(Logger.getDataSize());
  const WARNING_MESSAGE =
    'You are about to reach the maximum system size limit for logs, kindly reset the logs to avoid the failure.';
  const LIMIT_EXCEEDED_MESSAGE =
    'You tried logging above system capacity, logs below size limit will still be logged and logs above size limit will not be logged. To avoid such failure reset logs.';

  return (
    <>
      {(type === 'warning' || type === 'limitExceeded') && (
        <View style={[styles.container, styles[type]]}>
          <View>
            {/* <Text style={styles[type]}>
              {type} {dataSize}
            </Text> */}
            <Text style={styles[type]}>
              {type === 'warning' ? WARNING_MESSAGE : LIMIT_EXCEEDED_MESSAGE}
            </Text>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    padding: 10,
    borderRadius: 3,
    borderWidth: 0.5,
    width: 0.9 * width,
  },
  limitExceeded: {
    backgroundColor: '#f44336',
    borderColor: '#f44336',
    color: 'white',
  },
  warning: {
    backgroundColor: '#ff9800',
    borderColor: '#ff9800',
    color: 'white',
  },
});
export default LogSizeComponent;
