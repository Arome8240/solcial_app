# Comment Likes Troubleshooting Guide

## Issue: Comment likes not working

### Checklist:

1. **Backend Deployed?**
   - ✅ Code is pushed to GitHub (commit: fcdc9c7)
   - ❓ Is Render deployed with latest changes?
   - Check: https://your-backend.onrender.com/api/health

2. **Backend Endpoints**
   - `POST /api/posts/comments/:id/like` - Like a comment
   - `DELETE /api/posts/comments/:id/like` - Unlike a comment
   - `GET /api/posts/comments/:id/replies` - Get replies

3. **Frontend Implementation**
   - ✅ API methods exist (`likeComment`, `unlikeComment`)
   - ✅ Hooks properly set up (`useComments`, `useReplies`)
   - ✅ UI calls the mutations
   - ✅ Error handling added

### How to Test:

#### 1. Check Backend is Running
```bash
# Check if backend is up
curl https://your-backend.onrender.com/api/health

# Should return: {"status":"ok"}
```

#### 2. Test Comment Like Endpoint
```bash
# Get your auth token from the app
# Then test the endpoint

curl -X POST https://your-backend.onrender.com/api/posts/comments/COMMENT_ID/like \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"

# Should return: {"message":"Comment liked","isLiked":true}
```

#### 3. Check Frontend Logs
Open the app and check console logs when clicking like:
- Should see API request
- Should see response or error
- Toast should show error if it fails

### Common Issues:

#### Issue 1: Backend Not Deployed
**Solution:** Deploy backend to Render
```bash
cd solcial-backend
git push origin master
# Wait for Render to deploy
```

#### Issue 2: 404 Not Found
**Cause:** Endpoint doesn't exist on deployed backend
**Solution:** Verify backend is deployed with latest code

#### Issue 3: 401 Unauthorized
**Cause:** Auth token expired or invalid
**Solution:** Sign out and sign in again

#### Issue 4: Network Error
**Cause:** Backend URL incorrect or backend down
**Solution:** Check `EXPO_PUBLIC_API_URL` in `.env`

#### Issue 5: Comment ID Invalid
**Cause:** Comment ID is not a valid MongoDB ObjectId
**Solution:** Check comment data structure

### Debug Steps:

1. **Add Console Logs**
```typescript
// In handleLikeComment
const handleLikeComment = (commentId: string, isLiked: boolean) => {
  console.log('Liking comment:', commentId, 'isLiked:', isLiked);
  if (isLiked) {
    unlikeComment(commentId);
  } else {
    likeComment(commentId);
  }
};
```

2. **Check Network Tab**
- Open React Native Debugger
- Check Network tab
- Look for POST/DELETE requests to `/posts/comments/:id/like`
- Check response status and body

3. **Test with Postman**
- Create a POST request to your backend
- Add Authorization header
- Test if endpoint works

### Expected Behavior:

1. User taps heart icon on comment
2. `handleLikeComment` is called
3. `likeComment` or `unlikeComment` mutation runs
4. API request sent to backend
5. Backend updates database
6. Response returns
7. React Query invalidates cache
8. Comments refetch
9. UI updates with new like status

### If Still Not Working:

1. **Check Backend Logs on Render**
   - Go to Render dashboard
   - Check logs for errors
   - Look for 500 errors or exceptions

2. **Verify Database**
   - Check if CommentLike collection exists
   - Check if comments have `isLiked` field

3. **Test Backend Locally**
   ```bash
   cd solcial-backend
   npm run start:dev
   # Test endpoints with curl or Postman
   ```

4. **Check Frontend API URL**
   ```bash
   # In solcial/.env
   EXPO_PUBLIC_API_URL=https://your-backend.onrender.com/api
   ```

### Quick Fix:

If nothing works, try:
1. Clear app cache
2. Restart app
3. Sign out and sign in
4. Check if backend is deployed
5. Check error messages in toast notifications

The error handling has been added, so you should now see toast messages with specific errors when likes fail!
