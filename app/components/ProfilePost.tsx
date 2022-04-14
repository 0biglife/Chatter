import React from 'react';
import {Text, View} from 'react-native';
import styled from 'styled-components/native';

export const CellContainer = styled.View`
  align-self: center;
  width: 94%;
  height: 100px;
  border-radius: 8px;
  margin-top: 8px;
  background-color: lightgray;
  flex-direction: row;
`;

export const PostImage = styled.Image`
  flex: 1;
  width: 100px;
  height: 100px;
  border-radius: 4px;
`;

export const PostedWrapper = styled.View`
  flex: 2;
  flex-direction: column;
  align-self: flex-start;
  padding: 10px;
`;

export const PostText = styled.Text`
  flex: 4;
`;

export const PostedTime = styled.Text`
  flex: 1;
  margin-top: 10px;
  font-weight: 200;
`;

const ProfilePost = () => {
  return (
    <View>
      <Text>test</Text>
    </View>
  );
};

export default ProfilePost;
