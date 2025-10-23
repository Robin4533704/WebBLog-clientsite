import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-10 pb-6 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">
            Blog<span className="text-amber-400">Hub</span>
          </h2>
          <p className="text-sm leading-relaxed mb-4">
            Explore, create and share amazing blogs around the world.  
            Join the community of passionate writers and readers.
          </p>
          <div className="flex gap-3 mt-4">
            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-amber-500 transition">
              <FaFacebookF />
            </a>
            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-amber-500 transition">
              <FaInstagram />
            </a>
            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-amber-500 transition">
              <FaTwitter />
            </a>
            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-amber-500 transition">
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-amber-400 transition">Home</Link></li>
            <li><Link to="/blogs" className="hover:text-amber-400 transition">Blogs</Link></li>
            <li><Link to="/add-blog" className="hover:text-amber-400 transition">Add Blog</Link></li>
            <li><Link to="/contact" className="hover:text-amber-400 transition">Contact</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Support</h3>
          <ul className="space-y-2">
            <li><Link to="/help" className="hover:text-amber-400 transition">Help Center</Link></li>
            <li><Link to="/privacy" className="hover:text-amber-400 transition">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-amber-400 transition">Terms & Conditions</Link></li>
            <li><Link to="/faq" className="hover:text-amber-400 transition">FAQs</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Subscribe</h3>
          <p className="text-sm mb-3">
            Get the latest updates and blog posts directly in your inbox.
          </p>
          <form className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 rounded-md bg-gray-800 text-gray-300 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-md transition w-full sm:w-auto"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-10 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} <span className="text-amber-400">BlogHub</span>. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
