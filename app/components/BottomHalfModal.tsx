import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {Text} from 'react-native';
import Modal from 'react-native-modal';
import styled from 'styled-components/native';

const ModalContainer = styled.View`
  align-self: flex-end;
  width: 100%;
  height: 200px;
  background-color: white;
  border-radius: 20px;
  padding: 20px;
  border-width: 0.5px;
  border-color: gray;
`;

interface ModalProps {
  showModal: boolean;
  setShowModal: any;
  onClose: () => void;
  // moveToProfile: () => void;
}

const BottomHalfModal = (props: ModalProps) => {
  // console.log('Modal Data : ', props.userProfile);
  return (
    <Modal
      style={{justifyContent: 'flex-end'}}
      onSwipeComplete={() => props.onClose()}
      backdropColor="transparent"
      swipeDirection={['up', 'down']}
      isVisible={props.showModal}
      onBackdropPress={() => props.setShowModal(false)}>
      <ModalContainer>
        <Text>test</Text>
      </ModalContainer>
    </Modal>
  );
};

export default BottomHalfModal;
