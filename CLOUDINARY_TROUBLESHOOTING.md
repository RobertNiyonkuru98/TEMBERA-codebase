# Cloudinary Image Upload Troubleshooting Guide

## ✅ **Issue Fixed**

The upload endpoint URL has been corrected from `/upload/images` to `/api/upload/images`.

---

## 🔍 **Common Issues & Solutions**

### **1. 404 Error on `/upload/images`**

**Error:** `Failed to load resource: the server responded with a status of 404 (Not Found)`

**Solution:** ✅ **FIXED** - Updated the frontend to use the correct endpoint: `/api/upload/images`

---

### **2. Backend Server Not Running**

**Symptoms:**
- 404 errors on all API calls
- Network errors in browser console

**Solution:**
```bash
cd backend
npm run dev
```

Make sure you see:
```
Server is running on: http://localhost:3000/api
```

---

### **3. Missing Cloudinary Credentials**

**Symptoms:**
- Upload succeeds but images don't appear in Cloudinary
- Server errors about missing configuration

**Solution:**

1. Go to https://console.cloudinary.com/
2. Copy your credentials from the dashboard
3. Add them to `backend/.env`:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. Restart the backend server

---

### **4. Authentication Errors**

**Symptoms:**
- "Invalid token" or "Unauthorized" errors
- Upload fails even though backend is running

**Solution:**

Make sure you're logged in:
1. Check that you have a valid JWT token in localStorage
2. Try logging out and logging back in
3. Verify your `.env` has `JWT_SECRET` set

---

### **5. CORS Errors**

**Symptoms:**
- "CORS policy" errors in browser console
- Requests blocked by browser

**Solution:**

CORS is already enabled in the backend. If you still see errors:

1. Make sure backend is running on `http://localhost:3000`
2. Make sure frontend is running on `http://localhost:5173`
3. Clear browser cache and reload

---

### **6. File Size Too Large**

**Symptoms:**
- Upload fails with "File too large" error
- Some images upload, others fail

**Solution:**

Current limit is **10MB per image**. To change:

Edit `backend/src/controllers/UploadController.ts`:
```typescript
limits: {
  fileSize: 20 * 1024 * 1024, // Change to 20MB
},
```

---

### **7. Database Migration Not Applied**

**Symptoms:**
- Server errors about missing columns
- `image_url` or `public_id` not found

**Solution:**

```bash
cd backend
npx prisma migrate deploy
npx prisma generate
```

---

## 🧪 **Testing the Upload**

### **Quick Test**

1. **Start Backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test Upload:**
   - Go to Company Portal → Create Itinerary
   - Fill in required fields (title, date, price)
   - Drag and drop an image or click "Browse Files"
   - You should see the image preview
   - Click "Create Itinerary"
   - Check browser console for any errors

### **Manual API Test**

Test the upload endpoint directly:

```bash
# Get a valid token by logging in first, then:
curl -X POST http://localhost:3000/api/upload/images \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "images=@/path/to/test-image.jpg"
```

Expected response:
```json
{
  "message": "Images uploaded successfully",
  "images": [
    {
      "url": "https://res.cloudinary.com/...",
      "publicId": "tembera/itineraries/..."
    }
  ]
}
```

---

## 📋 **Checklist Before Testing**

- [ ] Backend server is running (`npm run dev` in backend folder)
- [ ] Frontend server is running (`npm run dev` in frontend folder)
- [ ] Database migration applied (`npx prisma migrate deploy`)
- [ ] Cloudinary credentials added to `backend/.env`
- [ ] JWT_SECRET set in `backend/.env`
- [ ] Logged in to the application with a company account
- [ ] Browser console open to see any errors

---

## 🔧 **Environment Variables Required**

### **Backend `.env`**
```env
DATABASE_URL="your_database_url"
PORT=3000
JWT_SECRET="your_secret_key"

CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

### **Frontend `.env` (Optional)**
```env
VITE_API_BASE_URL=http://localhost:3000
```

---

## 📞 **Still Having Issues?**

Check the browser console and backend logs for specific error messages. The updated code now logs detailed error information to help debug issues.

**Common error patterns:**

- `404` → Backend not running or wrong URL
- `401` → Not logged in or invalid token
- `400` → Missing Cloudinary credentials or invalid file
- `500` → Server error, check backend logs

---

**🎉 Your Cloudinary integration is ready! Just make sure the backend is running and credentials are set.**
