import { FC } from "react";

const PrivacyPolicy: FC = () => {
  return (
    <div className="bg-brown-02 text-brown-01 font-patrick">
      <div className="container mx-auto px-4 py-8 bg-pink-01">
        <h1 className="text-3xl font-bold text-center mb-6">Privacy Policy</h1>
        <p>Last updated: [Date of the last update]</p>
        <p>
          Thank you for visiting PalRock, operated by EQuest, located in
          Strasbourg, France. We are committed to protecting the privacy of all
          our visitors and customers.
        </p>
        <p>
          This Privacy Policy describes how your personal information is
          collected, used, and shared when you visit or make a purchase from
          https://www.palrock.com
        </p>
        <br />
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">Information Collected</h2>
        </section>
        <h3>Information You Provide Us:</h3>
        <ul className="list-disc pl-5 mb-6">
          <li>
            <strong>Personal Identifiers:</strong> Name, email address, postal
            address, telephone number.
          </li>
          <li>
            <strong>Payment Details:</strong> Credit card number, expiration
            date, and security code.
          </li>
        </ul>
        <h3>Information Collected Automatically:</h3>
        <ul className="list-disc pl-5 mb-6">
          <li>
            <strong>Connection and Navigation Data:</strong> IP address, browser
            information, time zone, and cookies installed on your device.
          </li>
          <li>
            <strong>Transaction Data:</strong> Details about the products and
            services you have purchased from us.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Use of Information</h2>
        <p>The information we collect allows us to:</p>
        <ul className="list-disc pl-5 mb-6">
          <li>Process your transactions and manage your orders.</li>
          <li>Communicate with you about our products and services.</li>
          <li>
            Improve and optimize our site (for example, by generating analytics
            about how our customers browse and interact with the site).
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          Sharing of Information
        </h2>
        <p>Your personal information may be shared with:</p>
        <ul className="list-disc pl-5 mb-6">
          <li>
            <strong>Our service providers:</strong> Such as payment processors
            and logistic services.
          </li>
          <li>
            <strong>Legal compliance and law enforcement requests:</strong> If
            necessary to respond to a legal requirement or government request.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Data Retention</h2>
        <p>
          We retain your personal information as long as necessary to provide
          our services and for the purposes outlined in this policy.
          Additionally, we retain and use your information as necessary to
          comply with our legal obligations, resolve disputes, and enforce our
          agreements.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Data Transfer</h2>
        <p>
          Your information may be transferred to, and maintained on, servers
          located outside of your country or jurisdiction, where the data
          protection laws may differ from those of your jurisdiction. By
          accepting this privacy policy, you consent to this transfer.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Security</h2>
        <p>
          The security of your personal information is important to us. We
          follow industry standards to protect the personal information
          submitted to us, both during transmission and once we receive it.
          However, no method of transmission over the Internet, or method of
          electronic storage, is 100% secure.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Your Rights</h2>
        <p>
          If you are a resident of the EU, you have the right to access the
          personal information we hold about you, to port it to a new service,
          and to ask that your personal information be corrected, updated, or
          erased. If you would like to exercise these rights, please contact us
          through the contact information below.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          Changes to this Privacy Policy
        </h2>
        <p>
          We may update this privacy policy from time to time in order to
          reflect, for example, changes to our practices or for other
          operational, legal, or regulatory reasons.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
        <p>
          For more information about our privacy practices, if you have
          questions, or if you would like to make a complaint, please contact us
          by e-mail at <strong>info@palrock.com</strong> or by mail using the
          details provided below:
        </p>
        <p>
          EQuest
          <br />
          Strasbourg
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
