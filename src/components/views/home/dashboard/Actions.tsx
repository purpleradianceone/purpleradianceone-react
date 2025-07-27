import { Plus, UserPlus, Calendar, Mail, BarChart3, LayoutPanelLeft, Store, Network, Settings } from 'lucide-react';
import ROUTES_URL from '../../../../constants/Routes';
import { useNavigate } from 'react-router-dom';

// const actions = [
//   {
//     id: 1,
//     title: 'New Deal',
//     description: 'Create opportunity',
//     icon: Plus,
//     color: 'bg-gradient-to-r from-blue-700 to-blue-800 min-h-40 hover:from-blue-800 hover:to-blue-900', // Deep Corporate Blue
//     shortcut: 'Lead',
//     route: ROUTES_URL.CREATE_LEAD
//   },
//   {
//     id: 2,
//     title: 'Add User',
//     description: 'New User',
//     icon: UserPlus,
//     color: 'bg-gradient-to-r from-indigo-700 to-indigo-800 min-h-40 hover:from-indigo-800 hover:to-indigo-900', // Rich Indigo
//     shortcut: 'Users',
//     route: ROUTES_URL.CRETE_COMPANY_USER
//   },
//   {
//     id: 3,
//     title: 'Schedule',
//     description: 'Book meeting',
//     icon: Calendar,
//     color: 'bg-gradient-to-r from-purple-700 to-purple-800 min-h-40 hover:from-purple-800 hover:to-purple-900', // Muted Deep Purple
//     shortcut: 'Meetings',
//     route: ROUTES_URL.SCHEDULE_MEETING
//   },
//   {
//     id: 4,
//     title: 'Email Template',
//     description: 'Create Email Template',
//     icon: Mail,
//     color: 'bg-gradient-to-r from-orange-600 to-orange-700 min-h-40 hover:from-orange-700 hover:to-orange-800', // Warm Coppery Orange (for accent)
//     shortcut: 'Templates',
//     route: ROUTES_URL.EMAIL_TEMPLATE
//   },
//   {
//     id: 5,
//     title: 'Settings',
//     description: 'Manage Settings',
//     icon: Settings,
//     color: 'bg-gradient-to-r from-gray-700 to-gray-800 min-h-40 hover:from-gray-800 hover:to-gray-900', // Charcoal Gray (neutral anchor)
//     shortcut: 'Settings',
//     route: ROUTES_URL.COMPANY_SETTING
//   },
//   {
//     id: 6,
//     title: 'Prefrences',
//     description: 'Manage Prefrences',
//     icon: LayoutPanelLeft,
//     color: 'bg-gradient-to-r from-slate-600 to-slate-700 min-h-40 hover:from-slate-700 hover:to-slate-800', // Slate Gray/Blue-Gray
//     shortcut: 'Preferences',
//     route: ROUTES_URL.USER_PROFILE_SETTING
//   },
//   {
//     id: 7,
//     title: 'Products',
//     description: 'Manage Products',
//     icon: Store,
//     color: 'bg-gradient-to-r from-green-700 to-green-800 min-h-40 hover:from-green-800 hover:to-green-900', // Deep Forest Green
//     shortcut: 'Product',
//     route: ROUTES_URL.PRODUCT_MANAGEMENT
//   },
//   {
//     id: 8,
//     title: 'Teams',
//     description: 'Manage Teams',
//     icon: Network,
//     color: 'bg-gradient-to-r from-teal-700 to-teal-800 min-h-40 hover:from-teal-800 hover:to-teal-900', // Dark Teal
//     shortcut: 'Team',
//     route: ROUTES_URL.TEAM_MANAGEMENT
//   },
//   {
//     id: 9,
//     title: 'Products Teams/Users',
//     description: 'Manage Product Teams and Users',
//     icon: BarChart3,
//     color: 'bg-gradient-to-r from-amber-600 to-amber-700 min-h-40 hover:from-amber-700 hover:to-amber-800', // Golden Amber (another accent)
//     shortcut: 'Product',
//     route: ROUTES_URL.PRODUCT_TEAM_MANAGEMENT
//   },
//   {
//     id: 10,
//     title: 'New Product',
//     description: 'Create Product',
//     icon: Plus,
//     color: 'bg-gradient-to-r from-cyan-600 to-cyan-700 min-h-40 hover:from-cyan-700 hover:to-cyan-800', // Medium Cyan-Blue
//     shortcut: 'Product',
//     route: ROUTES_URL.CREATE_SUBSCRIPTION
//   },
//   {
//     id: 11,
//     title: 'Create Team',
//     description: 'New Team',
//     icon: UserPlus,
//     color: 'bg-gradient-to-r from-emerald-600 to-emerald-700 min-h-40 hover:from-emerald-700 hover:to-emerald-800', // Rich Emerald Green
//     shortcut: 'Teams',
//     route: ROUTES_URL.CRETE_COMPANY_USER
//   }
// ];
// const actions = [
//   {
//     id: 1,
//     title: 'New Deal',
//     description: 'Create opportunity',
//     icon: Plus,
//     color: 'bg-gradient-to-r from-blue-700 to-blue-800 min-h-40 hover:from-blue-800 hover:to-blue-900', // Deep Corporate Blue
//     shortcut: 'Lead',
//     route: ROUTES_URL.CREATE_LEAD
//   },
//   {
//     id: 2,
//     title: 'Add User',
//     description: 'New User',
//     icon: UserPlus,
//     color: 'bg-gradient-to-r from-indigo-700 to-indigo-800 min-h-40 hover:from-indigo-800 hover:to-indigo-900', // Rich Indigo
//     shortcut: 'Users',
//     route: ROUTES_URL.CRETE_COMPANY_USER
//   },
//   {
//     id: 3,
//     title: 'Schedule',
//     description: 'Book meeting',
//     icon: Calendar,
//     color: 'bg-gradient-to-r from-purple-700 to-purple-800 min-h-40 hover:from-purple-800 hover:to-purple-900', // Muted Deep Purple
//     shortcut: 'Meetings',
//     route: ROUTES_URL.SCHEDULE_MEETING
//   },
//   {
//     id: 4,
//     title: 'Email Template',
//     description: 'Create Email Template',
//     icon: Mail,
//     color: 'bg-gradient-to-r from-orange-600 to-orange-700 min-h-40 hover:from-orange-700 hover:to-orange-800', // Warm Coppery Orange (for accent)
//     shortcut: 'Templates',
//     route: ROUTES_URL.EMAIL_TEMPLATE
//   },
//   {
//     id: 5,
//     title: 'Settings',
//     description: 'Manage Settings',
//     icon: Settings,
//     color: 'bg-gradient-to-r from-gray-700 to-gray-800 min-h-40 hover:from-gray-800 hover:to-gray-900', // Charcoal Gray (neutral anchor)
//     shortcut: 'Settings',
//     route: ROUTES_URL.COMPANY_SETTING
//   },
//   {
//     id: 6,
//     title: 'Prefrences',
//     description: 'Manage Prefrences',
//     icon: LayoutPanelLeft,
//     // Corrected from blue-gray to slate
//     color: 'bg-gradient-to-r from-slate-600 to-slate-700 min-h-40 hover:from-slate-700 hover:to-slate-800', // Slate Gray/Blue-Gray
//     shortcut: 'Preferences',
//     route: ROUTES_URL.USER_PROFILE_SETTING
//   },
//   {
//     id: 7,
//     title: 'Products',
//     description: 'Manage Products',
//     icon: Store,
//     color: 'bg-gradient-to-r from-green-700 to-green-800 min-h-40 hover:from-green-800 hover:to-green-900', // Deep Forest Green
//     shortcut: 'Product',
//     route: ROUTES_URL.PRODUCT_MANAGEMENT
//   },
//   {
//     id: 8,
//     title: 'Teams',
//     description: 'Manage Teams',
//     icon: Network,
//     color: 'bg-gradient-to-r from-teal-700 to-teal-800 min-h-40 hover:from-teal-800 hover:to-teal-900', // Dark Teal
//     shortcut: 'Team',
//     route: ROUTES_URL.TEAM_MANAGEMENT
//   },
//   {
//     id: 9,
//     title: 'Products Teams/Users',
//     description: 'Manage Product Teams and Users',
//     icon: BarChart3,
//     color: 'bg-gradient-to-r from-amber-600 to-amber-700 min-h-40 hover:from-amber-700 hover:to-amber-800', // Golden Amber (another accent)
//     shortcut: 'Product',
//     route: ROUTES_URL.PRODUCT_TEAM_MANAGEMENT
//   },
//   {
//     id: 10,
//     title: 'New Product',
//     description: 'Create Product',
//     icon: Plus,
//     color: 'bg-gradient-to-r from-cyan-600 to-cyan-700 min-h-40 hover:from-cyan-700 hover:to-cyan-800', // Medium Cyan-Blue
//     shortcut: 'Product',
//     route: ROUTES_URL.CREATE_SUBSCRIPTION
//   },
//   {
//     id: 11,
//     title: 'Create Team',
//     description: 'New Team',
//     icon: UserPlus,
//     color: 'bg-gradient-to-r from-emerald-600 to-emerald-700 min-h-40 hover:from-emerald-700 hover:to-emerald-800', // Rich Emerald Green
//     shortcut: 'Teams',
//     route: ROUTES_URL.CRETE_COMPANY_USER
//   }
// ];

