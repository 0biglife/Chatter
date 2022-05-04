import React from 'react';
import styled from 'styled-components/native';
import Modal from 'react-native-modal';
import {Dimensions} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height / 2;

const MainContainer = styled.View`
  background-color: white;
  top: 50%;
  align-self: center;
  width: ${Width}px;
  height: ${Height}px;
  padding-top: 8px;
  border-radius: 20px;
`;

const GrabBox = styled.View`
  align-self: center;
  width: 40px;
  height: 4px;
  border-color: transparent;
  background-color: lightgray;
  border-radius: 4px;
`;

const Section = styled.TouchableOpacity`
  width: 100%;
  height: 50px;
  margin-top: 4px;
  margin-left: 4px;
  padding: 10px;
  border-bottom-width: 0.5px;
  border-bottom-color: lightgray;
  flex-direction: row;
  align-items: center;
`;

const Title = styled.Text`
  font-size: 16px;
  font-weight: 400;
  color: black;
  margin-left: 14px;
`;

interface HalfModal {
  type: number;
  showModal: boolean;
  setShowModal: any;
  firstTapped: () => void;
  secondTapped: () => void;
  thirdTapped: () => void;
}

const HalfModal: React.FC<HalfModal> = props => {
  return (
    <Modal
      backdropOpacity={0.3}
      isVisible={props.showModal}
      useNativeDriver={true}
      onBackdropPress={() => props.setShowModal(false)}
      animationIn="slideInUp"
      animationInTiming={300}
      animationOut="slideOutDown"
      animationOutTiming={300}>
      <MainContainer>
        <GrabBox />
        <>
          {props.type === 1 && (
            <>
              <Section onPress={props.firstTapped}>
                <IonIcon
                  style={{marginLeft: 6}}
                  name="person-add-outline"
                  size={20}
                  color="black"
                />
                <Title>프로필 편집</Title>
              </Section>
              <Section onPress={props.secondTapped}>
                <IonIcon
                  style={{marginLeft: 6}}
                  name="settings-outline"
                  size={20}
                  color="black"
                />
                <Title>설정</Title>
              </Section>
              <Section onPress={props.thirdTapped}>
                <IonIcon
                  style={{marginLeft: 6}}
                  name="share-outline"
                  size={20}
                  color="black"
                />
                <Title>공유</Title>
              </Section>
            </>
          )}
          {props.type === 2 && (
            <>
              <Section onPress={props.firstTapped}>
                <IonIcon
                  style={{marginLeft: 6}}
                  name="cut-outline"
                  size={20}
                  color="black"
                />
                <Title>수정</Title>
              </Section>
              <Section onPress={props.secondTapped}>
                <IonIcon
                  style={{marginLeft: 6}}
                  name="remove-circle-outline"
                  size={20}
                  color="black"
                />
                <Title>삭제</Title>
              </Section>
              <Section onPress={props.thirdTapped}>
                <IonIcon
                  style={{marginLeft: 6}}
                  name="share-outline"
                  size={20}
                  color="black"
                />
                <Title>공유</Title>
              </Section>
            </>
          )}
        </>
      </MainContainer>
    </Modal>
  );
};

export default HalfModal;
