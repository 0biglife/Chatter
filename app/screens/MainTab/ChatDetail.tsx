import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {Text} from 'react-native';
import styled from 'styled-components/native';
import {ChatparamList} from '../../navigations/Types';

const MainContainer = styled.View`
  flex: 1;
  background-color: lightgray;
`;

const ChatDetail = () => {
  const route = useRoute<RouteProp<ChatparamList>>();
  const navigation = useNavigation<NativeStackNavigationProp<ChatparamList>>();

  useEffect(() => {
    navigation.setOptions({title: route.params?.user_name});
  }, []);

  return (
    <MainContainer>
      <Text style={{alignSelf: 'center'}}>{route.params?.user_id}</Text>
    </MainContainer>
  );
};

export default ChatDetail;
