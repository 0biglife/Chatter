import React, {useState, useEffect, useCallback, useRef} from 'react';
import {Alert} from 'react-native';
import styled from 'styled-components/native';
//Social Login
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

//Token Control
import {AuthParamList} from '../../navigations/Types';
//Redux
import DismissKeyboardView from '../../components/DismissKeyboardView';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
//API + Storage
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import {useAppDispatch} from '../../redux/store/index';
import userSlice from '../../redux/slices/user';
import EncrytedStorage from 'react-native-encrypted-storage';

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
  justify-content: center;
`;

const SocialButtonWrapper = styled.View`
  justify-content: center;
  align-items: center;
  flex-direction: row;
  margin-top: 10px;
`;

const SocialButton = styled.TouchableOpacity`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background-color: lightgray;
  margin: 10px;
  justify-content: center;
  align-items: center;
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

const SignUpTextView = styled.TouchableOpacity`
  width: 300px;
  height: 20px;
  background-color: white;
  justify-content: center;
  align-items: center;
`;

const SignUpText = styled.Text`
  font-size: 14px;
  color: lightslategray;
  font-weight: 400;
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

type LogInProps = NativeStackScreenProps<AuthParamList, 'LogIn'>;

const LogIn: React.FC<LogInProps> = ({navigation}) => {
  //Data Model
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  //Hooks
  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);
  //Logic
  const [isActive, setIsActive] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // GoogleSignin.configure({
    //   webClientId:
    //     '21966285335-pd59r4mk54v02nd8v5k2kem3gt1th3fl.apps.googleusercontent.com',
    //   iosClientId:
    //     '21966285335-0r4fqc0aoe84encol860j1q7l95mnt1o.apps.googleusercontent.com',
    //   offlineAccess: true,
    //   forceCodeForRefreshToken: true,
    // });
    // isSignedIn();
  }, []);

  const GoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const accessToken = (await GoogleSignin.getTokens()).accessToken;
      //google auth
      console.log('due_______', userInfo);
      console.log('Google Access Token : ', accessToken);
      // setUser(userInfo);
    } catch (error) {
      console.log('MESSAGE', error.message);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User Cancelled the Login Flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Signing In');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services Not Availbale');
      } else {
        console.log('Some other Error happened');
      }
    }
  };
  const isSignedIn = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (!!isSignedIn) {
      getCurrentUserInfo();
    } else {
      console.log('Please Login');
    }
  };

  const getCurrentUserInfo = async () => {
    try {
      const userinfo = await GoogleSignin.signInSilently();
      // setUser(userinfo);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        Alert.alert('User has not signed in yet!');
        console.log('User has not signed in yet!');
      } else {
        //Alert.alert('Something went wrong');
        console.log('Something went wrong');
      }
    }
  };

  const isActiveReady = () => {
    return email.includes('@') && password.length > 1
      ? setIsActive(true)
      : setIsActive(false);
  };

  const onChangeEmail = useCallback(text => {
    setEmail(text.trim());
  }, []);

  const onChangePassword = useCallback(text => {
    setPassword(text.trim());
  }, []);

  const onSubmit = useCallback(async () => {
    if (loading) {
      return;
    }
    //TextInput Checking
    if (!email || !email.trim()) {
      return Alert.alert('이메일을 입력해주세요');
    }
    if (!password || !password.trim()) {
      return Alert.alert('비밀번호를 입력하세요');
    }
    //API Call
    try {
      setLoading(true);
      const response = await axios.post(`${Config.API_URL}/login`, {
        email,
        password,
      });
      console.log('LogIn : Succeed');
      console.log('LogIn Response : ', response.data);
      Alert.alert('로그인이 완료되었습니다.');
      dispatch(
        userSlice.actions.setUser({
          name: response.data.data.name,
          email: response.data.data.email,
          accessToken: response.data.data.accessToken,
        }),
      );
      //추후, 서버쪽에서 refreshToken 자동 삭제 기능을 넣어야 보안이 철저함
      await EncrytedStorage.setItem(
        'refreshToken',
        response.data.data.refreshToken,
      );
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      //요청에 대한 응답(response) 실패 시 수행
      if (errorResponse) {
        Alert.alert(errorResponse.data.message);
      }
    } finally {
      setLoading(false);
    }
  }, [dispatch, email, loading, password]);

  return (
    <DismissKeyboardView>
      <SafeAreaContainer>
        <Container>
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
              onSubmitEditing={() => passwordRef.current?.focus()}
              blurOnSubmit={false}
              onKeyPress={() => isActiveReady()}
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
              onKeyPress={() => isActiveReady()}
            />
          </InputContainer>
          <LoginButton
            style={{
              backgroundColor: isActive ? 'gray' : 'lightgray',
            }}
            disabled={!isActive || loading}
            onPress={onSubmit}>
            <ButtonText>Login</ButtonText>
          </LoginButton>
          <SignUpTextView onPress={() => navigation.navigate('SignUp')}>
            <SignUpText>Sign up here</SignUpText>
          </SignUpTextView>
          <SocialButtonWrapper>
            <SocialButton onPress={() => GoogleSignIn}>
              <ButtonText>G</ButtonText>
            </SocialButton>
            <SocialButton>
              <ButtonText>A</ButtonText>
            </SocialButton>
          </SocialButtonWrapper>
        </Container>
      </SafeAreaContainer>
    </DismissKeyboardView>
  );
};

export default LogIn;
