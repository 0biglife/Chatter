/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import styled from 'styled-components/native';
import {SearchBar} from './HomeFeed';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {ActivityIndicator, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {HomeFeedStackParamList} from '../../../navigations/Types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {searchUser} from '../../../apis/UnsplashAPI/service';
import {useQuery} from 'react-query';
import {searchUserResults} from '../../../apis/UnsplashAPI/type';

const MainContainer = styled.View`
  flex: 1;
  background-color: white;
`;

const CellContainer = styled.TouchableOpacity`
  align-self: center;
  width: 96%;
  height: 80px;
  background-color: white;
  border-color: lightgray;
  border-width: 0.5px;
  border-radius: 10px;
  margin-bottom: 6px;
  flex-direction: row;
`;

const ImageSection = styled.View`
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

const InfoSection = styled.View`
  width: 78%;
  height: 100%;
  justify-content: center;
  padding-right: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
`;

const Name = styled.Text`
  font-size: 16px;
  font-weight: 400;
  color: black;
`;

const Location = styled.Text`
  font-size: 14px;
  font-weight: 300;
  color: black;
  margin-top: 4px;
`;

const SearchResults = () => {
  const [value, setValue] = useState<string>('');
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeFeedStackParamList>>();
  const {data, refetch} = useQuery(['searchUser', value], () =>
    searchUser(value),
  );

  if (!data) {
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
    console.log('Search Data Succeed : ', data);
  }

  const renderItem = ({item}: {item: searchUserResults}) => {
    return (
      <CellContainer
        activeOpacity={0.4}
        style={{
          shadowColor: 'black',
          shadowOpacity: 0.2,
          shadowRadius: 3,
          shadowOffset: {width: 3, height: 3},
        }}
        onPress={() =>
          navigation.navigate('UserProfile', {
            id: item.id,
            user_name: item.name,
            user_location: item.location,
            user_profile: item.profile_image.large,
          })
        }>
        <ImageSection>
          <ProfileImage source={{uri: item.profile_image.large}} />
        </ImageSection>
        <InfoSection>
          <Name>{item.name}</Name>
          <Location>{item.location ? item.location : 'none'}</Location>
        </InfoSection>
      </CellContainer>
    );
  };

  // const searchData = async (text: string) => {
  //   console.log('search : ', text);
  //   try {
  //     const response = await client.get('/search/users?', {
  //       params: {
  //         // per_page: 10,
  //         query: text,
  //         client_id: `${Config.UNSPLASH_ACCESSTOKEN}`,
  //       },
  //     });
  //     console.log('SearchBar Succeed : ', response.data.results);
  //     setUsers(response.data.results);
  //   } catch (e) {
  //     console.log('HomeFeed/SearchBar Error : ', e);
  //   }
  // };

  return (
    <MainContainer>
      <SearchBar
        placeholder="찾고 싶은 닉네임을 입력해주세요"
        autoCompleteType="off"
        autoCapitalize="none"
        returnKeyType="search"
        autoCorrect={false}
        autoFocus={false}
        onChangeText={(text: string) => setValue(text)}
        // onSubmitEditing={onSubmit}
      />
      <IonIcon
        style={{position: 'absolute', marginTop: 11, marginLeft: 16}}
        name="search-outline"
        size={20}
        color="lightgray"
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

export default SearchResults;
