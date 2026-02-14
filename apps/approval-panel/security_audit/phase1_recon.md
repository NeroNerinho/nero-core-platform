# Phase 1: Reconnaissance and Asset Discovery Report

**Date:** 2026-02-04
**Auditor:** Senior Full-Stack Engineer
**Target:** Approval Panel (Frontend + N8N)

## 1.1 File System Analysis
- **Structure:** Standard React (Vite/Webpack) + TypeScript project.
- **Sensitive Data:**
  - `secrets_check.txt` found potential matches (review required).
  - Hardcoded API URL in `axios.ts`: `https://n8n.grupoom.com.br/webhook/painel-aprovacao` (Public but critical).
- **Tech Debt:** 
  - `TODO`s found across codebase (see `todos.txt`).
  - Auth logic contains mock fallback (`AuthContext.tsx` generates fake tokens).

## 1.2 N8N Workflow Inspection
- **Critical Configuration Gap:** All BigQuery nodes (`BigQuery - Get Stats`, etc.) are missing the `query` parameter in the `n8n_workflow_updated.json` export. **Action Required:** Must verify if these are parameterized in the live environment. Assuming they are completely missing or default.
- **Vulnerabilities:**
  1.  **Hardcoded Mock Login:** `Handle Login` node validation is: `if (email && password && password.length >= 6)`. **Severity: CRITICAL**.
  2.  **XSS Risk:** `Email - Rejection Notification` node constructs HTML using `${reason}` directly. **Severity: HIGH**.
  3.  **No SQL Injection Prevention:** Since queries are not visible, we must assume they are using string concatenation until proven otherwise (given the mock login quality).

## 1.3 API Surface Mapping
- **Base URL:** `https://n8n.grupoom.com.br/webhook/painel-aprovacao`
- **Authentication:** Bearer Token (JWT) expected, but Client generates fake token if missing.
- **Endpoints (Actions):**
  - `POST ?action=login`
  - `POST ?action=get_stats`
  - `POST ?action=get_pending`
  - `POST ?action=approve`
  - `POST ?action=reject`
  - `POST ?action=health_check`
- **Methods:** `POST` used for all operations (RPC style). `OPTIONS` for CORS.

## Recommendation for Phase 2
- Immediate remediation of `AuthContext` to remove fake token generation.
- Audit dependencies for high-risk vulnerabilities.
