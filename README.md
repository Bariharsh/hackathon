# 📦 CoreInv - Premium Inventory & Logistics Management

<div align="center">
  <img src="images/index.png" alt="CoreInv Banner" />
</div>

> **CoreInv** is a modern, real-time, ERP-grade inventory management system built for speed, accuracy, and accountability.

CoreInv solves the problem of messy, inaccurate stock tracking by utilizing a strict immutable ledger system, real-time dashboard KPIs, and professional logistics workflows—all wrapped in a premium, high-performance user interface.

---

## 🚀 The Problem It Solves
Small to medium enterprises (SMEs) often rely on spreadsheets or clunky, outdated software to track their inventory. This leads to negative stock balances, lost items, and a complete lack of operational accountability. 

**CoreInv** introduces enterprise-level strictness (Draft ➔ Waiting ➔ Ready ➔ Done workflows) wrapped in a beautiful, lightning-fast, modern web experience. You cannot ship what you don't have, and every single movement is permanently audited.

---

## ✨ Key Features

* 📊 **Real-Time Command Dashboard:** Instant insights into pending receipts, outbound deliveries, and a live activity feed of warehouse operations.
* 📦 **Master Product Catalog:** Manage SKUs, categories, units of measure (UoM), and low-stock reorder levels with dynamic search and filtering.
* 🚚 **Strict Logistics Workflow:** Delivery and Receipt orders go through a logical, fail-safe flow:
    * **Draft:** Order is created.
    * **Waiting:** System checks stock; alerts if physical inventory is unavailable.
    * **Ready:** Stock is physically checked, confirmed, and reserved.
    * **Done:** Validated, shipped, and safely deducted from the ledger.
* ⚖️ **Stock Adjustments:** Easily handle manual warehouse cycle counts to correct discrepancies with automated math.
* 🔐 **Immutable Audit Trail (Move History):** Stock isn't just an integer that gets blindly updated. Every movement generates a strict `StockLedger` entry with timestamps, direction (IN/OUT), and resulting balances. 
* ⚡ **High-Performance Architecture:** Sub-millisecond data retrieval and automatic state invalidation upon stock movements.

---

## 🛠️ Tech Stack

**Frontend:**
* **Framework:** Next.js 16 (App Router / Turbopack)
* **State Management:** Zustand (Real-time store synchronization)
* **Styling:** Tailwind CSS + custom fade-in animations
* **Icons & UI:** Lucide React

**Backend:**
* **API:** Next.js Route Handlers (RESTful)
* **Database:** MongoDB & Mongoose 
* **Data Integrity:** ACID Transactions via Mongoose Sessions
* **Authentication:** JWT (JSON Web Tokens)

---

## 📸 Screenshots & Demo

👉 **[Watch the CoreInv Demo Video Here]([https://youtube.com/...](https://drive.google.com/file/d/1UxRZisrmPTTmoX7BigNIviWCJdmVwJQV/view))** *(Replace with your link)*

| Dashboard Overview | Move History (Immutable Ledger) |
| :---: | :---: |
| *<img src="images/dashboard.png" width="400"/>* | *<img src="images/move-history.png" width="400"/>* |
| **Delivery Workflow Validation** | **New Product Creation** |
| *<img src="images/delivery-workflow.png" width="400"/>* | *<img src="images/product.png" width="400"/>* |

---

## 🧠 Architectural Highlights (For Judges)

* **ACID Transactions:** Validating a receipt or delivery triggers a Mongoose Session Transaction. This ensures that the `StockBalance` is updated and the `StockLedger` entry is created *simultaneously*. If one fails, both roll back, completely preventing "ghost" inventory.
* **Separation of Concerns:** The system separates the current snapshot (`StockBalance`) from the historical log (`StockLedger`), allowing for lightning-fast dashboard queries while maintaining a heavy, detailed audit trail.
* **Optimistic UI & Cache Management:** The frontend uses Zustand to immediately reflect state changes while the backend processes the ledger updates, ensuring a snappy, zero-lag user experience.

---

## ⚙️ Getting Started

Follow these steps to run CoreInv locally on your machine.

### Prerequisites
* Node.js (v18 or higher)
* MongoDB Atlas account (or local MongoDB instance)

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Bariharsh/hackathon.git](https://github.com/Bariharsh/hackathon.git)
   cd hackathon

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory with the following variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   REDIS_URL=your_redis_connection_string
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email_user
   EMAIL_PASS=your_email_pass
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the app:**
   Open [http://localhost:3000](http://localhost:3000) in your browser to access the CoreInv dashboard.
