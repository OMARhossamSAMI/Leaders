// "use client";

// import { useEffect, useState } from "react";
// import { useTabs } from "../components/TabsContext";
// import Link from "next/link";
// import "./page.css";
// import Image from "next/image";

// // Tighten field typing to avoid `any`
// type FieldType =
//   | "text"
//   | "email"
//   | "number"
//   | "date"
//   | "radio"
//   | "select"
//   | "tel"
//   | "url"
//   | "file"
//   | "textarea"
//   | "checkbox";

// interface FormField {
//   field_name: string;
//   order: number;
//   name: string;
//   label?: string;
//   type: FieldType;
//   required?: boolean;
//   options?: string[];
//   placeholder?: string;
// }

// export default function AdmissionsPage() {
//   const { activeSection, setActiveSection } = useTabs();
//   const [fields, setFields] = useState<FormField[]>([]);

//   // Single preloader effect (deduped)
//   useEffect(() => {
//     const preloader = document.getElementById("preloader");
//     if (!preloader) return;
//     const timer = window.setTimeout(() => {
//       preloader.style.display = "none";
//     }, 15);
//     return () => window.clearTimeout(timer);
//   }, []);

//   // Fetch dynamic form fields with proper typing
//   useEffect(() => {
//     const fetchFields = async () => {
//       try {
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/form-fields`
//         );
//         if (!res.ok) throw new Error(`HTTP ${res.status}`);
//         const data: unknown = await res.json();

//         // Basic runtime shape check to keep TS happy without `any`
//         if (!Array.isArray(data)) throw new Error("Invalid response shape");
//         const typed = (data as unknown[]).filter((x): x is FormField => {
//           // minimal guards
//           return (
//             typeof (x as any)?.field_name === "string" &&
//             typeof (x as any)?.type === "string"
//           );
//         });
//         setFields(typed);
//       } catch (error) {
//         console.error("Failed to fetch form fields", error);
//       }
//     };

//     fetchFields();
//   }, []);

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     const form = e.currentTarget;
//     const formData = new FormData(form);

//     // FormDataEntryValue = string | File
//     const data: Record<string, FormDataEntryValue> = {};
//     formData.forEach((value, key) => {
//       data[key] = value;
//     });

//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/applications`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           // If your backend expects raw fields inside `data`, this is correct.
//           // If it expects multipart for files, switch to FormData and remove the JSON header.
//           body: JSON.stringify(data),
//         }
//       );

//       const result: { message?: string } = await response.json();

//       if (response.ok) {
//         alert(result.message || "Application submitted successfully!");
//         form.reset();
//       } else {
//         alert("❌ Error: " + (result.message || "Submission failed."));
//       }
//     } catch (error) {
//       console.error("Submission Error:", error);
//       alert("❌ An error occurred while submitting the form.");
//     }
//   };

//   return (
//     <>
//       <div>
//         <main className="main">
//           {/* Page Title */}
//           <div
//             className="page-title dark-background"
//             style={{
//               backgroundImage:
//                 "url(assets/img/education/Background_school.JPG)",
//             }}
//           >
//             <div className="container position-relative">
//               <h1>Admissions</h1>
//               <p>
//                 Start your journey at LIC—apply now to join a community that
//                 nurtures excellence, character, and global citizenship.
//               </p>
//               <nav className="breadcrumbs">
//                 <ol>
//                   <li>
//                     <Link href="/">Home</Link>
//                   </li>
//                   <li className="current">Admissions</li>
//                 </ol>
//               </nav>
//             </div>
//           </div>

//           {/* Buttons Styled Like Example */}
//           <div className="container mt-5 text-center">
//             <div className="btn-group">
//               <button
//                 className={`btn custom-tab ${
//                   activeSection === "apply" ? "active" : ""
//                 }`}
//                 onClick={() => setActiveSection("apply")}
//               >
//                 <i className="bi bi-pencil-square me-2"></i> How to Apply
//               </button>
//               <button
//                 className={`btn custom-tab ${
//                   activeSection === "form" ? "active" : ""
//                 }`}
//                 onClick={() => setActiveSection("form")}
//               >
//                 <i className="bi bi-file-earmark-text me-2"></i> Apply Now
//               </button>
//               <button
//                 className={`btn custom-tab ${
//                   activeSection === "requirements" ? "active" : ""
//                 }`}
//                 onClick={() => setActiveSection("requirements")}
//               >
//                 <i className="bi bi-people me-2"></i> Age Acceptance Guide
//               </button>
//               <button
//                 className={`btn custom-tab ${
//                   activeSection === "deadlines" ? "active" : ""
//                 }`}
//                 onClick={() => setActiveSection("deadlines")}
//               >
//                 <i className=" bi bi-camera-video me-2"></i> Virtual Tour
//               </button>
//             </div>
//           </div>

