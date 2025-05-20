import React, { useState, useEffect } from 'react';

const SiteCookies = () => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (error) => {
      console.warn('Resource loading error:', error);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Unable to load some resources</h2>
            <p className="text-gray-600 mb-4">
              Some resources were blocked by your browser settings. This may affect the functionality of certain features.
            </p>
            <p className="text-gray-600">
              Please check your browser settings or disable any ad blockers if you want to access all features.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Cookie Policy</h1>
        
        <div className="space-y-6 text-gray-600">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">1. What Are Cookies</h2>
            <p className="mb-4">
              Cookies are small text files that are placed on your computer or mobile device when you visit our website. They are widely used to make websites work more efficiently and provide a better user experience.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">2. How We Use Cookies</h2>
            <p className="mb-4">We use cookies for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Essential cookies: Required for the website to function properly</li>
              <li>Authentication cookies: To keep you logged in</li>
              <li>Preference cookies: To remember your settings and preferences</li>
              <li>Analytics cookies: To understand how visitors use our website</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">3. Types of Cookies We Use</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700">Session Cookies</h3>
                <p className="mb-2">Temporary cookies that expire when you close your browser.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Persistent Cookies</h3>
                <p className="mb-2">Cookies that remain on your device for a set period of time.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Third-Party Cookies</h3>
                <p className="mb-2">Cookies placed by third-party services we use, such as analytics providers.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">4. Managing Cookies</h2>
            <p className="mb-4">
              Most web browsers allow you to control cookies through their settings preferences. However, limiting cookies may impact your experience using our website.
            </p>
            <p className="mb-4">To manage cookies, you can:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Delete cookies from your browser</li>
              <li>Block cookies from being set</li>
              <li>Set your browser to notify you when you receive a cookie</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">5. Cookie Consent</h2>
            <p className="mb-4">
              When you first visit our website, you will be asked to consent to the use of cookies. You can choose to accept all cookies, reject non-essential cookies, or customize your preferences.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">6. Updates to This Policy</h2>
            <p className="mb-4">
              We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">7. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about our Cookie Policy, please contact us at:
            </p>
            <p className="text-blue-600">cookies@nawaschool.com</p>
          </section>

          <section>
            <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SiteCookies; 