import React, {useCallback, useState} from 'react';
import styled from 'styled-components/native';
import {
  Alert,
  Dimensions,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {firebase} from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import ImageResizer from 'react-native-image-resizer';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import {useAppDispatch} from '../../../redux/store';
import userSlice from '../../../redux/slices/user';

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

const ImageView = styled.TouchableOpacity`
  margin-left: 4px;
  margin-right: 4px;
  margin-top: 4px;
  height: 300px;
`;

const PostImage = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: 10px;
`;

const PostBody = styled.TextInput`
  justify-content: center;
  height: 100px;
  background-color: lightgray;
  padding: 14px;
  margin-left: 4px;
  margin-right: 4px;
  margin-top: 4px;
  border-radius: 10px;
`;

const Posting = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  //Data Upload
  const [image, setImage] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [transferred, setTranferred] = useState<number>(0);
  const [postText, setPostText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  //Action
  const [isActive, setIsActive] = useState<boolean>(false);

  const onResponse = useCallback(async response => {
    return ImageResizer.createResizedImage(
      response.path,
      600,
      600,
      response.mime.includes('jpeg') ? 'JPEG' : 'PNG',
      100,
      0,
    ).then(r => {
      //for Firebase Storage
      const imageUri = Platform.OS === 'ios' ? r.uri : r.path;
      setImage(imageUri);

      //만약 서버에 요청하는 로직이라면 이런 식으로 감싸서 post 요청해야함
      /*
      //업로드할 때에는 multipart/form-data 로 해야함

      setImage({
        uri: `data:${response.mime};base64,${response.data}`,
      });
      setImage({
        uri: r.uri,
        name: r.name,
        type: response.mime,
      });
      */
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

  const isActiveReady = () => {
    return image ? setIsActive(true) : setIsActive(false);
  };

  const postDone = async () => {
    const imageUrl = await uploadImage();
    const date = new Date();
    const dateStr = `${date.getFullYear()}.${date.getMonth()}.${date.getDay()}`;

    firebase
      .firestore()
      .collection('posts')
      .add({
        body: postText,
        postImg: imageUrl,
        postTime: dateStr,
      })
      .then(res => {
        Alert.alert('알림', '게시글이 등록되었습니다');
        setPostText('');
        navigation.goBack();
      })
      .catch(e => {
        console.log('postDone Error : ', e);
      });
  };

  const uploadImage = async () => {
    let fileName = image.substring(image.lastIndexOf('/') + 1);

    //파일명 오버라이딩을 위한 Date 문자열 추가
    const extension = fileName.split('.').pop();
    const name = fileName.split('.').slice(0, -1).join('.');
    fileName = name + Date.now() + '.' + extension;

    setUploading(true);
    setTranferred(0);

    //업로드 현황을 위한 task
    //ref라는 이름으로 파일 uri를 put해주는 역할
    const storageRef = storage().ref(`photos/${fileName}`);
    const task = storageRef.putFile(image);

    task.on('state_changed', taskSnapshot => {
      // console.log(
      //   `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
      // );

      setTranferred(
        Math.round(
          (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100,
        ),
      );
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
        <HeaderText style={{fontWeight: '600', fontSize: 17}}>
          게시글 추가
        </HeaderText>
        <TouchableOpacity
          // disabled={!isActive || loading}
          onPress={() => postDone()}>
          <HeaderText style={{color: isActive ? 'black' : 'gray'}}>
            완료
          </HeaderText>
        </TouchableOpacity>
      </HeaderSection>
      <ImageView onPress={onChangeFile}>
        {image ? (
          <PostImage source={{uri: image}} />
        ) : (
          <PostImage
            source={{
              uri: 'https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg',
            }}
          />
        )}
      </ImageView>
      <PostBody
        value={postText}
        onChangeText={(text: string) => {
          setPostText(text);
        }}
        onKeyPress={() => isActiveReady()}
        autoCapitalize="none"
        autoCompleteType="off"
        autoCorrect={false}
        multiline={true}
        numberOfLines={4}
      />
      {uploading ? (
        <View
          style={{
            alignSelf: 'center',
            justifyContent: 'flex-end',
            margin: 20,
            height: 40,
          }}>
          <Text>{transferred} % Completed</Text>
        </View>
      ) : null}
    </MainContainer>
  );
};

export default Posting;
