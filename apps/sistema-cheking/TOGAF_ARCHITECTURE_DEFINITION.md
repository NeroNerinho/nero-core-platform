# Architecture Definition Document (ADD)
**Project Name:** Central Checking OpusMúltipla (Checking 2.0)
**Framework:** The Open Group Architecture Framework (TOGAF) 9.2
**Document Version:** 1.0 (Enterprise Final)
**Date:** February 12, 2026
**Lead Architect:** Nero (Phillipe)
**Classification:** Internal / Confidential

---

## 1. Introduction

### 1.1 Purpose of this Document
This Architecture Definition Document (ADD) provides a comprehensive architectural overview of the Central Checking System. It fulfills the requirements of the TOGAF 9.2 Architecture Development Method (ADM) phases A through D, serving as the primary artifact for governing the solution's implementation and lifecycle.

### 1.2 Scope
The scope of this architecture includes:
*   **Business:** The entire workflow of media proof-of-performance receipt involves external suppliers (vendors) and internal media operations.
*   **Data:** The lifecycle of `PI` (Insertion Order) metadata and `Proof` (Evidence) binary assets.
*   **Application:** The front-end Single Page Application (SPA) and its integration with the n8n middleware.
*   **Technology:** The underlying serverless infrastructure and cloud storage services.

### 1.3 Stakeholders
*   **Media Directorate:** Sponsor. Concerned with billing velocity and audit compliance.
*   **Checking Dep.:** Primary Users. Concerned with operational efficiency and file organization.
*   **Suppliers:** External Users. Concerned with ease of use and mobile accessibility.
*   **IT/InfoSec:** Governance. Concerned with data sovereignty and security.

---

## 2. Architecture Vision

### 2.1 Summary
To transition OpusMúltipla's checking verification process from a decentralized, manual email-based workflow to a centralized, automated, and strictly validated digital platform.

### 2.2 Alignment with Organizational Goals
*   **Operational Excellence:** Eliminate 95% of manual file handling tasks (downloading, renaming, moving).
*   **Digital Transformation:** Replace legacy communication channels with structured API-driven interactions.
*   **Financial Integrity:** Ensure 100% of billable media is backed by audit-ready digital evidence.

---

## 3. Requirements

### 3.1 Functional Requirements (FR)
*   **FR-01:** The system must validate the "PI Number" against the ERP metadata database.
*   **FR-02:** The system must strictly block uploads for PIs with `Ok`, `Falha` (Failed), or `Com Problema` (Issue) statuses.
*   **FR-03:** The system must dynamically render upload fields based on the Media Type (e.g., Outdoor requires "Close" and "Far" photos per address).
*   **FR-04:** The system must support concurrent uploads of large binary files (up to 500MB).

### 3.2 Non-Functional Requirements (NFR)
*   **NFR-01 (Performance):** Time-to-Interactive (TTI) under 1 second on 4G networks.
*   **NFR-02 (Availability):** 99.5% uptime during business hours (08:00 - 19:00).
*   **NFR-03 (Security):** All external inputs must be sanitized client-side and server-side.
*   **NFR-04 (Usability):** No login credentials required for suppliers (Security via Obscurity + Metadata Validation).

### 3.3 Compliance Requirements
*   **LGPD (GDPR):** No Personally Identifiable Information (PII) of suppliers shall be stored beyond necessary interaction logs.

---

## 4. Operational Concept (Architecture Overview)

### 4.1 Architectural Patterns
*   **Micro-Frontend Consumer:** The front-end is a lightweight, decoupled consumer of the backend services.
*   **Serverless Orchestration:** Logic is handled by event-driven workflows (n8n) rather than monolithic servers.
*   **BFF (Backend for Frontend):** The Webhook acts as a specific API tailored for the UI's needs.

### 4.2 Key Decisions
*   **Decision 01:** Use **Vanilla JavaScript** instead of React/Vue.
    *   *Rationale:* Performance (zero-bundle overhead), simplicity for maintenance by non-specialists, and longevity of code.
*   **Decision 02:** Use **n8n** as the backend logic engine.
    *   *Rationale:* Agility in changing business rules (low-code) and native integration with Google Workspace.

---

## 5. Baseline Architecture (As-Is)

