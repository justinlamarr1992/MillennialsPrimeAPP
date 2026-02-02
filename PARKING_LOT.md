# Parking Lot - Issues to Resolve Later

Issues tracked here are known problems that need to be addressed but aren't blocking current development.

---

## 🔐 Authentication & Token Management

### Token Refresh Failing (401 Unauthorized)

**Issue:** Token refresh endpoint fails with 401 error, forcing users to re-login frequently. This defeats the purpose of persistent login.

**Symptoms:**
- Token refresh endpoint (`/refresh`) returns 401 Unauthorized
- Profile picture loading fails with 401
- User profile fetching fails with 401
- Users must sign out and sign back in to get fresh tokens

**Root Cause (Hypothesis):**
- Refresh token cookies may not be persisted correctly
- Server `/refresh` endpoint may require valid refresh token cookie
- axios instance may not be configured to send cookies with requests
- Cross-origin cookie issues (if using different domains for API)

**Impact:**
- **High** - Breaks user experience, forces frequent re-authentication
- Blocks persistent login functionality
- ProfileHeader and other authenticated features fail to load

**Error Logs:**
```
ERROR  Token refresh failed: [AxiosError: Request failed with status code 401]
ERROR  ❌ Failed to load profile picture: [AxiosError: Request failed with status code 401]
ERROR  ❌ Failed to fetch user profile: [AxiosError: Request failed with status code 401]
```

**Files Involved:**
- `services/serverAuth.ts` - Token refresh logic (line ~120)
- `hooks/useAxiosPrivate.ts` - Request interceptor that triggers refresh
- `API/axios.ts` - Base axios configuration
- Server: `/refresh` endpoint

**Potential Solutions:**
1. **Verify cookie configuration:**
   - Ensure axios is configured with `withCredentials: true`
   - Check server CORS settings allow credentials
   - Verify refresh token cookie is httpOnly, secure, sameSite settings

2. **Check refresh token storage:**
   - Confirm refresh token is stored as cookie (not just localStorage)
   - Verify cookie domain/path settings match API domain
   - Check cookie expiration is longer than access token

3. **Debug request flow:**
   - Log what cookies are sent with `/refresh` request
   - Verify server receives refresh token cookie
   - Check if server validates refresh token correctly

4. **Alternative approach:**
   - Store refresh token in SecureStore instead of cookie
   - Send refresh token in request body instead of cookie
   - Implement token rotation strategy

**Priority:** High
**Assigned:** Unassigned
**Created:** 2026-02-02
**Status:** Open

---

## 📋 Future Issues

Add additional parking lot items here as they are discovered.

