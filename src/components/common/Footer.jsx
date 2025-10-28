import { Link } from 'react-router-dom';

const Footer = () => {
  const navigation = {
    services: [
      { name: 'Emergency Care', href: '/services' },
      { name: 'Online Consultation', href: '/services' },
      { name: 'Health Checkup', href: '/services' },
      { name: 'Lab Tests', href: '/services' },
    ],
    support: [
      { name: 'Insurance', href: '/contact' },
      { name: 'FAQs', href: '/contact' },
      { name: 'Help Center', href: '/contact' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Our Doctors', href: '/doctors' },
      { name: 'Careers', href: '/about' },
      { name: 'Contact Us', href: '/contact' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookie Policy', href: '#' },
    ],
  };

  const socialLinks = [
    {
      name: 'Facebook',
      href: '#',
      icon: (props) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: 'Twitter',
      href: '#',
      icon: (props) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      href: '#',
      icon: (props) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-neutral-50 border-t border-neutral-100" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:justify-between">
          {/* Company Logo and Info */}
          <div className="mb-8 md:mb-0 md:w-1/3">
            <div className="flex items-center space-x-3">
              <img
                src="https://i.postimg.cc/5thn5rvZ/Whats-App-Image-2025-10-28-at-02-51-51.jpg"
                alt="Medi Link Logo"
                className="w-12 h-12 rounded-lg shadow-md object-cover"
              />
              <h2 className="text-2xl font-bold text-neutral-800">
                Medi<span className="text-primary-600">Link</span>
              </h2>
            </div>

            <p className="text-neutral-600 text-base mt-6">
              Making healthcare accessible <br /> and convenient for everyone.
            </p>

            <div className="flex space-x-5 mt-6">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-neutral-400 hover:text-primary-500 transition-colors duration-300"
                  aria-label={item.name}
                >
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:flex md:flex-1 md:justify-between space-y-8 md:space-y-0">
            {Object.entries(navigation).map(([section, links]) => (
              <div key={section}>
                <h3 className="text-base font-semibold text-neutral-800 uppercase mb-5">
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </h3>
                <ul className="space-y-3">
                  {links.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className="text-base text-neutral-600 hover:text-primary-500 transition-colors duration-200"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="border-t border-neutral-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-neutral-500">
            &copy; {new Date().getFullYear()} MediLink. All rights reserved.
          </p>
          <div className="mt-3 sm:mt-0 flex space-x-6">
            <a href="#" className="text-sm text-neutral-500 hover:text-primary-500">Terms</a>
            <a href="#" className="text-sm text-neutral-500 hover:text-primary-500">Privacy</a>
            <a href="#" className="text-sm text-neutral-500 hover:text-primary-500">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
