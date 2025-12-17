# Docker Hub Authentication Fix Guide

## Problem
Pipeline fails with error: `unauthorized: access token has insufficient scopes`

## Root Cause
The Docker Hub access token doesn't have **write permissions** to push images.

---

## Solution: Create New Access Token with Proper Permissions

### Step 1: Generate New Docker Hub Access Token

1. **Login to Docker Hub**
   - Go to https://hub.docker.com/
   - Sign in with your credentials

2. **Navigate to Access Tokens**
   - Click your **username** (top right)
   - Select **Account Settings**
   - Click **Security** tab
   - Click **Access Tokens**

3. **Create New Token**
   - Click **New Access Token** button
   - Fill in details:
     - **Access Token Description**: `GitHub Actions CI/CD`
     - **Access permissions**: Select **Read & Write** ✅ (NOT Read-only)
   - Click **Generate**

4. **Copy the Token**
   - ⚠️ **IMPORTANT**: Copy the token immediately
   - It will only be shown once
   - Store it temporarily in a secure location

---

### Step 2: Update GitHub Repository Secrets

1. **Go to Your GitHub Repository**
   - Navigate to your repository on GitHub
   - Example: `https://github.com/YOUR_USERNAME/devops-final-lab-exam`

2. **Access Secrets Settings**
   - Click **Settings** tab
   - In left sidebar, click **Secrets and variables** → **Actions**

3. **Update DOCKERHUB_TOKEN**
   - Find `DOCKERHUB_TOKEN` in the list
   - Click **Update** button
   - Paste the new token you copied from Docker Hub
   - Click **Update secret**

4. **Verify DOCKERHUB_USERNAME**
   - Check if `DOCKERHUB_USERNAME` secret exists
   - If not, click **New repository secret**
   - Name: `DOCKERHUB_USERNAME`
   - Value: Your Docker Hub username (NOT email)
   - Click **Add secret**

---

### Step 3: Test the Pipeline

#### Option 1: Trigger via Empty Commit
```bash
# Navigate to your project directory
cd "e:\Semester 7\DevOps\Final Lab Exam"

# Create an empty commit to trigger the pipeline
git commit --allow-empty -m "test: verify Docker Hub authentication"

# Push to main branch
git push origin main
```

#### Option 2: Trigger via Manual Workflow
1. Go to GitHub repository
2. Click **Actions** tab
3. Select **DevOps Lab CI/CD Pipeline**
4. Click **Run workflow** button
5. Select `main` branch
6. Click **Run workflow**

---

### Step 4: Monitor Pipeline Execution

1. **Watch the Pipeline**
   - Go to **Actions** tab in GitHub
   - Click on the latest workflow run
   - Watch jobs execute in real-time

2. **Check for Success**
   - ✅ All 5 jobs should show green checkmarks
   - ✅ "Build & Push Docker Images" should complete without errors
   - ✅ Docker Hub should receive the images

3. **Verify on Docker Hub**
   - Login to Docker Hub
   - Go to **Repositories**
   - Check for:
     - `YOUR_USERNAME/fa22-backend:latest`
     - `YOUR_USERNAME/fa22-frontend:latest`
   - Verify timestamp matches pipeline execution time

---

## Troubleshooting

### Issue: "repository does not exist"
**Solution**: Create repositories on Docker Hub first
```bash
# Or let the pipeline create them automatically (if you have auto-create enabled)
```

### Issue: "denied: requested access to the resource is denied"
**Solution**: Verify username is correct
- Secret should be your Docker Hub **username**, not email
- Check for typos or extra spaces

### Issue: Token still shows as invalid
**Solution**: Regenerate token
1. Delete old token from Docker Hub
2. Create new token with Read & Write permissions
3. Update GitHub secret immediately
4. Retry pipeline

### Issue: Pipeline doesn't trigger
**Solution**: Check branch name
- Workflow triggers on `main` branch
- If your default branch is `master`, update workflow file:
  ```yaml
  on:
    push:
      branches:
        - master  # Change from 'main' to 'master'
  ```

---

## Quick Reference

### Required GitHub Secrets
| Secret Name | Value | Example |
|-------------|-------|---------|
| `DOCKERHUB_USERNAME` | Your Docker Hub username | `johndoe` |
| `DOCKERHUB_TOKEN` | Access token with Read & Write | `dckr_pat_abc123...` |

### Docker Hub Token Permissions
- ❌ **Read-only** - Cannot push images
- ✅ **Read & Write** - Can push and pull images
- ⚠️ **Read, Write, Delete** - Full access (not recommended for CI/CD)

### Verification Commands
```bash
# Check if secrets are set (won't show values)
# Go to: Repository → Settings → Secrets and variables → Actions

# Test Docker login locally (optional)
echo $DOCKERHUB_TOKEN | docker login -u $DOCKERHUB_USERNAME --password-stdin

# Verify images exist
docker pull YOUR_USERNAME/fa22-backend:latest
docker pull YOUR_USERNAME/fa22-frontend:latest
```

---

## After Successful Fix

### Capture Screenshots for Submission

1. **Screenshot: Successful Pipeline Run**
   - GitHub Actions showing all jobs completed
   - Green checkmarks on all 5 jobs

2. **Screenshot: Docker Build Logs**
   - "Build & Push Docker Images" job expanded
   - Showing successful push to registry

3. **Screenshot: Docker Hub Repository**
   - Both images visible with latest tag
   - Timestamp showing recent push

4. **Screenshot: GitHub Secrets Configuration**
   - Settings → Secrets page showing both secrets exist
   - (Values will be hidden, which is correct)

---

## Summary

✅ Create Docker Hub token with **Read & Write** permissions  
✅ Update `DOCKERHUB_TOKEN` in GitHub Secrets  
✅ Verify `DOCKERHUB_USERNAME` is correct  
✅ Trigger pipeline and monitor execution  
✅ Verify images on Docker Hub  
✅ Capture screenshots for submission  

**Estimated Time**: 5-10 minutes  
**Difficulty**: Easy  
**Success Rate**: 100% if steps followed correctly  
