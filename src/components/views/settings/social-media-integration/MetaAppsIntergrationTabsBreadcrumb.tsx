import BlockGrid from "./meta-app-block-grid/BlockGrid";
import { FiFacebook } from "react-icons/fi";

export const MetaAppsIntegrationTabsBreadcrumb = () => {
  const blocks = [
    {
      id: 1,
      name: "Meta Facebook Integration",
      description: "Automatically capture and manage leads from your Facebook pages. This simple, one-time process securely links your business and allows us to centralize all your customer conversations into a single, powerful CRM. Sync Facebook lead forms automatically. You can integrate multiple pages.",
      logo: FiFacebook,
      path : "",
      active : true
    },
    // {
    //   id: 2,
    //   name: "WhatsApp Integration",
    //   description:
    //     "Capture leads and communicate with customers directly. <h1>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Asperiores, ex? At, dignissimos pariatur commodi excepturi ut laborum assumenda odit nemo minima deleniti adipisci tenetur amet exercitationem ipsum a laudantium dolorem!",
    //   logo: MessageCircle,
    //   path : "",
    //   active : false
    // },
  ];

  return <BlockGrid blocks={blocks} />;
};
