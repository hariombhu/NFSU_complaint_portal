# Admin Login Quick Fix Guide

## ✅ Database Seeded Successfully!

I've run the seeder script to create the admin user and sample data.

## 🔐 Admin Login Steps:

### 1. Open Your Browser
Go to: **http://localhost:3000**

### 2. Login with Admin Credentials

```
Email:    admin@nfsu.ac.in
Password: admin123
```

### 3. Make Sure Both Servers Are Running

Check that you have TWO terminals running:

**Terminal 1 - Backend:**
```
cd d:\hackone\nfsu-complaint-portal\server
npm run dev
```
Should show: `Server running on port 5000`

**Terminal 2 - Frontend:**
```
cd d:\hackone\nfsu-complaint-portal\client
npm run dev
```
Should show: `Local: http://localhost:3000/`

## 🐛 If Login Still Doesn't Work:

### Check for Errors:

1. **Open Browser Console (F12)**
   - Go to Console tab
   - Try logging in
   - Share any red error messages you see

2. **Check Backend Terminal**
   - Look for any errors when you try to login
   - Share the error if you see one

3. **Verify MongoDB is Running**
   - Open MongoDB Compass
   - Connect to `mongodb://localhost:27017`
   - Check if `nfsu_complaint_portal` database exists
   - Check if `users` collection has the admin user

## 📋 Other Test Accounts:

**Department (Canteen):**
- Email: `canteen@nfsu.ac.in`
- Password: `canteen123`

**Student:**
- Email: `rahul.sharma@nfsu.ac.in`
- Password: `student123`

---

## 🔄 If You Need to Re-seed:

```powershell
cd d:\hackone\nfsu-complaint-portal\server
node seeders/seed.js
```

This will clear all data and recreate the admin and sample users.
