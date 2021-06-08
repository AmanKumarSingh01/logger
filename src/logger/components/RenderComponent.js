import React from 'react';
import {View} from 'react-native';
import TextComp from './TextComp';
import ObjectComponent from './ObjectComponent';
import ArrayComponent from './ArrayComponent';

const Component = {
  string: TextComp,
  object: ObjectComponent,
  array: ArrayComponent,
  number: TextComp,
  undefined: TextComp,
};

const RenderComponent = props => {
  let type = typeof props.data;
  if (Array.isArray(props.data)) {
    type = 'array';
  }
  // console.log(typeof props.data, "amsn")
  let Comp = Component[type];
  return <View>{<Comp {...props} />}</View>;
};

export default RenderComponent;
