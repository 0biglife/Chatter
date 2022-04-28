import React, {useState} from 'react';
import styled from 'styled-components/native';
import Modal from 'react-native-modal';
import {Alert, Dimensions, TouchableOpacity} from 'react-native';
import firestore from '@react-native-firebase/firestore';

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

const ImageView = styled.TouchableOpacity`
  margin-left: 4px;
  margin-right: 4px;
  margin-top: 4px;
  height: 300px;
  background-color: lavender;
`;

const PostImage = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: 10px;
`;

const PostBody = styled.TextInput`
  justify-content: center;
  height: 100px;
  background-color: lightgray;
  padding: 14px;
  margin-left: 4px;
  margin-right: 4px;
  margin-top: 4px;
  border-radius: 10px;
`;

interface EditProps {
  showModal: boolean;
  setShowModal: any;
}

const PostModal: React.FC<EditProps> = props => {
  const [postImage, setPostImage] = useState<string>(
    'https://i.pinimg.com/736x/31/b0/96/31b0965acfb3438474bb47c6e4d1f221.jpg',
  );
  const [postText, setPostText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const FBStore = firestore().collection('users').doc('my').collection('post');

  const cancel = () => {
    if (postText) {
      Alert.alert('알림', '작업을 취소하시겠습니까?', [
        {
          text: '아니오',
        },
        {
          text: '예',
          onPress: () => props.setShowModal(false),
        },
      ]);
    } else {
      props.setShowModal(false);
    }
  };

  const complete = async () => {
    if (postText) {
      try {
        setLoading(true);
        await FBStore.add({
          body: postText,
          image: postImage,
        });
        console.log('test');
      } catch (e) {
        console.log('PostModal/Post Error : ', e);
      } finally {
        setLoading(false);
        props.setShowModal(false);
      }
    } else {
      props.setShowModal(false);
    }
  };

  return (
    <Modal
      isVisible={props.showModal}
      animationIn="slideInUp"
      animationInTiming={300}
      animationOut="slideOutDown"
      animationOutTiming={0}>
      <MainContainer>
        <HeaderSection>
          <TouchableOpacity onPress={() => cancel()}>
            <HeaderText>취소</HeaderText>
          </TouchableOpacity>
          <HeaderText style={{fontWeight: '600', fontSize: 17}}>
            게시글 추가
          </HeaderText>
          <TouchableOpacity onPress={() => complete()}>
            <HeaderText>완료</HeaderText>
          </TouchableOpacity>
        </HeaderSection>
        <ImageView>
          <PostImage source={{uri: postImage}} />
        </ImageView>
        <PostBody
          value={postText}
          onChangeText={(text: string) => {
            setPostText(text);
          }}
          autoCapitalize="none"
          autoCompleteType="off"
          autoCorrect={false}
          multiline={true}
          numberOfLines={4}
        />
      </MainContainer>
    </Modal>
  );
};

export default PostModal;
