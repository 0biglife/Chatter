import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import {postData} from '../../apis/postData';

const MainContainer = styled.View`
  flex: 1;
  background-color: white;
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
      {/* <CollapsibleView
        sectionTitle="공지사항"
        content="이 앱은 사용자을 위해 만들어졌습니다. 이 앱은 사용자을 위해 만들어졌습니다. 이 앱은 사용자을 위해 만들어졌습니다. 이 앱은 사용자을 위해 만들어졌습니다. 이 앱은 사용자을 위해 만들어졌습니다. 이 앱은 사용자을 위해 만들어졌습니다. 이 앱은 사용자을 위해 만들어졌습니다. 이 앱은 사용자을 위해 만들어졌습니다."
        maxLine={2}
      /> */}
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
