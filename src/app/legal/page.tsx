import React from 'react';

const LegalPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Legal Information</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Disclaimer</h2>
        <p className="mb-4">
          TriageFlow Care is intended to support medical staff purposes only. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
        </p>
        <p>
          Reliance on any information provided by this app is solely at your own risk. The developers and providers of TriageFlow Care disclaim any liability for any damages or adverse outcomes resulting from the use of this app.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Privacy Policy</h2>
        <p className="mb-4">
          We are committed to protecting your privacy. Any personal data collected through TriageFlow Care will be handled in accordance with applicable data protection laws.
        </p>
        <p className="mb-4">
          We collect only the minimum necessary information to provide the services and do not share your data with third parties without your consent, except as required by law.
        </p>
        <p>
          We implement appropriate technical and organizational measures to safeguard your data against unauthorized access, alteration, disclosure, or destruction.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, the developers and providers of TriageFlow Care shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising out of your use of the app.
        </p>
      </section>
    </div>
  );
};

export default LegalPage;
