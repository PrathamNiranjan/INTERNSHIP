#!/usr/bin/env python3
"""
Startup script for Legal AI Assistant
This script helps users start both backend and frontend services.
"""

import os
import sys
import subprocess
import time
import webbrowser
from pathlib import Path

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required!")
        print(f"Current version: {sys.version}")
        return False
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor} detected")
    return True

def check_dependencies():
    """Check if required dependencies are installed"""
    backend_dir = Path("backend")
    frontend_dir = Path("frontend")
    
    if not backend_dir.exists():
        print("❌ Backend directory not found!")
        return False
    
    if not frontend_dir.exists():
        print("❌ Frontend directory not found!")
        return False
    
    # Check if requirements.txt exists
    if not (backend_dir / "requirements.txt").exists():
        print("❌ Backend requirements.txt not found!")
        return False
    
    # Check if package.json exists
    if not (frontend_dir / "package.json").exists():
        print("❌ Frontend package.json not found!")
        return False
    
    print("✅ Project structure looks good")
    return True

def install_backend_dependencies():
    """Install backend dependencies"""
    print("\n📦 Installing backend dependencies...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "backend/requirements.txt"])
        print("✅ Backend dependencies installed!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install backend dependencies: {e}")
        return False

def install_frontend_dependencies():
    """Install frontend dependencies"""
    print("\n📦 Installing frontend dependencies...")
    try:
        subprocess.check_call(["npm", "install"], cwd="frontend")
        print("✅ Frontend dependencies installed!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install frontend dependencies: {e}")
        print("Make sure Node.js is installed and npm is available")
        return False

def start_backend():
    """Start the backend server"""
    print("\n🚀 Starting backend server...")
    try:
        # Change to backend directory and start Flask app
        backend_process = subprocess.Popen(
            [sys.executable, "app.py"],
            cwd="backend",
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        
        # Wait a moment for the server to start
        time.sleep(3)
        
        # Check if the process is still running
        if backend_process.poll() is None:
            print("✅ Backend server started successfully!")
            return backend_process
        else:
            stdout, stderr = backend_process.communicate()
            print(f"❌ Backend server failed to start:")
            print(f"STDOUT: {stdout.decode()}")
            print(f"STDERR: {stderr.decode()}")
            return None
            
    except Exception as e:
        print(f"❌ Failed to start backend: {e}")
        return None

def start_frontend():
    """Start the frontend development server"""
    print("\n🚀 Starting frontend server...")
    try:
        frontend_process = subprocess.Popen(
            ["npm", "run", "dev"],
            cwd="frontend",
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        
        # Wait a moment for the server to start
        time.sleep(5)
        
        # Check if the process is still running
        if frontend_process.poll() is None:
            print("✅ Frontend server started successfully!")
            return frontend_process
        else:
            stdout, stderr = frontend_process.communicate()
            print(f"❌ Frontend server failed to start:")
            print(f"STDOUT: {stdout.decode()}")
            print(f"STDERR: {stderr.decode()}")
            return None
            
    except Exception as e:
        print(f"❌ Failed to start frontend: {e}")
        return None

def main():
    """Main startup function"""
    print("🚀 Legal AI Assistant Startup")
    print("=" * 40)
    
    # Check prerequisites
    if not check_python_version():
        sys.exit(1)
    
    if not check_dependencies():
        print("\nPlease make sure you're in the correct directory and the project is properly set up.")
        sys.exit(1)
    
    # Ask user if they want to install dependencies
    install_deps = input("\nDo you want to install dependencies? (y/n): ").lower().strip()
    
    if install_deps == 'y':
        if not install_backend_dependencies():
            sys.exit(1)
        
        if not install_frontend_dependencies():
            sys.exit(1)
    
    # Start servers
    backend_process = start_backend()
    if not backend_process:
        print("\n❌ Failed to start backend. Please check the error messages above.")
        sys.exit(1)
    
    frontend_process = start_frontend()
    if not frontend_process:
        print("\n❌ Failed to start frontend. Please check the error messages above.")
        backend_process.terminate()
        sys.exit(1)
    
    print("\n🎉 Legal AI Assistant is running!")
    print("\n📱 Access the application:")
    print("   Frontend: http://localhost:5173")
    print("   Backend API: http://localhost:5000")
    
    # Ask if user wants to open browser
    open_browser = input("\nOpen browser automatically? (y/n): ").lower().strip()
    if open_browser == 'y':
        try:
            webbrowser.open("http://localhost:5173")
        except Exception as e:
            print(f"Could not open browser automatically: {e}")
    
    print("\nPress Ctrl+C to stop the servers...")
    
    try:
        # Keep the script running
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n\n🛑 Stopping servers...")
        backend_process.terminate()
        frontend_process.terminate()
        print("✅ Servers stopped successfully!")

if __name__ == "__main__":
    main() 