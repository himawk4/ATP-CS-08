# ATP-CS-08
An offline-first emergency coordination hub enabling real-time disaster triage and resource tracking across ad-hoc local Wi-Fi subnets without internet access.


# Trinode — Offline-First Subnet Coordination Hub

**_An offline-first disaster response and emergency coordination platform. When the network fails, the application should not fail._**

Trinode is an installable Progressive Mobile App designed to help civilians, volunteers, emergency responders, and administrators coordinate during floods, cyclones, earthquakes, and other large-scale emergencies without relying on the internet. Utilizing local ad-hoc Wi-Fi subnets, Trinode caches crucial data and forms directly on the user’s device using an IndexedDB outbox. When emergency responders enter the local radio perimeter, the application automatically merges and syncs disaster-management data, ensuring ticket submission, safe zone tracking, and live triage board updates remain fully functional even in complete blackout zones.

## Contents

1. [Problem statement](#problem-statement)
2. [Features](#features)
3. [Demo / simulation mode](#demo--simulation-mode)
4. [Deployment](#deployment)
5. [Project structure](#project-structure)
6. [Future improvements](#future-improvements)

Further documentation: [Architecture](docs/ARCHITECTURE.md) · [Database & ER diagram](docs/DATABASE_DESIGN.md) · [REST API](docs/API.md)

## Problem Statement

During severe disasters in Sri Lanka—such as monsoon floods, landslides, and cyclones—power grids and cellular infrastructure frequently fail at the exact moment coordination is needed most. This creates total communication blackouts where cloud-dependent emergency platforms, social media, and standard messaging apps become completely unusable.

When connectivity collapses, first responders and relief coordinators are forced to fall back on congested voice radios and manual paper logs. This results in fragmented incident reporting, duplicate rescue dispatches, delayed triage, and missed distress calls from trapped civilians. Furthermore, many existing emergency tools operate exclusively in English or require complex pre-configuration, creating a major accessibility barrier for local communities during high-stress crises.

**Trinode** addresses this gap by providing a zero-cloud, offline-first mobile application built in both **Sinhala and English**. By queueing emergency tickets locally on the user's device and automatically synchronizing them over ad-hoc local Wi-Fi subnets whenever a responder node enters range, Trinode ensures fast, reliable, and inclusive disaster coordination—even when the internet is completely gone.

## Features

### 1) For Civilians
Trinode enables affected individuals to request emergency assistance without cellular service or an internet connection. Through a lightweight captive portal accessible in both **Sinhala and English**, civilians can submit distress tickets, report hazards, and access offline safety guidance or shelter locations directly from their mobile browser—no app store download required. Every submission is saved locally in an IndexedDB outbox and automatically transmitted the moment a rescue node comes within local Wi-Fi range.

### 2) For Volunteers
Field volunteers can log on-the-ground observations, verify civilian reports, and update incident statuses even while moving through total blackout zones. Using the app's offline-first sync engine and custom background retry loops, volunteer devices act as reliable field terminals that quietly queue updates and flush them to the local server once reconnected, preventing lost field reports during fast-moving operations.

### 3) For Emergency Responders
Responders and dispatch coordinators receive incoming distress tickets on a real-time, WebSocket-powered triage dashboard. Tickets are automatically deduplicated using client-generated UUIDs, allowing teams to filter emergencies by severity, track shelter capacities, assign rescue units, and update dispatch statuses (Pending, In Progress, Resolved) with zero cloud dependency.

### 4) For Administrators
Base camp administrators and disaster management leads have full control over local node operations and cross-camp synchronization. Administrators can manage responder roles, monitor local SQLite database integrity, and use Trinode’s **Data-Mule** export/import tool (JSON/CSV) to physically merge incident records between disconnected base camps, ensuring a unified operational picture across the entire disaster zone.
