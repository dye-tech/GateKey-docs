---
sidebar_position: 9
title: Just-In-Time Access
description: Configure and manage time-limited access requests
---

# Just-In-Time (JIT) Access

GateKey's JIT access system provides temporary, approval-based access to resources. Instead of granting permanent access, users request access for a specific duration, admins approve, and access automatically revokes when the time expires.

## How It Works

1. **User requests access** — browses available resources and submits a request with justification and duration
2. **Admin reviews** — sees the request in the approval queue with requester info and justification
3. **Admin approves/denies** — optionally adds a note
4. **Access granted** — user immediately gains access to the resource
5. **Auto-revocation** — a background job (60-second interval) revokes expired grants

## User Portal

Navigate to **Access Requests** in the sidebar to:

- **Browse resources** you don't currently have access to (access rules, proxy apps, mesh hubs)
- **Submit requests** with a justification and duration (15 minutes to 8 hours)
- **View active grants** with countdown timers showing time remaining
- **Track request history** with status badges (pending, approved, denied, expired)

## Admin Approval

Navigate to **Identity & Access > JIT Access** to:

### Pending Tab
Review and process access requests. Each request shows the requester, resource, justification, and requested duration. Approve or deny with an optional note.

### Active Grants Tab
View all currently active JIT grants with countdown timers. Manually revoke grants if needed.

### History Tab
Full request history across all statuses.

### Policies Tab
Create policies that control JIT request behavior per resource:

| Setting | Description |
|---------|-------------|
| **Resource Type** | Target: specific resource, all of a type, or global wildcard (`*`) |
| **Max Duration** | Maximum allowed request duration (default: 480 min) |
| **Default Duration** | Pre-filled duration for new requests (default: 60 min) |
| **Request Expiry** | How long before unanswered requests auto-expire (default: 60 min) |
| **Auto-Approve** | Skip approval queue — grants created immediately |
| **Require Justification** | Whether users must provide a reason |

Policy priority: exact resource match > resource type wildcard > global wildcard (`*`).

### Analytics Tab
Dashboard showing:
- Total, approved, denied, expired request counts
- Approval rate percentage
- Average grant duration
- Requests by resource type
- Top requesters (last 30 days)

## Webhook Notifications

Configure Slack or Teams notifications in the **Settings** tab:

1. **Webhook URL** — paste your Slack incoming webhook or Teams webhook URL
2. **Enable** — toggle notifications on
3. **App URL** — your GateKey base URL (e.g., `https://gatekey.example.com`) for approval links

Notifications are sent for:
- New access requests (with requester, resource, justification, and approval link)
- Approved requests (with approver and expiry time)
- Denied requests (with approver and reason)

## API Endpoints

### User Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/jit/resources` | Browse requestable resources |
| POST | `/api/v1/jit/requests` | Create access request |
| GET | `/api/v1/jit/requests` | List my requests |
| POST | `/api/v1/jit/requests/:id/cancel` | Cancel pending request |
| GET | `/api/v1/jit/grants` | List my active grants |

### Admin Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/admin/jit/requests` | List all requests |
| POST | `/api/v1/admin/jit/requests/:id/approve` | Approve request |
| POST | `/api/v1/admin/jit/requests/:id/deny` | Deny request |
| POST | `/api/v1/admin/jit/grants/:id/revoke` | Revoke grant |
| GET | `/api/v1/admin/jit/stats` | Basic stats |
| GET | `/api/v1/admin/jit/stats/detailed` | Detailed analytics |
| GET/POST/PUT/DELETE | `/api/v1/admin/jit/policies` | Policy CRUD |
