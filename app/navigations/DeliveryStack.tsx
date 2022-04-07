import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Complete from '../screens/MainTab/Complete';
import Ing from '../screens/MainTab/Ing';

const Stack = createNativeStackNavigator();

const Delivery = () => {
  return (
    <Stack.Navigator initialRouteName="Ing">
      <Stack.Screen name="Ing" component={Ing} options={{headerShown: false}} />
      <Stack.Screen
        name="Complete"
        component={Complete}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default Delivery;
