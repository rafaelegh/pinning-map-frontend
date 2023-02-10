import Room from '@mui/icons-material/Room';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import React from 'react';
import './Register.css';

function Register({ setCurrentUsername, setShowRegister }) {
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);
  const nameRef = React.useRef();
  const emailRef = React.useRef();
  const passwordRef = React.useRef();

  const handleSubmit = (event) => {
    event.preventDefault();
    const newUser = {
      username: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value
    }

    try {
      const res = axios.post(import.meta.env.VITE_BACKEND_URL + '/users/register', newUser);
      setSuccess(true);
      setCurrentUsername(res.data.username);
    } catch (error) {
      setError(true);
    }
  }

  return (
    <div className='registerContainer'>
      <div className='logo'>
        <Room className='logoIcon' />
        <span>RafaPin</span>
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder='username' ref={nameRef} />
        <input type="email" placeholder='email' ref={emailRef} />
        <input type="password" placeholder='password' ref={passwordRef} />
        <button className='registerBtn'>Register</button>
        {success && <span className='success'>Sucesfull. You can login now!</span>}
        {error && <span className='failure'>Something went wrong!</span>}
      </form>
      <CloseIcon className='registerCancel' onClick={() => setShowRegister(false)} />
    </div>
  )
}

export default Register