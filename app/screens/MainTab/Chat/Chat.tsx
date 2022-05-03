import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {Dimensions} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import unsplashClient from '../../../apis/UnsplashAPI/unsplashClient';
import {userModel} from '../../../apis/sampleData/userData';
import {ChatStackParamList} from '../../../navigations/Types';

const MainConatiner = styled.View`
  flex: 1;
  background-color: lightgray;
`;

const CellContainer = styled.View`
  align-self: center;
  width: 100%;
  height: 80px;
  background-color: white;
  margin-top: 6px;
  flex-direction: row;
`;

const Width = Dimensions.get('window').width;

const ImageSection = styled.TouchableOpacity`
  width: 70px;
  height: 70px;
  border-radius: 35px;
  align-self: center;
  margin-left: 6px;
  background-color: lightgray;
`;
``;
const ProfileImage = styled.Image`
  flex: 1;
  width: 70px;
  height: 70px;
  border-radius: 35px;
`;

const TextSection = styled.TouchableOpacity`
  width: ${Width - 160}px;
  height: 80px;
  margin-left: 10px;
  padding: 6px;
  flex-direction: column;
`;

const NameWrapper = styled.View`
  flex: 1;
`;

const BodyWrapper = styled.View`
  flex: 2;
`;

const NameText = styled.Text`
  font-size: 16px;
  font-weight: 500;
`;

const BodyText = styled.Text`
  font-size: 14px;
  font-weight: 300;
`;

const Chat = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<ChatStackParamList>>();
  const [unsplashData, setUnsplashData] = useState<userModel>();

  useEffect(() => {
    //unsplash api
    const getUserData = async () => {
      try {
        const response = await unsplashClient.get('/photos/random', {
          params: {
            count: 12,
            client_id: '3eVYYY9UEOTwk4CcDUgHt9uSSP_MJiAO3E1hcna-i1Q',
          },
        });
        setUnsplashData(response.data);
        // console.log('CHAT API SUCCESS : ', response.data);
      } catch (e) {
        console.log('CHAT API FAILED : ', e);
      }
    };
    getUserData();
  }, []);

  const renderItem = ({item}) => {
    return (
      <CellContainer
        style={{
          shadowColor: 'black',
          shadowOpacity: 0.1,
          shadowRadius: 2,
          shadowOffset: {width: 2, height: 2},
        }}>
        <ImageSection
          onPress={() =>
            navigation.navigate('UserProfile', {
              id: item.id,
              user_id: item.user.id,
              user_name: item.user.username,
              user_profile: item.user.profile_image.large,
            })
          }>
          <ProfileImage source={{uri: item.user.profile_image.large}} />
        </ImageSection>
        <TextSection
          onPress={() =>
            navigation.navigate('ChatDetail', {
              id: item.id,
              user_id: item.user.id,
              user_location: item.user.location,
              user_name: item.user.username,
              user_profile: item.user.profile_image.large,
            })
          }>
          <NameWrapper>
            <NameText>{item.user.username}</NameText>
          </NameWrapper>
          <BodyWrapper>
            <BodyText>{item.user.location}</BodyText>
          </BodyWrapper>
        </TextSection>
      </CellContainer>
    );
  };

  return (
    <MainConatiner>
      <FlatList
        data={unsplashData}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </MainConatiner>
  );
};

export default Chat;
