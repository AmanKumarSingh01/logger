import React, {useState} from 'react';
import {View, Text} from 'react-native';
import RenderComponent from './RenderComponent';
import {styles} from '../../styles/GenericStyles';

const ObjectComponent = props => {
  const [clickable, setClickable] = useState(false);
  const [fullObjectCollapse, setFullObjectCollapse] = useState(true);
  const [sign, setSign] = useState('+');

  let componentData = '{...}';

  const handleSignPress = () => {
    setClickable(prev => !prev);
    setSign(prev => (prev === '+' ? '-' : '+'));
  };
  if (fullObjectCollapse && !props.single) {
    return (
      <View>
        <Text
          style={styles[props.type]}
          onPress={() => setFullObjectCollapse(prev => !prev)}>
          {`${componentData}  ${JSON.stringify(props.data).slice(0, 20)}...`}
        </Text>
      </View>
    );
  }
  return (
    <>
      {!props.single && (
        <Text onPress={() => setFullObjectCollapse(prev => !prev)}>-</Text>
      )}
      {Object.keys(props?.data).map(key => {
        let isObject = typeof props.data[key] === 'object';

        return (
          <View
            onPress={() => setFullObjectCollapse(prev => !prev)}
            key={Math.random()}
            style={styles.horizontal}>
            <Text style={[styles[props.type], styles.text]}>
              {isObject && <Text onPress={handleSignPress}>{sign} </Text>}
              {key} :{' '}
            </Text>
            {isObject ? (
              clickable ? (
                <RenderComponent
                  data={props.data[key]}
                  type={props.type}
                  single
                />
              ) : (
                <Text onPress={handleSignPress}>{componentData}</Text>
              )
            ) : (
              <RenderComponent
                component={typeof props.data[key]}
                data={props.data[key]}
                type={props.type}
              />
            )}
          </View>
        );
      })}
    </>
  );
};

export default ObjectComponent;
