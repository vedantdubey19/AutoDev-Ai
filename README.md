<<<<<<< HEAD
your code
# AutoDev AI

AutoDev AI is a comprehensive developer productivity platform that integrates deeply with GitHub to provide **AI-powered code reviews** and **ML-based bug risk prediction** on every Pull Request.

## Features
- **GitHub OAuth Login**: Seamlessly log in with your GitHub account.
- **AI Code Reviews**: Uses OpenAI (GPT-4o) or Anthropic (Claude 3.5 Sonnet) to analyze PR diffs and post review comments directly to GitHub.
- **ML Bug Risk Prediction**: Automatically predicts the risk level (Low, Medium, High) of incoming commits/PRs based on metadata heuristics using a custom-trained Scikit-Learn RandomForestClassifier.
- **Modern Dashboard**: Visually rich dashboard built with React, Vite, and Tailwind CSS.

## Architecture
- **Frontend**: React + Vite + Tailwind CSS v4, running in a Docker container on port `5173`.
- **Backend API**: Node.js + Express + Mongoose, running in a Docker container on port `5000`. Exposes OAuth routes and listens for GitHub Webhooks.
- **ML Service**: Python FastAPI server utilizing Pandas, NumPy, and Scikit-learn, served on port `8000`. Exposes a `/predict` endpoint.
- **Database**: MongoDB Atlas instance.

## Setup Instructions

### Environment Variables
Setup a `.env` file in the root directory. Wait, it's already provided, but you will need to add the `GITHUB_CLIENT_SECRET`:

```env
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
GITHUB_WEBHOOK_SECRET="..."
OPENAI_API_KEY="..." # OR use ANTHROPIC_API_KEY
MONGODB_URI="..."
JWT_SECRET="..."
ML_SERVICE_URL="http://ml-service:8000"
```

### GitHub OAuth App Setup
1. Go to GitHub -> Settings -> Developer Settings -> OAuth Apps -> New OAuth App.
2. Homepage URL: `http://localhost:5173`
3. Authorization callback URL: `http://localhost:5000/auth/github/callback`.
4. Copy the Client ID and Client Secret into the `.env` file.

### Webhooks
1. In your GitHub repository settings, go to **Webhooks** -> **Add webhook**.
2. Payload URL: `https://<your-ngrok-or-domain>/webhooks/github`
3. Content type: `application/json`
4. Secret: Use the `GITHUB_WEBHOOK_SECRET` from `.env`.
5. Select **Let me select individual events** -> **Pull requests**.

### Running the Project Locally
If you want to train the ML model locally first:
```bash
cd ml-service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python train.py
```
This generates `model.joblib`.

Then, use Docker Compose to run the entire stack:
```bash
docker-compose up --build
```
This will start:
- Frontend on `http://localhost:5173`
- Backend on `http://localhost:5000`
- ML Service on `http://localhost:8000`

### CI/CD
A GitHub Actions workflow is provided (`.github/workflows/ci.yml`) to lint, test, and build Docker containers on pushes and pull requests to the `main` branch.

# AutoDev-Ai

github code
>>>>>>>main
