import React from "react";
import { usePanel } from "../../../context/panel/usePanel";

const PanelCustomizer: React.FC = () => {

  const {position, setPosition}= usePanel();

  return (
    <div className="w-full  min-h-screen relative max-h-full bg-gradient-to-br from-blue-50 to-purple-50  flex flex-col items-center">
      <h1 className="text-xl font-bold text-indigo-700 mb-10 text-center">
        Choose Your Panel Layout
      </h1>

      {/* Cards Container */}
      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-4xl justify-center">
        {/* Top Panel Card */}
        <div
          className={`w-full lg:w-1/2 bg-white rounded-xl shadow-lg border-4 transition-all duration-300 ${
            position === "top"
              ? "border-indigo-500"
              : "border-transparent"
          }`}
        >
          <div className="relative w-full h-64 bg-gray-50 rounded-t-xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-14 bg-indigo-600 text-white flex items-center justify-center font-semibold shadow">
              Panel (Top)
            </div>
          </div>
          <div className="p-4 flex justify-center">
            <label className="flex items-center gap-2 text-lg font-medium">
              <input
                type="radio"
                name="panel"
                value="top"
                checked={position === "top"}
                onChange={() => setPosition("top")}
                className="accent-indigo-600"
              />
              Select Top Panel
            </label>
          </div>
        </div>

        {/* Left Panel Card */}
        <div
          className={`w-full lg:w-1/2 bg-white rounded-xl shadow-lg border-4 transition-all duration-300 ${
            position === "left"
              ? "border-indigo-500"
              : "border-transparent"
          }`}
        >
          <div className="relative w-full h-64 bg-gray-50 rounded-t-xl overflow-hidden">
            <div className="absolute top-0 left-0 h-full w-20 bg-indigo-600 text-white flex items-center justify-center font-semibold shadow-md">
             <div className="grid">
             Panel 
             <span>(Left)</span>
             </div>
            </div>
          </div>
          <div className="p-4 flex justify-center">
            <label className="flex items-center gap-2 text-lg font-medium">
              <input
                type="radio"
                name="panel"
                value="left"
                checked={position === "left"}
                onChange={() => setPosition("left")}
                className="accent-indigo-600"
              />
              Select Left Panel
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanelCustomizer;
