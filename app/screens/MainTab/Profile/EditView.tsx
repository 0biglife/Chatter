import React, { useCallback, useState } from 'react';
import styled from 'styled-components/native';
import { Alert, Dimensions, Platform, Text, TouchableOpacity, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../../navigations/Types';
import ImageResizer from 'react-native-image-resizer';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import { firebase } from '@react-native-firebase/firestore';

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

const MainContainer = styled.View`
  background-color: white;
  align-self: center;
  width: ${Width}px;
  height: ${Height}px;
  padding-top: 44px;
`;

const HeaderSection = styled.View`
  width: 100%;
  height: 44px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom-width: 0.5px;
  border-bottom-color: lightgray;
`;

const HeaderText = styled.Text`
  font-size: 16px;
  margin-left: 10px;
  margin-right: 10px;
`;

const ImageSection = styled.View`
  width: 100%;
  height: 160px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border-bottom-width: 0.5px;
  border-bottom-color: lightgray;
`;

const ImageView = styled.TouchableOpacity`
  background-color: antiquewhite;
  width: 124px;
  height: 124px;
  border-radius: 62px;
`;

const ProfileImage = styled.Image`
  width: 124px;
  height: 124px;
  border-radius: 62px;
`;

const BodySection = styled.View`
  width: 100%;
  height: 100%;
  margin-top: 10px;
`;

const TextWrqapper = styled.View`
  align-items: center;
  height: 45px;
  flex-direction: row;
  justify-content: space-around;
  padding: 10px;
`;

const TitleView = styled.View`
  flex: 1;
  height: 32px;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
`;

const Title = styled.Text`
  font-size: 16px;
  font-weight: 300;
  color: black;
`;

const InputView = styled.View`
  flex: 4;
  height: 32px;
  justify-content: center;
  align-items: center;
  border-bottom-color: lightgray;
  border-bottom-width: 0.5px;
`;

const Input = styled.TextInput`
  width: 100%;
  height: 30px;
  padding-left: 6px;
  font-size: 16px;
  font-weight: 500;
  color: black;
`;

interface EditProps {
  name: string;
  image: string;
}

const EditView: React.FC<EditProps> = () => {
  const route = useRoute<RouteProp<ProfileStackParamList, 'EditView'>>();
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList, 'EditView'>>();
  const [image, setImage] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [transferred, setTranferred] = useState<number>(0);
  const [postText, setPostText] = useState<string>('');

  const onResponse = useCallback(async (response) => {
    return ImageResizer.createResizedImage(response.path, 600, 600, response.mime.includes('jpeg') ? 'JPEG' : 'PNG', 100, 0).then((r) => {
      //for Firebase Storage
      const imageUri = Platform.OS === 'ios' ? r.uri : r.path;
      setImage(imageUri);
    });
  }, []);

  const onTakePhoto = useCallback(() => {
    // eslint-disable-next-line no-undef
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

  const cancel = () => {
    if (image || postText) {
      Alert.alert('알림', '작업을 취소하시겠습니까?', [
        {
          text: '아니오',
        },
        {
          text: '예',
          onPress: () => navigation.goBack(),
        },
      ]);
    } else {
      navigation.goBack();
    }
  };

  const editDone = async () => {
    const imageUrl = await uploadImage();

    if (image || postText) {
      Alert.alert('알림', '수정 완료하시겠습니까?', [
        {
          text: '아니오',
        },
        {
          text: '예',
          onPress: () => {
            firebase
              .firestore()
              .collection('profile')
              .doc('BEQmxPe4XeZ1BE2iQFJC')
              .update({
                userName: postText ? postText : route.params.name,
                profileImg: imageUrl ? imageUrl : route.params.image,
              })
              .then(() => {
                Alert.alert('알림', '프로필이 수정되었습니다');
                setPostText('');
                navigation.goBack();
              })
              .catch((e) => {
                console.log('postDone Error : ', e);
              });
          },
        },
      ]);
    } else {
      navigation.goBack();
    }
  };

  const uploadImage = async () => {
    let fileName = image.substring(image.lastIndexOf('/') + 1);

    const extension = fileName.split('.').pop();
    const name = fileName.split('.').slice(0, -1).join('.');
    fileName = name + Date.now() + '.' + extension;

    setUploading(true);
    setTranferred(0);

    const storageRef = storage().ref(`photos/${fileName}`);
    const task = storageRef.putFile(image);

    task.on('state_changed', (taskSnapshot) => {
      setTranferred(Math.round((taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100));
    });

    try {
      await task;
      const url = await storageRef.getDownloadURL();
      setUploading(false);
      setImage('');

      return url;
    } catch (e) {
      console.log('UploadImage Error : ', e);
      return null;
    }
  };

  return (
    <MainContainer>
      <HeaderSection>
        <TouchableOpacity onPress={() => cancel()}>
          <HeaderText>취소</HeaderText>
        </TouchableOpacity>
        <HeaderText style={{ fontWeight: '600', fontSize: 17 }}>프로필 편집</HeaderText>
        <TouchableOpacity onPress={() => editDone()}>
          <HeaderText>완료</HeaderText>
        </TouchableOpacity>
      </HeaderSection>
      <ImageSection>
        <ImageView onPress={onChangeFile}>
          {image ? (
            <ProfileImage source={{ uri: image }} />
          ) : (
            <ProfileImage
              source={{
                uri: route.params.image,
              }}
            />
          )}
        </ImageView>
      </ImageSection>
      <BodySection>
        <TextWrqapper>
          <TitleView>
            <Title>닉네임</Title>
          </TitleView>
          <InputView>
            <Input
              placeholder={route.params.name}
              style={{
                fontWeight: '400',
              }}
              value={postText}
              onChangeText={setPostText}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
            />
          </InputView>
        </TextWrqapper>
      </BodySection>
      {uploading && (
        <View
          style={{
            alignSelf: 'center',
            justifyContent: 'flex-end',
            margin: 20,
            height: 40,
          }}
        >
          <Text>{transferred} % Completed</Text>
        </View>
      )}
    </MainContainer>
  );
};

export default EditView;
