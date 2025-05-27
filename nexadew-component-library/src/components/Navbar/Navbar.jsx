import React from 'react';

const Dropdown = ({ label, items, onSelect, isMobile = false }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [openSubmenuIndex, setOpenSubmenuIndex] = React.useState(null);

  const toggleSubmenu = (index) => {
    setOpenSubmenuIndex(openSubmenuIndex === index ? null : index);
  };

  return (
    <div className={isMobile ? "w-full" : "relative"}>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setOpenSubmenuIndex(null); // Close any open submenus when main menu toggles
        }}
        className={`w-full text-center px-3 py-2 rounded-md hover:bg-gray-900 focus:outline-none font-medium ${
          isMobile ? "text-gray-800" : ""
        }`}
      >
        {label} {isMobile ? "▼" : "▼"}
      </button>
      {isOpen && (
        <div
          className={`${
            isMobile
              ? "w-full pl-4 bg-gray-50 rounded-md"
              : "absolute mt-2 w-48 bg-white shadow-lg rounded-md z-10"
          }`}
        >
          {items.map((item, index) => (
            <div key={index} className={isMobile ? "w-full" : "relative group"}>
              {item.subitems ? (
                <>
                  <button
                    onClick={() => isMobile ? toggleSubmenu(index) : null}
                    className={`flex justify-between items-center w-full px-4 py-2 ${
                      isMobile 
                        ? "text-gray-800 hover:bg-gray-100"
                        : "text-gray-800 hover:bg-gray-100"
                    } cursor-pointer`}
                  >
                    {item.label} 
                    {isMobile 
                      ? (openSubmenuIndex === index ? "▲" : "▼") 
                      : <span>▶</span>}
                  </button>
                  
                  {(isMobile ? openSubmenuIndex === index : true) && (
                    <div
                      className={`${
                        isMobile
                          ? "w-full pl-4 bg-gray-100 rounded-md"
                          : "hidden group-hover:block absolute left-full top-0 w-48 bg-white shadow-lg rounded-md z-10"
                      }`}
                    >
                      {item.subitems.map((subitem, subIndex) => (
                        <a
                          key={subIndex}
                          href={subitem.href}
                          onClick={() => {
                            setIsOpen(false);
                            setOpenSubmenuIndex(null);
                            onSelect(subitem.label);
                          }}
                          className={`block px-4 py-2 ${
                            isMobile 
                              ? "text-gray-800 hover:bg-gray-200" 
                              : "text-gray-800 hover:bg-gray-100"
                          }`}
                        >
                          {subitem.label}
                        </a>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <a
                  href={item.href}
                  onClick={() => {
                    setIsOpen(false);
                    setOpenSubmenuIndex(null);
                    onSelect(item.label);
                  }}
                  className={`block px-4 py-2 ${
                    isMobile ? "text-gray-800 hover:bg-gray-100" : "text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  {item.label}
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Navbar = ({
  brandName,
  logoUrl,
  bgColor,
  textColor,
  height,
  links = [],
  buttons = [],
  dropdowns = [],
  layout ,
  hasSearch = false,
  searchPlaceholder = 'Search...',
  searchstyle,
}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
// Tailwind's spacing scale: h-12 = 3rem = 48px
const tailwindSpacingToPx = {
  "h-10": 40,
  "h-11": 44,
  "h-12": 48,
  "h-14": 56,
  "h-16": 64,
  "h-20": 80,
  "h-24": 96,
  "h-28": 112,
  "h-32": 128,
  "h-36": 144,
  "h-40": 160,
  "h-44": 176,
  "h-48": 192,
  "h-52": 208,
  "h-56": 224,
  // add more as needed
};

const heightinpx = height ;
const topPx = tailwindSpacingToPx[heightinpx]; // 48

  return (
    <nav className={`w-full ${bgColor} ${textColor} shadow-md px-6 flex items-center ${height}`}>
      {/* Brand Logo/Name */}
      <div className="flex items-center space-x-3">
        {logoUrl ? (
          <img src={logoUrl} alt={brandName} className="h-8" />
        ) : (
          <span className="text-xl font-bold">{brandName}</span>
        )}
      </div>

      {/* Hamburger Menu for Mobile */}
      <button
        className="md:hidden ml-auto p-2 focus:outline-none"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
          />
        </svg>
      </button>

      <div
        className={`hidden md:flex ml-2  ${
          layout === 'center' ? 'justify-center flex-1' : layout === 'space-between' ? 'justify-between flex-1' : layout==="left"? 'justify-start' : ' ml-auto'
        } items-center`}
      >
        <div className={`flex ${layout === 'center' ? 'ml-auto gap-3' : 'space-x-6'} items-center`}>
          {links.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="hover:underline font-medium transition-colors"
            >
              {link.label}
            </a>
          ))}
          {dropdowns.map((dropdown, index) => (
            <Dropdown
              key={index}
              label={dropdown.label}
              items={dropdown.items}
              onSelect={dropdown.onSelect}
            />
          ))}
        </div>
        <div className="ml-auto flex items-center space-x-4">
          {buttons.map((button, index) => (
            <button
              key={index}
              onClick={button.onClick}
              className={`px-4 py-2 rounded-md ${button.style} font-medium hover:opacity-90 transition`}
            >
              {button.label}
            </button>
          ))}
          {hasSearch && (
            <input
              type="text"
              placeholder={searchPlaceholder}
              className={`px-4 py-2 ${searchstyle}  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            />
          )}
        </div>
      </div>

      {isMenuOpen && (
        <div
  className="md:hidden absolute left-0 w-full bg-white shadow-md z-20"
  style={{ top: `${topPx}px` }}
>
          <div className="flex flex-col p-4">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="py-2 text-gray-800 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            {dropdowns.map((dropdown, index) => (
              <Dropdown
                key={index}
                label={dropdown.label}
                items={dropdown.items}
                onSelect={(item) => {
                  dropdown.onSelect(item);
                  setIsMenuOpen(false);
                }}
                isMobile={true}
              />
            ))}
            {buttons.map((button, index) => (
              <button
                key={index}
                onClick={() => {
                  button.onClick();
                  setIsMenuOpen(false);
                }}
                className={`mt-2 px-4 py-2 rounded-md ${button.style} font-medium hover:opacity-90 transition`}
              >
                {button.label}
              </button>
            ))}
            {hasSearch && (
              <input
                type="text"
                placeholder={searchPlaceholder}
                className={`mt-2 px-4 py-2 ${searchstyle} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              />
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;