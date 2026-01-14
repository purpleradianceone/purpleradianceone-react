/* eslint-disable @typescript-eslint/no-explicit-any */



interface SettingToggleCardProps {
  setting: any;
  onToggle: (event: React.ChangeEvent<HTMLInputElement>) => void;
  description? : string;
}

const SettingToggleCard: React.FC<SettingToggleCardProps> = ({ setting, onToggle ,description}) => {
 

  return (
    <div className={`relative rounded-lg p-4 bg-white shadow-sm border border-gray-100 flex flex-col justify-between ${description ? "h-36 gap-0" : "h-28"}`}>
      <div>
        <h3 className="table-data-custom">
          {setting.name}
        </h3>
      </div>
<p className="caption-custom m-0 p-0">{description}</p>
      <label className="inline-flex items-center cursor-pointer relative self-end"> 
        <input
          type="checkbox"
          className="sr-only peer"
          checked={setting.isActive}
          id={setting.id.toString()}
          onChange={onToggle}
        />
        <div className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 transition-all duration-300" />
        <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transform peer-checked:translate-x-5 transition-all duration-300" />
      </label>
      {/* <ToggleButton
      checked={setting.isActive}
      name={setting.id.toString()}
      onToggle={onToggle}
      /> */}
    </div>
  );
};

export default SettingToggleCard;