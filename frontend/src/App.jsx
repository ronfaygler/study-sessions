import { useState } from 'react'
import './App.css'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

function App() {
  const handleRegister = async (data) => {
    console.log(data);
    try {
      const response = await fetch(`{}/auth/register`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      if (response.ok) {
        console.log(result);
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleLogin = async (data) => {
    console.log(data);
    try {
      const response = await fetch(`{}/auth/login`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      if (response.ok) {
        console.log(result);
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <LoginPage onSubmit={handleLogin}/>
      {/* <RegisterPage onSubmit={handleRegister} /> */}
    </>
  )
}

export default App
