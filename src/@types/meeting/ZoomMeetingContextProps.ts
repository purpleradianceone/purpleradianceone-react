export type ZoomMeetingContextState = {
  isConnected: boolean ; // 👈 important (loading state)
  email?: string;
};
export type ZoomMeetingContextProps = {
  zoomMeetingStatus: ZoomMeetingContextState;
  setZoomMeetingStatus: (
    googleMeetStatusState: ZoomMeetingContextState,
  ) => void;
   refreshZoomMeetingStatus: () => Promise<void>;
};

export default ZoomMeetingContextProps;
