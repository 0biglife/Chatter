/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import NaverMapView, {Circle, Marker} from 'react-native-nmap';
import styled from 'styled-components/native';
import Geolocation from '@react-native-community/geolocation';
import {ActivityIndicator} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store/reducers';
import Config from 'react-native-config';
import weatherClient from '../../../apis/WeatherAPI/weatherClient';
import IonIcon from 'react-native-vector-icons/Ionicons';
import UserModal from '../../../components/UserModal';
import unsplashClient from '../../../apis/UnsplashAPI/unsplashClient';
import {WeatherState} from '../../../apis/WeatherAPI/weatherState';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeMapStackParamList} from '../../../navigations/Types';

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
  opacity: 0.9;
  align-items: center;
  justify-content: center;
  flex-direction: column;
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
  opacity: 0.9;
  margin-right: 6px;
  padding: 10px;
`;

const HeadText = styled.Text`
  font-size: 13px;
  font-weight: 400;
  color: black;
`;

const TitleView = styled.View`
  flex-direction: column;
  justify-content: space-around;
  margin-right: 10px;
`;

const Title = styled.Text`
  font-size: 13px;
`;

const TextView = styled.View`
  flex-direction: column;
  justify-content: space-around;
`;

const DataText = styled.Text`
  font-size: 13px;
  font-weight: 300;
`;

const SliderView = styled.View`
  flex: 1;
  margin-left: 10px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const SliderHeader = styled.Text`
  font-size: 13px;
  font-weight: 500;
`;

const Sliders = styled.View`
  width: 100%;
  height: 40px;
  border-radius: 6px;
  margin-top: 10px;
  flex-direction: row;
`;

const FirstButton = styled.TouchableOpacity`
  flex: 1;
  background-color: rgba(255, 200, 120, 0.6);
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
`;

const SecondButton = styled.TouchableOpacity`
  flex: 1;
  background-color: rgba(255, 200, 120, 0.8);
`;

const ThirdButton = styled.TouchableOpacity`
  flex: 1;
  background-color: rgba(255, 200, 120, 1);
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
`;

const HomeMap = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeMapStackParamList>>();
  //<NativeStackNavigationProp<HomeMapStackParamList>>();
  //User Control
  const orders = useSelector((state: RootState) => state.order.orders);
  const [myPosition, setMyPosition] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [transparency, setTransparency] = useState<number>(0.2);
  const [radius, setRadius] = useState<number>(0.5);
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
    } catch (e) {
      console.log('UNSPLASH FAILED : ', e);
    } finally {
      setLoading(false);
    }
  };

  //마커 모달 생성
  const markerTapped = orderPosition => {
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
    navigation.navigate('UserProfile', {
      id: 1,
      user_id: '1',
      user_location: userLoca,
      user_name: userInfo,
      user_profile: userImage,
    });
  };

  const RadiusPicker = (picker: number) => {
    if (picker === 0) {
      setRadius(0.5);
      setTransparency(0.15);
    } else if (picker === 1) {
      setRadius(1);
      setTransparency(0.28);
    } else if (picker === 2) {
      setRadius(2);
      setTransparency(0.35);
    }
    console.log('rest: ', transparency);
  };

  return (
    <Container>
      <NaverMapView
        mapType={1}
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
          radius={radius * 10000}
          color={`rgba(255,150,0,${transparency})`}
        />
        {orders.map(orderPosition => (
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
            <IonIcon
              style={{marginTop: 8}}
              name={iconName.toString()}
              size={30}
            />
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
              {weatherData?.coord.lat.toFixed(3) +
                ' ' +
                weatherData?.coord.lon.toFixed(3)}
            </DataText>
            <DataText>
              {hour}시 {minute}분
            </DataText>
            <DataText>{orders.length} 명</DataText>
          </TextView>
          <SliderView>
            <SliderHeader>반경 범위 : {radius} km</SliderHeader>
            <Sliders>
              <FirstButton
                onPress={() => RadiusPicker(0)}
                activeOpacity={0.7}
              />
              <SecondButton
                onPress={() => RadiusPicker(1)}
                activeOpacity={0.7}
              />
              <ThirdButton
                onPress={() => RadiusPicker(2)}
                activeOpacity={0.7}
              />
            </Sliders>
          </SliderView>
        </InfoView>
      </HeaderView>
    </Container>
  );
};

export default HomeMap;
