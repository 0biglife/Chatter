import React, {useEffect} from 'react';
//View Module Stacks
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {RootState} from '../redux/store/reducers';
import {useSelector} from 'react-redux';
import {
  SignIn,
  SignUp,
  HomeFeed,
  Chat,
  Profile,
  HomeMap,
  ChatDetail,
  UserProfile,
  EditView,
  PostDetail,
  Setting,
  PostModify,
  Permission,
  Posting,
  SearchResults,
} from '../screens';
import {useAppDispatch} from '../redux/store';
import EncryptedStorage from 'react-native-encrypted-storage';
import {AxiosError} from 'axios';
import client from '../apis/MarkerAPI/client';
import userSlice from '../redux/slices/user';
import {Alert} from 'react-native';
import useSocket from '../hooks/useSocket';
import orderSlice from '../redux/slices/order';
import usePermissions from '../hooks/usePermissions';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {MainTabParamList} from './Types';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator();

const RootStack = () => {
  const dispatch = useAppDispatch();
  //!!연산자 : undefined checking : null이나 undefined 면 false 를 반환 !
  const isLoggedIn = useSelector((state: RootState) => !!state.user.email);
  //소켓 훅
  const [socket, disconnect] = useSocket();

  usePermissions();

  // axios interceptor로 refreshToken 적용
  useEffect(() => {
    //첫 번째 인자 : 성공했을 때 실행 함수
    //두 번째 인자 : 에러났을 때 실행 함수
    client.interceptors.response.use(
      response => {
        return response;
      },
      //여기 에러났을 때 실햄함수 부분에서 refreshToken 적용 !
      async error => {
        const {
          config, //원래 요청
          response: {status},
        } = error;
        if (status === 419) {
          //status가 419면서 에러 코드가 '만료'라면
          if (error.response.data.code === 'expired') {
            const originalRequest = config;
            const refreshToken = await EncryptedStorage.getItem('refreshToken');
            const {data} = await client.post(
              '/refreshToken',
              {},
              {
                headers: {
                  authorization: `Bearer ${refreshToken}`,
                },
              },
            );
            dispatch(userSlice.actions.setAccessToken(data.data.accessToken));
            originalRequest.headers.authorization = `Bearer ${data.data.accessToken}`;
            return client(originalRequest); //예전 요청 다시 보내는 방식
          }
        }
        return Promise.reject(error); //419 아닐 때 처리
      },
    );
  }, [dispatch]);

  //소켓 실시간 데이터 통신
  useEffect(() => {
    //서버로부터 데이터 받을 때는 콜백 방식 필수
    //useCallback => ()
    const socketCallBack = (data: any) => {
      dispatch(orderSlice.actions.addOrder(data));
    };
    if (socket && isLoggedIn) {
      console.log('RootStack Socket : ', socket);
      socket.emit('acceptOrder', 'hello'); //서버에 데이터 전송
      socket.on('order', socketCallBack); //서버로부터 데이터 받기
    }
    return () => {
      if (socket) {
        socket.off('order', socketCallBack); //데이터 받기 중단
      }
    };
  }, [dispatch, isLoggedIn, socket]);

  useEffect(() => {
    if (!isLoggedIn) {
      disconnect();
    }
  }, [isLoggedIn, disconnect]);

  //앱 실행 시 토큰 존재하면 로그인 활성화!
  useEffect(() => {
    const getTokenAndRefresh = async () => {
      try {
        const token = await EncryptedStorage.getItem('refreshToken');
        if (!token) {
          return; //없으면 탈출
        }
        //있으면 아래 경로로 토큰 쏴주고, 받아온 값을 리덕스로 보관
        const response = await client.post(
          '/refreshToken',
          {},
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          },
        );
        dispatch(
          userSlice.actions.setUser({
            name: response.data.data.name,
            email: response.data.data.email,
            accessToken: response.data.data.accessToken,
          }),
        );
      } catch (error) {
        console.log('RootStack - useEffect - Error : ', error);
        if ((error as AxiosError).response?.data.code === 'expired') {
          Alert.alert('알림', '다시 로그인 해주세요.');
        }
      } finally {
        //로그인 화면 가려주기 위해 splash-screen을 넣을건데 여기서 제거 흐름
        // TODO : 스플래시 스크린 없애기
      }
    };
    //useEffect는 async 불가기 때문에 별개 함수로 선언하고 호출하는 방식으로 구현
    getTokenAndRefresh();
  }, [dispatch]);

  const HomeFeedStack = () => {
    return (
      <Stack.Navigator
        initialRouteName="HomeFeed"
        screenOptions={{
          headerBackTitle: '',
          headerTintColor: 'black',
          headerShadowVisible: false,
        }}>
        <Stack.Screen
          name="HomeFeed"
          component={HomeFeed}
          options={{headerTitle: 'Home'}}
        />
        <Stack.Screen
          name="SearchResults"
          component={SearchResults}
          options={{headerTitle: 'Search'}}
        />
      </Stack.Navigator>
    );
  };

  const HomeMapStack = () => {
    return (
      <Stack.Navigator
        initialRouteName="HomeMap"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="HomeMap" component={HomeMap} />
        <Stack.Screen name="UserProfile" component={UserProfile} />
      </Stack.Navigator>
    );
  };

  const ChatStack = () => {
    return (
      <Stack.Navigator initialRouteName="Chat">
        <Stack.Screen name="Chat" component={Chat} options={{title: 'Chat'}} />
        <Stack.Screen
          name="ChatDetail"
          component={ChatDetail}
          options={{
            title: 'Chatting',
            headerBackTitle: '',
            headerTintColor: 'black',
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen name="UserProfile" component={UserProfile} />
      </Stack.Navigator>
    );
  };

  const ProfileStack = () => {
    return (
      <Stack.Navigator initialRouteName="Profile">
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EditView"
          component={EditView}
          options={{
            headerShown: false,
            presentation: 'fullScreenModal',
          }}
        />
        <Stack.Screen
          name="PostModify"
          component={PostModify}
          options={{
            headerShown: false,
            // presentation: 'fullScreenModal',
          }}
        />
        <Stack.Screen
          name="Posting"
          component={Posting}
          options={{headerShown: false, presentation: 'fullScreenModal'}}
        />
        <Stack.Screen
          name="PostDetail"
          component={PostDetail}
          options={{
            headerTitle: '게시글',
            headerBackTitle: '',
            headerTintColor: 'black',
          }}
        />
        <Stack.Screen
          name="Setting"
          component={Setting}
          options={{
            headerTitle: '설정',
            headerBackTitle: '',
            headerTintColor: 'black',
          }}
        />
      </Stack.Navigator>
    );
  };

  return isLoggedIn ? (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarShowLabel: false,
        tabBarActiveTintColor: 'gray',
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'HomeFeedStack') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'HomeMapStack') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'ChatStack') {
            iconName = focused ? 'chatbox' : 'chatbox-outline';
          } else if (route.name === 'ProfileStack') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <IonIcon name={iconName} size={size} color={color} />;
        },
      })}>
      <Tab.Screen
        name="HomeFeedStack"
        component={HomeFeedStack}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="HomeMapStack"
        component={HomeMapStack}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="ChatStack"
        component={ChatStack}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={{
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  ) : (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="Permission" component={Permission} />
    </Stack.Navigator>
  );
};

export default RootStack;
