import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import {postData} from '../../apis/postData';

const MainContainer = styled.View`
  flex: 1;
  background-color: gray;
`;

const CellContainer = styled.View`
  background-color: black;
  height: 400px;
  width: 100%;
  margin-top: 2px;
`;

const BodySection = styled.View`
  flex: 1;
`;

const PostImgae = styled.Image`
  flex: 1;
  width: 100%;
  height: 100%;
`;

const HomeFeed = () => {
  // const [data, setData] = useState();

  // useEffect(() => {
  //   const getPostData = async () => {
  //     try {
  //       const response = await unsplashClient.get('');

  //       console.log('HomeFeed API SUCCESS : ', response.data);
  //       setData(response.data);
  //     } catch (e) {
  //       console.log('HomeFeed API FAILED : ', e);
  //     }
  //   };
  //   getPostData();
  // }, []);

  const renderItem = ({item}) => {
    return (
      <CellContainer>
        <BodySection>
          <PostImgae resizeMode="contain" source={item.image} />
        </BodySection>
      </CellContainer>
    );
  };

  return (
    <MainContainer>
      <FlatList
        data={postData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
    </MainContainer>
  );
};

export default HomeFeed;
