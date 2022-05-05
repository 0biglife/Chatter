import React, {useState} from 'react';
import styled from 'styled-components/native';
import {SearchBar} from './HomeFeed';
import IonIcon from 'react-native-vector-icons/Ionicons';
import unsplashClient from '../../../apis/UnsplashAPI/unsplashClient';
import Config from 'react-native-config';
import {FlatList} from 'react-native';

const MainContainer = styled.View`
  flex: 1;
  background-color: white;
`;

const CellContainer = styled.View`
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

const SearchResults = () => {
  const [users, setUsers] = useState();

  const renderItem = ({item}) => {
    return <CellContainer></CellContainer>;
  };

  const searchData = async (text: string) => {
    console.log('search : ', text);
    try {
      const response = await unsplashClient.get('/search/users?', {
        params: {
          per_page: 20,
          query: text,
          client_id: `${Config.UNSPLASH_ACCESSTOKEN}`,
        },
      });
      console.log('SearchBar Succeed : ', response.data.results);
      setUsers(response.data.results);
    } catch (e) {
      console.log('HomeFeed/SearchBar Error : ', e);
    }
  };

  return (
    <MainContainer>
      <SearchBar
        placeholder="찾고 싶은 닉네임을 입력해주세요"
        onChangeText={(text: string) => searchData(text)}
      />
      <IonIcon
        style={{position: 'absolute', marginTop: 11, marginLeft: 16}}
        name="search-outline"
        size={20}
        color="lightgray"
      />
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
    </MainContainer>
  );
};

export default SearchResults;
