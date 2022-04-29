import React, {useCallback, useEffect, useState} from 'react';
import styled from 'styled-components/native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {FlatList} from 'react-native-gesture-handler';
import {Alert, Text, View} from 'react-native';
import {ScrollView} from 'react-native-virtualized-view';
import Share from 'react-native-share';

//Image Picker & Image Resizer
import ImagePicker from 'react-native-image-crop-picker';
import ImageResizer from 'react-native-image-resizer';

//Firebase
import firestore from '@react-native-firebase/firestore';

import {useAppDispatch} from '../../../redux/store';
import userSlice from '../../../redux/slices/user';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {FBPost, ProfileStackParamList} from '../../../navigations/Types';
import PostModal from './PostModal';
import HalfModal from '../../../components/HalfModal';

const Profile = () => {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<ProfileStackParamList, 'Profile'>
    >();
  const [showImageModal, setShowImageModal] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [imageFormdata, setImageFormData] =
    useState<{uri: string; name: string; type: string}>();
  const [image, setImage] = useState<{uri: string}>();
  const dispatch = useAppDispatch();
  //Firebase
  const FBStore = firestore();
  const [myPost, setMyPost] = useState<FBPost[]>();
  //Modal Control
  const [showHalfModal, setShowHalfModal] = useState<boolean>(false);
  const [showPostModal, setShowPostModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);

  const getPostData = async () => {
    try {
      const response = await FBStore.collection('user')
        .doc('1')
        .collection('post')
        .get();
      setMyPost(
        response.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        })),
      );
      console.log('Profile/getPostData Success: ', response.docs);
    } catch (e) {
      console.log('Profile/getPostData Error : ', e);
    }
  };

  useEffect(() => {
    getPostData();
  }, []);

  //ImageData
  const onResponse = useCallback(async response => {
    console.log('response width : ', response.width);
    console.log('response height : ', response.height);
    console.log('response exif : ', response.exif);
    setImage({
      uri: `data:${response.mime};base64,${response.data}`,
    });
    return ImageResizer.createResizedImage(
      response.path,
      600,
      600,
      response.mime.includes('jpeg') ? 'JPEG' : 'PNG',
      100,
      0, //이 자리는 rotation 값(orientation을 이용해 추후 코딩)
      // orientation === 3 ? -90 ~ // 3일 때 90도 돌려라 라는 방식 등등
    ).then(r => {
      console.log(r.uri, r.name);
      setShowImageModal(false);
      setImageFormData({
        uri: r.uri,
        name: r.name,
        type: response.mime,
      });
    });
  }, []);

  const onTakePhoto = useCallback(() => {
    return ImagePicker.openCamera({
      includeBase64: true,
      includeExif: true,
      saveToPhotos: true,
    })
      .then(onResponse)
      .catch(console.log);
  }, [onResponse]);

  const onChangeFile = useCallback(() => {
    return ImagePicker.openPicker({
      includeExif: true, //카메라 가로/세로 대응
      includeBase64: true, //미리보기 띄우기 가능
      mediaType: 'photo',
    })
      .then(onResponse)
      .catch(console.log);
  }, [onResponse]);

  //sharing function
  const CustomShare = async () => {
    setShowHalfModal(false);
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

  const gotoPostView = async () => {
    setShowPostModal(true);
  };

  const gotoEditModal = () => {
    setShowHalfModal(false);
    navigation.navigate('EditView', {
      name: 'GRboy',
      image: 'http://www.nbnnews.co.kr/news/photo/202106/506788_549628_956.jpg',
    });
  };

  const EditStart = () => {
    setName('');
    setShowEditModal(true);
  };

  const EditDone = () => {
    if (name || image) {
      //API : 변경된 프로필 사진 서버로 전송
      dispatch(
        userSlice.actions.setUser({
          profileImage: image,
        }),
      );
      setShowEditModal(false);
    } else {
      Alert.alert('닉네임을 입력해주세요');
    }
  };

  const EditCancel = () => {
    if (name) {
      Alert.alert('취소하시겠습니까?', '입력된 정보는 사라집니다', [
        {
          text: '예',
          onPress: () => {
            setShowEditModal(false);
          },
        },
        {
          text: '아니요',
        },
      ]);
    } else {
      setShowEditModal(false);
    }
  };

  const gotoSetting = () => {
    navigation.navigate('Setting');
    setShowHalfModal(false);
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
                shadowOpacity: 0.3,
                shadowRadius: 10,
                shadowOffset: {width: 2, height: 2},
              }}>
              <ProfileImage source={require('../../../assets/grboy02.webp')} />
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
              <BodyTitle>Time Record ( {3} )</BodyTitle>
              <AddButton onPress={() => gotoPostView()}>
                <IonIcon name="add" size={24} color="black" />
              </AddButton>
              <PostModal
                showModal={showPostModal}
                setShowModal={setShowPostModal}
              />
            </BodyTopWrapper>
            <BodyLine />
            <FlatList
              data={myPost}
              nestedScrollEnabled
              style={{marginBottom: 10}}
              renderItem={({item}) => (
                <View style={{flex: 1}}>
                  <CellContainer
                    activeOpacity={0.6}
                    onPress={() =>
                      navigation.navigate('PostDetail', {
                        image: item.image,
                        body: item.body,
                        userName: 'GRboy',
                      })
                    }>
                    <PostImage source={{uri: item.image}} />
                    <PostedWrapper>
                      <PostText>{item.body}</PostText>
                      <PostedTime>2022.02.22</PostedTime>
                    </PostedWrapper>
                  </CellContainer>
                </View>
              )}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
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
  height: 200px;
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
