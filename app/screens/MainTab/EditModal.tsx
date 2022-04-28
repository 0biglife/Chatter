import React, {useState} from 'react';
import styled from 'styled-components/native';
import Modal from 'react-native-modal';
import {Dimensions, Image, Text, TouchableOpacity} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';

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

const ProfileImage = styled.TouchableOpacity`
  background-color: antiquewhite;
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

interface PostProps {
  userInfo: {
    name: string;
    image: any;
  };
  showModal: boolean;
  setShowModal: any;
}

const EditModal: React.FC<PostProps> = props => {
  const [userName, setUserName] = useState<string>('');
  return (
    <Modal
      isVisible={props.showModal}
      useNativeDriver={true}
      animationIn="slideInUp"
      animationInTiming={300}
      animationOut="slideOutDown"
      animationOutTiming={300}>
      <MainContainer>
        <HeaderSection>
          <TouchableOpacity onPress={() => props.setShowModal(false)}>
            <HeaderText>취소</HeaderText>
          </TouchableOpacity>
          <HeaderText style={{fontWeight: '600', fontSize: 17}}>
            프로필 편집
          </HeaderText>
          <TouchableOpacity onPress={() => props.setShowModal(false)}>
            <HeaderText>완료</HeaderText>
          </TouchableOpacity>
        </HeaderSection>
        <ImageSection>
          <ProfileImage>
            <Image source={props.userInfo.image} />
          </ProfileImage>
        </ImageSection>
        <BodySection>
          <TextWrqapper>
            <TitleView>
              <Title>이름</Title>
            </TitleView>
            <InputView>
              <Input placeholder={props.userInfo.name} />
            </InputView>
          </TextWrqapper>
        </BodySection>
      </MainContainer>
    </Modal>
  );
};

export default EditModal;
