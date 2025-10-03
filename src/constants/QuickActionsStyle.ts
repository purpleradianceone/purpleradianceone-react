export const backgroundColorQuickActions = [
  "bg-gradient-to-r from-red-500 to-red-600 min-h-40 hover:from-red-600 hover:to-red-700", //a
  "bg-gradient-to-r from-blue-500 to-blue-600 min-h-40 hover:from-blue-600 hover:to-blue-700", //b
  "bg-gradient-to-r from-green-600 to-green-700 min-h-40 hover:from-green-700 hover:to-green-800", //c
  "bg-gradient-to-r from-purple-500 to-purple-600 min-h-40 hover:from-purple-600 hover:to-purple-700", //d
  "bg-gradient-to-r from-yellow-500 to-yellow-600 min-h-40 hover:from-yellow-600 hover:to-yellow-700", //e
  "bg-gradient-to-r from-emerald-500 to-emerald-600 min-h-40 hover:from-emerald-600 hover:to-emerald-700", //f
  "bg-gradient-to-r from-teal-500 to-teal-600 min-h-40 hover:from-teal-600 hover:to-teal-700", //g
  "bg-gradient-to-r from-orange-500 to-orange-600 min-h-40 hover:from-orange-600 hover:to-orange-700", //h
  "bg-gradient-to-r from-cyan-500 to-cyan-600 min-h-40 hover:from-cyan-600 hover:to-cyan-700", //i
  "bg-gradient-to-r from-fuchsia-500 to-fuchsia-600 min-h-40 hover:from-fuchsia-600 hover:to-fuchsia-700", //j
  "bg-gradient-to-r from-pink-500 to-pink-600 min-h-40 hover:from-pink-600 hover:to-pink-700", //k
  "bg-gradient-to-r from-violet-500 to-violet-600 min-h-40 hover:from-violet-600 hover:to-violet-700", //l
  "bg-gradient-to-r from-indigo-500 to-indigo-600 min-h-40 hover:from-indigo-600 hover:to-indigo-700", //m
  "bg-gradient-to-r from-lime-500 to-lime-600 min-h-40 hover:from-lime-600 hover:to-lime-700", //n
  "bg-gradient-to-r from-rose-500 to-rose-600 min-h-40 hover:from-rose-600 hover:to-rose-700", //o
  "bg-gradient-to-r from-amber-500 to-amber-600 min-h-40 hover:from-amber-600 hover:to-amber-700", //p
  "bg-gradient-to-r from-sky-500 to-sky-600 min-h-40 hover:from-sky-600 hover:to-sky-700", //q
  "bg-gradient-to-r from-sky-400 to-sky-500 min-h-40 hover:from-sky-500 hover:to-sky-600", //r
  "bg-gradient-to-r from-fuchsia-400 to-fuchsia-500 min-h-40 hover:from-fuchsia-500 hover:to-fuchsia-600", //s
  "bg-gradient-to-r from-green-400 to-green-500 min-h-40 hover:from-green-500 hover:to-green-600", //t
  "bg-gradient-to-r from-cyan-400 to-cyan-500 min-h-40 hover:from-cyan-500 hover:to-cyan-600", //u
  "bg-gradient-to-r from-teal-400 to-teal-500 min-h-40 hover:from-teal-500 hover:to-teal-600", //v
  "bg-gradient-to-r from-red-400 to-red-500 min-h-40 hover:from-red-500 hover:to-red-600", //w
  "bg-gradient-to-r from-amber-400 to-amber-500 min-h-40 hover:from-amber-500 hover:to-amber-600", //x
  "bg-gradient-to-r from-emerald-400 to-emerald-500 min-h-40 hover:from-emerald-500 hover:to-emerald-600", //y
  `bg-gradient-to-r from-pink-400 to-pink-500 min-h-40 hover:from-pink-500 hover:to-pink-600`, //z
];

export const getQuickActionColor = (value: number) => {
  if (!value) return backgroundColorQuickActions[0];
  let index = value;
  if(value>=26){
      index = index%26;
      getQuickActionColor(index);
  }
  
  return backgroundColorQuickActions[index];
};
