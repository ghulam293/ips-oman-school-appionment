# IPS Oman School Connect

A responsive React + Vite prototype for arranging parent meetings with the IPS Oman school team.

**Live demo:** https://ips-oman-school-appionment.vercel.app/

## Run locally

1. Install Node.js 20+.
2. Open this folder in VS Code.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open the localhost URL shown in your terminal. Use browser mobile device mode or a phone on the same local network.

## Deploy on Vercel

1. Push this project to a GitHub repository.
2. In Vercel, choose **Add New → Project**, connect GitHub, and import the repository.
3. Keep the detected Vite settings: build command `npm run build`, output directory `dist`.
4. Select **Deploy**. Vercel will publish a public URL and redeploy when changes are pushed to the connected branch.

The included `vercel.json` declares the Vite build settings. No environment variables are required for this frontend demo.

## Verify a production build

Run `npm run build`. The static site output is written to `dist/`.

## Demo features

- Responsive parent dashboard, appointment list, and mobile bottom navigation
- IPS Oman school crest, refined navy/teal/gold theme, and English/Arabic toggle
- Numbered appointment directory in the requested order: School Administrator, HR, Principal, Teachers, Admissions, Wellbeing, Finance, and Reception
- Teacher meetings are locked until School Administrator access is granted in the demo settings
- Book staff appointments: teacher, principal, admissions, counseling, finance
- Choose child, date, available sample session, meeting format, reason, and notes
- Prevent duplicate staff/time bookings using pending and confirmed appointments saved in this browser
- Appointment details, status, rescheduling, cancellation
- Staff-role preview: approve or decline pending requests
- Receptionist-role preview: mark confirmed appointment as completed (check-in simulation)
- LocalStorage persistence and demo reset

## Important limitations

This is a **frontend prototype only**. Appointments, demo roles, and the teacher-access setting are stored locally in each visitor's browser and are not real school data. Visitors do not share appointments or administrator permissions with each other across devices. The numbered staff list and teacher-access switch demonstrate the requested flow; they are not secure authorization because users can switch demo roles in the browser. The availability check only compares appointments saved in the current browser; dates and slots are illustrative and are not checked against the school's real schedule. No real identity verification, authorization, server-side conflict prevention, notification delivery, visitor verification, or online meeting link generation is implemented. Before production, connect to a secure Laravel/PHP API, enforce server-side authorization and guardian-child relationships, validate real availability and conflicts, and add audit logs, holidays, notifications, and accessible translated content. Do not enter real student personal information into this prototype.

The initial sample appointments use October 2026 dates; adjust them for later demonstrations.