// const actions = [
//   {
//     id: 1,
//     title: 'New Deal',
//     description: 'Create opportunity',
//     icon: Plus,
//     color: 'bg-gradient-to-r from-sky-600 to-sky-700 min-h-40 hover:from-sky-700 hover:to-sky-800', // Modern Sky Blue
//     shortcut: 'Lead',
//     route: ROUTES_URL.CREATE_LEAD
//   },
//   {
//     id: 2,
//     title: 'Add User',
//     description: 'New User',
//     icon: UserPlus,
//     color: 'bg-gradient-to-r from-emerald-600 to-emerald-700 min-h-40 hover:from-emerald-700 hover:to-emerald-800', // Deep Emerald Green
//     shortcut: 'Users',
//     route: ROUTES_URL.CRETE_COMPANY_USER
//   },
//   {
//     id: 3,
//     title: 'Schedule',
//     description: 'Book meeting',
//     icon: Calendar,
//     color: 'bg-gradient-to-r from-violet-600 to-violet-700 min-h-40 hover:from-violet-700 hover:to-violet-800', // Rich Violet
//     shortcut: 'Meetings',
//     route: ROUTES_URL.SCHEDULE_MEETING
//   },
//   {
//     id: 4,
//     title: 'Email Template',
//     description: 'Create Email Template',
//     icon: Mail,
//     color: 'bg-gradient-to-r from-orange-500 to-orange-600 min-h-40 hover:from-orange-600 hover:to-orange-700', // Warm Clay Orange
//     shortcut: 'Templates',
//     route: ROUTES_URL.EMAIL_TEMPLATE
//   },
//   {
//     id: 5,
//     title: 'Settings',
//     description: 'Manage Settings',
//     icon: Settings,
//     color: 'bg-gradient-to-r from-zinc-700 to-zinc-800 min-h-40 hover:from-zinc-800 hover:to-zinc-900', // Dark Zinc (deep, cool gray)
//     shortcut: 'Settings',
//     route: ROUTES_URL.COMPANY_SETTING
//   },
//   {
//     id: 6,
//     title: 'Prefrences',
//     description: 'Manage Prefrences',
//     icon: LayoutPanelLeft,
//     color: 'bg-gradient-to-r from-neutral-600 to-neutral-700 min-h-40 hover:from-neutral-700 hover:to-neutral-800', // Neutral Gray (balanced tone)
//     shortcut: 'Preferences',
//     route: ROUTES_URL.USER_PROFILE_SETTING
//   },
//   {
//     id: 7,
//     title: 'Products',
//     description: 'Manage Products',
//     icon: Store,
//     color: 'bg-gradient-to-r from-teal-600 to-teal-700 min-h-40 hover:from-teal-700 hover:to-teal-800', // Sophisticated Teal
//     shortcut: 'Product',
//     route: ROUTES_URL.PRODUCT_MANAGEMENT
//   },
//   {
//     id: 8,
//     title: 'Teams',
//     description: 'Manage Teams',
//     icon: Network,
//     color: 'bg-gradient-to-r from-rose-600 to-rose-700 min-h-40 hover:from-rose-700 hover:to-rose-800', // Muted Rose
//     shortcut: 'Team',
//     route: ROUTES_URL.TEAM_MANAGEMENT
//   },
//   {
//     id: 9,
//     title: 'Products Teams/Users',
//     description: 'Manage Product Teams and Users',
//     icon: BarChart3,
//     color: 'bg-gradient-to-r from-amber-600 to-amber-700 min-h-40 hover:from-amber-700 hover:to-amber-800', // Warm Amber
//     shortcut: 'Product',
//     route: ROUTES_URL.PRODUCT_TEAM_MANAGEMENT
//   },
//   {
//     id: 10,
//     title: 'New Product',
//     description: 'Create Product',
//     icon: Plus,
//     color: 'bg-gradient-to-r from-cyan-600 to-cyan-700 min-h-40 hover:from-cyan-700 hover:to-cyan-800', // Crisp Cyan
//     shortcut: 'Product',
//     route: ROUTES_URL.CREATE_SUBSCRIPTION
//   },
//   {
//     id: 11,
//     title: 'Create Team',
//     description: 'New Team',
//     icon: UserPlus,
//     color: 'bg-gradient-to-r from-indigo-600 to-indigo-700 min-h-40 hover:from-indigo-700 hover:to-indigo-800', // Calm Indigo
//     shortcut: 'Teams',
//     route: ROUTES_URL.CRETE_COMPANY_USER
//   }
// ];

