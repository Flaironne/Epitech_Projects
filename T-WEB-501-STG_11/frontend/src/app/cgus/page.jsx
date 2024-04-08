"use client";
import "JQ/styles/legals.css";
import Layout from "JQ/components/Layout";
import Title from "JQ/components/Title";

export default function Home() {
  let todayDate = new Date();

  return (
    <Layout>
      <Title content="Usage terms and conditions" />
      <div className="legals">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using this website, you agree to these Terms of
          Service. If you do not agree with any of these terms, please do not
          use this site.
        </p>

        <h2>2. User Accounts</h2>
        <p>
          You may need to create an account to access certain features of this
          site. You are responsible for maintaining the confidentiality of your
          account and password.
        </p>

        <h2>3. User Content</h2>
        <p>
          You are solely responsible for the content you post on the site.
          Content must not violate copyrights, trademarks, privacy rights, or
          other rights of third parties.
        </p>

        <h2>4. Site Usage</h2>
        <p>
          You agree to use the site in compliance with applicable laws and
          decency standards. We reserve the right to suspend or terminate your
          account for violation of these rules.
        </p>

        <h2>5. Responsibilities</h2>
        <p>
          We are not responsible for user interactions or job postings on the
          site. We do not guarantee the accuracy of information provided by
          employers.
        </p>

        <h2>6. Changes to Terms</h2>
        <p>
          We reserve the right to modify these Terms of Service at any time.
          Changes will be effective upon posting on the site. It is your
          responsibility to regularly check the Terms of Service for updates.
        </p>

        <h2>7. Governing Law</h2>
        <p>
          These Terms of Service are governed by the laws of your country of
          residence. Any dispute arising out of these terms shall be subject to
          the competent courts in your jurisdiction.
        </p>

        <p>
          Please read these Terms of Service carefully and understand them
          before using this site.
        </p>
      </div>
    </Layout>
  );
}
