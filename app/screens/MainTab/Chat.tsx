import React from 'react';
import {Text, View} from 'react-native';

const Chat = () => {
  return (
    <View>
      <Text>cnhat</Text>
    </View>
    //반복문 or 서버 데이터 받을 떄는 ScrollView 보단 FlatList 를 지향
    // <FlatList
    //   data={orders}
    //   keyExtractor={item => item.orderId}
    //   renderItem={renderItem}
    //   showsVerticalScrollIndicator={false}
    // />
  );
};

export default Chat;