// const actions = [
//   {
//     id: 1,
//     title: 'New Deal',
//     description: 'Create opportunity',
//     icon: Plus,
//     color: 'bg-gradient-to-r from-blue-800 to-blue-900 min-h-40 hover:from-blue-900 hover:to-blue-950', // Royal Blue
//     shortcut: 'Lead',
//     route: ROUTES_URL.CREATE_LEAD
//   },
//   {
//     id: 2,
//     title: 'Add User',
//     description: 'New User',
//     icon: UserPlus,
//     color: 'bg-gradient-to-r from-green-800 to-green-900 min-h-40 hover:from-green-900 hover:to-green-950', // Deep Forest Green
//     shortcut: 'Users',
//     route: ROUTES_URL.CRETE_COMPANY_USER
//   },
//   {
//     id: 3,
//     title: 'Schedule',
//     description: 'Book meeting',
//     icon: Calendar,
//     color: 'bg-gradient-to-r from-purple-800 to-purple-900 min-h-40 hover:from-purple-900 hover:to-purple-950', // Dark Plum
//     shortcut: 'Meetings',
//     route: ROUTES_URL.SCHEDULE_MEETING
//   },
//   {
//     id: 4,
//     title: 'Email Template',
//     description: 'Create Email Template',
//     icon: Mail,
//     color: 'bg-gradient-to-r from-red-700 to-red-800 min-h-40 hover:from-red-800 hover:to-red-900', // Strong Crimson
//     shortcut: 'Templates',
//     route: ROUTES_URL.EMAIL_TEMPLATE
//   },
//   {
//     id: 5,
//     title: 'Settings',
//     description: 'Manage Settings',
//     icon: Settings,
//     color: 'bg-gradient-to-r from-stone-700 to-stone-800 min-h-40 hover:from-stone-800 hover:to-stone-900', // Earthy Stone Gray
//     shortcut: 'Settings',
//     route: ROUTES_URL.COMPANY_SETTING
//   },
//   {
//     id: 6,
//     title: 'Prefrences',
//     description: 'Manage Prefrences',
//     icon: LayoutPanelLeft,
//     color: 'bg-gradient-to-r from-gray-700 to-gray-800 min-h-40 hover:from-gray-800 hover:to-gray-900', // Standard Dark Gray
//     shortcut: 'Preferences',
//     route: ROUTES_URL.USER_PROFILE_SETTING
//   },
//   {
//     id: 7,
//     title: 'Products',
//     description: 'Manage Products',
//     icon: Store,
//     color: 'bg-gradient-to-r from-teal-800 to-teal-900 min-h-40 hover:from-teal-900 hover:to-teal-950', // Very Deep Teal
//     shortcut: 'Product',
//     route: ROUTES_URL.PRODUCT_MANAGEMENT
//   },
//   {
//     id: 8,
//     title: 'Teams',
//     description: 'Manage Teams',
//     icon: Network,
//     color: 'bg-gradient-to-r from-pink-700 to-pink-800 min-h-40 hover:from-pink-800 hover:to-pink-900', // Deep Berry Pink
//     shortcut: 'Team',
//     route: ROUTES_URL.TEAM_MANAGEMENT
//   },
//   {
//     id: 9,
//     title: 'Products Teams/Users',
//     description: 'Manage Product Teams and Users',
//     icon: BarChart3,
//     color: 'bg-gradient-to-r from-yellow-600 to-yellow-700 min-h-40 hover:from-yellow-700 hover:to-yellow-800', // Golden Yellow
//     shortcut: 'Product',
//     route: ROUTES_URL.PRODUCT_TEAM_MANAGEMENT
//   },
//   {
//     id: 10,
//     title: 'New Product',
//     description: 'Create Product',
//     icon: Plus,
//     color: 'bg-gradient-to-r from-lime-700 to-lime-800 min-h-40 hover:from-lime-800 hover:to-lime-900', // Zesty Lime Green
//     shortcut: 'Product',
//     route: ROUTES_URL.CREATE_SUBSCRIPTION
//   },
//   {
//     id: 11,
//     title: 'Create Team',
//     description: 'New Team',
//     icon: UserPlus,
//     color: 'bg-gradient-to-r from-cyan-700 to-cyan-800 min-h-40 hover:from-cyan-800 hover:to-cyan-900', // Vibrant Cyan
//     shortcut: 'Teams',
//     route: ROUTES_URL.CRETE_COMPANY_USER
//   }
// ];