//           <section id="admissions" className="admissions section">
//             <div className="container" data-aos="fade-up" data-aos-delay={100}>
//               <div className="row gy-5 g-lg-5">
//                 {activeSection === "apply" && (
//                   <>
//                     <div className="col-lg-8">
//                       <div className="admissions-info">
//                         <h2>Begin Your Academic Journey Today</h2>
//                         <p>
//                           Please carefully provide the information requested
//                           below. Once submitted, our admissions team will review
//                           your application and contact you to arrange interviews
//                           for both the student and parents. We are here to
//                           answer all your questions and guide you through each
//                           step of the admissions process. We look forward to
//                           getting to know your family and exploring how LIC can
//                           support your child&apos;s educational journey.
//                         </p>
//                         <div className="admissions-steps mt-5">
//                           <h3>How to Apply</h3>
//                           <p>
//                             Applying at LIC is an exciting journey for your
//                             family, and we strive to make the admissions process
//                             as smooth as possible. Here are the steps
//                             you&apos;ll need to follow to apply to our school:
//                           </p>
//                           <div className="steps-wrapper mt-4">
//                             <div className="step-item">
//                               <div className="step-number">1</div>
//                               <div className="step-content">
//                                 <h4>Online Application</h4>
//                                 <p>
//                                   Start your application by clicking the Apply
//                                   Now button. You will need to fill out the
//                                   application form. This is your first step
//                                   toward becoming a part of our vibrant learning
//                                   community.
//                                 </p>
//                               </div>
//                             </div>
//                             <div className="step-item">
//                               <div className="step-number">2</div>
//                               <div className="step-content">
//                                 <h4>Child Assessment</h4>
//                                 <p>
//                                   Once your application is received, the
//                                   admission team will schedule an assessment for
//                                   your child to better understand their
//                                   educational needs and abilities.
//                                 </p>
//                                 <h6>Parents&apos; Interview</h6>
//                                 <p>
//                                   On the day of the assessment or at a time
//                                   convenient for you, we will conduct a
//                                   parents&apos; interview to learn more about
//                                   your expectations and how we can best support
//                                   your child.
//                                 </p>
//                               </div>
//                             </div>
//                             <div className="step-item">
//                               <div className="step-number">3</div>
//                               <div className="step-content">
//                                 <h4>Enrollment</h4>
//                                 <p>
//                                   Upon acceptance, you will receive an offer to
//                                   join LIC. To finalize enrollment, complete the
//                                   registration and paperwork—we’ll guide you
//                                   through it.
//                                 </p>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* RIGHT IMAGE COLUMN */}
//                     <div className="col-lg-4 d-flex align-items-center">
//                       <div
//                         style={{
//                           position: "relative",
//                           width: "100%",
//                           height: "500px",
//                         }}
//                       >
//                         <Image
//                           src="/assets/img/education/ApplyNowFINAL.JPG"
//                           alt="How to Apply"
//                           fill
//                           sizes="(max-width: 768px) 100vw, 33vw"
//                           style={{ objectFit: "cover" }}
//                           className="img-fluid"
//                         />
//                       </div>
//                     </div>
//                   </>
//                 )}

//                 {activeSection === "requirements" && (
//                   <div className="col-lg-12">
//                     <div className="admissions-requirements">
//                       <h3>Age Acceptance Guide</h3>

//                       <div className="requirements-list mt-4">
//                         <div className="requirement-item">
//                           <div className="icon-box">
//                             <i className="bi bi-people" />
//                           </div>
//                           <div>
//                             <p>
//                               Our Age Guide Chart shows the typical age ranges
//                               for each grade level at Leaders International
//                               College (PYP → MYP → DP).
//                             </p>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="requirements-image mb-4">
//                         <Image
//                           src="/assets/img/education/AGE.jpg"
//                           alt="Age Acceptance Guide"
//                           width={1200}
//                           height={800}
//                           style={{
//                             width: "100%",
//                             height: "auto",
//                             borderRadius: "8px",
//                             objectFit: "cover",
//                           }}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {activeSection === "deadlines" && (
//                   <div className="col-lg-12">
//                     <div className="deadlines">
//                       <div className="row mt-4">
//                         <div className="col-lg-6">
//                           <div className="deadline-item mb-4">
//                             <h4>Virtual Tour</h4>
//                             <p>
//                               Explore LIC from home! Walk through classrooms,
//                               labs, sports facilities, and more. If you need
//                               details about any area, our admissions team is
//                               ready to help.
//                             </p>
//                             <p>
//                               Experience our learning spaces, modern labs,
//                               creative studios, and welcoming common areas. See
//                               how students thrive academically and socially.
//                             </p>
//                             <p>
//                               Discover what makes LIC exceptional. When you’re
//                               ready to learn more or take the next step, we’re
//                               here to support you.
//                             </p>
//                           </div>
//                         </div>

