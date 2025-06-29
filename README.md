# 🗨️ React Chat App

A real-time chat application built with **Vite** and **React JS**, powered by **FreeAPI.app** for authentication and messaging. This app demonstrates secure login/logout with **JWT auto-refresh**, real-time messaging via **WebSockets**, and seamless navigation using **React Router DOM**.

---

## 🚀 Features

- 🔐 **Authentication**: Register, login, logout with access token auto-refresh  
- 💬 **Chat API Integration**: Built on [FreeAPI.app](https://freeapi.app) open-source chat and auth APIs  
- 🧠 **Context API**:  
  - `AuthContext` for authentication logic  
  - `SocketContext` for managing WebSocket connections  
- 🔄 **Token Auto Refresh**: Ensures access token refreshes without interrupting user sessions  
- 🌐 **React Router**: Navigation between login, register, and chat views  

---

## 🛠️ Tech Stack

- [React JS](https://reactjs.org/)
- [React Router DOM](https://reactrouter.com/)
- [FreeAPI.app](https://freeapi.app) (for Auth & Chat APIs)
- WebSockets for real-time messaging
- Context API for state management

---

## 🔐 Authentication Flow

1. **Register/Login** using FreeAPI  
2. **Store access & refresh tokens** in localStorage  
3. **Auto-refresh token** on expiry using interceptors  
4. Protect routes with `PrivateRoute` based on auth context  

---

## 🔌 Socket Integration

- Establishes a **WebSocket connection** on login  
- Listens for incoming messages via `SocketContext`  
- Allows **sending messages in real-time**  

---

## 🔄 Token Refresh

- Uses an `axios` interceptor to detect expired access tokens  
- Automatically fetches a new token using the refresh token  
- Maintains seamless user experience  

---

## 🧪 Installation & Running Locally

```bash
# Clone the repo
git clone https://github.com/amansain11/chatApp.git
cd chatApp

# Install dependencies
npm install

# Run the app after configuring environment variables
npm run dev
```

> 📌 Make sure to install open source [Freeapi.app] backend locally in your machine, you can follow the instruction on this repository https://github.com/hiteshchoudhary/apihub.git
after installing locally make sure to update 'url: ${{server}}' in servers of the swagger.yaml file.

---

## 🔧 Environment Variables

Create a `.env` file in the root directory :

```
VITE_API_URL=http://localhost:8080/api/v1 
```
```
VITE_SOCKET_URL=http://localhost:8080
```

Or copy the content of `.env.sample` and paste in your `.env` and update as per your backend configuration.