// const actions = [
//   {
//     id: 1,
//     title: 'New Deal',
//     description: 'Create opportunity',
//     icon: Plus,
//     color: 'bg-gradient-to-r from-blue-700 to-blue-800 min-h-40 hover:from-blue-800 hover:to-blue-900', // Deep Sapphire
//     shortcut: 'Lead',
//     route: ROUTES_URL.CREATE_LEAD
//   },
//   {
//     id: 2,
//     title: 'Add User',
//     description: 'New User',
//     icon: UserPlus,
//     color: 'bg-gradient-to-r from-emerald-700 to-emerald-800 min-h-40 hover:from-emerald-800 hover:to-emerald-900', // Forest Emerald
//     shortcut: 'Users',
//     route: ROUTES_URL.CRETE_COMPANY_USER
//   },
//   {
//     id: 3,
//     title: 'Schedule',
//     description: 'Book meeting',
//     icon: Calendar,
//     color: 'bg-gradient-to-r from-purple-700 to-purple-800 min-h-40 hover:from-purple-800 hover:to-purple-900', // Royal Amethyst
//     shortcut: 'Meetings',
//     route: ROUTES_URL.SCHEDULE_MEETING
//   },
//   {
//     id: 4,
//     title: 'Email Template',
//     description: 'Create Email Template',
//     icon: Mail,
//     color: 'bg-gradient-to-r from-amber-600 to-amber-700 min-h-40 hover:from-amber-700 hover:to-amber-800', // Burnished Gold
//     shortcut: 'Templates',
//     route: ROUTES_URL.EMAIL_TEMPLATE
//   },
//   {
//     id: 5,
//     title: 'Settings',
//     description: 'Manage Settings',
//     icon: Settings,
//     color: 'bg-gradient-to-r from-zinc-700 to-zinc-800 min-h-40 hover:from-zinc-800 hover:to-zinc-900', // Charcoal Zinc
//     shortcut: 'Settings',
//     route: ROUTES_URL.COMPANY_SETTING
//   },
//   {
//     id: 6,
//     title: 'Prefrences',
//     description: 'Manage Prefrences',
//     icon: LayoutPanelLeft,
//     color: 'bg-gradient-to-r from-slate-600 to-slate-700 min-h-40 hover:from-slate-700 hover:to-slate-800', // Slate Carbon
//     shortcut: 'Preferences',
//     route: ROUTES_URL.USER_PROFILE_SETTING
//   },
//   {
//     id: 7,
//     title: 'Products',
//     description: 'Manage Products',
//     icon: Store,
//     color: 'bg-gradient-to-r from-teal-700 to-teal-800 min-h-40 hover:from-teal-800 hover:to-teal-900', // Deep Ocean Teal
//     shortcut: 'Product',
//     route: ROUTES_URL.CREATE_SUBSCRIPTION // Assuming a management route here too
//   },
//   {
//     id: 8,
//     title: 'Teams',
//     description: 'Manage Teams',
//     icon: Network,
//     color: 'bg-gradient-to-r from-rose-700 to-rose-800 min-h-40 hover:from-rose-800 hover:to-rose-900', // Deep Ruby Rose
//     shortcut: 'Team',
//     route: ROUTES_URL.TEAM_MANAGEMENT
//   },
//   {
//     id: 9,
//     title: 'Products Teams/Users',
//     description: 'Manage Product Teams and Users',
//     icon: BarChart3,
//     color: 'bg-gradient-to-r from-lime-600 to-lime-700 min-h-40 hover:from-lime-700 hover:to-lime-800', // Rich Chartreuse (distinct for analytics)
//     shortcut: 'Product',
//     route: ROUTES_URL.PRODUCT_TEAM_MANAGEMENT
//   },
//   {
//     id: 10,
//     title: 'New Product',
//     description: 'Create Product',
//     icon: Plus,
//     color: 'bg-gradient-to-r from-cyan-600 to-cyan-700 min-h-40 hover:from-cyan-700 hover:to-cyan-800', // Pristine Cyan
//     shortcut: 'Product',
//     route: ROUTES_URL.PRODUCT_MANAGEMENT // Assuming this is for creating products
//   },
//   {
//     id: 11,
//     title: 'Create Team',
//     description: 'New Team',
//     icon: UserPlus,
//     color: 'bg-gradient-to-r from-indigo-700 to-indigo-800 min-h-40 hover:from-indigo-800 hover:to-indigo-900', // Midnight Indigo
//     shortcut: 'Teams',
//     route: ROUTES_URL.CRETE_COMPANY_USER
//   }
// ];


