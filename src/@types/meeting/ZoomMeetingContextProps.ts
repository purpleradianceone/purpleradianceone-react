

export type ZoomMeetingContextState = {
    isConnected : boolean
}
export type ZoomMeetingContextProps = {
    zoomMeetingStatus : ZoomMeetingContextState;
    setZoomMeetingStatus : (googleMeetStatusState: ZoomMeetingContextState) => void;

};

export default ZoomMeetingContextProps;