import React from 'react';
import styled from 'styled-components/native';
import Modal from 'react-native-modal';
import {Dimensions, Text, TouchableOpacity} from 'react-native';
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

interface EditProps {
  showModal: boolean;
  setShowModal: any;
}

const PostModal: React.FC<EditProps> = props => {
  return (
    <Modal
      isVisible={props.showModal}
      animationIn="slideInUp"
      animationInTiming={300}
      animationOut="slideOutDown"
      animationOutTiming={0}>
      <MainContainer>
        <HeaderSection>
          <TouchableOpacity onPress={() => props.setShowModal(false)}>
            <HeaderText>취소</HeaderText>
          </TouchableOpacity>
          <HeaderText style={{fontWeight: '600', fontSize: 17}}>
            게시글 추가
          </HeaderText>
          <TouchableOpacity onPress={() => props.setShowModal(false)}>
            <HeaderText>완료</HeaderText>
          </TouchableOpacity>
        </HeaderSection>
      </MainContainer>
    </Modal>
  );
};

export default PostModal;