const actions = [
  {
    id: 1,
    title: 'New Deal',
    description: 'Create opportunity',
    icon: Plus,
    color: 'bg-gradient-to-r from-blue-600 to-blue-700 min-h-40 hover:from-blue-700 hover:to-blue-800', // Classic Business Blue
    shortcut: 'Lead',
    route: ROUTES_URL.CREATE_LEAD
  },
  {
    id: 2,
    title: 'Add User',
    description: 'New User',
    icon: UserPlus,
    color: 'bg-gradient-to-r from-teal-600 to-teal-700 min-h-40 hover:from-teal-700 hover:to-teal-800', // Friendly Teal
    shortcut: 'Users',
    route: ROUTES_URL.CREATE_COMPANY_USER
  },
  {
    id: 3,
    title: 'Schedule',
    description: 'Book meeting',
    icon: Calendar,
    color: 'bg-gradient-to-r from-violet-500 to-violet-600 min-h-40 hover:from-violet-600 hover:to-violet-700', // Bright but Muted Violet
    shortcut: 'Meetings',
    route: ROUTES_URL.SCHEDULE_MEETING
  },
  {
    id: 4,
    title: 'Email Template',
    description: 'Create Email Template',
    icon: Mail,
    color: 'bg-gradient-to-r from-orange-500 to-orange-600 min-h-40 hover:from-orange-600 hover:to-orange-700', // Energetic Orange
    shortcut: 'Templates',
    route: ROUTES_URL.EMAIL_TEMPLATE
  },
  {
    id: 5,
    title: 'Settings',
    description: 'Manage Settings',
    icon: Settings,
    color: 'bg-gradient-to-r from-gray-600 to-gray-700 min-h-40 hover:from-gray-700 hover:to-gray-800', // Warm Gray
    shortcut: 'Settings',
    route: ROUTES_URL.COMPANY_SETTING
  },
  {
    id: 6,
    title: 'Prefrences',
    description: 'Manage Prefrences',
    icon: LayoutPanelLeft,
    color: 'bg-gradient-to-r from-stone-500 to-stone-600 min-h-40 hover:from-stone-600 hover:to-stone-700', // Earthy Stone
    shortcut: 'Preferences',
    route: ROUTES_URL.USER_PROFILE_SETTING
  },
  {
    id: 7,
    title: 'Products',
    description: 'Manage Products',
    icon: Store,
    color: 'bg-gradient-to-r from-green-600 to-green-700 min-h-40 hover:from-green-700 hover:to-green-800', // Lively Green
    shortcut: 'Product',
    route: ROUTES_URL.PRODUCT_MANAGEMENT
  },
  {
    id: 8,
    title: 'Teams',
    description: 'Manage Teams',
    icon: Network,
    color: 'bg-gradient-to-r from-fuchsia-600 to-fuchsia-700 min-h-40 hover:from-fuchsia-700 hover:to-fuchsia-800', // Playful Fuchsia (used sparingly for unique actions)
    shortcut: 'Team',
    route: ROUTES_URL.TEAM_MANAGEMENT
  },
  {
    id: 9,
    title: 'Products Teams/Users',
    description: 'Manage Product Teams and Users',
    icon: BarChart3,
    color: 'bg-gradient-to-r from-yellow-500 to-yellow-600 min-h-40 hover:from-yellow-600 hover:to-yellow-700', // Bright Chart Yellow
    shortcut: 'Product',
    route: ROUTES_URL.PRODUCT_TEAM_MANAGEMENT
  },
  {
    id: 10,
    title: 'New Product',
    description: 'Create Product',
    icon: Plus,
    color: 'bg-gradient-to-r from-cyan-500 to-cyan-600 min-h-40 hover:from-cyan-600 hover:to-cyan-700', // Clear Cyan
    shortcut: 'Product',
    route: ROUTES_URL.CREATE_PRODUCT
  },
  {
    id: 11,
    title: 'Create Team',
    description: 'New Team',
    icon: UserPlus,
    color: 'bg-gradient-to-r from-red-500 to-red-600 min-h-40 hover:from-red-600 hover:to-red-700', // Action Red (for important new creation)
    shortcut: 'Teams',
    route: ROUTES_URL.CREATE_TEAM
  }
];

