import React, {useState, useCallback, useRef} from 'react';
import {ActivityIndicator, Alert, Image, TextInput} from 'react-native';
import styled from 'styled-components/native';
//Redux
import DismissKeyboardView from '../../components/DismissKeyboardView';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthParamList} from '../../navigations/Types';
//Axios
import {AxiosError} from 'axios';
import client from '../../apis/MarkerAPI/client';
import IonIcon from 'react-native-vector-icons/Ionicons';
import ImageResizer from 'react-native-image-resizer';
import ImagePicker from 'react-native-image-crop-picker';
import {useAppDispatch} from '../../redux/store';

interface tokenType {
  aud: string;
  auth_time: number;
  c_hash: string;
  email: string;
  email_verified: string;
  exp: number;
  iat: number;
  is_private_email: string;
  iss: string;
  nonce: string;
  nonce_supported: boolean;
  sub: string;
}

const SafeAreaContainer = styled.SafeAreaView`
  flex: 1;
  background-color: ${prop => prop.theme.color.bg};
`;

const Container = styled.View`
  flex: 1;
  background-color: white;
  align-items: center;
  margin-top: 20px;
  /* justify-content: center; */
`;

const ImageView = styled.TouchableOpacity`
  width: 140px;
  height: 140px;
  margin-bottom: 20px;
`;

const AddIconView = styled.View`
  position: absolute;
  width: 32px;
  height: 32px;
  border-radius: 20px;
  margin-left: 108px;
  margin-top: 94px;
  padding-right: 2px;
  background-color: white;
`;

const LoginButton = styled.TouchableOpacity`
  min-width: 85%;
  height: 48px;
  border-radius: 24px;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 6px;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 600;
`;

const InputContainer = styled.View`
  background-color: white;
  border-color: lightgray;
  border-width: 1.2px;
  border-radius: 24px;
  min-width: 85%;
  margin-top: 10px;
  align-self: center;
`;

const Input = styled.TextInput`
  padding: 15px;
  height: 48px;
  margin-right: 8px;
`;

type SignUpProps = NativeStackScreenProps<AuthParamList, 'SignUp'>;

