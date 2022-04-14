import React from 'react';
import styled from 'styled-components/native';
import {Text, View} from 'react-native';

const SafeContainer = styled.SafeAreaView`
  flex: 1;
`;

const HeaderContainer = styled.View`
  width: 100%;
  height: 390px;
  /* background-color: lightblue; */
  align-items: center;
`;

const ProfileBG = styled.Image`
  width: 100%;
  height: 100%;
  position: absolute;
  opacity: 0.6;
`;

const ProfileSection = styled.View`
  width: 90%;
  height: 352px;
  background-color: white;
  align-items: center;
  margin-top: 20px;
  border-radius: 20px;
`;

const ProfileView = styled.View`
  margin-top: 40px;
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

const BodyContainer = styled.View`
  flex: 1;
  width: 100%;
  /* background-color: lightcoral; */
`;

const Profile = () => {
  return (
    <SafeContainer>
      <HeaderContainer>
        <ProfileBG source={require('../../assets/profile_header.jpeg')} />
        <ProfileSection>
          <ProfileView
            style={{
              shadowColor: 'black',
              shadowOpacity: 0.3,
              shadowRadius: 10,
              shadowOffset: {width: 2, height: 2},
            }}>
            <ProfileImage source={require('../../assets/grboy02.webp')} />
            <ProfileName>GRboy</ProfileName>
          </ProfileView>
          <IntroText>0 year-old hambie</IntroText>
          <InfoSection>
            <TextWrapper>
              <InnerTitle>Following</InnerTitle>
              <InnerSubtitle>339</InnerSubtitle>
            </TextWrapper>
            <CustomLine />
            <TextWrapper>
              <InnerTitle>Follower</InnerTitle>
              <InnerSubtitle>339</InnerSubtitle>
            </TextWrapper>
          </InfoSection>
        </ProfileSection>
      </HeaderContainer>
      <BodyContainer></BodyContainer>
    </SafeContainer>
  );
};

export default Profile;
