export type MainTabParamList = {
  HomeFeed: undefined;
  HomeMap: undefined;
  Chat: ChatparamList;
  Profile: undefined;
  Complete: {orderId: string};
};

export type AuthParamList = {
  LogIn: undefined;
  SignUp: undefined;
};

export type ChatparamList = {
  Chat: undefined;
  ChatDetail: {
    id: number;
    user_id: string;
    user_name: string;
    user_location: string;
    user_profile: string;
  };
};
