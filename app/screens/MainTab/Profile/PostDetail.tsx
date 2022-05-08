import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {Alert, Image, View} from 'react-native';
import styled from 'styled-components/native';
import {ProfileStackParamList} from '../../../navigations/Types';
import IonIcon from 'react-native-vector-icons/Ionicons';
import HalfModal from '../../../components/HalfModal';
import firestore from '@react-native-firebase/firestore';

const MainContainer = styled.View`
  flex: 1;
`;

const HeaderSection = styled.View`
  width: 100%;
  height: 62px;
  flex-direction: row;
  align-items: center;
`;

const ImageView = styled.TouchableOpacity`
  width: 50px;
  height: 50px;
  margin-left: 6px;
`;

const ProfileImage = styled.Image`
  flex: 1;
  border-radius: 25px;
`;

const ProfileName = styled.Text`
  font-size: 16px;
  font-weight: 500;
`;

const LocationText = styled.Text`
  font-size: 14px;
  font-weight: 300;
  margin-top: 2px;
`;

const PostOption = styled.TouchableOpacity`
  align-items: flex-end;
  flex: 1;
  margin-right: 10px;
`;

const BodySection = styled.View`
  min-width: 96%;
  padding: 10px;
  margin: 10px;
  align-self: center;
  min-height: 100px;
  border-width: 0.5px;
  border-color: lightgray;
  border-radius: 20px;
  background-color: rgba(0, 0, 0, 0.1);
`;

const BodyText = styled.Text`
  font-size: 16px;
  font-weight: 300;
  color: black;
`;

const BottomSection = styled.View`
  width: 96%;
  padding: 4px;
  align-items: flex-end;
  margin-left: 10px;
  margin-right: 10px;
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.1);
`;

const TimeText = styled.Text`
  font-size: 14px;
  font-weight: 300;
  margin-right: 10px;
  color: gray;
`;

interface PostDetailProps {
  body: string;
  image: string;
  userName: string;
}

const PostDetail: React.FC<PostDetailProps> = () => {
  const route = useRoute<RouteProp<ProfileStackParamList, 'PostDetail'>>();
  const navigation =
    useNavigation<
      NativeStackNavigationProp<ProfileStackParamList, 'PostDetail'>
    >();
  const [showModal, setShowModal] = useState<boolean>(false);
  const FBStore = firestore().collection('user').doc('1').collection('post');

  const modify = () => {
    navigation.navigate('PostModify', {
      image: route.params.image,
      body: route.params.body,
    });
    setShowModal(false);
  };

  const remove = () => {
    FBStore.doc('iaON8v7jv04Lns8ZYYVX').delete();
    Alert.alert('기록이 삭제되었습니다.');
    setShowModal(false);
    navigation.navigate('Profile');
  };

  const share = async () => {
    setShowModal(false);

    Alert.alert('share');
    // const shareOptions = {
    //   message: 'test for sharing function',
    // };

    // try {
    //   const shareResponse = await Share.open(shareOptions);
    //   console.log(JSON.stringify(shareResponse));
    // } catch (e) {
    //   console.log('Share Error : ', e);
    // }
  };

  return (
    <MainContainer>
      <HeaderSection>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <ImageView onPress={() => navigation.navigate('Profile')}>
            <ProfileImage
              source={{
                uri: 'https://i.pinimg.com/736x/31/b0/96/31b0965acfb3438474bb47c6e4d1f221.jpg',
              }}
            />
          </ImageView>
          <View style={{flexDirection: 'column', marginLeft: 12}}>
            <ProfileName>{route.params.userName}</ProfileName>
            <LocationText>Songpa, Seoul</LocationText>
          </View>
        </View>
        <PostOption onPress={() => setShowModal(true)}>
          <IonIcon name="ellipsis-horizontal-sharp" size={28} color="black" />
        </PostOption>
        <HalfModal
          type={2}
          showModal={showModal}
          setShowModal={setShowModal}
          firstTapped={modify}
          secondTapped={remove}
          thirdTapped={share}
        />
      </HeaderSection>
      {/* <Image
        style={{width: '100%', height: 300}}
        source={{uri: route.params.image}}
      /> */}
      <BodySection>
        <BodyText>{route.params.body}</BodyText>
      </BodySection>
      <BottomSection>
        <TimeText>{route.params.created}</TimeText>
      </BottomSection>
    </MainContainer>
  );
};

export default PostDetail;
