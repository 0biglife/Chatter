import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {Image, View} from 'react-native';
import styled from 'styled-components/native';
import {ProfileStackParamList} from '../../../navigations/Types';
import IonIcon from 'react-native-vector-icons/Ionicons';

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
  console.log('test: ', route);
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
        <PostOption>
          <IonIcon name="ellipsis-horizontal-sharp" size={28} color="black" />
        </PostOption>
      </HeaderSection>
      <Image
        style={{width: '100%', height: 300}}
        source={{uri: route.params.image}}
      />
    </MainContainer>
  );
};

export default PostDetail;
