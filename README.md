# TapRide – Digital Wallet and Bus Management System

TapRide is a Progressive Web Application (PWA) designed to provide a digital wallet and QR-based bus ticketing solution for private bus transportation in Sri Lanka.

The system aims to reduce dependency on cash-based ticketing while supporting digital payments, QR-based journey management, offline transaction handling, fleet management, and reporting.

## Project

**Project Name:** TapRide – Digital Wallet and Bus Management System

**Course:** EER4189 – Software Design in Group

**Institution:** The Open University of Sri Lanka (OUSL)

**Project Type:** Group Software Engineering Project

## Main Objectives

- Provide a digital stored-value wallet for passengers.
- Support QR-based bus entry and exit.
- Support maximum-fare holding and fare reconciliation.
- Provide offline transaction storage and synchronization.
- Support conductor-assisted passenger scanning.
- Provide bus, crew, and fleet management functionality.
- Provide transaction and operational reporting.
- Improve fare transparency and reduce cash dependency.

## Main User Roles

- Passenger
- Conductor
- Driver
- Bus Owner
- Administrator

## Main Features

### Passenger
- Registration and authentication
- Digital wallet
- Wallet top-up
- QR journey entry and exit
- Journey status
- Transaction history
- Digital receipts

### Conductor
- Passenger QR scanning
- Journey assistance
- Offline transaction handling

### Bus Owner
- Bus and fleet management
- Crew management
- Operational information

### Administrator
- User management
- Fleet management
- Route and fare management
- Reports and system administration

## Technology Stack

### Frontend
- React
- TypeScript
- Progressive Web App (PWA)
- Redux / Zustand
- HTML5 / CSS3

### Backend
- Python
- FastAPI
- REST API

### Database
- PostgreSQL

### Offline Support
- IndexedDB
- Local storage
- Offline transaction queue and synchronization

### Development & Design Tools
- Git
- GitHub
- Jira
- Figma
- Visual Studio Code
- Postman

## System Architecture

TapRide follows a client-server architecture.

```text
Passenger / Conductor / Admin
            |
            v
      React PWA Frontend
            |
            v
       FastAPI Backend
            |
            v
       PostgreSQL DB
