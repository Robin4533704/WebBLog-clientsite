import { useState } from "react";
import { motion } from "framer-motion";
import { 
  FaGavel, 
  FaUserShield, 
  FaFileContract, 
  FaExclamationTriangle, 
  FaCheckCircle,
  FaBan,
  FaBalanceScale,
  FaCopyright,
  FaShieldAlt,
  FaHandshake,
  FaComments,
  FaEnvelope,
  FaClock
} from "react-icons/fa";

const TermsOfService = () => {
  const [activeSection, setActiveSection] = useState("acceptance");
  const [accepted, setAccepted] = useState(false);

  const termsSections = [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      icon: FaCheckCircle,
      content: `By accessing and using BlogHub ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement.

## Your Agreement
When you create an account, publish content, or use any of our services, you are entering into a legally binding agreement with BlogHub. If you disagree with any part of the terms, you may not access our services.

## Eligibility
To use our services, you must:
- Be at least 13 years of age (or 16 in the European Union)
- Have the legal capacity to enter into binding contracts
- Not be prohibited from receiving our services under applicable laws

## Account Responsibility
You are responsible for:
- Maintaining the confidentiality of your account credentials
- All activities that occur under your account
- Ensuring your account information remains accurate and current
- Immediately notifying us of any unauthorized use of your account`
    },
    {
      id: "user-responsibilities",
      title: "User Responsibilities",
      icon: FaUserShield,
      content: `As a user of BlogHub, you agree to use our platform responsibly and in accordance with all applicable laws and community guidelines.

## Content Standards
You agree not to post content that:
- Infringes on any third-party intellectual property rights
- Contains hate speech, threats, or harassment
- Is defamatory, obscene, or pornographic
- Promotes illegal activities or violence
- Contains malicious code or viruses
- Violates any person's privacy rights

## Conduct Guidelines
You must not:
- Impersonate any person or entity
- Engage in unauthorized scraping or data collection
- Interfere with the proper functioning of the platform
- Attempt to gain unauthorized access to other accounts
- Use the platform for commercial purposes without authorization
- Engage in any activity that could damage, disable, or overburden our services

## Content Ownership
You retain all ownership rights to the content you create and publish on BlogHub. However, by posting content, you grant us a worldwide, non-exclusive, royalty-free license to use, display, and distribute your content through our platform.`
    },
    {
      id: "content-policy",
      title: "Content Policy",
      icon: FaFileContract,
      content: `BlogHub is a platform for creative expression, but we have guidelines to ensure a safe and respectful environment for all users.

## Acceptable Content
We welcome:
- Original articles, stories, and opinions
- Educational and informative content
- Creative writing and poetry
- Personal experiences and reviews
- Professional insights and analysis

## Prohibited Content
Strictly prohibited content includes:
- Plagiarized or stolen content
- Spam, scams, or fraudulent offers
- Adult content or pornography
- Dangerous or illegal activities
- Medical or financial advice without proper credentials
- Content that promotes self-harm or suicide

## Content Moderation
We reserve the right to:
- Review and moderate all content
- Remove any content that violates our policies
- Suspend or terminate accounts for policy violations
- Cooperate with legal authorities when required

## Copyright Compliance
We respond to legitimate copyright infringement claims under the Digital Millennium Copyright Act (DMCA). If you believe your copyright has been infringed, please contact our designated agent.`
    },
    {
      id: "intellectual-property",
      title: "Intellectual Property",
      icon: FaCopyright,
      content: `Respecting intellectual property rights is fundamental to our community.

## Your Rights
You retain ownership of the content you create. You grant BlogHub a license to:
- Host, store, and display your content
- Promote and distribute your content through our services
- Make incidental copies as part of our services
- Use your content for platform improvement and analytics

## Our Rights
BlogHub and its licensors own:
- The platform design, layout, and functionality
- Our trademarks, logos, and brand elements
- The underlying software and technology
- Aggregate and anonymized usage data

## Copyright Protection
We respect copyright laws and expect our users to do the same. If you repeatedly infringe others' intellectual property rights, we will terminate your account.

## License Grant
By posting content, you grant other users the right to:
- View and read your published content
- Share your content through platform features
- Comment on and discuss your content
- Engage with your content within platform guidelines`
    },
    {
      id: "prohibited-activities",
      title: "Prohibited Activities",
      icon: FaBan,
      content: `To maintain a safe and professional environment, certain activities are strictly prohibited on BlogHub.

## Platform Abuse
You may not:
- Use automated systems to access our services
- Attempt to circumvent any security measures
- Interfere with other users' enjoyment of the platform
- Create multiple accounts for abusive purposes
- Use the platform for unauthorized commercial activities

## Security Violations
Prohibited security-related activities include:
- Attempting to probe, scan, or test system vulnerabilities
- Accessing data not intended for you
- Attempting to breach authentication measures
- Interfering with service to any user, host, or network
- Transmitting viruses, worms, or any destructive code

## Commercial Restrictions
Unless expressly authorized, you may not:
- Use the platform for commercial advertising
- Solicit users for commercial purposes
- Resell or commercialize our services
- Use our content for commercial training or AI development
- Scrape or collect user data for commercial use

## Enforcement
We may investigate any violation of these provisions and:
- Remove offending content
- Suspend or terminate accounts
- Cooperate with law enforcement
- Pursue legal action when necessary`
    },
    {
      id: "termination",
      title: "Termination",
      icon: FaExclamationTriangle,
      content: `We believe in fair treatment of our users, but we reserve the right to suspend or terminate accounts under certain circumstances.

## By You
You may terminate your account at any time by:
- Using the account deletion feature in settings
- Contacting our support team
- Ceasing to use our services

## By Us
We may suspend or terminate your account if:
- You violate these Terms of Service
- We are required to do so by law
- You create risk or possible legal exposure for us
- Your account has been inactive for an extended period
- We discontinue or materially change our services

## Effects of Termination
Upon termination:
- Your right to use our services immediately ceases
- We may delete your content and account information
- You remain liable for any obligations incurred before termination
- Provisions that should survive termination will remain in effect

## Content Preservation
We may preserve your content for a reasonable period after termination for:
- Legal compliance requirements
- Dispute resolution purposes
- Platform integrity and security
- Enforcement of our terms`
    },
    {
      id: "disclaimer",
      title: "Disclaimer of Warranties",
      icon: FaShieldAlt,
      content: `We provide our services with care, but there are certain limitations you should understand.

## Service "As Is"
Our services are provided "as is" and "as available" without warranties of any kind, either express or implied, including, but not limited to:
- Implied warranties of merchantability
- Fitness for a particular purpose
- Non-infringement
- Course of performance or usage of trade

## No Guarantees
We do not guarantee that:
- Our services will meet your specific requirements
- Our services will be uninterrupted, timely, or error-free
- The results from using our services will be accurate or reliable
- Any errors in the service will be corrected

## Content Accuracy
We are not responsible for:
- The accuracy, completeness, or usefulness of any content
- Any errors or omissions in any content
- Any loss or damage resulting from reliance on content
- Content provided by third parties or other users

## Technical Issues
You understand and agree that:
- Your use of our services is at your sole risk
- You download or obtain content at your own discretion and risk
- You are solely responsible for any damage to your computer system or loss of data`
    },
    {
      id: "limitation-liability",
      title: "Limitation of Liability",
      icon: FaBalanceScale,
      content: `To the extent permitted by law, our liability is limited as described below.

## General Limitation
In no event shall BlogHub, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation:
- Loss of profits
- Loss of data
- Loss of use
- Business interruption
- Personal injury or privacy violation

## Maximum Liability
Our total cumulative liability to you for all claims relating to our services shall not exceed the greater of:
- $100 USD, or
- The amount you have paid us in the past six months for services

## Exceptions
Some jurisdictions do not allow the exclusion of certain warranties or the limitation or exclusion of liability for incidental or consequential damages. Accordingly, some of the above limitations may not apply to you.

## Essential Purpose
You acknowledge and agree that these limitations of liability are fundamental elements of the basis of the bargain and we would not be able to provide the services on an economic basis without such limitations.`
    },
    {
      id: "governing-law",
      title: "Governing Law",
      icon: FaGavel,
      content: `These terms and your use of our services are governed by specific legal principles and jurisdictions.

## Applicable Law
These Terms shall be governed and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions.

## Dispute Resolution
Most disputes can be resolved without formal proceedings. If we cannot resolve a dispute informally, we agree to resolve any claims through binding arbitration or small claims court rather than in courts of general jurisdiction.

## Arbitration Agreement
You and BlogHub agree to resolve any disputes through final and binding arbitration, except that:
- You may assert claims in small claims court if they qualify
- Either party may bring suit in court to enjoin infringement of intellectual property rights

## Class Action Waiver
You may only resolve disputes with us on an individual basis and may not bring a claim as a plaintiff or class member in a class, consolidated, or representative action.

## International Users
If you are accessing our services from outside the United States, you agree to transfer and process your data in the United States, and you are responsible for compliance with local laws.`
    },
    {
      id: "changes",
      title: "Changes to Terms",
      icon: FaClock,
      content: `We may update these terms from time to time to reflect changes in our services or for legal reasons.

## Modification Rights
We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect.

## Notification Methods
We may notify you of changes through:
- Email to the address associated with your account
- A prominent notice on our platform
- A notification within your account dashboard
- Direct communication through our support system

## Your Acceptance
By continuing to access or use our services after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use our services.

## Review Responsibility
We encourage you to review the Terms periodically for any changes. The "Last Updated" date at the top of this page indicates when these Terms were last revised.`
    }
  ];

  const importantPoints = [
    {
      icon: FaHandshake,
      title: "Binding Agreement",
      description: "By using BlogHub, you agree to these terms and our privacy policy"
    },
    {
      icon: FaUserShield,
      title: "Content Responsibility",
      description: "You are responsible for all content you publish on the platform"
    },
    {
      icon: FaCopyright,
      title: "Rights Protection",
      description: "You retain ownership of your content while granting us necessary licenses"
    },
    {
      icon: FaBan,
      title: "Prohibited Content",
      description: "Certain types of content are strictly prohibited and may result in account termination"
    }
  ];

  const contactInfo = [
    {
      method: "Legal Inquiries",
      value: "legal@bloghub.com",
      description: "For formal legal notices and DMCA requests",
      icon: FaEnvelope
    },
    {
      method: "Content Issues",
      value: "content@bloghub.com",
      description: "For content removal requests and policy questions",
      icon: FaComments
    },
    {
      method: "General Support",
      value: "support@bloghub.com",
      description: "For account and technical support issues",
      icon: FaShieldAlt
    }
  ];

  const handleAcceptTerms = () => {
    setAccepted(true);
    localStorage.setItem('termsAccepted', 'true');
    // In a real app, you might want to make an API call here
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
            className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-amber-500/25"
          >
            <FaGavel className="text-3xl text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Last updated: December 2024 | Please read these terms carefully before using BlogHub.
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
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">Terms Sections</h3>
                <nav className="space-y-2">
                  {termsSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 ${
                        activeSection === section.id
                          ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200"
                      }`}
                    >
                      <section.icon className="text-sm flex-shrink-0" />
                      <span className="text-sm font-medium">{section.title}</span>
                    </button>
                  ))}
                </nav>

                {/* Quick Points */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">Key Points</h4>
                  <div className="space-y-3">
                    {importantPoints.map((point, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <point.icon className="text-amber-500 text-sm mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white text-sm">
                            {point.title}
                          </div>
                          <div className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                            {point.description}
                          </div>
                        </div>
                      </div>
                    ))}
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
                {/* Terms Content */}
                <div className="p-8">
                  {termsSections.map((section) => (
                    <div
                      key={section.id}
                      className={activeSection === section.id ? "block" : "hidden"}
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center">
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

                {/* Acceptance Section */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-8 bg-gray-50 dark:bg-gray-900/50">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                    <FaCheckCircle className="text-green-500" />
                    Terms Acceptance
                  </h3>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        id="accept-terms"
                        checked={accepted}
                        onChange={(e) => setAccepted(e.target.checked)}
                        className="mt-1 w-4 h-4 text-amber-500 bg-gray-100 border-gray-300 rounded focus:ring-amber-500 focus:ring-2"
                      />
                      <div>
                        <label htmlFor="accept-terms" className="font-semibold text-gray-900 dark:text-white cursor-pointer">
                          I have read and agree to the Terms of Service
                        </label>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                          By checking this box, you acknowledge that you have read, understood, and agree to be bound by all terms and conditions outlined in this agreement. You also agree to our Privacy Policy and any additional guidelines referenced herein.
                        </p>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: accepted ? 1.02 : 1 }}
                    whileTap={{ scale: accepted ? 0.98 : 1 }}
                    onClick={handleAcceptTerms}
                    disabled={!accepted}
                    className={`w-full py-4 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                      accepted
                        ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:shadow-lg cursor-pointer"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <FaCheckCircle />
                    {accepted ? "Accept Terms & Continue" : "Please Accept Terms to Continue"}
                  </motion.button>
                </div>

                {/* Contact Information */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {contactInfo.map((contact, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                        className="text-center p-6 bg-gray-50 dark:bg-gray-900/30 rounded-xl border border-gray-200 dark:border-gray-700"
                      >
                        <div className="w-12 h-12 mx-auto mb-4 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                          <contact.icon className="text-xl text-amber-600 dark:text-amber-400" />
                        </div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                          {contact.method}
                        </h4>
                        <p className="text-amber-600 dark:text-amber-400 font-semibold mb-2">
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

              {/* Important Notice */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6"
              >
                <div className="flex items-start gap-4">
                  <FaExclamationTriangle className="text-red-500 text-xl mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                      Legal Notice
                    </h4>
                    <p className="text-red-800 dark:text-red-200 text-sm">
                      These Terms of Service constitute a legally binding agreement between you and BlogHub. 
                      If you do not agree with any part of these terms, you must discontinue use of our services immediately. 
                      We recommend consulting with legal counsel if you have any questions about these terms.
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

export default TermsOfService;