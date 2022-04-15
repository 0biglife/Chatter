export type MainStackParamList = {
  MainTab: MainTabParamList;
  UserProfile: UserData;
  ChatDetail: UserData;
};

export type MainTabParamList = {
  HomeFeed: undefined;
  HomeMap: undefined;
  Chat: ChatStackParamList;
  Profile: undefined;
};

export type ChatStackParamList = {
  UserProfile: UserData;
  ChatDetail: UserData;
};

export type AuthParamList = {
  LogIn: undefined;
  SignUp: undefined;
};

type UserData = {
  id: number;
  user_id: string;
  user_name: string;
  user_location: string;
  user_profile: string;
};
