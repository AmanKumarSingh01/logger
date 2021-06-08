import React, {useState} from 'react';
import {Text} from 'react-native';
import {styles} from '../../styles/GenericStyles';

const TextComp = prop => {
  const [numberOfLines, setNumberOfLines] = useState(1);
  const handleTextPress = () => {
    setNumberOfLines(prev => (prev === 1 ? 0 : 1));
  };

  return (
    <Text
      style={[styles.text, styles.textWidth, styles[prop.type]]}
      onPress={handleTextPress}
      numberOfLines={numberOfLines}>
      {prop.data ?? 'undefined'}
    </Text>
  );
};

export default TextComp;