### 5.1 Current Business Process
1.  Vendor executes media.
2.  Vendor takes photos.
3.  Vendor emails photos to `checking@grupoom...`.
4.  Analyst receives email, downloads attachment.
5.  Analyst renames file to standard `PI_CLIENTE_DATA.jpg`.
6.  Analyst moves file to Network Drive.
7.  If file is wrong, Analyst emails Vendor back.

### 5.2 Technical Debt
*   **Data Silos:** Information trapped in individual email inboxes.
*   **Security Risk:** No validation of incoming file types via email.
*   **Process Latency:** Feedback loop takes 24-48 hours.

---

## 6. Target Architecture (To-Be)

### 6.1 Business Architecture
*   **Process:** Self-service portal where the vendor performs the data entry and validation.
*   **Validation:** Immediate "Reject" at the edge if criteria aren't met.
*   **Role Change:** Analysts become "Exception Managers" rather than "Data Entry Clerks".

### 6.2 Data Architecture
*   **Entities:**
    *   `InsertionOrder` (Source of Truth: ERP)
    *   `EvidencePackage` (Collection of validated files)
*   **Flow:**
    *   `Front-End` $\to$ `JSON Pipeline` $\to$ `n8n` $\to$ `Google BigQuery` (Immutable Log).

### 6.3 Application Architecture
*   **Client Node:** Browser running `index.html` + `script.js`.
    *   *Modules:* `Validator`, `OOH_Normalizer`, `HATEOAS_State_Manager`.
*   **Integration Node:** n8n Webhook Listener.
    *   *Workflows:* `Auth`, `Upload_Stream`, `Notification`.

### 6.4 Technology Architecture
*   **Infrastructure:** Cloud-Native.
*   **Hosting:** Static Web Hosting (Any Provider).
*   **Compute:** Containerized Node.js (n8n) on Linux.
*   **Storage:** Object Storage (Google Drive API).

---

## 7. Gap Analysis

| Domain | Baseline (As-Is) | Target (To-Be) | Gap | Priority |
| :--- | :--- | :--- | :--- | :--- |
| **UX** | Email Client | Dedicated Web Portal | Complete Re-engineering | High |
| **Validation** | Post-process (Manual) | Pre-process (Automated) | Automation | Critical |
| **Storage** | Local/Network Drive | Cloud Object Store | Migration | High |
| **Logic** | Human Consistency | Algorithmic Rules | Formalization | Medium |

---

## 8. Implementation Strategy

### 8.1 Work Packages (WP)
*   **WP1:** Interface Design & Core Logic (Complete).
*   **WP2:** Automated Validation Rules (Complete - "Strict Blocking").
*   **WP3:** Integration with BigQuery (Pending).
*   **WP4:** Legacy Data Migration (Not performable due to unstructured nature).

### 8.2 Transition Architecture
*   **Phase 1 (Pilot):** 10 Vendors (OOH only).
*   **Phase 2 (General Availability):** All Vendors. Email auto-reply enabled instructing use of Portal.

---

## 9. Risks and Mitigation

| Risk | Probability | Impact | Mitigation Strategy |
| :--- | :--- | :--- | :--- |
| **API Doubt** | Low | High | Vendors questioning if data was saved. -> **Solution:** Implementation of "Protocol Number" generation. |
| **Browser Compatibility** | Medium | Low | Use of Polyfills and ES6 transpilation targets. |
| **Webhook Overload** | Low | High | Implementation of Rate Limiting in the n8n Gateway. |

---

## 10. Architecture Governance

### 10.1 Review Boards
*   **Architecture Review Board (ARB):** Validated by Nero (Lead Architect).
*   **Change Control Board (CCB):** Media Operations Director.

### 10.2 Compliance
*   **Audit Trail:** Every upload attempt is logged in BigQuery with IP, Timestamp, and PI Number, ensuring full traceability.
*   **Code Quality:** The project adheres to the "Clean Code" principles within the constraints of a vanilla JS environment.

---

## 11. Conclusion

The standardizing of the Checking Process represents a significant leap in operational maturity for OpusMúltipla. The architecture defined herein uses modern, cost-effective technologies to solve a chronic legacy problem. The solution is scalable, secure, and ready for enterprise-wide deployment.

---

**Signed:**
*Nero (Phillipe)*
*Enterprise Architect*
