import React, {useCallback, useState} from 'react';
import styled from 'styled-components/native';
import {Alert, Text, View} from 'react-native';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {MainTabParamList} from '../../navigations/Types';
import ImagePicker from 'react-native-image-crop-picker';
//카메라로 찍은 사진을 서버로 보내는 건 용량이 너무 커서 비효율적(서버 터짐)
//따라서, 리사이징 과정이 필요
import ImageResizer from 'react-native-image-resizer';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store/reducers';
import orderSlice from '../../redux/slices/order';
import {useAppDispatch} from '../../redux/store/index';

const HeaderContainer = styled.View`
  padding-top: 20px;
  padding-left: 20px;
  padding-right: 20px;
`;

const BodyContainer = styled.View`
  padding-left: 20px;
  padding-right: 20px;
  flex-direction: column;
`;

const ButtonWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ImageWrapper = styled.View`
  width: 100%;
  height: 60%;
  margin-top: 10px;
  margin-bottom: 20px;
  background-color: lightgray;
`;

const ImageView = styled.Image`
  flex: 1;
  width: 100%;
  height: 60%;
  background-color: lightgray;
`;

const ButtonView = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  background-color: lightgoldenrodyellow;
  width: 100px;
  height: 30px;
`;

const ButtonText = styled.Text`
  color: black;
`;

const Complete = () => {
  //redux & api
  const dispatch = useAppDispatch();
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  //navigationProps
  const route = useRoute<RouteProp<MainTabParamList>>();
  const navigation = useNavigation<NavigationProp<MainTabParamList>>();
  const [image, setImage] =
    useState<{uri: string; name: string; type: string}>();
  const [preview, setPreview] = useState<{uri: string}>();

  const onResponse = useCallback(async response => {
    console.log('response width : ', response.width);
    console.log('response height : ', response.height);
    console.log('response exif : ', response.exif);
    setPreview({
      uri: `data:${response.mime};base64,${response.data}`,
    });
    //
    const orientation = (response.exif as any)?.Orientation;
    console.log('orientation : ', orientation);
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

      setImage({
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

  const orderId = route.params?.orderId;
  const onComplete = useCallback(async () => {
    if (!image) {
      Alert.alert('알림', '파일을 업로드해주세요.');
      return;
    }
    if (!orderId) {
      Alert.alert('알림', '유효하지 않은 주문입니다.');
      return;
    }
    const formData = new FormData();
    formData.append('image', image);
    formData.append('orderId', orderId);
    try {
      await axios.post(`${Config.API_URL}/complete`, formData, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });
      Alert.alert('알림', '완료처리 되었습니다.');
      navigation.goBack();
      navigation.navigate('Settings');
      dispatch(orderSlice.actions.rejectOrder(orderId));
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      if (errorResponse) {
        Alert.alert('알림', errorResponse.data.message);
      }
    }
  }, [dispatch, navigation, image, orderId, accessToken]);

  return (
    <View>
      <HeaderContainer>
        <Text>주문번호: {orderId}</Text>
      </HeaderContainer>
      <BodyContainer>
        <ImageWrapper>
          {preview && (
            <ImageView style={{resizeMode: 'contain'}} source={preview} />
          )}
        </ImageWrapper>
        <ButtonWrapper>
          <ButtonView onPress={onTakePhoto}>
            <ButtonText>이미지 촬영</ButtonText>
          </ButtonView>
          <ButtonView onPress={onChangeFile}>
            <ButtonText>이미지 선택</ButtonText>
          </ButtonView>
          <ButtonView
            style={{backgroundColor: image ? 'yellow' : 'lightgray'}}
            onPress={onComplete}>
            <ButtonText>완료</ButtonText>
          </ButtonView>
        </ButtonWrapper>
      </BodyContainer>
    </View>
  );
};

export default Complete;
