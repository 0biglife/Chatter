import React from 'react';
import {Text, View} from 'react-native';
import styled from 'styled-components/native';

export const CellContainer = styled.View`
  align-self: center;
  margin-left: 12px;
  margin-right: 12px;
  margin-top: 12px;
  height: 100px;
  border-radius: 8px;
  background-color: white;
  flex-direction: row;
`;

export const PostImage = styled.Image`
  flex: 1;
  width: 100px;
  height: 100px;
  border-radius: 8px;
  margin-right: 4px;
`;

export const PostedWrapper = styled.View`
  flex: 2;
  flex-direction: column;
  align-self: flex-start;
  padding: 10px;
  border-radius: 8px;
  border-width: 0.5px;
  margin-left: 2px;
  border-color: lightgray;
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
