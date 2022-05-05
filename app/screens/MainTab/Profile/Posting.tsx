import React, {useCallback, useState} from 'react';
import styled from 'styled-components/native';
import {Alert, Dimensions, TouchableOpacity} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import ImageResizer from 'react-native-image-resizer';
import ImagePicker from 'react-native-image-crop-picker';

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
  const [image, setImage] = useState<{uri: string}>();
  const [isActive, setIsActive] = useState<boolean>(false);
  const [postText, setPostText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const FBStore = firestore().collection('user').doc('1').collection('post');

  const onResponse = useCallback(async response => {
    return ImageResizer.createResizedImage(
      response.path,
      600,
      600,
      response.mime.includes('jpeg') ? 'JPEG' : 'PNG',
      100,
      0,
    ).then(r => {
      console.log(r.uri, r.name);
      setImage({
        uri: `data:${response.mime};base64,${response.data}`,
      });
      //만약 서버에 요청하는 로직이라면 이런 식으로 감싸서 post 요청해야함
      /*
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
    if (postText) {
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
    return postText.length > 1 ? setIsActive(true) : setIsActive(false);
  };

  const complete = async () => {
    try {
      setLoading(true);
      await FBStore.add({
        body: postText,
        image:
          'https://i.pinimg.com/736x/31/b0/96/31b0965acfb3438474bb47c6e4d1f221.jpg',
      }).then(data => console.log('aa: ', data));
      console.log('test');
    } catch (e) {
      console.log('PostModal/Post Error : ', e);
    } finally {
      setLoading(false);
    }
    navigation.goBack();
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
          disabled={!isActive || loading}
          onPress={() => complete()}>
          <HeaderText style={{color: isActive ? 'black' : 'gray'}}>
            완료
          </HeaderText>
        </TouchableOpacity>
      </HeaderSection>
      <ImageView onPress={onChangeFile}>
        <PostImage
          source={image ? image : require('../../../assets/postDefault.png')}
        />
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
    </MainContainer>
  );
};

export default Posting;
