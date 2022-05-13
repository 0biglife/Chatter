//State of unsplash API
export type randomPhotoState = {
  alt_description: string;
  blur_hash: string;
  color: string;
  created_at: string;
  description: string;
  downloads: number;
  id: string;
  liked_by_user: boolean;
  likes: number;
  links: {
    download: string;
    download_location: string;
    html: string;
    self: string;
  };
  location: {
    city: string;
    country: string;
    name: string;
    position: [null];
    title: string;
  };
  promoted_at: string;
  sponsorship: string;
  updated_at: string;
  urls: {
    full: string;
    raw: string;
    regular: string;
    small: string;
    small_s3: string;
    thumb: string;
  };
  user: {
    accepted_tos: boolean;
    bio: string;
    id: string;
    name: string;
    first_name: string;
    last_name: string;
    location: string;
    profile_image: {
      small: string;
      medium: string;
      large: string;
    };
    username: string;
  };
  view: number;
  width: number;
  height: number;
};

export type searchUserState = {
  total: number;
  total_pages: number;
  results: [searchUserResults];
};

export type searchUserResults = {
  id: string;
  updated_at: string;
  username: string;
  name: string;
  first_name: string;
  last_name: string;
  bio: string;
  location: string;
  links: {
    self: string;
    html: string;
    photos: string;
    likes: string;
    portfolio: string;
    following: string;
    followers: string;
  };
  profile_image: {
    small: string;
    medium: string;
    large: string;
  };
  social: {
    instagram_uesrname: string;
  };
  photos: [
    {
      id: string;
      created_at: string;
      updated_at: string;
      blur_hash: string;
      urls: {
        raw: string;
        full: string;
        regular: string;
        small: string;
        thumb: string;
        small_s3: string;
      };
    },
  ];
};
