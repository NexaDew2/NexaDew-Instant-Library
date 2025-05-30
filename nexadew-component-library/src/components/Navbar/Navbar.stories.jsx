import React from 'react';
import Navbar from './Navbar';

export default {
  title: 'Components/Navbar',
  component: Navbar,
  argTypes: {
    brandName: { control: 'text', description: 'Brand name to display' },
    logoUrl: { control: 'text', description: 'URL for brand logo image' },
    bgColor: { 
      control: 'text', 
      description: 'Background color class (Tailwind)',
      defaultValue: 'bg-gray-800'
    },
    textColor: { 
      control: 'text', 
      description: 'Text color class (Tailwind)',
      defaultValue: 'text-white'
    },
    height: { 
      control: 'text', 
      description: 'Height class (Tailwind)',
      defaultValue: 'h-12'
    },
    layout: {
      control: {
        type: 'select',
        options: ['left', 'center', 'space-between', 'right']
      },
      description: 'Layout of navbar items'
    },
    hasSearch: { control: 'boolean', description: 'Whether to show search input' },
    searchPlaceholder: { 
      control: 'text', 
      description: 'Placeholder text for search input',
      defaultValue: 'Search...'
    },
    searchstyle: { control: 'text', description: 'Search input style class (Tailwind)' },
  }
};

const Template = (args) => <Navbar {...args} />;

export const Default = Template.bind({});
Default.args = {
  brandName: 'NexaDew',
  logoUrl: '',
  bgColor: 'bg-gray-800',
  textColor: 'text-white',
  height: 'h-12',
  layout: 'right',
  hasSearch: true,
  searchPlaceholder: 'Search...',
  searchstyle: 'rounded-md border border-gray-300',
  links: [
    { label: 'Home', href: '#' },
    { label: 'About', href: '#' },
    { label: 'Contact', href: '#' }
  ],
  buttons: [
    { label: 'Login', onClick: () => console.log('Login clicked'), style: 'bg-blue-500 text-white' },
    { label: 'Sign Up', onClick: () => console.log('Sign Up clicked'), style: 'bg-green-500 text-white' }
  ],
  dropdowns: [
    {
      label: 'Products',
      items: [
        { label: 'Product 1', href: '#' },
        { label: 'Product 2', href: '#' },
        { 
          label: 'More Products', 
          subitems: [
            { label: 'Sub Product 1', href: '#' },
            { label: 'Sub Product 2', href: '#' }
          ]
        }
      ],
      onSelect: (item) => console.log(`${item} selected`)
    }
  ]
};

export const CenteredLayout = Template.bind({});
CenteredLayout.args = {
  ...Default.args,
  layout: 'center'
};
export const LetfLayout = Template.bind({});
CenteredLayout.args = {
  ...Default.args,
  layout: 'left'
};
export const WithLogo = Template.bind({});
WithLogo.args = {
  ...Default.args,
  logoUrl: 'https://www.nexadew.com/assets/Logo-DQxgWKsq.png'
};

export const WithoutSearch = Template.bind({});
WithoutSearch.args = {
  ...Default.args,
  hasSearch: false
};