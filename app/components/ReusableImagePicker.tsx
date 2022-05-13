import React, {useCallback, useState} from 'react';
import {Platform} from 'react-native';
import ImageResizer from 'react-native-image-resizer';
import ImagePicker from 'react-native-image-crop-picker';

const ReusableImagePicker = () => {
  const [image, setImage] = useState<string>('');
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
};

export default ReusableImagePicker;
