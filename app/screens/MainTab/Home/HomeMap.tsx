/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import NaverMapView, {Circle, Marker} from 'react-native-nmap';
import styled from 'styled-components/native';
import Geolocation from '@react-native-community/geolocation';
import {ActivityIndicator, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store/reducers';
import Config from 'react-native-config';
import weatherClient from '../../../apis/WeatherAPI/weatherClient';
import IonIcon from 'react-native-vector-icons/Ionicons';
import UserModal from '../../../components/UserModal';
import unsplashClient from '../../../apis/UnsplashAPI/unsplashClient';
import {WeatherState} from '../../../apis/WeatherAPI/weatherState';
import {CompositeNavigationProp, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import { ChatStackParamList, MainTabParamList } from '../../../navigations/Types';
import UnixTimeStamp from '../../../components/UnixTimeStamp';

const Container = styled.View`
  flex: 1;
`;

const HeaderView = styled.View`
  position: absolute;
  margin-top: 44px;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
  height: 96px;
`;

const WeatherView = styled.View`
  width: 80px;
  background-color: white;
  border-radius: 16px;
  border-width: 1px;
  border-color: lightgray;
  opacity: 0.8;
  align-items: center;
  margin-left: 6px;
  margin-right: 4px;
`;

const WeatherText = styled.Text`
  font-size: 13px;
  font-weight: 400;
  margin-top: 2px;
  color: black;
`;

const InfoView = styled.View`
  flex: 1;
  flex-direction: row;
  border-radius: 16px;
  border-width: 1px;
  border-color: lightgray;
  background-color: white;
  opacity: 0.8;
  margin-right: 6px;
  padding: 10px;
`;

const HeadText = styled.Text`
  font-size: 13px;
  font-weight: 400;
  color: black;
  margin: 12px;
`;

const TitleView = styled.View`
  background-color: aliceblue;
  flex-direction: column;
  justify-content: space-around;
  margin-right: 10px;
`;

const Title = styled.Text`
  font-size: 13px;
  font-weight: 500;
`;

const TextView = styled.View`
  background-color: beige;
  flex: 1;
  flex-direction: column;
  justify-content: space-around;
`;

const DataText = styled.Text`
  font-size: 13px;
  font-weight: 300;
`;

type HomeMapProp = CompositeNavigationProp<
  NativeStackNavigationProp<ChatStackParamList>,
  NativeStackNavigationProp<MainTabParamList>
>;

const HomeMap = () => {
  const navigation = useNavigation();
  //User Control
  const orders = useSelector((state: RootState) => state.order.orders);
  const [myPosition, setMyPosition] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [radius, setRadius] = useState<number>(0.1);
  const [distance, setDistance] = useState<string>('');
  const [hour, setHour] = useState<number>(0);
  const [minute, setMinute] = useState<number>(0);
  //User -> Modal
  const [showModal, setShowModal] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<string>('');
  const [userLoca, setUserLoca] = useState<string>('');
  const [userImage, setUserImage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  //Weather Control
  const [weatherData, setWeatherData] = useState<WeatherState | null>(null);
  const [myWeather, setMyWeather] = useState<string>('');
  const [iconName, setIconName] = useState<string>('');

  useEffect(() => {
    // console.log('Marker Added : ', orders.length);
  }, [orders]);

  //현위치(서울특별시 중구) 날씨 정보 지정
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
        setWeatherData(response.data);
        setMyWeather(response.data.weather[0].main);
        var date = new Date(weatherData!.sys.sunset * 1000);
        var hours = date.getHours();
        var minutes = date.getMinutes();
        setHour(hours);
        setMinute(minutes);
        console.log('date test: ', hours, minutes);
        if (myWeather === 'Clouds') {
          setIconName('cloudy-outline');
        } else if (myWeather === 'Mist') {
          setIconName('filter');
        } else if (myWeather === 'Rain') {
          setIconName('rainy-outline');
        } else if (myWeather === 'Clear') {
          setIconName('sunny-outline');
        }
        // else {
        //   // <ActivityIndicator />;
        // }
        // getAreaWeather();
      } catch (e) {
        console.log('Weather API error : ', e);
      }
    };
    getWeather();
  }, [
    myPosition?.latitude,
    myPosition?.longitude,
    myWeather,
    weatherData?.sys.sunset,
  ]);

  if (!myPosition || !myPosition.latitude) {
    return (
      <Container style={{justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator color="black" />
      </Container>
    );
  }

  //마커마다 유저 임의 정보 지정
  const getRandomImage = async () => {
    try {
      setLoading(true);
      const response = await unsplashClient.get('/photos/random', {
        params: {
          count: 1,
          client_id: '3eVYYY9UEOTwk4CcDUgHt9uSSP_MJiAO3E1hcna-i1Q',
        },
      });
      setUserImage(response.data[0].links.download);
      setUserInfo(response.data[0].user.last_name);
      setUserLoca(response.data[0].user.location);
      // console.log('SUCCED!! : ', response.data[0].links.download);
    } catch (e) {
      console.log('UNSPLASH FAILED : ', e);
    } finally {
      setLoading(false);
    }
  };

  //마커 모달 생성
  const markerTapped = (orderPosition) => {
    // var date = new Date(weatherData?.sys.sunrise. * 1000);
    var dis_x = myPosition.latitude - orderPosition.start.latitude;
    var dis_y = myPosition.longitude - orderPosition.start.longitude;
    var dist =
      Math.sqrt(Math.abs(dis_x * dis_x) + Math.abs(dis_y * dis_y)) * 10000;
    var calDist = dist.toFixed(0);
    setDistance(calDist);
    setShowModal(true);
    getRandomImage();
  };

  //모달에서 화면 전환
  const gotoProfile = () => {
    setShowModal(false);
    navigation.navigate('UserProfile');
  };

  const Tapped = () => {
    setRadius(0.05);
  };

  return (
    <Container>
      <NaverMapView
        style={{width: '100%', height: '100%'}}
        zoomControl={false}
        center={{
          zoom: 10, //13
          latitude: myPosition.latitude,
          longitude: myPosition.longitude,
        }}
        nightMode={true}>
        <Marker
          coordinate={{
            latitude: myPosition.latitude,
            longitude: myPosition.longitude,
          }}
          pinColor="black"
          width={30}
          height={40}
        />
        <Circle //사용자 중심 반경 1km 지역
          coordinate={{
            latitude: myPosition.latitude,
            longitude: myPosition.longitude,
          }}
          radius={radius * 100000}
          color={'rgba(255,150,0,0.15)'}
        />
        {orders.map(orderPosition => (
          <>
            <Marker
              coordinate={{
                latitude: orderPosition.start.latitude,
                longitude: orderPosition.start.longitude,
              }}
              pinColor="red"
              width={30}
              height={40}
              onClick={() => markerTapped(orderPosition)}
            />
          </>
        ))}
      </NaverMapView>
      {loading ? (
        <ActivityIndicator color="black" size="large" />
      ) : (
        <UserModal
          showModal={showModal}
          setShowModal={setShowModal}
          userInfo={userInfo}
          userLocation={userLoca}
          userProfile={userImage}
          gotoProfile={gotoProfile}
          getDistance={distance}
        />
      )}
      <HeaderView>
        <WeatherView>
          <HeadText>현재날씨</HeadText>
          {!myWeather ? (
            <ActivityIndicator style={{marginTop: 10}} />
          ) : (
            <IonIcon name={iconName} size={30} />
          )}
          <WeatherText>{myWeather}</WeatherText>
        </WeatherView>
        <InfoView>
          <TitleView>
            <Title>위도 경도</Title>
            <Title>일몰 시간</Title>
            <Title>생존자 수</Title>
          </TitleView>
          <TextView>
            <DataText>
              {weatherData?.coord.lat + ' ' + weatherData?.coord.lon}
            </DataText>
            <DataText>
              {hour}시 {minute}분
            </DataText>
            <DataText>{orders.length} 명</DataText>
          </TextView>
          {/* <HeadText style={{alignSelf: 'center'}}>{orders.length}</HeadText>
          <HeadText style={{alignSelf: 'center'}}>{hour}</HeadText>
          <TouchableOpacity
            style={{width: 100, height: 100, flex: 1, backgroundColor: 'red'}}
            onPress={Tapped}></TouchableOpacity> */}
        </InfoView>
      </HeaderView>
    </Container>
  );
};

export default HomeMap;
