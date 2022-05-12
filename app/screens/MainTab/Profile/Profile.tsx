/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useState} from 'react';
import styled from 'styled-components/native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {FlatList} from 'react-native-gesture-handler';
import {Alert, Text, View} from 'react-native';
import {ScrollView} from 'react-native-virtualized-view';
import Share from 'react-native-share';

//Firebase
import firestore from '@react-native-firebase/firestore';

import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  PostState,
  ProfileStackParamList,
  ProfileState,
} from '../../../navigations/Types';
import HalfModal from '../../../components/HalfModal';

const Profile = () => {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<ProfileStackParamList, 'Profile'>
    >();
  //Firebase
  const [post, setPost] = useState<PostState[]>();
  const [user, setUser] = useState<ProfileState>();
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  //Modal Control
  const [showHalfModal, setShowHalfModal] = useState<boolean>(false);
  const getPostData = async () => {
    try {
      const list: PostState[] = [];
      await firestore()
        .collection('posts')
        .orderBy('postTime', 'desc')
        .get()
        .then(querySnapShot => {
          querySnapShot.forEach(doc => {
            const {body, postImg, postTime} = doc.data();
            list.push({
              id: doc.id,
              body,
              postImg,
              postTime,
            });
          });
        });
      setPost(list);
    } catch (e) {
      console.log('Profile/getPostData Error : ', e);
    }
  };

  const getProfile = async () => {
    try {
      await firestore()
        .collection('profile')
        .get()
        .then(querySnapshot => {
          querySnapshot.docs.map(doc => {
            const {email, userName, profileImg} = doc.data();
            if (doc.exists) {
              setUser({
                email: email,
                userName: userName,
                profileImage: profileImg,
              });
            } else {
              console.log('no data exist !');
            }
          });
        });
      console.log('userInfo test : ', user);
    } catch (e) {
      console.log('Profile/getProfile Error : ', e);
    }
  };

  useEffect(() => {
    getPostData();
    getProfile();
  }, []);

  //sharing function
  const CustomShare = async () => {
    const shareOptions = {
      message: 'test for sharing function',
    };
    try {
      const shareResponse = await Share.open(shareOptions);
    } catch (e) {
      console.log('Share Error : ', e);
    } finally {
      setShowHalfModal(false);
    }
  };

  const gotoTimePostView = () => {
    navigation.navigate('Posting');
  };

  const gotoSpacePostView = () => {
    navigation.navigate('Posting');
  };

  const gotoEditModal = () => {
    setShowHalfModal(false);
    navigation.navigate('EditView', {
      name: user!.userName,
      image: user!.profileImage,
    });
  };

  const gotoSetting = () => {
    navigation.navigate('Setting');
    setShowHalfModal(false);
  };

  const wait = (timeout: number) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const refreshing = async () => {
    setIsRefreshing(true);
    wait(1400).then(() => setIsRefreshing(false));
    await getPostData();
    console.log('test');
  };

  return (
    <SafeContainer>
      <ScrollView nestedScrollEnabled>
        <HeaderContainer>
          <ProfileBG source={require('../../../assets/bg_01.jpeg')} />
          <ProfileSection>
            <View
              style={{
                position: 'absolute',
                width: '100%',
                height: 40,
                alignItems: 'flex-end',
              }}>
              <ProfileTopButton onPress={() => setShowHalfModal(true)}>
                <IonIcon
                  name="ellipsis-horizontal-sharp"
                  size={30}
                  color="black"
                />
              </ProfileTopButton>
              <HalfModal
                type={1}
                showModal={showHalfModal}
                setShowModal={setShowHalfModal}
                firstTapped={gotoEditModal}
                secondTapped={gotoSetting}
                thirdTapped={CustomShare}
              />
            </View>
            <ProfileView
              style={{
                shadowColor: 'black',
                shadowOpacity: 0.5,
                shadowRadius: 10,
                shadowOffset: {width: 2, height: 2},
              }}>
              <ProfileImage
                source={{
                  uri: user?.profileImage
                    ? user?.profileImage
                    : require('../../../assets/profileDefault.jpeg'),
                }}
              />
              <ProfileName>{user?.userName}</ProfileName>
            </ProfileView>
            <IntroText>0 year-old hambie</IntroText>
            <InfoSection>
              <TextWrapper>
                <InnerTitle>Follower</InnerTitle>
                <InnerSubtitle>218</InnerSubtitle>
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
              <BodyTitle>Time Record ( {post?.length} )</BodyTitle>
              <AddButton onPress={() => gotoTimePostView()}>
                <IonIcon name="add" size={24} color="black" />
              </AddButton>
            </BodyTopWrapper>
            <BodyLine />
            <FlatList
              data={post}
              nestedScrollEnabled
              style={{marginBottom: 10}}
              renderItem={({item}) => (
                <View style={{flex: 1, marginBottom: 8}}>
                  <CellContainer
                    style={{
                      shadowColor: 'black',
                      shadowOpacity: 0.1,
                      shadowRadius: 2,
                      shadowOffset: {width: 2, height: 2},
                    }}
                    activeOpacity={0.6}
                    onPress={() =>
                      navigation.navigate('PostDetail', {
                        id: item.id,
                        image: item.postImg,
                        body: item.body,
                        userName: user!.userName,
                        postTime: item.postTime,
                      })
                    }>
                    <PostImage source={{uri: item.postImg}} />
                    <PostedWrapper>
                      <PostText>{item.body}</PostText>
                      <PostedTime>{item.postTime}</PostedTime>
                    </PostedWrapper>
                  </CellContainer>
                </View>
              )}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              onRefresh={() => refreshing()}
              refreshing={isRefreshing}
            />
          </BodySection>
          <BottomSection>
            <BodyTopWrapper>
              <BodyTitle>Place Record ( {0} )</BodyTitle>
            </BodyTopWrapper>
            <BodyLine />
            <View
              style={{
                flex: 1,
                backgroundColor: 'lightgray',
                margin: 10,
                borderRadius: 8,
              }}
            />
            <LockedIcon onPress={() => Alert.alert('Updating 0.0.1')}>
              <IonIcon name="lock-closed" size={30} color="gray" />
              <Text style={{color: 'gray'}}>Locked</Text>
            </LockedIcon>
          </BottomSection>
        </HeaderContainer>
      </ScrollView>
    </SafeContainer>
  );
};

const CellContainer = styled.TouchableOpacity`
  align-self: center;
  margin-left: 12px;
  margin-right: 12px;
  margin-top: 4px;
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

const LockedIcon = styled.TouchableOpacity`
  position: absolute;
  align-items: center;
  align-self: center;
  justify-content: center;
  margin-top: 104px;
  flex: 1;
  flex-direction: column;
`;

const BottomSection = styled.View`
  width: 90%;
  height: 250px;
  flex: 1;
  background-color: white;
  margin-bottom: 20px;
  border-radius: 20px;
`;

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
`;

const ProfileImage = styled.Image`
  width: 150px;
  height: 150px;
  align-self: center;
  border-radius: 75px;
`;

const ProfileTopButton = styled.TouchableOpacity`
  padding-left: 12px;
  padding-right: 16px;
  padding-top: 8px;
`;

const ProfileName = styled.Text`
  margin-top: 14px;
  font-size: 20px;
  font-weight: 500;
  color: black;
  align-self: center;
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
  align-self: center;
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

export default Profile;
