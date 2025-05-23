import React from 'react';
import Navbar from './components/Navbar/Navbar';

const App = () => {
  const brandConfigs = {
    facebook: {
      brandName: 'insta',
      logoUrl: 'https://static.xx.fbcdn.net/rsrc.php/y1/r/4lCu2zih0ca.svg',
      bgColor: 'bg-red-600',
      textColor: 'text-white',
      height: 'h-28',
      links: [
        { label: 'Home', href: '#' },
        { label: 'Friends', href: '#' },
        { label: 'Marketplace', href: '#' },
        { label: 'Marketplace', href: '#' },
      ],
      buttons: [
        {
          label: 'Log Out',
          style: 'bg-red-800 text-white hover:bg-red-700',
          onClick: () => alert('Logging out from Facebook'),
        },
      ],
      dropdowns: [
        {
          label: 'More',
          items: [
            { label: 'Profile',
               subitems: [
                { label: 'Account Settings', href: '#' },
                { label: 'Privacy', href: '#' },
                { label: 'Security', href: '#' },
              ], },
            {
              label: 'Settings',
              subitems: [
                { label: 'Account Settings', href: '#' },
                { label: 'Privacy', href: '#' },
                { label: 'Security', href: '#' },
              ],
            },
            { label: 'Help', href: '#' },
          ],
          onSelect: (item) => alert(`Selected ${item} on Facebook`),
        },
      ],
      layout: 'space-between',  
      hasSearch: true,
      searchPlaceholder: 'Search Facebook',
      searchstyle: 'bg-white text-black border border-gray-300 rounded-md px-4 py-2',
    },
  };

  return (
    <div className="w-full bg-black">
      <Navbar {...brandConfigs.facebook} />
      <div></div>
    </div>
  );
};

export default App;