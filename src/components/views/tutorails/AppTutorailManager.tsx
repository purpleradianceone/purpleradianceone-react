import Joyride from "react-joyride";
import type { CallBackProps, Step } from "react-joyride";

function AppTutorailManager({ 
    steps,
    handleTourEnd,
    isModalOpen,
    modalTriggerIndices
}: { 
    steps: Step[];
    handleTourEnd : () => void;
    isModalOpen? : (index : number) => void;
    modalTriggerIndices? : number[];

}) {
  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status,index } = data;
    console.log(data);

   if(modalTriggerIndices?.includes(index)){
    
    isModalOpen!(index);
   }

    if(status === "finished" || status === "skipped" ){
        handleTourEnd();
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
        spotlight : {
            margin:"0px",
            padding:"0px",
           
        }
      }}
    />
  );
}

export default AppTutorailManager;
