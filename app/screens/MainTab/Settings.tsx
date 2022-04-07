import React, {useCallback, useEffect} from 'react';
import styled from 'styled-components/native';
import {Alert} from 'react-native';
//API + Storage
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import EncryptedStorage from 'react-native-encrypted-storage';
//Redux
import {useAppDispatch} from '../../redux/store/index';
import userSlice from '../../redux/slices/user';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store/reducers';

const Container = styled.View`
  justify-content: space-around;
`;

const TextContainer = styled.View`
  background-color: lightgray;
  justify-content: center;
  align-items: center;
  padding: 20px;
  margin: 20px;
`;

const ButtonContainer = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  background-color: lightcoral;
  height: 48px;
  border-radius: 8px;
  margin: 20px;
`;

const Title = styled.Text`
  font-size: 16px;
  color: white;
`;

function Settings() {
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const dispatch = useAppDispatch();
  const name = useSelector((state: RootState) => state.user.name);
  const money = useSelector((state: RootState) => state.user.money);

  useEffect(() => {
    const getMoney = async () => {
      const response = await axios.get<{data: number}>(
        `${Config.API_URL}/showmethemoney`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        },
      );
      dispatch(userSlice.actions.setMoney(response.data.data));
    };
    getMoney();
  }, [accessToken, dispatch]);

  const onLogout = useCallback(async () => {
    try {
      await axios.post(
        `${Config.API_URL}/logout`,
        {},
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        },
      );
      Alert.alert('알림', '로그아웃 되었습니다.');
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
    <Container>
      <TextContainer>
        <Title style={{color: 'black'}}>
          {name} 님의 수익금{' '}
          <Title style={{color: 'black', fontWeight: 'bold'}}>
            {money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </Title>
        </Title>
      </TextContainer>
      <ButtonContainer onPress={onLogout}>
        <Title>Log Out</Title>
      </ButtonContainer>
    </Container>
  );
}

export default Settings;
