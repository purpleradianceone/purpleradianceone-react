

export type GoogleMeetContextState = {
    isConnected : boolean
}
export type GoogleMeetContextProps = {
    googleMeetStatus : GoogleMeetContextState;
    setGoogleMeetStatus : (googleMeetStatusState: GoogleMeetContextState) => void;

};

export default GoogleMeetContextProps;