// const actions = [
//   {
//     id: 1,
//     title: 'New Deal',
//     description: 'Create opportunity',
//     icon: Plus,
//     color: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800', // Bright Blue
//     shortcut: 'Lead',
//     route: ROUTES_URL.CREATE_LEAD
//   },
//   {
//     id: 2,
//     title: 'Add User',
//     description: 'New User',
//     icon: UserPlus,
//     color: 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800', // Electric Purple
//     shortcut: 'Users',
//     route: ROUTES_URL.CRETE_COMPANY_USER
//   },
//   {
//     id: 3,
//     title: 'Schedule',
//     description: 'Book meeting',
//     icon: Calendar,
//     color: 'bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800', // Hot Pink
//     shortcut: 'Meetings',
//     route: ROUTES_URL.SCHEDULE_MEETING
//   },
//   {
//     id: 4,
//     title: 'Email Template',
//     description: 'Create Email Template',
//     icon: Mail,
//     color: 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700', // Sunny Yellow
//     shortcut: 'Templates',
//     route: ROUTES_URL.EMAIL_TEMPLATE
//   },
//   {
//     id: 5,
//     title: 'Settings',
//     description: 'Manage Settings',
//     icon: Settings,
//     color: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800', // Bold Red
//     shortcut: 'Settings',
//     route: ROUTES_URL.COMPANY_SETTING
//   },
//   {
//     id: 6,
//     title: 'Prefrences',
//     description: 'Manage Prefrences',
//     icon: LayoutPanelLeft,
//     color: 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700', // Aqua Cyan
//     shortcut: 'Preferences',
//     route: ROUTES_URL.USER_PROFILE_SETTING
//   },
//   {
//     id: 7,
//     title: 'Products',
//     description: 'Manage Products',
//     icon: Store,
//     color: 'bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700', // Zesty Lime Green
//     shortcut: 'Product',
//     route: ROUTES_URL.PRODUCT_MANAGEMENT
//   },
//   {
//     id: 8,
//     title: 'Teams',
//     description: 'Manage Teams',
//     icon: Network,
//     color: 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800', // Fiery Orange
//     shortcut: 'Team',
//     route: ROUTES_URL.TEAM_MANAGEMENT
//   },
//   {
//     id: 9,
//     title: 'Products Teams/Users',
//     description: 'Manage Product Teams and Users',
//     icon: BarChart3,
//     color: 'bg-gradient-to-r from-fuchsia-600 to-fuchsia-700 hover:from-fuchsia-700 hover:to-fuchsia-800', // Bold Fuchsia
//     shortcut: 'Product',
//     route: ROUTES_URL.PRODUCT_TEAM_MANAGEMENT
//   },
//   {
//     id: 10,
//     title: 'New Product',
//     description: 'Create Product',
//     icon: Plus,
//     color: 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700', // Vivid Emerald
//     shortcut: 'Product',
//     route: ROUTES_URL.CREATE_SUBSCRIPTION
//   },
//   {
//     id: 11,
//     title: 'Create Team',
//     description: 'New Team',
//     icon: UserPlus,
//     color: 'bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700', // Rose Red
//     shortcut: 'Teams',
//     route: ROUTES_URL.CRETE_COMPANY_USER
//   }
// ];
// const actions = [
//   {
//     id: 1,
//     title: 'New Deal',
//     description: 'Create opportunity',
//     icon: Plus,
//     color: 'bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800', // Deep Teal
//     shortcut: 'Lead',
//     route: ROUTES_URL.CREATE_LEAD
//   },
//   {
//     id: 2,
//     title: 'Add User',
//     description: 'New User',
//     icon: UserPlus,
//     color: 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800', // Rich Indigo
//     shortcut: 'Users',
//     route: ROUTES_URL.CRETE_COMPANY_USER
//   },
//   {
//     id: 3,
//     title: 'Schedule',
//     description: 'Book meeting',
//     icon: Calendar,
//     color: 'bg-gradient-to-r from-purple-700 to-purple-800 hover:from-purple-800 hover:to-purple-900', // Darker Purple
//     shortcut: 'Meetings',
//     route: ROUTES_URL.SCHEDULE_MEETING
//   },
//   {
//     id: 4,
//     title: 'Email Template',
//     description: 'Create Email Template',
//     icon: Mail,
//     color: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700', // Vibrant Orange (a pop of color)
//     shortcut: 'Templates',
//     route: ROUTES_URL.EMAIL_TEMPLATE
//   },
//   {
//     id: 5,
//     title: 'Settings',
//     description: 'Manage Settings',
//     icon: Settings,
//     color: 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900', // Charcoal Gray (neutral and strong)
//     shortcut: 'Settings',
//     route: ROUTES_URL.COMPANY_SETTING
//   },
//   {
//     id: 6,
//     title: 'Prefrences',
//     description: 'Manage Prefrences',
//     icon: LayoutPanelLeft,
//     color: 'bg-gradient-to-r from-blue-600 to-blue-gray-700 hover:from-blue-gray-700 hover:to-blue-gray-800', // Blue-Gray
//     shortcut: 'Preferences',
//     route: ROUTES_URL.USER_PROFILE_SETTING
//   },
//   {
//     id: 7,
//     title: 'Products',
//     description: 'Manage Products',
//     icon: Store,
//     color: 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800', // Forest Green
//     shortcut: 'Product',
//     route: ROUTES_URL.PRODUCT_MANAGEMENT
//   },
//   {
//     id: 8,
//     title: 'Teams',
//     description: 'Manage Teams',
//     icon: Network,
//     color: 'bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800', // Muted Pink
//     shortcut: 'Team',
//     route: ROUTES_URL.TEAM_MANAGEMENT
//   },
//   {
//     id: 9,
//     title: 'Products Teams/Users',
//     description: 'Manage Product Teams and Users',
//     icon: BarChart3,
//     color: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700', // Golden Amber
//     shortcut: 'Product',
//     route: ROUTES_URL.PRODUCT_TEAM_MANAGEMENT
//   },
//   {
//     id: 10,
//     title: 'New Product',
//     description: 'Create Product',
//     icon: Plus,
//     color: 'bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800', // Teal-Blue
//     shortcut: 'Product',
//     route: ROUTES_URL.CREATE_SUBSCRIPTION
//   },
//   {
//     id: 11,
//     title: 'Create Team',
//     description: 'New Team',
//     icon: UserPlus,
//     color: 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800', // Emerald Green
//     shortcut: 'Teams',
//     route: ROUTES_URL.CRETE_COMPANY_USER
//   }
// ];
const QuickActions = () => {

  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-full rounded-2xl shadow-lg border border-gray-100 p-8">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Quick Actions</h3>
        <p className="text-gray-600">Frequently used CRM functions</p>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <button 
            key={action.id}
            onClick={() =>  {
              if(action.id !==3 ){
                    navigate(action.route);
              }
              else{
                navigate(
                            ROUTES_URL.SCHEDULE_MEETING +
                              "?from=" +
                              window.location.pathname
                          );
              }
                  
            }}
            className={`${action.color} text-white p-5 rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95 group relative overflow-hidden`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <action.icon className="w-6 h-6" />
                <span className="text-xs opacity-75 font-mono">{action.shortcut}</span>
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-sm mb-1">{action.title}</h4>
                <p className="text-xs opacity-90">{action.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;