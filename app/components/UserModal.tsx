import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
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
  width: 84px;
  height: 84px;
  border-radius: 42px;
  margin-left: 30px;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const InfoWrapper = styled.View`
  flex: 2;
  height: 90px;
  margin-left: 10px;
  margin-right: 20px;
  flex-direction: column;
`;

const InfoSection = styled.View`
  flex: 2;
  flex-direction: row;
  justify-content: space-between;
  margin-left: 14px;
  margin-right: 20px;
  margin-bottom: 6px;
`;

const ButtonSection = styled.TouchableOpacity`
  background-color: white;
  border-width: 0.5px;
  border-color: gray;
  flex: 1;
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 4px;
  border-radius: 6px;
  justify-content: center;
  align-items: center;
`;

const ButtonText = styled.Text`
  font-size: 15px;
  color: black;
`;

const TitleSection = styled.View`
  justify-content: center;
  align-items: center;
`;

const DataSection = styled.View`
  justify-content: center;
  align-items: center;
  margin-left: 8px;
  margin-right: 8px;
`;

const Title = styled.Text`
  font-size: 15px;
  font-weight: 400;
  color: black;
  margin-top: 4px;
  margin-bottom: 4px;
`;

const DataText = styled.Text`
  font-size: 15px;
  font-weight: 500;
  color: black;
  margin-top: 4px;
  margin-bottom: 4px;
`;

interface ModalProps {
  showModal: boolean;
  setShowModal: any;
  userInfo: string;
  userLocation: string;
  userProfile: string;
  gotoProfile: () => void;
}

const UserModal = (props: ModalProps) => {
  console.log('test : ', props);
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
            <ImageSection activeOpacity={0.6} onPress={() => props.gotoProfile}>
              <ProfileImage source={{uri: props.userProfile}} />
            </ImageSection>
            <InfoWrapper>
              <InfoSection>
                <TitleSection>
                  <Title>사용자</Title>
                  <Title>거주지</Title>
                </TitleSection>
                <DataSection>
                  <DataText>{props.userInfo}</DataText>
                  <DataText numberOfLines={1}>{props.userLocation}</DataText>
                </DataSection>
              </InfoSection>
              <ButtonSection onPress={() => props.gotoProfile}>
                <ButtonText>프로필 방문</ButtonText>
              </ButtonSection>
            </InfoWrapper>
          </InnerContainer>
        </ModalContainer>
      </Modal>
    </MainContainer>
  );
};

export default UserModal;
