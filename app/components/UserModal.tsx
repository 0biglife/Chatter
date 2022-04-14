import React, {useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import styled from 'styled-components/native';

const MainContainer = styled.View`
  flex: 1;
`;

const ModalContainer = styled.View`
  flex: 1;
  top: 34%;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-color: lightgray;
  border-width: 1px;
  width: 100%;
  max-height: 115px;
  border-radius: 10px;
`;

const InnerContainer = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;

const ImageSection = styled.TouchableOpacity``;

const ProfileImage = styled.Image`
  background-color: lightcoral;
  width: 80px;
  height: 80px;
  border-radius: 45px;
  margin-left: 30px;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const InfoSection = styled.View`
  flex: 2;
  height: 90px;
  margin: 20px;
  flex-direction: row;
`;

const TitleSection = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const DataSection = styled.View`
  justify-content: center;
  align-items: center;
  flex: 2;
`;

const Title = styled.Text`
  font-size: 16px;
  font-weight: 300;
  color: black;
  margin-top: 4px;
  margin-bottom: 4px;
`;

const DataText = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: black;
  margin-top: 4px;
  margin-bottom: 4px;
`;

interface ModalProps {
  showModal: boolean;
  setShowModal: any;
  userInfo: string;
  userProfile: string;
}

const UserModal = (props: ModalProps) => {
  console.log('Modal Data : ', props.userProfile);
  return (
    <MainContainer>
      <Modal
        backdropColor="transparent"
        animationIn="fadeInUp"
        useNativeDriver={true}
        isVisible={props.showModal}
        onBackdropPress={() => props.setShowModal(false)}>
        <ModalContainer>
          <InnerContainer>
            <ImageSection>
              <ProfileImage source={{uri: props.userProfile}} />
            </ImageSection>
            <InfoSection>
              <TitleSection>
                <Title>사용자</Title>
                <Title>주 소</Title>
                <Title>좌 표</Title>
              </TitleSection>
              <DataSection>
                <DataText>{props.userInfo}</DataText>
                <DataText>{props.userInfo}</DataText>
                <DataText>{props.userInfo}</DataText>
              </DataSection>
            </InfoSection>
          </InnerContainer>
        </ModalContainer>
      </Modal>
    </MainContainer>
  );
};

export default UserModal;
