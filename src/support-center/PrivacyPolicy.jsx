import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FaShieldAlt, 
  FaUserLock, 
  FaCookie, 
  FaDatabase, 
  FaEye, 
  FaTrash,
  FaDownload,
  FaChevronDown,
  FaChevronUp,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClock,
  FaEnvelope,
  FaPhone
} from "react-icons/fa";

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState("introduction");
  const [consent, setConsent] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false
  });

  // Load consent from localStorage on component mount
  useEffect(() => {
    const savedConsent = localStorage.getItem('privacyConsent');
    if (savedConsent) {
      setConsent(JSON.parse(savedConsent));
    }
  }, []);

  // Save consent to localStorage
  const updateConsent = (type, value) => {
    const newConsent = { ...consent, [type]: value };
    setConsent(newConsent);
    localStorage.setItem('privacyConsent', JSON.stringify(newConsent));
  };

  const policySections = [
    {
      id: "introduction",
      title: "Introduction",
      icon: FaShieldAlt,
      content: `Welcome to BlogHub's Privacy Policy. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice or our practices with regard to your personal information, please contact us at privacy@bloghub.com.`
    },
    {
      id: "information-we-collect",
      title: "Information We Collect",
      icon: FaDatabase,
      content: `We collect personal information that you voluntarily provide to us when you register on the BlogHub platform, express an interest in obtaining information about us or our products and services, when you participate in activities on the platform, or otherwise when you contact us.

The personal information we collect may include the following:
• Name and contact data: Your first and last name, email address, postal address, phone number, and other similar contact data.
• Credentials: Passwords, password hints, and similar security information used for authentication and account access.
• Profile data: Your username, profile photo, bio, website links, and social media profiles.
• Content: Blog posts, comments, likes, shares, and other content you create on our platform.
• Technical data: IP address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access our platform.`
    },
    {
      id: "how-we-use-info",
      title: "How We Use Your Information",
      icon: FaEye,
      content: `We use personal information collected via our platform for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.

We use the information we collect or receive:
• To facilitate account creation and login process
• To send you marketing and promotional communications
• To send administrative information to you
• To protect our Services and enforce our terms
• To respond to user inquiries/offer support to users
• For other business purposes such as data analysis, identifying usage trends, determining the effectiveness of our promotional campaigns and to evaluate and improve our platform, products, services, marketing and your experience.`
    },
    {
      id: "cookies",
      title: "Cookies and Tracking",
      icon: FaCookie,
      content: `We use cookies and similar tracking technologies to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Policy.

Types of Cookies We Use:
• Necessary Cookies: Essential for the operation of our platform. They include, for example, cookies that enable you to log into secure areas of our platform.
• Analytics Cookies: Allow us to recognize and count the number of visitors and to see how visitors move around our platform when they are using it.
• Functionality Cookies: Used to recognize you when you return to our platform.
• Targeting Cookies: Record your visit to our platform, the pages you have visited and the links you have followed.`
    },
    {
      id: "data-sharing",
      title: "Data Sharing",
      icon: FaUserLock,
      content: `We may process or share your data that we hold based on the following legal basis:
• Consent: We may process your data if you have given us specific consent to use your personal information for a specific purpose.
• Legitimate Interests: We may process your data when it is reasonably necessary to achieve our legitimate business interests.
• Performance of a Contract: Where we have entered into a contract with you, we may process your personal information to fulfill the terms of our contract.
• Legal Obligations: We may disclose your information where we are legally required to do so in order to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process.

We may share your data with:
• Service Providers: We may share your data with third-party vendors, service providers, contractors or agents who perform services for us or on our behalf.
• Business Transfers: We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.
• Affiliates: We may share your information with our affiliates, in which case we will require those affiliates to honor this privacy policy.`
    },
    {
      id: "data-retention",
      title: "Data Retention",
      icon: FaClock,
      content: `We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy policy, unless a longer retention period is required or permitted by law.

No purpose in this policy will require us keeping your personal information for longer than the period of time in which users have an account with us.

When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize such information, or, if this is not possible, then we will securely store your personal information and isolate it from any further processing until deletion is possible.`
    },
    {
      id: "data-security",
      title: "Data Security",
      icon: FaShieldAlt,
      content: `We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security, and improperly collect, access, steal, or modify your information.

Measures We Take:
• Encryption of data in transit and at rest
• Regular security assessments and penetration testing
• Access controls and authentication mechanisms
• Security incident monitoring and response procedures
• Employee security training and awareness programs`
    },
    {
      id: "your-rights",
      title: "Your Privacy Rights",
      icon: FaCheckCircle,
      content: `Depending on your geographical location, you may have certain rights regarding your personal information. These may include the right to:

• Request access and obtain a copy of your personal information
• Request rectification or erasure of your personal information
• Restrict the processing of your personal information
• Data portability rights
• Object to processing of your personal information
• Opt-out of marketing communications
• Withdraw consent at any time

To make such a request, please use the contact details provided below. We will consider and act upon any request in accordance with applicable data protection laws.`
    },
    {
      id: "updates",
      title: "Policy Updates",
      icon: FaExclamationTriangle,
      content: `We may update this privacy policy from time to time. The updated version will be indicated by an updated "Revised" date and the updated version will be effective as soon as it is accessible. If we make material changes to this privacy policy, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification.

We encourage you to review this privacy policy frequently to be informed of how we are protecting your information.`
    }
  ];

  const contactInfo = [
    {
      method: "Email",
      value: "privacy@bloghub.com",
      description: "For privacy-related inquiries and data requests",
      icon: FaEnvelope
    },
    {
      method: "Phone",
      value: "+1 (555) 123-PRIVACY",
      description: "Available Monday-Friday, 9AM-5PM EST",
      icon: FaPhone
    },
    {
      method: "Data Request Portal",
      value: "bloghub.com/data-requests",
      description: "Submit formal data access or deletion requests",
      icon: FaDownload
    }
  ];

  const handleExportData = () => {
    // Simulate data export
    alert("Your data export has been initiated. You will receive an email with your data within 24 hours.");
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.")) {
      // Simulate account deletion
      alert("Account deletion request received. Our team will process your request within 7 business days.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-20 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/25"
          >
            <FaShieldAlt className="text-3xl text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Last updated: December 2024 | We are committed to protecting your privacy and being transparent about our data practices.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-1"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">Policy Sections</h3>
                <nav className="space-y-2">
                  {policySections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 ${
                        activeSection === section.id
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200"
                      }`}
                    >
                      <section.icon className="text-sm flex-shrink-0" />
                      <span className="text-sm font-medium">{section.title}</span>
                    </button>
                  ))}
                </nav>

                {/* Quick Actions */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">Quick Actions</h4>
                  <div className="space-y-3">
                    <button
                      onClick={handleExportData}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors duration-300"
                    >
                      <FaDownload className="text-sm" />
                      <span className="text-sm font-medium">Export My Data</span>
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-300"
                    >
                      <FaTrash className="text-sm" />
                      <span className="text-sm font-medium">Delete Account</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-3"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Policy Content */}
                <div className="p-8">
                  {policySections.map((section) => (
                    <div
                      key={section.id}
                      className={activeSection === section.id ? "block" : "hidden"}
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                          <section.icon className="text-xl text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {section.title}
                          </h2>
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                            <FaClock className="text-xs" />
                            <span>Last updated: December 2024</span>
                          </div>
                        </div>
                      </div>

                      <div className="prose prose-lg dark:prose-invert max-w-none">
                        <div className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                          {section.content}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cookie Consent Manager */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-8 bg-gray-50 dark:bg-gray-900/50">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                    <FaCookie className="text-amber-500" />
                    Cookie Preferences
                  </h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">Necessary Cookies</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Essential for the website to function properly. Cannot be disabled.
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                        <FaCheckCircle />
                        <span className="text-sm font-medium">Always Active</span>
                      </div>
                    </div>

                    {[
                      { key: "analytics", label: "Analytics Cookies", description: "Help us understand how visitors interact with our website." },
                      { key: "marketing", label: "Marketing Cookies", description: "Used to track visitors across websites for marketing purposes." },
                      { key: "preferences", label: "Preference Cookies", description: "Allow the website to remember choices you make." }
                    ].map((cookie) => (
                      <div key={cookie.key} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{cookie.label}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {cookie.description}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={consent[cookie.key]}
                            onChange={(e) => updateConsent(cookie.key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => {
                        const allConsent = {
                          necessary: true,
                          analytics: true,
                          marketing: true,
                          preferences: true
                        };
                        setConsent(allConsent);
                        localStorage.setItem('privacyConsent', JSON.stringify(allConsent));
                      }}
                      className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors duration-300"
                    >
                      Accept All
                    </button>
                    <button
                      onClick={() => {
                        const minimalConsent = {
                          necessary: true,
                          analytics: false,
                          marketing: false,
                          preferences: false
                        };
                        setConsent(minimalConsent);
                        localStorage.setItem('privacyConsent', JSON.stringify(minimalConsent));
                      }}
                      className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
                    >
                      Reject All
                    </button>
                    <button
                      onClick={() => updateConsent}
                      className="px-6 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors duration-300"
                    >
                      Save Preferences
                    </button>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Contact Our Privacy Team</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {contactInfo.map((contact, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                        className="text-center p-6 bg-gray-50 dark:bg-gray-900/30 rounded-xl border border-gray-200 dark:border-gray-700"
                      >
                        <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                          <contact.icon className="text-xl text-blue-600 dark:text-blue-400" />
                        </div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                          {contact.method}
                        </h4>
                        <p className="text-blue-600 dark:text-blue-400 font-semibold mb-2">
                          {contact.value}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {contact.description}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Policy Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-8 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6"
              >
                <div className="flex items-start gap-4">
                  <FaExclamationTriangle className="text-amber-500 text-xl mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                      Important Notice
                    </h4>
                    <p className="text-amber-800 dark:text-amber-200 text-sm">
                      This privacy policy explains how BlogHub collects, uses, and protects your personal information. 
                      By using our platform, you agree to the terms outlined in this policy. We may update this policy 
                      from time to time, and we will notify you of any significant changes.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;