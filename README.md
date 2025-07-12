# Skill Swap Platform  
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)  

A community-based mini-application where users can exchange skills, fostering a peer-to-peer learning environment without any monetary transactions.  

This project is a submission for the Odoo Hackathon (July 2025).  

---

### 🎥 **Video Presentation**  
[Link to Video Presentation on Google Drive] *(<- Add your final video link here)*  

---

### 📋 **Table of Contents**  
1. [Problem Statement](#-problem-statement)  
2. [Our Solution](#-our-solution)  
3. [Core Features](#-core-features)  
4. [UI/UX Design & Wireframes](#-uiux-design--wireframes)  
5. [Tech Stack](#-tech-stack)  
6. [System Architecture & Database Design](#-system-architecture--database-design)  
7. [Getting Started](#-getting-started)  
8. [Our Team](#-our-team)  

---

### 🎯 **Problem Statement**  
The goal is to develop a "Skill Swap Platform," a mini-application that enables users to list skills they can teach and request skills they wish to learn in return. The platform should facilitate a non-monetary, community-driven exchange of knowledge, complete with user profiles, a search and discovery function, a robust swap request system, and administrative oversight to ensure platform integrity.  

---

### 💡 **Our Solution**  
The Skill Swap Platform is designed to connect individuals eager to learn with those willing to teach. By removing financial barriers, we foster a genuine community where the primary currency is knowledge and time.  

**Why This Matters:**  
* **Promotes Community Learning:** Creates a collaborative, non-commercial space for personal growth.  
* **Fills a P2P Gap:** Replaces currency with a direct value-for-value exchange (skill for skill).  
* **Highly Scalable:** The concept can be easily extended for internal use in educational institutions or for corporate upskilling programs.  

---

### ✨ **Core Features**

#### 👤 User & Profile Management  
* [ ] **User Authentication:** Secure sign-up and login.  
* [ ] **User Profile:** Manage basic info including Name, Location (optional), and Profile Photo (optional).  
* [ ] **Profile Privacy:** Ability to toggle profile between `Public` and `Private`.  
* [ ] **Skill Management:** Easily add/update/remove skills offered and skills wanted.  
* [ ] **Availability:** Set and display availability (e.g., weekends, evenings) to coordinate swaps.  

#### 🔄 Swap System  
* [ ] **Search & Discover:** Browse or search for other users by the specific skills they offer (e.g., "Python", "Singing", "Photoshop").  
* [ ] **Send Swap Request:** Initiate a swap offer with another user.  
* [ ] **Manage Requests:** Accept or reject incoming swap offers.  
* [ ] **Request Retraction:** Ability to delete a sent swap request if it has not been accepted yet.  
* [ ] **Swap History:** View `Pending`, `Current` (accepted), and `Completed` swaps.  
* [ ] **Rating & Feedback System:** Provide feedback and a rating after a swap is completed to build trust and reputation.  

#### 🛡️ Admin Role & Platform Integrity  
* [ ] **Content Moderation:** Reject inappropriate or spammy skill descriptions.  
* [ ] **User Management:** Ban users who violate platform policies.  
* [ ] **Swap Monitoring:** Monitor the status of all swaps on the platform (pending, accepted, cancelled).  
* [ ] **Platform Announcements:** Send platform-wide messages (e.g., feature updates, downtime alerts).  
* [ ] **Reporting:** Download reports of user activity, feedback logs, and swap stats.  

*(Note: Checkboxes `[ ]` can be changed to `[x]` as features are completed.)*  

---

### 🎨 **UI/UX Design & Wireframes**  
Our design philosophy focuses on creating a clean, intuitive, and responsive user experience. We prioritized ease of use to ensure users can find, request, and manage skill swaps effortlessly.  

* **Responsive Design:** The UI is designed to be fully responsive, providing a seamless experience on both desktop and mobile devices.  
* **Key UI Elements:**  
    * **Pagination:** Implemented on the main discovery/search page to handle a large number of users efficiently.  
    * **Breadcrumbs:** Used for easy navigation, especially within user profiles and swap history sections.  
    * **Search & Filtering:** A prominent search bar allows for quick filtering of users by skills.  
    * **Clear Visual Hierarchy:** We use a consistent color scheme and font combination to ensure readability and highlight key actions (like "Send Swap" or "Accept").  

The wireframes submitted illustrate the core user flow, from signing up to managing swap requests.  

---

### 💻 **Tech Stack**  

This project is built using the MERN stack and other modern web technologies to create a fast, scalable, and real-time application.  

| Category             | Technology / Library                             |  
|----------------------|--------------------------------------------------|  
| **Frontend**         | React.js                                         |  
| **Backend**          | Node.js, Express.js                              |  
| **Database**         | MongoDB (with Mongoose ODM)                      |  
| **State Management** | Redux Toolkit                                    |  
| **Styling**          | Tailwind CSS                                     |  
| **Authentication**   | JSON Web Tokens (JWT)                            |  
| **Real-time Engine** | Socket.IO                                        |  
| **Deployment**       | Vercel (Frontend), Render / Heroku (Backend)     |  

---

### 🏗️ **System Architecture & Database Design**  

To meet the hackathon's criteria, our architecture emphasizes reusability, performance, and robust data handling.  

#### Coding Standards & Best Practices  
* **Code Reusability:** Modular, component-based architecture.  
* **Data Validation:** Client-side and server-side validation.  
* **Performance:** State management and caching; optimized assets.  
* **Error Handling:** Graceful error fallback with messages.  
* **Linting:** Enforced code style using ESLint / Prettier.  

#### Database Schema (MongoDB)  

**`Users` Collection**  
```json
{
  "_id": "ObjectId",
  "name": "String",
  "email": "String",
  "password_hash": "String",
  "profile_photo": "String",
  "location": "String",
  "availability": "String",
  "is_private": "Boolean",
  "role": "String",
  "skills_offered": ["ObjectId"],
  "skills_wanted": ["ObjectId"],
  "created_at": "Date"
}
```  

**`Skills` Collection**  
```json
{
  "_id": "ObjectId",
  "name": "String"
}
```  

**`Swaps` Collection**  
```json
{
  "_id": "ObjectId",
  "requester_id": "ObjectId",
  "responder_id": "ObjectId",
  "requester_skill_id": "ObjectId",
  "responder_skill_id": "ObjectId",
  "status": "String",
  "created_at": "Date"
}
```  

**`Ratings` Collection**  
```json
{
  "_id": "ObjectId",
  "swap_id": "ObjectId",
  "rating_by_user": "ObjectId",
  "rating_for_user": "ObjectId",
  "rating_value": "Number",
  "feedback_text": "String",
  "created_at": "Date"
}
```  

---

### 🚀 **Getting Started**  

To get a local copy up and running, follow these simple steps.  

#### Prerequisites  
* Node.js (v18.x or later)  
* npm / yarn  
* Git  
* MongoDB (local or MongoDB Atlas)  

#### Installation  

1. **Clone the repository:**  
    ```sh
    git clone https://github.com/SugamSharma03/SkillSwap.git
    cd SkillSwap
    ```

2. **Set up Backend:**  
    ```sh
    cd server
    npm install
    cp .env.example .env
    npm start
    ```

3. **Set up Frontend:**  
    ```sh
    cd ../client
    npm install
    npm start
    ```

---

### 👨‍💻 **Our Team**  
This project was built by a dedicated team of collaborators.  

| Member Name          | GitHub Profile                                       |  
|----------------------|------------------------------------------------------|  
| **Sugam Sharma (Leader)** | [SugamSharma03](https://github.com/SugamSharma03) |  
| **Mann**             | [Mann275](https://github.com/Mann275)               |  
| **Rahul Choudhary**  | [RahulChoudhary04](https://github.com/RahulChoudhary04) |  
| **Sumit**            | [Sumitscript](https://github.com/Sumitscript)       |  
| *Collaborator*       | [hami-odoo](https://github.com/hami-odoo)           |  
