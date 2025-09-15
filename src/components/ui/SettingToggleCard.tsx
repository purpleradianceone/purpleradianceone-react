/* eslint-disable @typescript-eslint/no-explicit-any */

interface SettingToggleCardProps {
  setting: any;
  onToggle: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SettingToggleCard: React.FC<SettingToggleCardProps> = ({ setting, onToggle }) => {
 

  return (
    <div className="relative rounded-lg p-4 bg-white shadow-sm border border-gray-100 flex flex-col justify-between h-28">
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-1"> {/* Increased font size and weight */}
          {setting.name}
        </h3>
      </div>

      <label className="inline-flex items-center cursor-pointer relative self-end"> {/* Align toggle to bottom-right */}
        <input
          type="checkbox"
          className="sr-only peer"
          checked={setting.isActive}
          id={setting.id.toString()}
          onChange={onToggle}
        />
        <div className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 transition-all duration-300" /> {/* Adjusted size and colors */}
        <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transform peer-checked:translate-x-5 transition-all duration-300" /> {/* Adjusted size and position */}
      </label>
    </div>
  );
};

export default SettingToggleCard;