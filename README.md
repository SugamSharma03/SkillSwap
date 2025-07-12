# Skill Swap Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A community-based mini-application where users can exchange skills, fostering a peer-to-peer learning environment without any monetary transactions.

This project is a submission for the Odoo Hackathon (July 2025).

---

### 🎥 **Video Presentation**

[Link to Video Presentation on Google Drive] *(<- Add your final video link here)*

---

### 📋 **Table of Contents**

1.  [Problem Statement](#-problem-statement)
2.  [Our Solution](#-our-solution)
3.  [Core Features](#-core-features)
4.  [UI/UX Design & Wireframes](#-uiux-design--wireframes)
5.  [Tech Stack](#-tech-stack)
6.  [System Architecture & Database Design](#-system-architecture--database-design)
7.  [Getting Started](#-getting-started)
8.  [Our Team](#-our-team)

---

### 🎯 **Problem Statement**

The goal is to develop a "Skill Swap Platform," a mini-application that enables users to list skills they can teach and request skills they wish to learn in return. The platform should facilitate a non-monetary, community-driven exchange of knowledge, complete with user profiles, a search and discovery function, a robust swap request system, and administrative oversight to ensure platform integrity.

---

### 💡 **Our Solution**

The Skill Swap Platform is designed to connect individuals eager to learn with those willing to teach. By removing financial barriers, we foster a genuine community where the primary currency is knowledge and time. Our application allows users to create a profile, showcase the skills they offer, and list the skills they are looking for. The core of the platform is the "swap" system, enabling users to directly propose and manage skill exchanges.

**Why This Matters:**
* **Promotes Community Learning:** Creates a collaborative, non-commercial space for personal growth.
* **Fills a P2P Gap:** Replaces currency with a direct value-for-value exchange (skill for skill).
* **Highly Scalable:** The concept can be easily extended for internal use in educational institutions or for corporate upskilling programs.

---

### ✨ **Core Features**

#### **👤 User & Profile Management**
* [ ] **User Authentication:** Secure sign-up and login.
* [ ] **User Profile:** Manage basic info including Name, Location (optional), and Profile Photo (optional).
* [ ] **Profile Privacy:** Ability to toggle profile between `Public` and `Private`.
* [ ] **Skill Management:** Easily add/update/remove skills offered and skills wanted.
* [ ] **Availability:** Set and display availability (e.g., weekends, evenings) to coordinate swaps.

#### **🔄 Swap System**
* [ ] **Search & Discover:** Browse or search for other users by the specific skills they offer (e.g., "Python", "Singing", "Photoshop").
* [ ] **Send Swap Request:** Initiate a swap offer with another user.
* [ ] **Manage Requests:** Accept or reject incoming swap offers.
* [ ] **Request Retraction:** Ability to delete a sent swap request if it has not been accepted yet.
* [ ] **Swap History:** View `Pending`, `Current` (accepted), and `Completed` swaps.
* [ ] **Rating & Feedback System:** Provide feedback and a rating after a swap is completed to build trust and reputation.

#### **🛡️ Admin Role & Platform Integrity**
* [ ] **Content Moderation:** Reject inappropriate or spammy skill descriptions.
* [ ] **User Management:** Ban users who violate platform policies.
* [ ] **Swap Monitoring:** Monitor the status of all swaps on the platform (pending, accepted, cancelled).
* [ ] **Platform Announcements:** Send platform-wide messages (e.g., feature updates, downtime alerts).
* [ ] **Reporting:** Download reports of user activity, feedback logs, and swap statistics.

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

*(This section should be filled out with your project's technologies)*

| Category      | Technology                                    |
|---------------|-----------------------------------------------|
| **Frontend** | `e.g., React, Vue.js, Angular, Svelte`        |
| **Backend** | `e.g., Node.js (Express), Python (Django), Go`|
| **Database** | `e.g., PostgreSQL, MongoDB, Firebase, Supabase` |
| **Real-time** | `e.g., WebSockets (Socket.io), Polling`       |
| **Deployment**| `e.g., Vercel, Netlify, AWS, Docker`            |

---

### 🏗️ **System Architecture & Database Design**

To meet the hackathon's criteria, our architecture emphasizes reusability, performance, and robust data handling.

#### **Coding Standards & Best Practices**
* **Code Reusability:** The application is built using a modular, component-based architecture to avoid repetition and improve maintainability.
* **Data Validation:** We implement strict validation on both the client-side (for immediate feedback) and server-side (for security and data integrity).
* **Performance:** Network calls are minimized through techniques like state management and caching. Images and assets are optimized for fast loading.
* **Error Handling:** The application gracefully handles invalid inputs and system errors, providing clear fallback messages to the user.
* **Linting:** A linter (e.g., ESLint, Prettier) is configured to enforce consistent coding standards across the entire codebase.

#### **Database Schema**

Our database schema is designed to be efficient and scalable, with clear relationships between data entities.

**`Users` Table**
| Column          | Data Type     | Constraints                | Description                                |
|-----------------|---------------|----------------------------|--------------------------------------------|
| `id`            | `UUID`        | `PRIMARY KEY`              | Unique identifier for the user.            |
| `name`          | `VARCHAR(255)`| `NOT NULL`                 | User's full name.                          |
| `email`         | `VARCHAR(255)`| `NOT NULL, UNIQUE`         | User's email for login.                    |
| `password_hash` | `VARCHAR(255)`| `NOT NULL`                 | Hashed user password.                      |
| `profile_photo` | `TEXT`        | `NULLABLE`                 | URL to the user's profile photo.           |
| `location`      | `VARCHAR(255)`| `NULLABLE`                 | User's location.                           |
| `availability`  | `VARCHAR(255)`| `NULLABLE`                 | e.g., "Weekends", "Evenings"               |
| `is_private`    | `BOOLEAN`     | `DEFAULT FALSE`            | If the user's profile is private.          |
| `role`          | `ENUM('user', 'admin')` | `DEFAULT 'user'` | User role for authorization.               |
| `created_at`    | `TIMESTAMP`   | `DEFAULT CURRENT_TIMESTAMP`| Timestamp of account creation.             |

**`Skills` Table**
| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `INTEGER` | `PRIMARY KEY, AUTOINCREMENT` | Unique identifier for a skill. |
| `name` | `VARCHAR(255)` | `NOT NULL, UNIQUE` | Name of the skill (e.g., "Python"). |

**`UserSkills` (Join Table)**
| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `user_id` | `UUID` | `FOREIGN KEY -> Users(id)` | Links to the user. |
| `skill_id`| `INTEGER` | `FOREIGN KEY -> Skills(id)` | Links to the skill. |
| `type` | `ENUM('OFFERED', 'WANTED')` | `NOT NULL` | Specifies if the user offers or wants the skill. |

**`Swaps` Table**
| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY` | Unique identifier for the swap request. |
| `requester_id` | `UUID` | `FOREIGN KEY -> Users(id)` | The user who initiated the swap. |
| `responder_id` | `UUID` | `FOREIGN KEY -> Users(id)` | The user who received the swap request. |
| `requester_skill_id` | `INTEGER`| `FOREIGN KEY -> Skills(id)`| The skill offered by the requester. |
| `responder_skill_id` | `INTEGER`| `FOREIGN KEY -> Skills(id)`| The skill requested from the responder. |
| `status` | `ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED')` | `DEFAULT 'PENDING'` | Current status of the swap. |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Timestamp of swap creation. |

**`Ratings` Table**
| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY` | Unique identifier for the rating. |
| `swap_id` | `UUID` | `FOREIGN KEY -> Swaps(id), UNIQUE` | The completed swap being rated. |
| `rating_by_user` | `UUID` | `FOREIGN KEY -> Users(id)` | The user giving the rating. |
| `rating_for_user`| `UUID` | `FOREIGN KEY -> Users(id)` | The user receiving the rating. |
| `rating_value`| `INTEGER` | `CHECK (1-5)` | The numeric rating. |
| `feedback_text`| `TEXT` | `NULLABLE` | Optional written feedback. |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Timestamp of rating submission. |

---

### 🚀 **Getting Started**

To get a local copy up and running, follow these simple steps.

#### **Prerequisites**
* Node.js (v18.x or later)
* npm / yarn
* Git

#### **Installation**
1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/](https://github.com/)[YourUsername]/[YourRepoName].git
    cd [YourRepoName]
    ```

2.  **Install Frontend Dependencies:**
    ```sh
    # Navigate to the frontend directory
    cd client
    npm install
    ```

3.  **Install Backend Dependencies:**
    ```sh
    # Navigate to the backend directory
    cd ../server
    npm install
    ```

4.  **Set up Environment Variables:**
    Create a `.env` file in the `server` directory and add the necessary environment variables (e.g., database connection string, JWT secret).
    ```
    DATABASE_URL="your_database_url"
    JWT_SECRET="your_jwt_secret"
    ```

5.  **Run the Application:**
    * **Run the Backend Server:**
        ```sh
        # From the 'server' directory
        npm start
        ```
    * **Run the Frontend Development Server:**
        ```sh
        # From the 'client' directory
        npm start
        ```

---

### 👨‍💻 **Our Team**

This project was built by a dedicated team of collaborators. All team members were actively involved in the coding and development process, demonstrating strong team collaboration.

| Member Name        | GitHub Profile                               |
|--------------------|----------------------------------------------|
| **Sugam Sharma (Leader)** | [SugamSharma03](https://github.com/SugamSharma03) |
| **Mann** | [Mann275](https://github.com/Mann275)           |
| **Rahul Choudhary**| [RahulChoudhary04](https://github.com/RahulChoudhary04) |
| **Sumit** | [Sumitscript](https://github.com/Sumitscript)     |
| *Collaborator* | [hami-odoo](https://github.com/hami-odoo)    |