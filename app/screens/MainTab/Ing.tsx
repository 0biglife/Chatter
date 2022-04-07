import React, {useEffect, useState} from 'react';
import {Dimensions, Text, View} from 'react-native';
import NaverMapView, {Marker, Path} from 'react-native-nmap';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store/reducers';
import Geolocation from '@react-native-community/geolocation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MainTabParamList} from '../../navigations/Types';
import styled from 'styled-components/native';

const ViewContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

type IngProps = NativeStackScreenProps<MainTabParamList, 'Delivery'>;

const Ing: React.FC<IngProps> = ({navigation}) => {
  console.dir(navigation);
  const deliveries = useSelector((state: RootState) => state.order.deliveries);
  const [myPosition, setMyPosition] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  //화면 띄우자마자 현재 위치 useState에 넣어줘야함
  useEffect(() => {
    Geolocation.watchPosition(
      //사용자가 움직이는거 반영은 getCurrentPosition이 아닌 watchPostition으로 적용(배터리 소모 큼)
      //첫 번째 인자 : 성공할 시
      info => {
        setMyPosition({
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
        });
      },
      //두 번째 인자 : 실패할 시(콘솔로 에러 출력)
      console.error,
      //세 번째 인자 : 옵션
      {
        enableHighAccuracy: true, //정확한 수치로 가져올 것
        timeout: 20000, //20초 동안 안가져오면 에러 띄울 것
        distanceFilter: 100, //사용자 이동 거리마다 트래킹
      },
    );
  }, []);

  //deliveries 배열에 값이 없을 시(주문 수락하지 않은 상태)
  if (!deliveries?.[0]) {
    return (
      <ViewContainer>
        <Text>주문을 먼저 수락해주세요 :)</Text>
      </ViewContainer>
    );
  }

  if (!myPosition || !myPosition.latitude) {
    return (
      <ViewContainer>
        <Text>내 위치를 로딩 중입니다. 권한을 허용했는지 확인해주세요.</Text>
      </ViewContainer>
    );
  }

  const {start, end} = deliveries?.[0];

  return (
    <View>
      <View
        style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
        }}>
        <NaverMapView
          style={{width: '100%', height: '100%'}}
          zoomControl={false}
          center={{
            zoom: 10,
            tilt: 50,
            latitude: (start.latitude + end.latitude) / 2,
            longitude: (start.longitude + end.longitude) / 2,
          }}>
          {myPosition?.latitude && (
            <Marker
              coordinate={{
                latitude: myPosition.latitude,
                longitude: myPosition.longitude,
              }}
              width={15}
              height={15}
              anchor={{x: 0.5, y: 0.5}}
              caption={{text: '나'}}
              image={require('../../assets/red-dot.png')}
            />
          )}
          {myPosition?.latitude && (
            <Path
              coordinates={[
                {
                  latitude: myPosition.latitude,
                  longitude: myPosition.longitude,
                },
                {latitude: start.latitude, longitude: start.longitude},
              ]}
              color="orange"
            />
          )}
          <Marker
            coordinate={{ 
              latitude: start.latitude,
              longitude: start.longitude,
            }}
            width={15}
            height={15}
            anchor={{x: 0.5, y: 0.5}}
            caption={{text: '출발'}}
            image={require('../../assets/blue-dot.png')}
          />
          <Path
            coordinates={[
              {
                latitude: start.latitude,
                longitude: start.longitude,
              },
              {latitude: end.latitude, longitude: end.longitude},
            ]}
            color="orange"
          />
          <Marker
            coordinate={{latitude: end.latitude, longitude: end.longitude}}
            width={15}
            height={15}
            anchor={{x: 0.5, y: 0.5}}
            caption={{text: '도착'}}
            image={require('../../assets/green-dot.png')}
            onClick={() => {
              console.log(navigation);
              navigation.push('Complete', {orderId: deliveries[0].orderId});
            }}
          />
        </NaverMapView>
      </View>
    </View>
  );
};

export default Ing;
