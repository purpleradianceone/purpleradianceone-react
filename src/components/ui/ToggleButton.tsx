function ToggleButton ({
    checked,
    name,
    onToggle,
    label = "Status",
    wantLabel = false
} : {
    checked : boolean;
    name : string;
    onToggle : (event: React.ChangeEvent<HTMLInputElement>) => void;
    label?: string ,
    wantLabel? : boolean
}){
    return(

      <div className="flex items-center justify-center gap-2">
        <div>


      {
        wantLabel && 
        <span className="input-label-custom">{label}:</span>
      }
      </div>
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
          </div>
    )
}

export default ToggleButton;