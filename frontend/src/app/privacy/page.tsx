// src/app/privacy/page.tsx — the website's privacy policy

import type { Metadata } from "next";
import Link from "next/link";
import "./privacy.css";

export const metadata: Metadata = {
  title: "Privacy Policy | Leaders International College",
  description:
    "How Leaders International College collects, uses and protects personal data on leadersintcollege.com.",
};

const UPDATED = "12 November 2026";

const sections = [
  { id: "who-we-are", title: "Who we are" },
  { id: "what-we-collect", title: "What we collect" },
  { id: "how-we-use", title: "How we use it" },
  { id: "sharing", title: "Who we share it with" },
  { id: "cookies", title: "Cookies and tracking" },
  { id: "keeping", title: "How long we keep it" },
  { id: "children", title: "Children's information" },
  { id: "security", title: "How we protect it" },
  { id: "rights", title: "Your rights" },
  { id: "changes", title: "Changes to this policy" },
  { id: "contact", title: "Contact us" },
];

export default function PrivacyPage() {
  return (
    <main className="main">
      {/* Page Title */}
      <div
        className="page-title dark-background"
        style={{
          backgroundImage: "url(/assets/img/education/Background_school.JPG)",
        }}
      >
        <div className="container position-relative">
          <h1>Privacy Policy</h1>
          <p>
            How we collect, use and protect the information you share with us
            on this website.
          </p>
          <nav className="breadcrumbs">
            <ol>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li className="current">Privacy Policy</li>
            </ol>
          </nav>
        </div>
      </div>
      {/* End Page Title */}

      <section className="section lic-privacy">
        <div className="container">
          <div className="lic-privacy-card">
            <p className="lic-privacy-updated">Last updated: {UPDATED}</p>

            <p className="lic-privacy-lead">
              Leaders International College respects the privacy of the
              families, students, job applicants and visitors who use our
              website. This policy explains what personal information we
              collect through leadersintcollege.com, why we collect it, and the
              choices you have.
            </p>

            <nav className="lic-privacy-toc" aria-label="On this page">
              <strong>On this page</strong>
              <ol>
                {sections.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`}>{s.title}</a>
                  </li>
                ))}
              </ol>
            </nav>

            <h2 id="who-we-are">1. Who we are</h2>
            <p>
              This website is run by Leaders International College (Leaders
              College for Educational Services), off 90th Road, Fifth
              Settlement, New Cairo, Egypt. We are responsible for the personal
              information you give us through this website. We handle it in
              line with Egypt&apos;s Personal Data Protection Law (Law No. 151
              of 2020).
            </p>

            <h2 id="what-we-collect">2. What we collect</h2>
            <p>We only collect what you choose to give us, and basic information about how the website is used:</p>
            <ul>
              <li>
                <strong>Admission applications:</strong> the student&apos;s
                name, date of birth, gender, nationality, the grade applied
                for, current school, second language and siblings at the
                college; each parent&apos;s name, phone number, email and
                occupation; marital status; how you heard about us; and any
                documents you upload.
              </li>
              <li>
                <strong>Assessment booking and payment:</strong> your
                application code and the date and time you choose. The
                assessment fee is paid on Paymob&apos;s secure payment page. We
                never see or store your card details; we only receive the
                payment result and its reference.
              </li>
              <li>
                <strong>Campus tour requests:</strong> the student&apos;s name,
                your email and phone number, the grade you are interested in
                and the time you choose.
              </li>
              <li>
                <strong>Contact form:</strong> your name, email, phone number,
                who you are (student, parent, alumni, staff or other), the
                grade (if any), the subject and your message.
              </li>
              <li>
                <strong>Job and internship applications:</strong> your name and
                contact details, education and experience, CV, cover letter and
                anything else you include.
              </li>
              <li>
                <strong>Website use:</strong> the pages you visit and some of
                the buttons you use (for example &ldquo;Apply Now&rdquo;),
                together with technical details such as your browser, device
                and IP address. This is collected through cookies and similar
                tools; see <a href="#cookies">Cookies and tracking</a>.
              </li>
            </ul>

            <h2 id="how-we-use">3. How we use it</h2>
            <ul>
              <li>To review applications and arrange assessments, interviews and campus tours.</li>
              <li>
                To contact you about your application, booking or enquiry by
                email, phone or WhatsApp.
              </li>
              <li>To take the assessment fee and confirm your booking.</li>
              <li>To answer your questions and messages.</li>
              <li>To consider job and internship applications.</li>
              <li>
                To understand how our website is used, improve it, and measure
                and improve our advertising (for example on Facebook, Instagram
                and Google).
              </li>
              <li>To meet our legal obligations.</li>
            </ul>
            <p>
              We use your information because you gave it to us for these
              purposes, to take the steps you asked for (such as an application
              or a booking), and where the law requires it.{" "}
              <strong>We do not sell your personal information.</strong>
            </p>

            <h2 id="sharing">4. Who we share it with</h2>
            <p>
              We share personal information only with service providers that
              help us run the website and our admissions, and only as much as
              they need:
            </p>
            <ul>
              <li>website hosting and database providers;</li>
              <li>email delivery services, for confirmations and replies;</li>
              <li>WhatsApp (Meta), when we message you about a booking;</li>
              <li>Paymob, to process payments;</li>
              <li>
                Meta (Facebook, Instagram) and Google, for website statistics
                and advertising measurement (see{" "}
                <a href="#cookies">Cookies and tracking</a>).
              </li>
            </ul>
            <p>
              Some of these providers store data on servers outside Egypt,
              including in the European Union and the United States. We may
              also share information with authorities when the law requires
              it.
            </p>

            <h2 id="cookies">5. Cookies and tracking</h2>
            <p>
              Cookies are small files saved by your browser. Our website uses:
            </p>
            <ul>
              <li>
                <strong>Meta Pixel</strong> (Facebook and Instagram): records
                visits and actions such as applying or booking an assessment,
                so we can measure and improve our ads. Meta may link this with
                your Meta account under its own privacy policy. You can manage
                the ads you see in your{" "}
                <a href="https://www.facebook.com/adpreferences" target="_blank" rel="noopener noreferrer">
                  Facebook ad preferences
                </a>
                .
              </li>
              <li>
                <strong>Google Analytics</strong> (when enabled): shows us how
                visitors use the website. You can opt out with Google&apos;s{" "}
                <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
                  opt-out browser add-on
                </a>
                .
              </li>
              <li>
                <strong>Google Maps</strong>, shown on our Contact page, which
                may set its own cookies.
              </li>
            </ul>
            <p>
              You can block or delete cookies in your browser settings at any
              time. The website will still work.
            </p>

            <h2 id="keeping">6. How long we keep it</h2>
            <p>
              We keep application and booking information for as long as it is
              needed for admission and, for enrolled students, as part of the
              school record. Job applications are kept for recruitment. When
              information is no longer needed we delete it or make it
              anonymous, unless the law requires us to keep it longer.
              Statistics collected by Meta and Google are kept according to
              their own settings.
            </p>

            <h2 id="children">7. Children&apos;s information</h2>
            <p>
              Information about students is given to us by their parents or
              guardians, and we use it only for admission and school purposes.
              Our application, booking and job forms are meant to be filled in
              by parents, guardians and adult applicants, not by children.
            </p>

            <h2 id="security">8. How we protect it</h2>
            <p>
              The website uses an encrypted (HTTPS) connection, access to
              submitted information is limited to authorised college staff,
              and payments are handled by Paymob on its own secure page. No
              website can be completely secure, but we take reasonable steps to
              protect your information.
            </p>

            <h2 id="rights">9. Your rights</h2>
            <p>You can ask us to:</p>
            <ul>
              <li>tell you what personal information we hold about you and give you a copy;</li>
              <li>correct information that is wrong or incomplete;</li>
              <li>delete your information, where we don&apos;t have to keep it;</li>
              <li>withdraw a consent you gave, or stop using your information for advertising.</li>
            </ul>
            <p>
              To do any of this, email{" "}
              <a href="mailto:info@leadersintcollege.com">info@leadersintcollege.com</a>.
              We may ask you to confirm who you are before we act on a request.
            </p>

            <h2 id="changes">10. Changes to this policy</h2>
            <p>
              We may update this policy from time to time. The date at the top
              shows when it last changed.
            </p>

            <h2 id="contact">11. Contact us</h2>
            <ul className="lic-privacy-contact">
              <li>
                General and privacy questions:{" "}
                <a href="mailto:info@leadersintcollege.com">info@leadersintcollege.com</a>
              </li>
              <li>
                Admissions:{" "}
                <a href="mailto:admission@leadersintcollege.com">admission@leadersintcollege.com</a>
                , <a href="tel:+20226410641">02 26410641</a>
              </li>
              <li>
                Jobs and internships:{" "}
                <a href="mailto:careers@leadersintcollege.com">careers@leadersintcollege.com</a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
