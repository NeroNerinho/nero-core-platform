# OpusMúltipla Central Checking Portal

> **Enterprise Architecture Status:** Verified & Audited 🟢
> **Compliance Standard:** TOGAF 9.2 / Nero Audit Certified

---

## 📖 Overview
The Central Checking Portal is a high-performance, zero-dependency web interface designed to automate the collection and validation of media proof-of-performance (Checking). By migrating from manual email-based workflows to a structured digital gateway, the platform ensures 100% data integrity and significantly accelerates the billing cycle.

---

## 🏛️ Documentation Suite
This project maintains a robust set of architectural and operational artifacts to satisfy enterprise governance requirements:

*   **[TOGAF Architecture Definition](./TOGAF_ARCHITECTURE_DEFINITION.md):** Full-scale Enterprise Architecture deliverable covering Business, Data, Application, and Technology domains.
*   **[Software Architecture Document (SAD)](./SOFTWARE_ARCHITECTURE_DOCUMENT.md):** Detailed technical blueprint using the **4+1 View Model** (Logical, Process, Physical, Development, Scenarios).
*   **[Compliance Audit Report](./COMPLIANCE_AUDIT_REPORT.md):** Formal security and logic audit certifying the "Strict Blocking" and "Edge Sanitization" mechanisms.
*   **[Supplier Submission Guide](./SUPPLIER_GUIDE.md):** Operational manual for external vendors and partners.

---

## 🚀 Key Technical Features

### 1. Strict Business Logic Enforcement
The system implements a "Strict Blocking" rule at the edge. Any PI (Insertion Order) with a finalized status (`Ok`, `Failed`, or `Issue`) is immediately locked. The UI replaces interactive upload fields with non-interactive status cards to prevent redundant or conflicting data entries.

### 2. Intelligent OOH Normalization
For Out-of-Home media (Outdoor, Frontlight), the system features a robust regex-driven pipeline that parses complex address strings and generates individual upload slots for contextual and proximal photography.

### 3. Progressive User Experience
*   **Zero-Dependency Core:** Written in pure Vanilla JS and CSS for maximum longevity and performance.
*   **Real-time Feedback:** Integrated XHR progress monitoring for large binary payloads (up to 500MB).
*   **Responsive Theming:** Native support for high-contrast dark mode with persistence.

---

## 🛠️ Maintenance & Development

### Adding Media Types
Media definitions are managed in the `MEDIA_TYPE_CONFIG` object within `script.js`. Each entry supports alias mapping and dynamic field generation counts.

### Execution Environment
The project is a static frontend. To run locally for testing purposes:
1. Open the project in VS Code.
2. Use the **Live Server** extension to host `index.html`.
3. The production environment targets the **n8n Webhook** for orchestration.

---

**Developed & Governed by:**
*Nero (Phillipe) - Lead Enterprise Architect*
*OpusMúltipla Technology Division*
