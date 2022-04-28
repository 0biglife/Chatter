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

export type ProfileStackParamList = {
  Profile: undefined;
  EditModal: undefined;
  PostModal: undefined;
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

export type FBPost = {
  id: string;
  userId: string;
  image: string;
  body: string;
};
