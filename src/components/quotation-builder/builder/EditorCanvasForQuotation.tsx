// quotation-builder/
//  ├── builder/
//  │   ├── EditorCanvas.tsx
//  │   ├── Toolbox.tsx
//  │   ├── SettingsPanel.tsx
//  |   |── canvas-wrapper
//  |         |──CanvasWrapperQuotation
//  |
//  ├── blocks/
//  │        PageBlock (A4)
//  │            ├── SectionBlock
//  │            │    ├── HeaderBlock
//  │            │    ├── TextBlock
//  │            │    ├── ImageBlock
//  │            │    ├── TableBlock
//  │            │    └── FooterBlock
//  │
//  ├── state/
//  │   ├── templateAtoms.ts
//  ├── pages/
//  │   ├── QuotationTemplateBuilder.tsx
//  ├── services/
//  │   ├── templateApi.ts

// import { Editor } from "@craftjs/core";
// import { PageBlockQuotation } from "../blocks/PageBlockQuotation";
// import { CanvasWrapperQuotation } from "./canvas-wrapper/CanvasWrapperQuotation";
// import { SectionBlockQuotation } from "../blocks/SectionBlockQuotation";
// import { SidebarQuotation } from "../sidebar/SidebarQuotation";

// export const EditorCanvasForQuotation: React.FC = () => {
//   const canvasBgColor = "#f9f9f9";

//   return (
//     <div>
//       <div className="flex w-full">
//         <Editor
//           resolver={{
//             PageBlockQuotation,
//             SectionBlockQuotation,
//           }}
//         >
//           <div className="flex col-span-2 w-full">
//             <div
//               className="w-fit"
//               style={{
//                 position: "sticky",
//                 top: "10px",
//                 height: "10000px",
//                 backgroundColor: canvasBgColor,
//               }}
//             >
//               <SidebarQuotation />
//             </div>
//             <div
//             className={`relative w-full p-[20px] `}
//               style={{
//                 backgroundColor: canvasBgColor,
//               }}
//             >
//               <div id="CANVAS" style={{ top: 55 }}>
//                 <CanvasWrapperQuotation />
//               </div>
//             </div>
//           </div>
//         </Editor>
//       </div>
//     </div>
//   );
// };
import { Editor } from "@craftjs/core";
import { PageBlockQuotation } from "../blocks/PageBlockQuotation";
import { CanvasWrapperQuotation } from "./canvas-wrapper/CanvasWrapperQuotation";
import { SectionBlockQuotation } from "../blocks/SectionBlockQuotation";
import { SidebarQuotation } from "../sidebar/SidebarQuotation";
import { useUserPreference } from "../../../context/user/UserPreference";

export const EditorCanvasForQuotation: React.FC = () => {
  const canvasBgColor = "#f9f9f9";

  const {userPreference} = useUserPreference();

  return (
    <Editor
      resolver={{
        PageBlockQuotation,
        SectionBlockQuotation,
      }}
    >
      {/* ROOT WRAPPER */}
      <div className={`flex w-full h-screen overflow-hidden ${userPreference.isLeftMenu?"pl-5":"pl-1"} `}>

        {/* SIDEBAR (NO SCROLL) */}
        <aside
          className="w-fit shrink-0 h-screen overflow-hidden border-r"
          style={{ backgroundColor: canvasBgColor }}
        >
          <SidebarQuotation />
        </aside>

        {/* MAIN CANVAS (SCROLLABLE) */}
        <main
          className="flex-1 relative overflow-auto p-[20px]"
          style={{ backgroundColor: canvasBgColor }}
        >
          <div id="CANVAS" className="mt-[55px] w-full">
            <CanvasWrapperQuotation />
          </div>
        </main>

      </div>
    </Editor>
  );
};
