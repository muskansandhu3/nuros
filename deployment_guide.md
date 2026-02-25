# Nuros Deployment Guide: Streamlit Community Cloud

This guide outlines exactly how to push the Nuros "High-Gloss" prototype to GitHub using a Personal Access Token (PAT) and how to seamlessly deploy it to the Streamlit Community Cloud.

## 1. Push to GitHub using a Personal Access Token (PAT)

Streamlit Community Cloud works by reading a public (or private) GitHub repository where your `app.py`, `requirements.txt`, and `runtime.txt` live.

### Generating your PAT:
1. Go to your GitHub settings (`Settings` > `Developer settings` > `Personal access tokens` > `Tokens (classic)`).
2. Click **Generate new token (classic)**.
3. Give it a descriptive name (e.g., "Nuros Deployment").
4. Select the **`repo`** scope (Full control of private repositories).
5. Click **Generate token** and copy the resulting string (it starts with `ghp_`).

### Pushing the Code:
In your terminal, navigate to `/Users/muskansandhu/Desktop/Nuros` and run:

```bash
git init
git add .
git commit -m "feat: High-Gloss UI and secure Phase 1 Prototype"
git branch -M main

# Add your repository remote URL (replace username and repo)
git remote add origin https://github.com/YOUR_USERNAME/nuros-streamlit.git

# When you push, GitHub will ask for a Username and Password. 
# USE YOUR GENERATED PAT AS THE PASSWORD!
git push -u origin main
```

## 2. Deploy to Streamlit Community Cloud

Once the code is on GitHub, Streamlit can pull it and host it for free.

1. Create an account at [share.streamlit.io](https://share.streamlit.io/).
2. Link your GitHub Account when prompted.
3. Click the **"New app"** button.
4. Fill in the deployment details:
   - **Repository:** `YOUR_USERNAME/nuros-streamlit`
   - **Branch:** `main`
   - **Main file path:** `app.py`
5. (Optional) Customize the App URL: Click "Advanced settings" or click on the URL to change it to something like `nuros-ai.streamlit.app`.
6. Click **Deploy!**

### What to Expect Next:
Streamlit will automatically read your `runtime.txt` to spin up a Python 3.11 environment. It will then read `requirements.txt` to install the latest `streamlit`, `librosa`, `praat-parselmouth`, and `pycryptodome`.

Once complete, your Nuros widget will be live on the internet! 

Any future pushes you make via `git push origin main` will automatically trigger a rebuild, and your custom `.github/workflows/deploy.yml` will ensure the code passes CI linting validations before the server restarts.
