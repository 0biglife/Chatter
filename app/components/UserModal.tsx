import React from 'react';
import {Text} from 'react-native';
import Modal from 'react-native-modal';
import styled from 'styled-components/native';

const MainContainer = styled.View`
  flex: 1;
`;

const ModalContainer = styled.View`
  flex: 1;
  top: 28%;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-color: lightgray;
  border-width: 1px;
  width: 100%;
  max-height: 200px;
  border-radius: 10px;
`;

interface ModalProps {
  showModal: boolean;
  setShowModal: any;
  userInfo: string;
}

const UserModal = (props: ModalProps) => {
  console.log('modal props ; ', props.userInfo);
  return (
    <MainContainer>
      <Modal
        backdropColor="transparent"
        animationIn="fadeInUp"
        useNativeDriver={true}
        isVisible={props.showModal}
        onBackdropPress={() => props.setShowModal(false)}>
        <ModalContainer>
          <Text>test</Text>
          <Text>{props.userInfo}</Text>
        </ModalContainer>
      </Modal>
    </MainContainer>
  );
};

export default UserModal;