//                         <div className="col-lg-6">
//                           <div className="deadline-item mb-4">
//                             <div className="intro-image-container">
//                               <div className="intro-image main-image">
//                                 <h4>Press And Visit</h4>
//                                 <Link
//                                   href="http://vrtour.leadersintcollege.com/"
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                 >
//                                   <Image
//                                     src="/assets/img/education/VrtualFinal.png"
//                                     alt="Main Campus"
//                                     width={600}
//                                     height={580}
//                                     className="img-fluid rounded"
//                                   />
//                                 </Link>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {activeSection === "form" && (
//                   <div className="col-lg-12">
//                     <div className="cta-wrapper mt-5">
//                       <div className="cta-item apply p-4 border rounded shadow-sm bg-light w-100">
//                         <i className="bi bi-file-earmark-check" />
//                         <h3>Ready to Apply?</h3>
//                         <p>
//                           Provide the requested information. Our team will
//                           review and contact you to arrange interviews for the
//                           student and parents.
//                         </p>
//                       </div>
//                     </div>

//                     <div className="form-wrapper mt-5">
//                       <div className="card w-100">
//                         <div className="card-body">
//                           <h3 className="card-title">
//                             Admission Application Form
//                           </h3>
//                           <p>
//                             Please complete the form below to apply for
//                             admission at LIC.
//                           </p>

//                           <form
//                             id="applicationForm"
//                             className="php-email-form mt-4"
//                             onSubmit={handleSubmit}
//                           >
//                             <h5>Applicant Details</h5>

//                             <div className="row">
//                               {[...fields]
//                                 .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
//                                 .map((field) => {
//                                   const key = field.field_name || field.name;
//                                   const label =
//                                     field.label ||
//                                     (field.field_name
//                                       ? field.field_name.replace(/_/g, " ")
//                                       : field.name);
//                                   const required = field.required ?? false;

//                                   if (
//                                     field.type === "radio" &&
//                                     field.options?.length
//                                   ) {
//                                     return (
//                                       <div className="col-md-6 mb-3" key={key}>
//                                         <label className="form-label d-block">
//                                           {label}
//                                         </label>
//                                         {field.options.map((opt) => (
//                                           <div
//                                             className="form-check form-check-inline"
//                                             key={opt}
//                                           >
//                                             <input
//                                               className="form-check-input"
//                                               type="radio"
//                                               name={field.field_name}
//                                               value={opt}
//                                               required={required}
//                                             />
//                                             <label className="form-check-label">
//                                               {opt}
//                                             </label>
//                                           </div>
//                                         ))}
//                                       </div>
//                                     );
//                                   }

//                                   if (
//                                     field.type === "select" &&
//                                     field.options?.length
//                                   ) {
//                                     return (
//                                       <div className="col-md-6 mb-3" key={key}>
//                                         <label className="form-label">
//                                           {label}
//                                         </label>
//                                         <select
//                                           name={field.field_name}
//                                           className="form-select"
//                                           required={required}
//                                           defaultValue=""
//                                         >
//                                           <option value="" disabled>
//                                             Select {label}
//                                           </option>
//                                           {field.options.map((opt) => (
//                                             <option key={opt} value={opt}>
//                                               {opt}
//                                             </option>
//                                           ))}
//                                         </select>
//                                       </div>
//                                     );
//                                   }

//                                   if (field.type === "date") {
//                                     return (
//                                       <div className="col-md-6 mb-3" key={key}>
//                                         <label className="form-label">
//                                           {label}
//                                         </label>
//                                         <input
//                                           type="date"
//                                           name={field.field_name}
//                                           className="form-control"
//                                           max={
//                                             new Date()
//                                               .toISOString()
//                                               .split("T")[0]
//                                           }
//                                           required={required}
//                                         />
//                                       </div>
//                                     );
//                                   }

//                                   // Default inputs
//                                   return (
//                                     <div className="col-md-6 mb-3" key={key}>
//                                       <label className="form-label">
//                                         {label}
//                                       </label>
//                                       <input
//                                         type={field.type}
//                                         name={field.field_name}
//                                         className="form-control"
//                                         placeholder={field.placeholder || label}
//                                         required={required}
//                                       />
//                                     </div>
//                                   );
//                                 })}
//                             </div>

//                             <div className="text-center mt-4">
//                               <button
//                                 type="submit"
//                                 className="btn-submit-application"
//                               >
//                                 <i className="bi bi-file-earmark-text" /> Submit
//                                 Application
//                               </button>
//                             </div>
//                           </form>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </section>
//         </main>
//       </div>

//       <style jsx>{`
//         .custom-tab {
//           border-radius: 50px;
//           padding: 10px 20px;
//           margin: 5px;
//           background: #fff;
//           border: 1px solid #ddd;
//           font-weight: 600;
//         }
//         .custom-tab.active {
//           background: #00b4e6;
//           color: #fff;
//           border: 1px solid #00b4e6;
//         }
//       `}</style>
//     </>
//   );
// }
