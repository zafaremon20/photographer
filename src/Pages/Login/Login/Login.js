import { async } from '@firebase/util';
import React, { useRef } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useSendPasswordResetEmail, useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import auth from '../../../firebase.init';
import Loading from '../../Shared/Loading/Loading';
import SocialLogin from '../SocialLogin/SocialLogin';

const Login = () => {
  const [
    signInWithEmailAndPassword,
    user,
    loading,
    error,
  ] = useSignInWithEmailAndPassword(auth);
  const [sendPasswordResetEmail, sending] = useSendPasswordResetEmail(auth);

  const navigate = useNavigate();
  const emailRef = useRef('');
  const passwordRef = useRef('');
  const location = useLocation();
  let from = location.state?.from?.pathname || '/';

  const handleLogin = event => {
    event.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    signInWithEmailAndPassword(email, password);
  }
  if (user) {
    navigate(from, { replace: true });
  }
  if (loading || sending) {
    return <Loading></Loading>
  }
  let errorElement;
  if (error) {
    errorElement = <p className='text-danger'>Error: {error?.message}</p>
  }

  const navigateRegister = () => {
    navigate('/register');
  }
  const handleShowPassword = () => {
    const pass = passwordRef.current;
    if (pass.type === "password") {
      pass.type = "text";
    } else {
      pass.type = "password";
    }
  }

  const resetPassword = async () => {
    const email = emailRef.current.value;
    if (email) {
      await sendPasswordResetEmail(email);
      toast('Email Sent');
    }
    else {
      toast('Please enter your email address');
    }
  }

  return (
    <div className='container w-25 mx-auto m-5 shadow' style={{ 'minWidth': '350px' }}>
      <h2 className="text-center text-success">Please Login</h2>
      <Form onSubmit={handleLogin}>
        <Form.Group className="mb-3" >
          <Form.Control ref={emailRef} type="email" placeholder="Enter email" id="email" required />
        </Form.Group>

        <Form.Group className="mb-3 password mb-3 d-flex align-items-center" >
          <Form.Control ref={passwordRef} type="password" placeholder="Password" id="password" required />
          <Form.Check onClick={handleShowPassword} className='show-pass' type="checkbox" label="Show" />
        </Form.Group>
        {/* <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Check me out" />
        </Form.Group> */}
        <Button className='w-100' variant="success" type="submit">
          Login
        </Button>
      </Form>
      {errorElement}
      <p>Forgot Password? <button onClick={resetPassword} className='btn btn-link text-success p-0 mb-1 text-decoration-none'>Reset Password</button></p>
      <p>New to Service Provider? <Link to='/register' className='text-success text-decoration-none' onClick={navigateRegister}>Please Register</Link></p>
      <SocialLogin></SocialLogin>
      <ToastContainer />
    </div>
  );
};

export default Login;