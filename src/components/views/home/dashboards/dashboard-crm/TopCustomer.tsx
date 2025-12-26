import { Star, TrendingUp, Users } from 'lucide-react';

const customers = [
  {
    id: 1,
    name: 'Acme Corporation',
    revenue: '$125,000',
    deals: 12,
    growth: '+15%',
    rating: 5,
    color: 'bg-gradient-to-r from-blue-500 to-blue-600',
    avatar: 'AC',
    status: 'Active',
    lastContact: '2 days ago'
  },
  {
    id: 2,
    name: 'TechFlow Solutions',
    revenue: '$89,500',
    deals: 8,
    growth: '+22%',
    rating: 4,
    color: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
    avatar: 'TS',
    status: 'Active',
    lastContact: '1 week ago'
  },
  {
    id: 3,
    name: 'Global Dynamics',
    revenue: '$67,200',
    deals: 6,
    growth: '+8%',
    rating: 5,
    color: 'bg-gradient-to-r from-purple-500 to-purple-600',
    avatar: 'GD',
    status: 'Negotiating',
    lastContact: '3 days ago'
  },
  {
    id: 4,
    name: 'InnovateX',
    revenue: '$54,800',
    deals: 4,
    growth: '+18%',
    rating: 4,
    color: 'bg-gradient-to-r from-orange-500 to-orange-600',
    avatar: 'IX',
    status: 'Active',
    lastContact: '5 days ago'
  },
  {
    id: 5,
    name: 'DataCore Systems',
    revenue: '$43,200',
    deals: 7,
    growth: '+12%',
    rating: 4,
    color: 'bg-gradient-to-r from-red-500 to-red-600',
    avatar: 'DS',
    status: 'Active',
    lastContact: '1 day ago'
  },
  {
    id: 6,
    name: 'CloudTech Inc',
    revenue: '$38,900',
    deals: 5,
    growth: '+25%',
    rating: 5,
    color: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
    avatar: 'CT',
    status: 'Negotiating',
    lastContact: '4 days ago'
  },
  {
    id: 7,
    name: 'NextGen Solutions',
    revenue: '$32,100',
    deals: 3,
    growth: '+9%',
    rating: 3,
    color: 'bg-gradient-to-r from-teal-500 to-teal-600',
    avatar: 'NS',
    status: 'Active',
    lastContact: '1 week ago'
  },
  {
    id: 8,
    name: 'FutureTech Labs',
    revenue: '$28,700',
    deals: 4,
    growth: '+14%',
    rating: 4,
    color: 'bg-gradient-to-r from-pink-500 to-pink-600',
    avatar: 'FT',
    status: 'Active',
    lastContact: '3 days ago'
  },
  {
    id: 9,
    name: 'Quantum Systems',
    revenue: '$25,400',
    deals: 3,
    growth: '+7%',
    rating: 4,
    color: 'bg-gradient-to-r from-cyan-500 to-cyan-600',
    avatar: 'QS',
    status: 'Active',
    lastContact: '2 weeks ago'
  },
  {
    id: 10,
    name: 'Digital Dynamics',
    revenue: '$22,800',
    deals: 2,
    growth: '+19%',
    rating: 5,
    color: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
    avatar: 'DD',
    status: 'Negotiating',
    lastContact: '1 week ago'
  },
  {
    id: 11,
    name: 'Smart Solutions',
    revenue: '$19,600',
    deals: 4,
    growth: '+11%',
    rating: 3,
    color: 'bg-gradient-to-r from-green-500 to-green-600',
    avatar: 'SS',
    status: 'Active',
    lastContact: '5 days ago'
  },
  {
    id: 12,
    name: 'Tech Innovators',
    revenue: '$17,300',
    deals: 2,
    growth: '+16%',
    rating: 4,
    color: 'bg-gradient-to-r from-purple-400 to-purple-500',
    avatar: 'TI',
    status: 'Active',
    lastContact: '4 days ago'
  }
];

const TopCustomers = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border overflow-y-auto border-gray-100 p-8 h-full flex flex-col [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
      <div className="flex items-center justify-between mb-8 flex-shrink-0">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Top Customers</h3>
          <p className="text-gray-600">Highest value customer relationships</p>
        </div>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold px-4 py-2 hover:bg-blue-50 rounded-lg transition-colors">
          View All
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 -mr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
        <div className="space-y-6">
          {customers.map((customer, index) => (
            <div 
              key={customer.id} 
              className="flex items-center space-x-4 p-5 rounded-xl hover:bg-gray-50 transition-all duration-200 cursor-pointer group border border-gray-100 hover:border-gray-200"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-12 h-12 ${customer.color} rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:scale-110 transition-transform duration-200 flex-shrink-0`}>
                {customer.avatar}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {customer.name}
                  </h4>
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < customer.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl font-bold text-gray-900">{customer.revenue}</span>
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{customer.deals} deals</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      customer.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {customer.status}
                    </span>
                    <span className="text-xs text-gray-500">Last contact: {customer.lastContact}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-emerald-600 flex-shrink-0">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-semibold">{customer.growth}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopCustomers;