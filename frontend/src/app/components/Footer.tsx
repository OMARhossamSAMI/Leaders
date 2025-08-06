import Link from "next/link";
import "./Footer.css";

export default function Footer() {
  return (
    <footer
      id="footer"
      className="footer position-relative dark-background text-white"
    >
      <div className="container footer-top">
        <div className="row gy-4">
          {/* === Left: Info + Socials === */}
          <div className="col-lg-4 col-md-12 mb-4">
            <h4 className="sitename mb-3">Leaders International College</h4>
            <p>
              <i className="bi bi-geo-alt-fill me-2"></i>Campus: off 90th road,
              Fifth Settlement
            </p>
            <p>
              <i className="bi bi-clock-fill me-2"></i>Hours: Sunday–Thursday, 8
              AM – 3 PM
            </p>

            <div className="social-links d-flex gap-3 mt-3">
              <Link
                href="https://www.facebook.com/share/1RSZBCVMbK/?mibextid=wwXIfr"
                target="_blank"
              >
                <i className="bi bi-facebook"></i>
              </Link>
              <Link
                href="https://www.instagram.com/leadersintcollege?igsh=MXB1cDR1ZW8wOGo3bA=="
                target="_blank"
              >
                <i className="bi bi-instagram"></i>
              </Link>
              <Link
                href="https://www.linkedin.com/company/leaders-int-college/"
                target="_blank"
              >
                <i className="bi bi-linkedin"></i>
              </Link>
            </div>          
          </div>

          {/* === Departments === */}
          <div className="col-lg-8 col-md-12">
            <div className="row gy-3">
              <div className="col-12 col-sm-6 col-lg-4">
                <h5 className="mb-2">Admission Department</h5>
                <p>
                  <i className="bi bi-envelope me-2"></i>{" "}
                  admission@leadersintcollege.com
                </p>
                <p>
                  <i className="bi bi-telephone me-2"></i> 02 26410641
                </p>
              </div>
              
              <div className="col-12 col-sm-6 col-lg-4">
                <h5 className="mb-2">HR Department</h5>
                <p>
                  <i className="bi bi-envelope me-2"></i>{" "}
                  careers@leadersintcollege.com
                </p>
                <p>
                  <i className="bi bi-telephone me-2"></i> 02 26410050
                </p>
              </div>

              {/* <div className="col-12 col-sm-6 col-lg-4">
                <h5 className="mb-2">School Counselor</h5>
                <p><i className="bi bi-envelope me-2"></i> schoolcounselorpyp1_pyp@leadersintcollege.com</p>
                <p><i className="bi bi-envelope me-2"></i> cshoolcounselormyp_dp@leadersintcollege.com</p>
                <p><i className="bi bi-telephone me-2"></i> 02 26410003</p>
              </div>

              <div className="col-12 col-sm-6 col-lg-4">
                <h5 className="mb-2">Principal</h5>
                <p><i className="bi bi-envelope me-2"></i> Principal@leadersintcollege.com</p>
              </div>

              <div className="col-12 col-sm-6 col-lg-4">
                <h5 className="mb-2">Student Affairs</h5>
                <p><i className="bi bi-envelope me-2"></i> studentaffairs@leadersintcollege.com</p>
              </div> */}

              <div className="col-12 col-sm-6 col-lg-4">
                <h5 className="mb-2">For other inquiries</h5>
                <p>
                  <i className="bi bi-envelope me-2"></i>{" "}
                  info@leadersintcollege.com
                </p>
                <p>
                  <i className="bi bi-telephone me-2"></i> 01201117506
                </p>
                <p>
                  <i className="bi bi-telephone me-2"></i> 01201117509
                </p>
              </div>
              {/* 
              <div className="col-12 col-sm-6 col-lg-4">
                <h5 className="mb-2">IT Support</h5>
                <p>
                  <i className="bi bi-envelope me-2"></i>{" "}
                  itsupport@leadersintcollege.com
                </p>
              </div>

              <div className="col-12 col-sm-6 col-lg-4">
                <h5 className="mb-2">Accounting & Finance</h5>
                <p>
                  <i className="bi bi-envelope me-2"></i>{" "}
                  accountingOffice@leadersintcollege.com
                </p>
              </div> */}
            </div>
          </div>
        </div>

        {/* === Bottom Nav === */}
        <div className="footer-nav text-center mt-5">
          {[
            { label: "Home", path: "/" },
            { label: "About Us", path: "/about" },
            { label: "Admissions", path: "/admissions" },
            { label: "Curriculum", path: "/curriculum" },
            { label: "Students Life", path: "/students-life" },
            { label: "We Are Hiring", path: "/hiring" },
            { label: "Contact Us", path: "/contact" },
          ].map((item, idx, arr) => (
            <span key={item.label}>
              <Link href={item.path} className="footer-link">
                {item.label}
              </Link>
              {idx < arr.length - 1 && <span className="divider">|</span>}
            </span>
          ))}
        </div>

        <div className="text-center mt-3">
          <p>
            © Copyright <strong>Leaders International College</strong> All
            Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
