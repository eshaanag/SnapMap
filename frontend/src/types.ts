
export type CameraCapturedPicture = {
  uri: string;
  width: number;
  height: number;
  base64?: string;
  exif?: any;
};

export type LocationObject = {
  coords: {
    latitude: number;
    longitude: number;
    altitude: number | null;
    accuracy: number | null;
    altitudeAccuracy: number | null;
    heading: number | null;
    speed: number | null;
  };
  timestamp: number;
  mocked?: boolean;
};

type AppImage = {
  uri: string;
  width: number;
  height: number;
  format?: "jpg" | "jpeg" | "png"; // optional
  exif?: Record<string, any>;
};

export type RootParamList = {
  SplashScreen: undefined;
  SignInScreen: undefined;
  HomeScreen: undefined;
  CameraPermissionScreen: undefined;
  LocationPermissionScreen: undefined;
  CameraScreen: undefined;
  MapScreen: undefined;
  UploadConfirmationScreen:
    | { 
        photo?: AppImage; 
        photos?: any[];
        location?: LocationObject | null 
      }
    | undefined;
  BubbleDetailsScreen: undefined;
  EventGalleryScreen: undefined;
  MyUploadsScreen: undefined;
  ProfileScreen: undefined;
  SettingsScreen: undefined;
  ErrorScreen: undefined;
  RegisterUserScreen: undefined;
  CropScreen: 
    | { photo?: AppImage; location?: LocationObject | null }
    | undefined;
};

export type ScreenProps<T extends keyof RootParamList> = {
  navigation: any;
  route: {
    params: RootParamList[T];
    [key: string]: any;
  } | any;
};
