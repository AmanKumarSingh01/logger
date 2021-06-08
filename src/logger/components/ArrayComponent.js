import React, {useState} from 'react';
import {View, Text} from 'react-native';
import RenderComponent from './RenderComponent';
import {styles} from '../../styles/GenericStyles';

const ArrayComponent = props => {
  const [fullObjectCollapse, setFullObjectCollapse] = useState(true);
  if (fullObjectCollapse) {
    return (
      <View>
        <Text
          style={styles[props.type]}
          onPress={() => setFullObjectCollapse(prev => !prev)}>
          [...] ({props.data.length}) {JSON.stringify(props.data).slice(0, 20)}
          ...
        </Text>
      </View>
    );
  }
  return (
    <>
      {!props.single && (
        <Text onPress={() => setFullObjectCollapse(prev => !prev)}>-</Text>
      )}
      {props.data.map((item, key) => {
        return (
          <View style={styles.sidewise}>
            <Text>{key} :</Text>
            <View style={styles.marginLeft}>
              <RenderComponent data={item} type={props.type} />
            </View>
          </View>
        );
      })}
    </>
  );
};

export default ArrayComponent;
