import React, {useCallback, useEffect, useState} from 'react';
import styled from 'styled-components/native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {FlatList} from 'react-native-gesture-handler';
import {postData} from '../../apis/postData';
import {Alert, Text, View} from 'react-native';
import {ScrollView} from 'react-native-virtualized-view';
import Share from 'react-native-share';
import Modal from 'react-native-modal';

//Image Picker & Image Resizer
import ImagePicker from 'react-native-image-crop-picker';
import ImageResizer from 'react-native-image-resizer';

//Firebase
import firestore from '@react-native-firebase/firestore';

//Imported RenderItem
import {
  CellContainer,
  PostedTime,
  PostedWrapper,
  PostImage,
  PostText,
} from '../../components/ProfilePost';
import {useAppDispatch} from '../../redux/store';
import userSlice from '../../redux/slices/user';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {FBPost, ProfileStackParamList} from '../../navigations/Types';

const Profile = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showImageModal, setShowImageModal] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [imageFormdata, setImageFormData] =
    useState<{uri: string; name: string; type: string}>();
  const [image, setImage] = useState<{uri: string}>();
  const dispatch = useAppDispatch();
  //Firebase
  const FBStore = firestore().collection('users');
  const [myPost, setMyPost] = useState<FBPost[]>();

  const getFirData = async () => {
    try {
      const response = await FBStore.get();
      setMyPost(
        response.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        })),
      );
      console.log('Profile/FireStore Success: ', myPost);
    } catch (e) {
      console.log('Profile/FireStore Error : ', e);
    }
  };

  useEffect(() => {
    getFirData();
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

  const gotoEdit = () => {
    navigation.navigate('EditProfile');
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

  const onChangeName = useCallback(text => {
    setName(text.trim());
  }, []);

  return (
    <SafeContainer>
      <ScrollView nestedScrollEnabled>
        <HeaderContainer>
          <ProfileBG source={require('../../assets/bg_01.jpeg')} />
          <ProfileSection>
            {showEditModal ? (
              <View
                style={{
                  position: 'absolute',
                  width: '100%',
                  alignSelf: 'center',
                  height: 40,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <ProfileTopButton onPress={() => EditCancel()}>
                  <IonIcon name="close-sharp" size={30} color="gray" />
                </ProfileTopButton>
                <ProfileTopButton onPress={() => EditDone()}>
                  <IonIcon name="checkmark-sharp" size={30} color="gray" />
                </ProfileTopButton>
              </View>
            ) : (
              <View
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: 40,
                  alignItems: 'flex-end',
                }}>
                <ProfileTopButton onPress={() => gotoEdit()}>
                  <IonIcon
                    name="ellipsis-horizontal-sharp"
                    size={30}
                    color="black"
                  />
                </ProfileTopButton>
              </View>
            )}
            {/* <Modal
              isVisible={showEditModal}
              backdropColor="transparent"
              animationIn="fadeIn"
              animationInTiming={2}
              onBackdropPress={() => setShowEditModal(false)}>
              <EditModalContainer>
                <TouchableOpacity
                  style={{alignItems: 'center', justifyContent: 'center'}}>
                  <Text style={{fontSize: 18, backfaceVisibility: false}}>
                    Edit Profile
                  </Text>
                </TouchableOpacity>
              </EditModalContainer>
            </Modal> */}
            <ProfileView
              style={{
                shadowColor: 'black',
                shadowOpacity: 0.3,
                shadowRadius: 10,
                shadowOffset: {width: 2, height: 2},
              }}>
              {showEditModal ? (
                <ProfileImage
                  source={image ? image : require('../../assets/grboy02.webp')}
                />
              ) : (
                <ProfileImage source={require('../../assets/grboy02.webp')} />
              )}
              {showEditModal ? (
                <>
                  <EditButton onPress={() => setShowImageModal(true)}>
                    <IonIcon
                      style={{
                        position: 'absolute',
                      }}
                      name="add-circle"
                      size={28}
                      color="gray"
                    />
                  </EditButton>
                  <Modal
                    isVisible={showImageModal}
                    backdropColor="black"
                    animationIn="fadeIn"
                    animationInTiming={0.1}
                    onBackdropPress={() => setShowImageModal(false)}>
                    <ImageModalContainer>
                      <ImageModalButton onPress={() => onTakePhoto()}>
                        <Text>카메라</Text>
                      </ImageModalButton>
                      <ImageModalButton onPress={() => onChangeFile()}>
                        <Text>앨범</Text>
                      </ImageModalButton>
                    </ImageModalContainer>
                  </Modal>
                </>
              ) : null}
              {showEditModal ? ( //here
                <View
                  style={{
                    width: '100%',
                    marginTop: 14,
                    alignContent: 'center',
                    alignSelf: 'center',
                  }}>
                  <Input
                    value={name}
                    placeholder="GRboy"
                    // importantForAutofill="yes"
                    onChangeText={text => onChangeName(text)}
                    // textContentType="name"
                    returnKeyType="done"
                    clearButtonMode="while-editing"
                    autoCapitalize="none"
                  />
                </View>
              ) : (
                <ProfileName>GRboy</ProfileName>
              )}
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
              data={myPost}
              nestedScrollEnabled
              style={{marginBottom: 10}}
              renderItem={({item}) => (
                <CellContainer>
                  <PostImage source={{uri: item.image}} />
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
    </SafeContainer>
  );
};

const EditModalContainer = styled.View`
  width: 100%;
  height: 600px;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.8);
`;

const ImageModalContainer = styled.View`
  background-color: lightgray;
  border-radius: 20px;
  align-items: center;
  justify-content: space-around;
  align-self: center;
  width: 50%;
  height: 80px;
  flex-direction: row;
`;

const ImageModalButton = styled.TouchableOpacity`
  flex: 1;
  margin: 10px;
  align-items: center;
  justify-content: center;
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

const EditButton = styled.TouchableOpacity`
  background-color: transparent;
  width: 24px;
  height: 24px;
  align-items: center;
  position: absolute;
  margin-top: 117px;
  margin-left: 117px;
`;

const ProfileTopButton = styled.TouchableOpacity`
  padding-left: 12px;
  padding-right: 16px;
  padding-top: 8px;
`;

const Input = styled.TextInput`
  font-size: 20px;
  font-weight: 500;
  color: black;
  align-self: center;
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
