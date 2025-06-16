import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext';
import { Input, Button } from '../components';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [data, setData] = useState({
      username: "",
      password: "",
    })

    const navigate = useNavigate()
  
    const {login} = useAuth();
  
    const handleChange = (name) => (e) =>{
      setData({
        ...data,
        [name]: e.target.value,
      })
    }
  
    const handleLogin = async () => {
      const result = await login(data);
      if(result) navigate('/chat')
        // you can show error if result is false
    } 
  
    return (
      <div className="flex justify-center items-center flex-col h-screen w-screen">
        <h1 className="text-3xl font-bold">FreeAPI Chat App</h1>
        <div className="max-w-5xl w-1/2 p-8 flex justify-center items-center gap-5 flex-col shadow-md rounded-2xl my-16 border-[1px] border-zinc-700">
          <h1 className="inline-flex items-center text-2xl mb-4 flex-col">
            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="white" viewBox="0 0 24 24">
              <path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V12a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5zm-3 8V7a3 3 0 1 1 6 0v3H9z"/>
            </svg>
            Login
          </h1>
          <Input
            type='text'
            placeholder='Enter the username...'
            value={data.username}  
            onChange={handleChange("username")}
          />
          <Input
            type='password'
            placeholder='Enter the password...'
            value={data.password}
            onChange={handleChange("password")}
          />
          <Button
            onClick={handleLogin}
            disabled={Object.values(data).some(val => !val)}
            className='w-full rounded-full inline-flex flex-shrink-0 justify-center items-center text-center text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white shadow-sm bg-[rgb(73_86_143)] hover:bg-[rgb(73_86_143)]/80 disabled:bg-[rgb(73_86_143)]/50 text-base px-4 py-3'
          >
            Login
          </Button>
          <small className="text-zinc-300">
              Don&apos;t have an account?{" "}
              <a className="text-blue-400 hover:underline" href="/register">
                  Register
              </a>
          </small>
        </div>
      </div>
    )
}

export default Login
