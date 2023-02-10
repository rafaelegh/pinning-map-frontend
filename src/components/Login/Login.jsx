import Room from '@mui/icons-material/Room';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react'
import './Login.css';
import axios from 'axios';

function Login({ setCurrentUsername, setShowLogin }) {
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);
  const nameRef = React.useRef();
  const passwordRef = React.useRef();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const user = {
      username: nameRef.current.value,
      password: passwordRef.current.value,
    }

    try {
      const res = await axios.post(import.meta.env.VITE_BACKEND_URL + '/users/login', user);
      console.log(res)
      setSuccess(true);
      setCurrentUsername(res.data.username);
      setShowLogin(false);
    } catch (error) {
      console.log(error)
      setError(true);
    }
  }

  return (
    <div className='loginContainer'>
      <div className='logo'>
        <Room className='logoIcon' />
        <span>RafaPin</span>
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder='username' ref={nameRef} />
        <input type="password" placeholder='password' ref={passwordRef} />
        <button className='loginBtn'>Login</button>
        {success && <span className='success'>Sucesfull. You can login now!</span>}
        {error && <span className='failure'>Something went wrong!</span>}
      </form>
      <CloseIcon className='loginCancel' onClick={() => setShowLogin(false)} />
    </div>
  )
}

export default Login