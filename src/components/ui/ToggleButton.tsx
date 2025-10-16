function ToggleButton ({
    checked,
    name,
    onToggle
} : {
    checked : boolean;
    name : string;
    onToggle : (event: React.ChangeEvent<HTMLInputElement>) => void;
}){
    return(
        <label className="inline-flex items-center cursor-pointer relative self-end"> 
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          name={name}
          onChange={onToggle}
          id={name}
        />
        <div className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 transition-all duration-300" />
        <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transform peer-checked:translate-x-5 transition-all duration-300" />
      </label>
    )
}

export default ToggleButton;