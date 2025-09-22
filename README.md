# 🗳️ Online Voting System API

A **Node.js + Express** based REST API for managing a **secure online voting system**.  
This system includes **Admin** and **User** modules, enabling **NID management, party management, user registration, voting, and result generation**.

---

## 🚀 Features
- **Admin Panel**
  - Register and login as an Admin
  - Add and manage NID records
  - Add and manage political parties
  - Secure authentication with middleware
- **User Panel**
  - Register and login as a user
  - Verify NID for registration
  - Vote for candidates by position
  - View available parties and election results
- **Voting System**
  - One vote per user per position
  - Secure and authenticated voting
- **Authentication**
  - JWT-based authentication for Admin and Users

---

## 🛠️ Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Token)
- **Other:** bcrypt, cors, dotenv, etc.

---
## 🛠️ Admin Route
| Method | Endpoint              | Description          | Auth Required |
| ------ | --------------------- | -------------------- | ------------- |
| POST   | `/admin/registration` | Register a new admin | ❌             |
| POST   | `/admin/verify`       | Verify admin account | ❌             |
| POST   | `/admin/login`        | Admin login          | ❌             |
| POST   | `/admin/logout`       | Admin logout         | ✅             |
| POST   | `/admin/add-nid`      | Add new NID record   | ✅             |
| GET    | `/admin/read-nid`     | Get all NID records  | ✅             |
| POST   | `/admin/add-party`    | Add new party        | ✅             |
| GET    | `/admin/read-party`   | Get all parties      | ✅             |


## 🛠️ User Route
| Method | Endpoint                          | Description                 | Auth Required |
| ------ | --------------------------------- | --------------------------- | ------------- |
| POST   | `/user/registration`              | Register new user           | ❌             |
| POST   | `/user/login`                     | User login                  | ❌             |
| POST   | `/user/logout`                    | User logout                 | ✅             |
| POST   | `/user/register-nid`              | Register user with NID      | ❌             |
| GET    | `/user/listByPosition/:position`  | Get parties by position     | ✅             |
| GET    | `/user/read-party`                | Get all parties             | ✅             |
| POST   | `/user/submit-vote/:id/:position` | Submit vote for a candidate | ✅             |
| GET    | `/user/get-result`                | Get voting results          | ❌             |
| GET    | `/user/getAvailableParty`         | Get available parties list  | ❌             |

