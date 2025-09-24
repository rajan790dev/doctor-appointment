import React, { useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  const [state, setState] = useState('SignUp');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { signUp } = useContext(AppContext);
  const onSubmitHandler = async (event) => {
    signUp(event,state,email,password,name);
  };
  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] !border !border-gray-200 sm:min-w-96 rounded-xl text-zinc-600 text-sm shadow-2xl">
        <p className='text-2xl font-semibold text-center w-full'>{state === 'SignUp' ? "Create Account" : "Login"}</p>

        {state === 'SignUp' && (
          <div className='w-full'>
            <p>Full Name</p>
            <input
              className='border border-zinc-300 rounded w-full p-2 mt-1'
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>
        )}
        <div className='w-full'>
          <p>Email</p>
          <input
            className='border border-zinc-300 rounded w-full p-2 mt-1'
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>
        <div className='w-full'>
          <p>Password</p>
          <input
            className='border border-zinc-300 rounded w-full p-2 mt-1'
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>
        <button type="submit" className='bg-primary text-white w-full py-2 rounded-md text-base cursor-pointer hover:bg-[#3345e3]'>
          {state === 'SignUp' ? 'Create Account' : 'Login'}
        </button>
        {state === 'SignUp' ? (
          <p className='text-center w-full'>
            Already have an account?{" "}
            <span onClick={() => setState("Login")} className='text-primary underline cursor-pointer'>
              Login here
            </span>
          </p>
        ) : (
          <p className='text-center w-full'>
            Create a new account{" "}
            <span onClick={() => setState("SignUp")} className='text-primary underline cursor-pointer'>
              SignUp
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
