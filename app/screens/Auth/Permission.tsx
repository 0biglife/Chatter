import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import styled from 'styled-components/native';
import {AuthParamList} from '../../navigations/Types';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {
  check,
  PERMISSIONS,
  RESULTS,
  request,
  checkMultiple,
  requestMultiple,
} from 'react-native-permissions';
import {AuthBGImage, AuthBGView} from './SignIn';

export const AuthBackIcon = styled.TouchableOpacity`
  position: absolute;
  width: 60px;
  height: 60px;
  top: 40px;
  left: 6px;
`;

const Container = styled.SafeAreaView`
  width: 94%;
  height: 500px;
  border-radius: 36px;
  justify-content: center;
  align-items: center;
  background-color: ${prop => prop.theme.color.bg};
`;

const TitleContainer = styled.View`
  margin-left: 30px;
  margin-right: 30px;
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: 700;
  margin-left: 10px;
  color: black;
`;

const SubTitle = styled.Text`
  font-size: 16px;
  font-weight: 400;
  padding-top: 20px;
  color: gray;
  margin-left: 10px;
`;

const SubscriptionWrapper = styled.View`
  height: 300px;
  padding-top: 20px;
`;

const SubscriptionView = styled.View`
  height: 40px;
  margin-top: 10px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
  /* margin-bottom: 10px; */
`;

const SubScriptionText = styled.Text`
  font-size: 16px;
  color: gray;
  margin-left: 64px;
`;

const ButtonContainer = styled.TouchableOpacity`
  background-color: black;
  margin-top: 30px;
  height: 50px;
  border-radius: 6px;
  align-items: center;
  justify-content: center;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 600;
`;

export interface PermissioinAuthProps {
  navigation: StackNavigationProp<AuthParamList, 'Permission'>;
}

const permissionAuth: React.FC<PermissioinAuthProps> = ({navigation}) => {
  const requestPermission = () => {
    request(PERMISSIONS.IOS.CAMERA).then(response => {
      console.log(response);
    });
  };

  const checkPermission = () => {
    //checkMultiple을 쓸거면 이 부분 생략 가능
    check(PERMISSIONS.IOS.CAMERA)
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log(
              'This feature is not available (on this device / in this context)',
            );
            break;
          case RESULTS.DENIED:
            console.log(
              'The permission has not been requested / is denied but requestable',
            );
            break;
          case RESULTS.LIMITED:
            console.log('The permission is limited: some actions are possible');
            break;
          case RESULTS.GRANTED:
            console.log('The permission is granted');
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            break;
        }
      })
      .catch(error => {
        console.log('PERMISSION ERROR : ', error);
      });
  };

  const requestMultiplePermissions = () => {
    requestMultiple([
      PERMISSIONS.IOS.CONTACTS,
      PERMISSIONS.IOS.CAMERA,
      PERMISSIONS.IOS.PHOTO_LIBRARY,
      PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY,
      PERMISSIONS.IOS.MICROPHONE,
    ]).then(response => {
      console.log('MULTIPLE REQUEST RESPONSE : ', response);
      navigation.navigate('SignUp');
    });
  };

  const checkMultiplePermissions = () => {
    checkMultiple([
      PERMISSIONS.IOS.CONTACTS,
      PERMISSIONS.IOS.CAMERA,
      PERMISSIONS.IOS.PHOTO_LIBRARY,
      PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY,
      PERMISSIONS.IOS.MICROPHONE,
    ]).then(response => {
      console.log('MULTIPLE CHECK RESPONSE : ', response);
    });
  };

  return (
    <AuthBGView>
      <AuthBGImage source={require('../../assets/bg_01.jpeg')} />
      <AuthBackIcon onPress={() => navigation.goBack()}>
        <IonIcon name="chevron-back-sharp" color="white" size={50} />
      </AuthBackIcon>
      <Container>
        <TitleContainer>
          <Title>접근 권한 승인</Title>
          <SubTitle>해당 서비스 이용을 위한 접근 권한을 허용합니다.</SubTitle>
          <SubscriptionWrapper>
            <SubscriptionView>
              <IonIcon name="phone-portrait" size={22} color="gray" />
              <SubScriptionText>
                연락처 접근 권한을 허용합니다.
              </SubScriptionText>
            </SubscriptionView>
            <SubscriptionView>
              <IonIcon name="camera" size={22} color="gray" />
              <SubScriptionText>
                카메라 접근 권한을 허용합니다.
              </SubScriptionText>
            </SubscriptionView>
            <SubscriptionView>
              <IonIcon name="book" size={22} color="gray" />
              <SubScriptionText>
                갤러리 접근 권한을 허용합니다.
              </SubScriptionText>
            </SubscriptionView>
            <SubscriptionView>
              <IonIcon name="mic" size={22} color="gray" />
              <SubScriptionText>
                마이크 접근 권한을 허용합니다.
              </SubScriptionText>
            </SubscriptionView>
            <ButtonContainer onPress={() => requestMultiplePermissions()}>
              <ButtonText>권한 허용</ButtonText>
            </ButtonContainer>
          </SubscriptionWrapper>
        </TitleContainer>
      </Container>
    </AuthBGView>
  );
};

export default permissionAuth;
