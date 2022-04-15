import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import {ChatparamList} from '../../navigations/Types';

const MainContainer = styled.View`
  flex: 1;
  background-color: lightgray;
`;

const HeaderSection = styled.View`
  width: 100%;
  height: 140px;
  justify-content: center;
  background-color: white;
`;

const ProfileImage = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  align-self: center;
`;

const ChatSection = styled.View`
  width: 100%;
  flex: 1;
  background-color: white;
  margin-top: 4px;
`;

const ChatDetail = () => {
  const route = useRoute<RouteProp<ChatparamList>>();
  const navigation = useNavigation<NativeStackNavigationProp<ChatparamList>>();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: route.params?.user_name,
      headerBackTitle: '',
      headerTintColor: 'black',
      headerShadowVisible: false,
    });
  }, []);

  return (
    <MainContainer>
      <HeaderSection>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('UserProfile', {
              id: route.params.id,
              user_id: route.params.user_id,
              user_name: route.params.user_name,
              user_profile: route.params.user_profile,
            })
          }>
          <ProfileImage source={{uri: route.params?.user_profile}} />
        </TouchableOpacity>
      </HeaderSection>
      <ChatSection></ChatSection>
    </MainContainer>
  );
};

export default ChatDetail;
