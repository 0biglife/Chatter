import React, {useEffect, useState} from 'react';
import NaverMapView, {Marker} from 'react-native-nmap';
import styled from 'styled-components/native';
import Geolocation from '@react-native-community/geolocation';
import {ActivityIndicator, Alert, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store/reducers';
import Config from 'react-native-config';
import weatherClient from '../../apis/weatherClient';
import IonIcon from 'react-native-vector-icons/Ionicons';

const Container = styled.View`
  flex: 1;
`;

const WeatherView = styled.View`
  width: 100px;
  height: 100px;
  position: absolute;
  background-color: white;
  margin-top: 44px;
  margin-left: 10px;
  border-radius: 16px;
  border-width: 1px;
  border-color: lightgray;
  opacity: 0.8;
`;

const HeadText = styled.Text`
  font-size: 12px;
  font-weight: 400;
  color: black;
  opacity: 0.8;
  margin: 12px;
`;

const Title = styled.Text`
  font-weight: 600;
  font-size: 20px;
`;

const HomeMap = () => {
  const orders = useSelector((state: RootState) => state.order.orders);
  const [myWeather, setMyWeather] = useState<string>('');
  const [iconName, setIconName] = useState<string>('');
  const [myPosition, setMyPosition] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      info => {
        setMyPosition({
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
        });
      },
      console.error,
      {
        enableHighAccuracy: true,
        timeout: 20000,
        distanceFilter: 400,
      },
    );
    const getWeather = async () => {
      try {
        const response = await weatherClient.get(
          `/weather?lat=${myPosition?.latitude}&lon=${myPosition?.longitude}&appid=${Config.WEATHER_APIKEY}`,
        );
        setMyWeather(response.data.weather[0].main);
        if (myWeather === 'Clouds') {
          setIconName('cloudy-outline');
        }
      } catch (e) {
        console.log('Weather API error : ', e);
      }
    };
    getWeather();
  }, []);

  if (!myPosition || !myPosition.latitude) {
    return (
      <Container style={{justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator color="black" />
      </Container>
    );
  }

  //rainy-outline,cloudy-outline,md-cloudy-night-outline(night)
  //partly-sunny-outline(구름 가린 햇빛),sunny-outline(태양), snow-outline(눈)
  return (
    <Container>
      <NaverMapView
        style={{width: '100%', height: '100%'}}
        zoomControl={false}
        center={{
          zoom: 10,
          latitude: myPosition.latitude,
          longitude: myPosition.longitude,
        }}>
        <Marker
          coordinate={{
            latitude: myPosition.latitude,
            longitude: myPosition.longitude,
          }}
          pinColor="black"
          width={30}
          height={40}
        />
        {orders.map(orderPostition => (
          <Marker
            coordinate={{
              latitude: orderPostition.start.latitude,
              longitude: orderPostition.start.longitude,
            }}
            pinColor="red"
            width={30}
            height={40}
            onClick={() => Alert.alert(`${orderPostition.orderId}`)}
          />
        ))}
      </NaverMapView>
      <WeatherView>
        <HeadText>지금 날씨는..</HeadText>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <IonIcon name={iconName} size={34} />
        </View>
      </WeatherView>
    </Container>
  );
};

export default HomeMap;
