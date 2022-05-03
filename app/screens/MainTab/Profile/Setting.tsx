import {AxiosError} from 'axios';
import React, {useCallback} from 'react';
import {Alert} from 'react-native';
import {useSelector} from 'react-redux';
import styled from 'styled-components/native';
import client from '../../../apis/MarkerAPI/client';
import userSlice from '../../../redux/slices/user';
import {useAppDispatch} from '../../../redux/store';
import {RootState} from '../../../redux/store/reducers';
import EncryptedStorage from 'react-native-encrypted-storage';

const MainContainer = styled.View`
  flex: 1;
  background-color: aliceblue;
  flex-direction: column;
  justify-content: flex-end;
  padding: 10px;
`;

const ButtonContainer = styled.TouchableOpacity`
  width: 100%;
  height: 46px;
  border-radius: 10px;
  border-width: 0.5px;
  background-color: white;
  border-color: lightgray;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
`;

const ButtonText = styled.Text`
  font-size: 16px;
  font-weight: 400;
  color: black;
`;

const Setting = () => {
  const dispatch = useAppDispatch();
  const accessToken = useSelector((state: RootState) => state.user.accessToken);

  const onLogOut = useCallback(async () => {
    Alert.alert('알림', '로그아웃 되었습니다.');
    dispatch(
      userSlice.actions.setUser({
        name: '',
        email: '',
        accessToken: '',
      }),
    );
    await EncryptedStorage.removeItem('refreshToken');
  }, [dispatch]);

  const onSecession = useCallback(async () => {
    try {
      await client.post(
        '/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      Alert.alert('알림', '회원탈퇴 되었습니다.');
      dispatch(
        userSlice.actions.setUser({
          name: '',
          email: '',
          accessToken: '',
        }),
      );
      await EncryptedStorage.removeItem('refreshToken');
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      console.error(errorResponse);
    }
  }, [accessToken, dispatch]);

  return (
    <MainContainer>
      <ButtonContainer onPress={onLogOut}>
        <ButtonText>로그아웃</ButtonText>
      </ButtonContainer>
      <ButtonContainer onPress={onSecession}>
        <ButtonText>회원탈퇴</ButtonText>
      </ButtonContainer>
    </MainContainer>
  );
};

export default Setting;
