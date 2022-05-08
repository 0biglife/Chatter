export type MainStackParamList = {
  MainTab: MainTabParamList;
  UserProfile: UserData;
  ChatDetail: UserData;
};

export type HomeFeedStackParamList = {
  HomeFeed: undefined;
  SearchResults: undefined;
  UserProfile: UserData;
};

export type HomeMapStackParamList = {
  HomeMap: undefined;
  UserProfile: UserData;
};

export type MainTabParamList = {
  HomeFeedStack: HomeFeedStackParamList;
  HomeMapStack: undefined;
  ChatStack: ChatStackParamList;
  ProfileStack: undefined;
};

export type ChatStackParamList = {
  UserProfile: UserData;
  ChatDetail: UserData;
};

export type ProfileStackParamList = {
  Profile: undefined;
  EditView: {
    name: string;
    image: string;
  };
  Posting: undefined;
  PostDetail: {
    id: string;
    userName: string;
    body: string;
    image: string;
    postTime: string;
  };
  PostModify: {
    body: string;
    image: string;
  };
  Setting: undefined;
};

export type AuthParamList = {
  SignIn: undefined;
  SignUp: undefined;
  Permission: undefined;
};

type UserData = {
  id: number;
  user_id: string;
  user_name: string;
  user_location: string;
  user_profile: string;
};

export type PostState = {
  id: string;
  body: string;
  postImg: string;
  postTime: string;
};
