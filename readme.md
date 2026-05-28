# 🚢 Shipping Logistics Management System

## 📌 Overview

The **Shipping Logistics Management System** is a full-stack application designed for managing logistics operations within a single shipping company. It enables administrators to assign cargo to ships and allows captains to manage and track shipments from source to destination with real-time route updates.

---

## 🎯 Features

### 👨‍💼 Admin

* Create and manage ships
* Assign cargo to ships and captains
* Monitor all shipments and their statuses
* Track shipment routes and progress

### 🧑‍✈️ Captain

* View assigned shipments
* Update cargo status (Picked, In Transit, Delivered)
* Add route updates at different checkpoints
* Track journey progress

---

## 📦 Core Modules

### 🚢 Ship Management

* Manage ship details (name, capacity, assigned captain)
* Track availability and status

### 📦 Cargo Management

* Define cargo type and weight
* Set source and destination ports

### 🔄 Shipment Management

* Assign cargo to ships and captains
* Track shipment lifecycle:

  * Assigned
  * Picked
  * In Transit
  * Delivered

### 📍 Route Tracking

* Record multiple checkpoints during transit
* Store:

  * Location (port name or coordinates)
  * Timestamp
  * Status notes

---

## 🗂️ Database Design

### Ship

* Id
* Name
* Capacity
* CaptainId

### Captain

* Id
* Name
* Email

### Cargo

* Id
* Type
* Weight
* Source
* Destination

### Shipment

* Id
* ShipId
* CargoId
* Status
* StartDate
* EndDate

### RouteUpdate

* Id
* ShipmentId
* Location
* Timestamp
* Notes

---

## ⚙️ Tech Stack

* **Backend:** ASP.NET Core Web API (C#)
* **ORM:** Entity Framework Core
* **Database:** SQL Server
* **Authentication:** JWT (JSON Web Token)
* **Real-Time (Optional):** SignalR

---

## 🚀 Future Enhancements

* 🌍 Map integration (Google Maps / OpenLayers)
* 🌦️ Weather API integration for route alerts
* 📊 Dashboard analytics for shipments
* 🔔 Real-time notifications using SignalR
* 🤖 AI-based delay prediction

---

## 📅 Development Plan

### Phase 1

* Project setup
* Database design
* Basic models and relationships

### Phase 2

* CRUD APIs for Ship, Cargo, Shipment

### Phase 3

* Authentication and role management

### Phase 4

* Route tracking and status updates

### Phase 5

* Advanced features (real-time tracking, APIs)

---

## 💡 Project Goal

To simulate a real-world shipping logistics system that demonstrates:

* Scalable backend architecture
* Secure API design
* Complex relational data handling
* Real-time tracking capabilities

---

## 🧠 Learning Outcomes

* ASP.NET Core Web API development
* Entity Framework Core and database design
* Authentication and authorization (JWT)
* Designing enterprise-level systems
* Building real-world logistics workflows

---

## 📌 Author

Developed as a enterprise web app to demonstrate backend engineering and system design skills using .NET technologies.
