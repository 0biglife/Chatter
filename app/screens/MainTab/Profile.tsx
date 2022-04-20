import React, {useState} from 'react';
import styled from 'styled-components/native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {FlatList} from 'react-native-gesture-handler';
import {postData} from '../../apis/postData';
import {Alert, Text, View} from 'react-native';
import {ScrollView} from 'react-native-virtualized-view';
import BottomHalfModal from '../../components/BottomHalfModal';
import Share from 'react-native-share';

//Imported RenderItem
import {
  CellContainer,
  PostedTime,
  PostedWrapper,
  PostImage,
  PostText,
} from '../../components/ProfilePost';

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
  height: 320px;
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
  width: 150px;
  height: 150px;
  border-radius: 75px;
`;

const EditButton = styled.TouchableOpacity`
  position: absolute;
  align-self: flex-end;
  width: 46px;
  margin-top: 8px;
`;

const ProfileName = styled.Text`
  margin-top: 14px;
  font-size: 20px;
  font-weight: 500;
  color: black;
`;

const InfoSection = styled.View`
  margin-top: 10px;
  width: 90%;
  height: 80px;
  flex-direction: row;
  justify-content: space-around;
`;

const IntroText = styled.Text`
  font-size: 14px;
  font-weight: 300;
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
  flex: 1;
  background-color: white;
  margin-top: 20px;
  margin-bottom: 20px;
  border-radius: 20px;
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

const AddButton = styled.TouchableOpacity`
  margin-top: 20px;
  margin-right: 20px;
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

const Profile = () => {
  // const [showModal, setShowModal] = useState<boolean>(false);

  const CustomShare = async () => {
    const shareOptions = {
      message: 'test for sharing function',
    };

    try {
      const shareResponse = await Share.open(shareOptions);
      console.log(JSON.stringify(shareResponse));
    } catch (e) {
      console.log('Share Error : ', e);
    }
  };

  return (
    <SafeContainer>
      <ScrollView nestedScrollEnabled>
        <HeaderContainer>
          <ProfileBG source={require('../../assets/bg_01.jpeg')} />
          <ProfileSection>
            <EditButton onPress={() => CustomShare()}>
              <IonIcon
                name="ellipsis-horizontal-sharp"
                size={30}
                color="black"
              />
            </EditButton>
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
                <InnerTitle>Follower</InnerTitle>
                <InnerSubtitle>2.7K</InnerSubtitle>
              </TextWrapper>
              <CustomLine />
              <TextWrapper>
                <InnerTitle>Following</InnerTitle>
                <InnerSubtitle>339</InnerSubtitle>
              </TextWrapper>
            </InfoSection>
          </ProfileSection>
          <BodySection>
            <BodyTopWrapper>
              <BodyTitle>Time Record ( {postData.length} )</BodyTitle>
              <AddButton onPress={() => Alert.alert('test')}>
                <IonIcon name="add" size={24} color="black" />
              </AddButton>
            </BodyTopWrapper>
            <BodyLine />
            <FlatList
              data={postData}
              nestedScrollEnabled
              style={{marginBottom: 10}}
              renderItem={({item}) => (
                <CellContainer>
                  <PostImage source={require('../../assets/post01.jpeg')} />
                  <PostedWrapper>
                    <PostText>{item.body}</PostText>
                    <PostedTime>2022.02.22</PostedTime>
                  </PostedWrapper>
                </CellContainer>
              )}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
            />
          </BodySection>
        </HeaderContainer>
      </ScrollView>
      {/* <BottomHalfModal
        onClose={() => setShowModal(false)}
        showModal={showModal}
        setShowModal={setShowModal}
      /> */}
    </SafeContainer>
  );
};

export default Profile;