const SignUp: React.FC<SignUpProps> = ({navigation}) => {
  const dispatch = useAppDispatch();
  const [image, setImage] = useState<{uri: string}>();
  //Data Model
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  //Hooks
  const nameRef = useRef<TextInput | null>(null);
  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);
  //Logic
  const [loading, setLoading] = useState<boolean>(false);

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

  const onChangeEmail = useCallback(text => {
    setEmail(text.trim());
  }, []);

  const onChangeName = useCallback(text => {
    setName(text.trim());
  }, []);

  const onChangePassword = useCallback(text => {
    setPassword(text.trim());
  }, []);

  const canGoNext = email && name && password;

  const onSubmit = useCallback(async () => {
    if (loading) {
      return;
    }
    if (!email || !email.trim()) {
      return Alert.alert('이메일을 입력해주세요');
    }
    if (!name || !name.trim()) {
      return Alert.alert('이름을 입력해주세요');
    }
    if (!password || !password.trim()) {
      return Alert.alert('비밀번호를 입력하세요');
    }
    if (
      !/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/.test(
        email,
      )
    ) {
      return Alert.alert('알림', '올바른 이메일 주소가 아닙니다.');
    }
    if (!/^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@^!%*#?&]).{8,50}$/.test(password)) {
      return Alert.alert(
        '알림',
        '비밀번호는 영문,숫자,특수문자($@^!%*#?&)를 모두 포함하여 8자 이상 입력해야합니다.',
      );
    }

    try {
      setLoading(true);
      const response = await client.post('/user', {
        email,
        name,
        password, //비밀번호는 hash화(일방향 암호화) 되어서 숨겨진 채로 백으로 들어감
        //다시 값을 받아오는 것은 양방향 암호화. 비밀번호는 일방향 암호화로 처리.
        //암호화 반댓말은 복호화
      });
      console.log('SignUp : Succeed');
      console.log('SignUp Response : ', response.data);
      Alert.alert('회원가입이 완료되었습니다.');

      //서버로 image post 요청하는 로직

      navigation.navigate('SignIn');
    } catch (error) {
      //error는 unknown이기 때문에 우리가 타입을 지정을 해서 추론해야한다!
      //따라서 이 에러가 네트워크 에러인지 문법에러인지 타입스크립트 활용 가능.
      //네트워크 에러일 때는 아래와 같이 AxiosError로
      const errorResponse = (error as AxiosError).response;
      //요청에 대한 응답(response) 실패 시 수행
      console.error('SignUp error.response : ', (error as AxiosError).response);
      if (errorResponse) {
        Alert.alert(errorResponse.data.message);
      }
    } finally {
      //try, catch 무관하게 최종적으로 항상 수행되는 코드
      setLoading(false);
    }

    // 회원가입 구현
    /* const signUp = async () => {
      try {
        setLoading(true);
        const reponse = await axios.post(
          SIGNUP,
          {
            email: email,
            password: password,
            returnSecureToken: true,
          },
          {headers: {'Content-Type': 'application/json'}},
        );
        console.log('SignUp Succeed : ', reponse.data);
        Alert.alert('회원가입이 완료되었습니다.');
        navigation.navigate('LogIn');
      } catch (e) {
        console.log('SignUp Error : ', e);
        Alert.alert('에러 발생', e);
      } finally {
        setLoading(false);
      }
    };
    signUp();
    */
  }, [email, loading, name, navigation, password]);

  return (
    <DismissKeyboardView>
      <SafeAreaContainer>
        <Container>
          <ImageView onPress={onChangeFile}>
            <Image
              style={{width: 140, height: 140, borderRadius: 70}}
              source={
                image ? image : require('../../assets/profileDefault.jpeg')
              }
            />
            <AddIconView>
              <IonIcon
                style={{marginTop: -2}}
                name="add-circle"
                size={34}
                color="gray"
              />
            </AddIconView>
          </ImageView>
          <InputContainer>
            <Input
              placeholder="이메일을 입력해주세요"
              onChangeText={text => onChangeEmail(text)}
              importantForAutofill="yes"
              autoCompleteType="email"
              textContentType="emailAddress"
              keyboardType="email-address"
              value={email}
              returnKeyType="next"
              clearButtonMode="while-editing"
              autoCapitalize="none"
              ref={emailRef}
              onSubmitEditing={() => nameRef.current?.focus()}
              blurOnSubmit={false}
            />
          </InputContainer>
          <InputContainer>
            <Input
              placeholder="이름을 입력해주세요"
              onChangeText={text => onChangeName(text)}
              importantForAutofill="yes"
              textContentType="name"
              value={name}
              returnKeyType="send"
              clearButtonMode="while-editing"
              autoCapitalize="none"
              ref={nameRef}
              onSubmitEditing={() => passwordRef.current?.focus()}
            />
          </InputContainer>
          <InputContainer>
            <Input
              placeholder="비밀번호를 입력해주세요"
              onChangeText={text => onChangePassword(text)}
              importantForAutofill="yes"
              autoCompleteType="password"
              textContentType="password"
              secureTextEntry
              value={password}
              returnKeyType="send"
              clearButtonMode="while-editing"
              autoCapitalize="none"
              ref={passwordRef}
              onSubmitEditing={onSubmit}
            />
          </InputContainer>
          <LoginButton
            style={{
              backgroundColor: canGoNext ? 'gray' : 'lightgray',
            }}
            //disabled에 loading 넣어주기
            //사용자가 버튼을 연달아누를 시 중복가입 방지용
            //사용자는 해커라고 생각하고 코드로 구현
            disabled={!canGoNext || loading}
            onPress={onSubmit}>
            {loading ? (
              <ActivityIndicator color="white" size="small" style={{}} />
            ) : (
              <ButtonText>Sign Up</ButtonText>
            )}
          </LoginButton>
        </Container>
      </SafeAreaContainer>
    </DismissKeyboardView>
  );
};

export default SignUp;
