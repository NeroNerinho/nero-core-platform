# Software Architecture Document (SAD)
**Project:** Central Checking OpusMúltipla
**Architecture Model:** Kruchten's 4+1 View Model
**Version:** 1.0
**Date:** February 12, 2026
**Lead Architect:** Nero (Phillipe)

---

## 1. Introduction
This document provides a comprehensive architectural overview of the Central Checking System, using a number of different architectural views to depict different aspects of the system. It is intended to capture and convey the significant architectural decisions which have been made on the system.

---

## 2. Logical View
The Logical View describes how the system's functionality is structured.

### 2.1 Overview
The system is designed as a **Single Page Application (SPA)** that interacts with a **Serverless Workflow Engine (Core API)**. The logic is decoupled into specific modules for validation, UI rendering, and data normalization.

### 2.2 Functional Decomposition
*   **Search Steering Layer:** Handles the asynchronous fetching of PI data and manages the search mode (PI vs. CNPJ).
*   **Validation Engine:** Implements the `Strict Blocking Logic`, evaluating the `status_checking` attribute from the backend and enforcing user access control.
*   **Media Factory:** Dynamically generates HTML components based on the `Meio` (Media Type) configuration.
*   **OOH Normalization Service:** A robust regex-based pipeline that cleans and structures raw address strings into actionable upload slots.

---

## 3. Process View
The Process View addresses the dynamic aspects of the system.

### 3.1 Data Acquisition Flow
1.  **Input Trigger:** User enters a PI number.
2.  **Debounce State:** JavaScript waits 500ms to minimize API thrashing.
3.  **Authentication/Validation Call:** Fetch request to Core API webhook with the PI payload.
4.  **Status Evaluation:** Front-end parses the response. If status is `Ok/Falha/Problem`, the process branches to the `Block State`.
5.  **Field Generation:** If valid, the `generateUploadFields` function constructs the DOM for specific media requirements.

### 3.2 Concurrency and Persistence
*   **Async/Await:** All network operations use modern asynchronous patterns to prevent UI blocking.
*   **XHR for Uploads:** Uses `XMLHttpRequest` instead of `fetch` to provide real-time progress bar feedback for large binary payloads.

---

## 4. Development View (Implementation View)
The Development View describes the organization of the actual software modules.

### 4.1 Code Organization
*   **Modular Vanilla JS:** The codebase avoids build-step complexity (no Webpack/Vite) to ensure maximum longevity and ease of audit.
*   **CSS Design System:** Built using CSS Custom Properties (Variables) for theming and a mobile-first responsive grid.
*   **Stateless Frontend:** The frontend maintains only the `currentPIStatus`, while all persistent state is handled by the Core API backend.

---

## 5. Physical View (Deployment View)
The Physical View describes the mapping of software onto hardware.

### 5.1 System Topology
*   **Client Node:** Any modern web browser (Edge, Chrome, Safari, Firefox).
*   **Network:** HTTPS/TLS 1.2+ encrypted tunnel.
*   **Integration Node:** Core API instance (SaaS or Private Cloud).
*   **Storage Nodes:** 
    *   **Object Storage:** Google Drive (Managed SaaS).
    *   **Data Warehouse:** Google BigQuery (Managed SaaS).

---

## 6. Scenarios (+1 View)
The Scenarios view illustrates the architecture with critical use cases.

### 6.1 Scenario: Blocked PI Submission
*   **Actor:** Vendor.
*   **Flow:** Vendor searches for an already confirmed PI.
*   **Outcome:** The system detects the `Ok` flag, disables the submit button, and replaces the upload area with a non-interactive "Checking Confirmado" card. *Validation: Ensures data integrity and prevents duplicate processing costs.*

### 6.2 Scenario: OOH Individual Address Upload
*   **Actor:** OOH Vendor.
*   **Flow:** Vendor searches for an Outdoor PI with 5 locations.
*   **Outcome:** The system iterates through the address list, creating 5 distinct cards, each requesting 1 "Close" and 1 "Far" photo. *Validation: Ensures compliance with the specific auditing requirements of Out-of-Home media.*

---

**End of Document**
