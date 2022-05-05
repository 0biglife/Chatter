export type MainStackParamList = {
  MainTab: MainTabParamList;
  UserProfile: UserData;
  ChatDetail: UserData;
};

export type HomeFeedStackParamList = {
  HomeFeed: undefined;
  SearchResults: undefined;
};

export type HomeMapStackParamList = {
  HomeMap: undefined;
  UesrProfile: UserData;
};

export type MainTabParamList = {
  HomeFeed: HomeFeedStackParamList;
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
  EditView: {
    name: string;
    image: string;
  };
  Posting: undefined;
  PostDetail: {
    userName: string;
    body: string;
    image: string;
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

export type FBPost = {
  id: string;
  userId: string;
  image: string;
  body: string;
};
