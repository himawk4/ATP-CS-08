# Trinode (ATP Group CS-08)

Trinode is our ATP group project. It is an offline-first web app for coordinating help during disasters like floods, landslides and cyclones, when the internet and mobile network are not working.

The app runs on a local Wi-Fi network (a Raspberry Pi at the relief camp). People connect to the Wi-Fi, the app opens in their browser, and they can send a help request. If they are out of range, the request is saved on the phone and sent later when they come back into range.

This repo has the project website, which shows the idea, features, wireframes and team.

## Problem

In Sri Lanka, floods and landslides often knock out power and mobile towers. When that happens, apps and websites that need the internet stop working, and responders end up relying on radios and paper notes. This leads to missed or duplicate requests and slow responses.

Many existing tools are also only in English or need setup beforehand, which makes them hard to use for local communities in an emergency.

Trinode tries to solve this by working without the internet, in both Sinhala and English, and without needing an app install.

## Features

### Residents
- Send a help request (rescue, medical, food, water, shelter) from the phone browser without an account
- Requests are saved in IndexedDB on the phone if there is no connection and sent automatically later
- See the status of their request and find shelters with free space

### Volunteers
- Get simple tasks from the coordinator and mark them as done
- Updates are queued offline and sent when the phone reconnects

### Rescue teams / coordinators
- Live triage board (WebSockets) showing incoming requests
- Duplicate requests are detected using UUIDs created on the phone
- Filter by urgency, assign teams, update status (Pending, In Progress, Resolved) and track shelter space

### Admins
- Manage user roles and check the local SQLite database
- Export / import data as JSON or CSV to move records between camps that are not connected ("data mule")

## Running the website

It is a static site (HTML, CSS and JavaScript), so you can just open `index.html` in a browser, or run a local server:

```
npx serve .
```

## Team

- Mulani Methara - Frontend
- Himansha Dias - Full stack
- Sesadi Hewamadduma - UI/UX
- Chanka Nethmi - Backend
- Dithira Abhiman - QA / DevOps

Informatics Institute of Technology, in collaboration with the University of Westminster.
