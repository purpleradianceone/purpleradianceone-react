export type GoogleMeetContextState = {
  isConnected: boolean;
  email?: string;
};
export type GoogleMeetContextProps = {
  googleMeetStatus: GoogleMeetContextState;
  setGoogleMeetStatus: (googleMeetStatusState: GoogleMeetContextState) => void;
};

export default GoogleMeetContextProps;
