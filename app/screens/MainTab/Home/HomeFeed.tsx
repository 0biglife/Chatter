/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {FlatList} from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {HomeFeedStackParamList} from '../../../navigations/Types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ActivityIndicator} from 'react-native';
import {useQuery} from 'react-query';
import {getPhoto} from '../../../apis/UnsplashAPI/service';
import {randomPhotoState} from '../../../apis/UnsplashAPI/type';

const MainContainer = styled.View`
  flex: 1;
  background-color: white;
`;

export const SearchBar = styled.TextInput`
  width: 96%;
  height: 44px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  align-self: center;
  padding-left: 32px;
  margin-bottom: 8px;
  border-color: lightgray;
  border-width: 1px;
  font-size: 16px;
  color: black;
`;

const CellContainer = styled.View`
  align-self: center;
  width: 96%;
  height: 390px;
  background-color: white;
  border-color: lightgray;
  border-width: 0.5px;
  border-radius: 10px;
  margin-bottom: 6px;
`;

const HeaderSection = styled.View`
  width: 100%;
  height: 80px;
  flex-direction: row;
`;

const ProfileView = styled.TouchableOpacity`
  width: 80px;
  height: 80px;
  align-items: center;
  justify-content: center;
`;

const ProfileImage = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 30px;
`;

const InfoView = styled.View`
  justify-content: center;
  flex-direction: column;
  width: 200px;
  height: 80px;
  padding-right: 10px;
  padding-left: 4px;
`;

const Name = styled.Text`
  font-size: 16px;
  font-weight: 500;
`;

const Location = styled.Text`
  font-size: 14px;
  font-weight: 300;
  margin-top: 4px;
`;

const ImageSection = styled.Image`
  width: 100%;
  height: 240px;
`;

const BodySection = styled.View`
  width: 100%;
  padding: 10px;
`;

const BodyText = styled.Text`
  font-size: 14px;
  font-weight: 400;
`;

const HomeFeed = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeFeedStackParamList>>();
  const {data, isLoading} = useQuery('homePost', getPhoto);

  //useQuery 적용 전 .get 호출
  // -> useEffect, useState 생략 가능
  // -> Auth 인증은 최적화 처리
  // const getUser = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await client.get('/photos/random', {
  //       params: {
  //         count: 1,
  //         query: 'war',
  //         client_id: `${Config.UNSPLASH_ACCESSTOKEN}`,
  //       },
  //     });
  //     setData(response.data);
  //     console.log('HomeFeed Unsplash Data : ', response.data);
  //   } catch (e) {
  //     console.log('HomeFeed/getUser Error : ', e);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // useEffect(() => {
  //   getUser();
  // }, []);

  if (!data) {
    console.log('data uploading : ', isLoading);
    return (
      <ActivityIndicator
        style={{
          flex: 1,
          justifyContent: 'center',
          alignContent: 'center',
        }}
        size="small"
        color="gray"
      />
    );
  } else {
    console.log('Home useQuery Data : ', data);
  }

  const renderItem = ({item}: {item: randomPhotoState}) => {
    return (
      <CellContainer
        style={{
          height: item.user.bio ? 390 : 320,
          shadowColor: 'black',
          shadowOpacity: 0.2,
          shadowRadius: 3,
          shadowOffset: {width: 3, height: 3},
        }}>
        <HeaderSection>
          <ProfileView
            activeOpacity={0.2}
            onPress={() =>
              navigation.navigate('UserProfile', {
                id: item.id,
                user_name: item.user.name,
                user_location: item.user.location,
                user_profile: item.user.profile_image.large,
              })
            }>
            <ProfileImage source={{uri: item.user.profile_image.large}} />
          </ProfileView>
          <InfoView>
            <Name>{item.user.name}</Name>
            <Location>{item.user.location}</Location>
          </InfoView>
        </HeaderSection>
        <ImageSection
          style={{
            borderBottomLeftRadius: item.user.bio ? 0 : 10,
            borderBottomRightRadius: item.user.bio ? 0 : 10,
          }}
          source={{uri: item.urls.full}}
        />
        <BodySection>
          <BodyText numberOfLines={3}>{item.user.bio}</BodyText>
        </BodySection>
      </CellContainer>
    );
  };

  return (
    <MainContainer>
      <SearchBar
        placeholder="찾고 싶은 닉네임을 입력해주세요"
        onTouchStart={() => navigation.navigate('SearchResults')}
      />
      <IonIcon
        style={{position: 'absolute', marginTop: 11, marginLeft: 16}}
        name="search-outline"
        size={20}
        color="black"
      />
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
    </MainContainer>
  );
};

export default HomeFeed;
