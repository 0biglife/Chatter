import React, {useEffect} from 'react';
import styled from 'styled-components/native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {FlatList} from 'react-native-gesture-handler';
import {postData} from '../../../apis/sampleData/postData';
import {Alert, Text} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MainStackParamList} from '../../../navigations/Types';

const SafeContainer = styled.SafeAreaView`
  flex: 1;
  background-color: transparent;
`;

const HeaderContainer = styled.View`
  flex: 1;
  align-items: center;
`;

const ProfileBG = styled.Image`
  width: 100%;
  height: 100%;
  position: absolute;
  opacity: 0.9;
`;

const ProfileSection = styled.View`
  width: 90%;
  height: 48%;
  background-color: white;
  align-items: center;
  margin-top: 20px;
  border-radius: 20px;
`;

const ProfileView = styled.View`
  margin-top: 20px;
  align-items: center;
`;

const ProfileImage = styled.Image`
  /* flex: 1; */
  width: 150px;
  height: 150px;
  border-radius: 75px;
`;

const ProfileName = styled.Text`
  margin-top: 14px;
  font-size: 20px;
  font-weight: 500;
  color: black;
`;

const InfoSection = styled.View`
  margin-top: 10px;
  /* background-color: lightblue; */
  width: 90%;
  height: 80px;
  flex-direction: row;
  justify-content: space-around;
`;

const IntroText = styled.Text`
  font-size: 14px;
  font-weight: 300;
  /* background-color: lightblue; */
  margin-top: 6px;
`;

const TextWrapper = styled.View`
  flex: 1;
  width: 80px;
  height: 100px;
  align-items: center;
  margin-top: 4px;
`;

const CustomLine = styled.View`
  width: 0.5px;
  height: 40px;
  background-color: lightgray;
  margin-top: 18px;
`;

const InnerTitle = styled.Text`
  font-size: 16px;
  font-weight: 400;
  margin-top: 10px;
`;

const InnerSubtitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  margin-top: 8px;
`;

const BodySection = styled.View`
  width: 90%;
  height: 43%;
  background-color: white;
  margin-top: 20px;
  border-radius: 20px;
  padding-bottom: 14px;
`;

const BodyTopWrapper = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const BodyTitle = styled.Text`
  font-size: 16px;
  font-weight: 300;
  margin-top: 20px;
  margin-left: 18px;
`;

const BodyLine = styled.View`
  justify-self: center;
  width: 90%;
  height: 0.5px;
  margin-top: 12px;
  margin-left: 18px;
  background-color: lightgray;
  opacity: 0.8;
`;

const BlurWrapper = styled.View`
  flex: 1;
  background-color: lightgray;
  opacity: 0.1;
`;

const LockedIcon = styled.TouchableOpacity`
  position: absolute;
  align-items: center;
  align-self: center;
  justify-content: center;
  margin-top: 140px;
  flex: 1;
  flex-direction: column;
`;

const CellContainer = styled.TouchableOpacity`
  align-self: center;
  margin-left: 12px;
  margin-right: 12px;
  margin-top: 12px;
  margin-bottom: -6px;
  height: 100px;
  border-radius: 8px;
  background-color: white;
  flex-direction: row;
`;

const PostImage = styled.Image`
  flex: 1;
  width: 100px;
  height: 100px;
  border-radius: 8px;
  margin-right: 4px;
`;

const PostedWrapper = styled.View`
  flex: 2;
  flex-direction: column;
  align-self: flex-start;
  padding: 10px;
  border-radius: 8px;
  border-width: 0.5px;
  margin-left: 2px;
  border-color: lightgray;
`;

const PostText = styled.Text`
  flex: 4;
`;

const PostedTime = styled.Text`
  flex: 1;
  margin-top: 10px;
  font-weight: 200;
`;

interface UserProfileProps {
  user_name: string;
  user_profile: string;
  user_location: string;
}

const UserProfile: React.FC<UserProfileProps> = () => {
  const route = useRoute<RouteProp<MainStackParamList, 'UserProfile'>>();
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'User Profile',
      headerBackTitle: '',
      headerTintColor: 'black',
      headerShadowVisible: false,
    });
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: route.params.user_name,
    });
  }, []);

  const getRandom = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min) + min);
  };

  return (
    <SafeContainer>
      <HeaderContainer>
        <ProfileBG source={require('../../../assets/bg_01.jpeg')} />
        <ProfileSection>
          <ProfileView
            style={{
              shadowColor: 'black',
              shadowOpacity: 0.6,
              shadowRadius: 10,
              shadowOffset: {width: 2, height: 2},
            }}>
            <ProfileImage source={{uri: route.params.user_profile}} />
            <ProfileName>{route.params.user_name}</ProfileName>
          </ProfileView>
          <IntroText>0 year-old hambie</IntroText>
          <InfoSection>
            <TextWrapper>
              <InnerTitle>Follower</InnerTitle>
              <InnerSubtitle>{getRandom(200, 500)}</InnerSubtitle>
            </TextWrapper>
            <CustomLine />
            <TextWrapper>
              <InnerTitle>Following</InnerTitle>
              <InnerSubtitle>{getRandom(300, 500)}</InnerSubtitle>
            </TextWrapper>
          </InfoSection>
        </ProfileSection>
        <BodySection>
          <BodyTopWrapper>
            <BodyTitle>Time Record ( {postData.length} )</BodyTitle>
          </BodyTopWrapper>
          <BodyLine />
          <BlurWrapper>
            <FlatList
              data={postData}
              scrollEnabled={false}
              renderItem={({item}) => (
                <CellContainer>
                  <PostImage source={{uri: route.params.user_profile}} />
                  <PostedWrapper>
                    <PostText>{item.body}</PostText>
                    <PostedTime>2022.02.22</PostedTime>
                  </PostedWrapper>
                </CellContainer>
              )}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
            />
          </BlurWrapper>
          <LockedIcon onPress={() => Alert.alert('Updating 0.0.1')}>
            <IonIcon name="lock-closed" size={30} color="black" />
            <Text>Locked</Text>
          </LockedIcon>
        </BodySection>
      </HeaderContainer>
    </SafeContainer>
  );
};

export default UserProfile;
