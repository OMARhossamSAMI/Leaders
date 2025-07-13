"use client";

import AdminHeader from "../../components/admin_header";
import Link from "next/link";
import "./page.css"; // Styling for the cards

const cards = [
  {
    title: "About Us",
    href: "/about",
    img: "/assets/img/education/WHO1.JPG",
    desc: "Learn about our vision, values, and what makes LIC unique.",
  },
  {
    title: "Campus",
    href: "/campus-facilities",
    img: "/assets/img/education/CampusH.JPG",
    desc: "Explore our academic, sports, and arts facilities.",
  },
  {
    title: "Admissions",
    href: "/admissions",
    img: "/assets/img/education/A1.jpeg",
    desc: "Everything you need to apply and join our school.",
  },
  {
    title: "Curriculum",
    href: "/curriculum",
    img: "/assets/img/education/A2.jpeg",
    desc: "Discover our PYP, MYP, DP, American Diploma, and IGCSE programs.",
  },
  {
    title: "Students Life",
    href: "/students-life",
    img: "/assets/img/education/A3.jpeg",
    desc: "From sports to clubs – a vibrant life outside the classroom.",
  },
  {
    title: "We Are Hiring",
    href: "/hiring",
    img: "/assets/img/education/CHESS1.png",
    desc: "Join our passionate team of educators and professionals.",
  },
];

export default function AdminITPage() {
  return (
    <>
      <AdminHeader />
      <main className="admin-it-main">
        <div className="container py-5">
          <h2 className="text-center mb-5 fw-bold">Quick Navigation</h2>
          <div className="row g-4">
            {cards.map((card, index) => (
              <div className="col-md-6 col-lg-4" key={index}>
                <Link href={card.href}>
                  <div className="large-card shadow-sm">
                    <img src={card.img} alt={card.title} className="large-card-img" />
                    <div className="large-card-body">
                      <h5 className="large-card-title">{card.title}</h5>
                      <p className="large-card-desc">{card.desc}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
