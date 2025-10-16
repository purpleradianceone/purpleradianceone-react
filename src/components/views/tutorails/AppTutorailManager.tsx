import Joyride from "react-joyride";
import type { CallBackProps, Step } from "react-joyride";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";

function AppTutorailManager({
  steps,
  handleTourEnd,
  isModalOpen,
  modalOpenTriggerIndices,
}: {
  steps: Step[];
  handleTourEnd: () => void;
  isModalOpen?: (index: number) => void;
  modalOpenTriggerIndices?: number[];
}) {
  const { loginStatus } = useLoggedInUserContext();
  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, index, lifecycle } = data;

    if (modalOpenTriggerIndices?.includes(index)) {
      console.log(index + " : " + status + " : " + lifecycle);
      isModalOpen!(index);
    }

    if (status === "finished" || status === "skipped") {
      if (loginStatus.status) {
        handleTourEnd();
      }
    }
  };

  return (
    <Joyride
      steps={steps}
      run={true}
      continuous={true}
      showSkipButton={true}
      showProgress={true}
      callback={handleJoyrideCallback}
      locale={{ last: "Finish", next: "Next", skip: "Skip Tour" }}
      styles={{
        options: {
          zIndex: 100000,
          arrowColor: "skyblue",
          backgroundColor: "skyblue",
          width: "500px",
          beaconSize: 15,
          overlayColor: "#333333",
          primaryColor: "blue",
          spotlightShadow: "white",
          textColor: "black",
        },
        spotlight: {
          margin: "0px",
          padding: "0px",
        },
        overlay: {
          zIndex: 100000,
        },
      }}
    />
  );
}

export default AppTutorailManager;
