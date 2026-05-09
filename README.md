# DeepShield AI

DeepShield AI is a state-of-the-art Identity Protection Platform designed to secure your digital presence by proactively detecting unauthorized deepfakes, face-swaps, and manipulated media across the internet. Built with a visually stunning, responsive React frontend and a powerful PyTorch-driven Flask backend, DeepShield leverages cutting-edge computer vision to provide comprehensive threat analysis and detailed cryptographic reporting.

## Visual DeepFake Detection (Technical Overview)

Our detection system relies heavily on the research and datasets proposed in the context of visual deepfake detection. 

We address the challenge that models proposed in current state-of-the-art literature (like FaceForensics++) often do not generalize well to real-life videos randomly collected from platforms like YouTube. Our solution relies on a dynamic neural network constantly updated with real-world data.

Our backend PyTorch model is based on a pre-trained **ResNet18** architecture that we fine-tune to solve the deepfake detection problem. We perform extensive inference incorporating both standard datasets and augmented real-world data to identify manipulations.

### Datasets

The underlying model research utilizes two major data sources:
1. **FaceForensics++**: Half of the dataset used in this project is from the [FaceForensics](https://github.com/ondyari/FaceForensics) deepfake detection dataset.
2. **Real-world (YouTube) Data**: Augmented deepfake data collected from the wild to ensure our model detects highly customized, unseen manipulation techniques.

When a model is trained on a combination of both datasets, it learns to detect both real-world manipulation techniques as well as the other synthetic methods mentioned in the FaceForensics++ paper (Deepfakes, Face2Face, FaceSwap, NeuralTextures).

## Key Features

- **Proactive AI Threat Analysis**: Instantly scan images and videos. The backend extracts faces using OpenCV Haar Cascades and runs inference via our ResNet18 model to calculate precise deepfake probabilities.
- **Dynamic Evidence Reports**: Generate and download visually comprehensive PDF investigation reports with cryptographic signatures, suitable for legal and corporate takedowns.
- **Enterprise-grade Authentication**: Secure login and registration with JWT (JSON Web Tokens) and secure session management.
- **Interactive Global Dashboard**: Track threats, scan history, and protection metrics across a personalized, high-performance dashboard.
- **Secure Cloud Proxying**: Advanced HTTPS-to-HTTP bridging via AWS CloudFront for secure, encrypted communication between frontend and backend.


## Setup & Installation

### Prerequisites
- Node.js (v18+)
- Python (3.8+)
- RAM >= 16GB (for deep learning model inference)
- NVIDIA GPU (Optional, for CUDA-accelerated inference)

### 1. Frontend Setup
```bash
# Install frontend dependencies
npm install

# Run the development server
npm run dev
```

### 2. Backend Setup
```bash
cd backend

# Create a virtual environment
python -m venv venv
source venv/bin/activate  # Or `venv\Scripts\activate` on Windows

# Install dependencies
pip install -r requirements.txt

# Start the Flask API
python app.py
```
## Deployment Architecture

DeepShield AI is deployed using a secure, scalable AWS architecture:
- **Frontend**: Hosted on **AWS Amplify** with automated CI/CD.
- **Backend API**: Running on **AWS Elastic Beanstalk** (Python Platform).
- **Security Bridge**: An **AWS CloudFront** distribution acts as a secure HTTPS-to-HTTP proxy to resolve Mixed Content restrictions.
- **Routing**: Amplify utilizes Reverse Proxy rewrites (`/api/*`) to securely route traffic through the CloudFront bridge to the backend.

### Production Status
- **Auth/Scanning**: Fully functional via secure proxying.
- **Environment**: Python 3.11 / Amazon Linux 2023.


## Repository Structure

- `/src` - React frontend application featuring glassmorphism design.
- `/backend` - Flask REST API with PyTorch and OpenCV integrations.
- `/deepfake-repo` - Original research scripts and PyTorch dataset loaders for the underlying ResNet18 model.

## License

© 2025 DeepShield AI Contributors. All third-party names and trademarks are properties of their respective owners.
