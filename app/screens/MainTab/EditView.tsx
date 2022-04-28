import React, {useState} from 'react';
import styled from 'styled-components/native';
import {Dimensions, TouchableOpacity} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ProfileStackParamList} from '../../navigations/Types';

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

const EditView = () => {
  const route = useRoute<RouteProp<ProfileStackParamList>>();
  const navigation =
    useNavigation<
      NativeStackNavigationProp<ProfileStackParamList, 'EditView'>
    >();
  const [userName, setUserName] = useState<string>('');
  return (
    <MainContainer>
      <HeaderSection>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <HeaderText>취소</HeaderText>
        </TouchableOpacity>
        <HeaderText style={{fontWeight: '600', fontSize: 17}}>
          프로필 편집
        </HeaderText>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <HeaderText>완료</HeaderText>
        </TouchableOpacity>
      </HeaderSection>
      <ImageSection>
        <ImageView>
          {/* <ProfileImage source={{uri: route.params?.image}} /> */}
          <ProfileImage
            source={{
              uri: 'http://www.nbnnews.co.kr/news/photo/202106/506788_549628_956.jpg',
            }}
          />
        </ImageView>
      </ImageSection>
      <BodySection>
        <TextWrqapper>
          <TitleView>
            <Title>이름</Title>
          </TitleView>
          <InputView>
            <Input
              placeholder={route.params?.name}
              style={{
                fontWeight: '400',
              }}
            />
          </InputView>
        </TextWrqapper>
      </BodySection>
    </MainContainer>
  );
};

export default EditView;
