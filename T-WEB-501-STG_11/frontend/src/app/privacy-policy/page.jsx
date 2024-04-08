"use client";
import "JQ/styles/legals.css";
import Layout from "JQ/components/Layout";
import Title from "JQ/components/Title";

export default function Home() {
  return (
    <Layout>
      <Title content="Privacy policy" />
      <div className="legals">
        <p>
          This Privacy Policy describes how your personal information is
          collected, used, and shared when you visit or make a purchase from our
          website.
        </p>

        <h2>1. Information We Collect</h2>
        <p>
          We collect information that you provide directly to us. This may
          include your name, email address, phone number, resume, and other
          information you provide when creating an account or applying for jobs.
        </p>

        <h2>2. How We Use Your Information</h2>
        <p>
          We use the information we collect to provide and improve our services.
          This includes communicating with you, processing your job
          applications, and enhancing user experience.
        </p>

        <h2>3. Sharing Your Information</h2>
        <p>
          We may share your information with employers and other users on our
          platform for the purpose of job applications. We do not sell your
          personal information to third parties.
        </p>

        <h2>4. Data Retention</h2>
        <p>
          We retain your information for as long as necessary to provide our
          services and comply with our legal obligations.
        </p>

        <h2>5. Changes to Policy</h2>
        <p>
          We reserve the right to modify this Privacy Policy at any time.
          Changes will be effective upon posting on the site. It is your
          responsibility to regularly check the Privacy Policy for updates.
        </p>

        <h2>6. Contact Us</h2>
        <p>
          For more information about our privacy practices, or if you have
          questions, please contact us by email at{" "}
          <a href="mailto:jobquest.epitech@gmail.com">
            jobquest.epitech@gmail.com
          </a>
          .
        </p>
      </div>
    </Layout>
  );
}
