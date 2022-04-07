import React, {useCallback} from 'react';
import {FlatList} from 'react-native';
import {useSelector} from 'react-redux';
import OrderCell from '../../components/OrderCell';
import {Order} from '../../redux/slices/order';
import {RootState} from '../../redux/store/reducers';

const Orders = () => {
  const orders = useSelector((state: RootState) => state.order.orders);

  const renderItem = useCallback(({item}: {item: Order}) => {
    return <OrderCell item={item} />;
  }, []);

  return (
    //반복문 or 서버 데이터 받을 떄는 ScrollView 보단 FlatList 를 지향
    <FlatList
      data={orders}
      keyExtractor={item => item.orderId}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default Orders;
