import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import ReCaptchaV2 from 'react-google-recaptcha';
import './index.css';
import axios from 'axios';
import { env } from '../../constants';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory } from 'react-router-dom';
import Cookies from 'universal-cookie';
import Moment from 'moment';
import { renderToStream } from '@react-pdf/renderer';

toast.configure();
function Login(props) {
  const notify = (type, text) => {
    if (type === 'loginError') {
      toast(text);
    }
  };
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const cookies = new Cookies();
  const history = useHistory();
  const validationSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email is invalid'),
    password: Yup.string().required('Password is required'),
    recaptcha: Yup.bool().oneOf([true], 'Recaptcha is required'),
  });

  // useEffect(() => {
  //   const userLoggedIn = cookies.get("response");
  //   if (!userLoggedIn && userRole == 'client') {
  //     history.push("/marketplace/home");
  //   }
  // });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });



  const onSubmit = (data) => {
    const options = {
      headers: {
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };
    // if (recaptchaValue) {
    axios
      .post(env.apiUrl + 'api/users/login', data, options)
      .then((res) => {
        if (res.data.status === false) {
          notify('loginError', res.data.msg);
          if (res.data.msg === 'User email is Not Verified.') {
            history.push('/verify');
          }
        } else {
          //remove cookies old data
          cookies.remove("response",{ path: '/' });
          cookies.remove("userId",{ path: '/' });
          cookies.remove("username",{ path: '/' });
          cookies.remove("userRole",{ path: '/' });
          cookies.remove("email",{ path: '/' });
          cookies.remove("firstname",{ path: '/' });
          sessionStorage.clear();
          // add new cookies
          console.log(new Date(Date.now() + 3600));
          console.log(res.data);
          cookies.set('response', res.data.token, {
            path: '/',
            expires: new Date(Moment().add(60, 'm').format()),
          });



          cookies.set('userToken', res.data.token, {
            path: '/',
            expires: new Date(Moment().add(60, 'm').format()),
          });
          cookies.set('response', res.data.token, {
            path: '/',
            expires: new Date(Moment().add(60, 'm').format()),
          });
          cookies.set('userId', res.data.data.id, { path: '/' });
          cookies.set('username', res.data.data.username, { path: '/' });
          cookies.set('userRole', res.data.data.userRole, { path: '/' });
          cookies.set('firstname', res.data.data.firstName, { path: '/' });
          cookies.set('lastname', res.data.data.lastName, { path: '/' });
          cookies.set('email', res.data.data.email, { path: '/' });
          cookies.set(
              'profilePicture',
            res.data.data.logo,
              { path: '/' }
          );
          sessionStorage.setItem('newKey', 1);
           if (res.data.data.userRole === 'owner') {
            history.push('/dashboard');
          } else if (res.data.data.userRole === 'client') {
            history.push('/marketplace/home');
          }
        }
      })
      .catch((err) => {
        if (err.response) {
          notify('loginError', err.response.data.msg);
        }
      });

    // } else {
    //     notify("loginError", "Recaptcha is Required");
    //   }
  };
  function onChange(value) {
    setRecaptchaValue(value);
  }
  return (
    <div className='container-fluid bg-image' id='main'>
      <div className='row no-gutter'>
        <div className='col-sm-6 d-none centerMain d-sm-flex borderRight'>
          <div className='innerCenter'>
            <img className='logo leftLogo' alt='logo' />
            <span className='A-quick-way-to-authe'>
              A quick way to authenticate your products and tokenize your
              digital assets
            </span>
          </div>
        </div>
        <div className='col-sm-6'>
          <div className='login d-flex align-items-center py-5'>
            <div className='container'>
              <div className='row'>
                <div className='col-lg-10 col-xl-7 mx-auto'>
                  <h2 className='display-4 loginHeader'>Login</h2>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='form-group mb-4'>
                      <div className='inner-addon left-addon'>
                        <i className='fa fa-user fa-lg iconClass mt-2'></i>
                        <input
                          name='email'
                          type='text'
                          placeholder='Email'
                          {...register('email')}
                          className={`form-control ${
                            errors.email ? 'is-invalid' : ''
                          }`}
                        />

                        <div className='invalid-feedback'>
                          {errors.email?.message}
                        </div>
                      </div>
                    </div>
                    <div className='form-group mb-4'>
                      <div className='inner-addon left-addon'>
                        <i className='fa fa-lock fa-lg iconClass mt-2'></i>
                        <input
                          name='password'
                          type='password'
                          placeholder='Password'
                          {...register('password')}
                          className={`form-control ${
                            errors.password ? 'is-invalid' : ''
                          }`}
                        />
                        <div className='invalid-feedback'>
                          {errors.password?.message}
                        </div>
                      </div>
                    </div>
                    <ReCaptchaV2
                      sitekey='6LcCu6AaAAAAAKEu5Pv94XdOq0s3fhEyebLneN4y'
                      data-size='compact'
                      theme='dark'
                      required={true}
                      onChange={onChange}
                      // onChange={useCallback(() => setDisableSubmit(false))}
                      className={`mb-4 ${errors.recaptcha ? 'is-invalid' : ''}`}
                    />
                    <div className='invalid-feedback'>
                      {errors.recaptcha?.message}
                    </div>
                    <div className='row mb-4'>
                      <div className='col-6'>
                        <button
                          className='btn btn-primary w-100 btnsText'
                          type='submit'
                          // disabled={disableSubmit}
                        >
                          Login
                        </button>
                      </div>
                      <div className='col-6'>
                        <a
                          className='btn btn-secondary w-100 btnsText'
                          type='button'
                          href='./register'
                          style={{ padding: '14px' }}
                        >
                          Register
                        </a>
                      </div>
                    </div>
                    <p className='text-muted  '>
                      <div className='forgotText mr-4'> Forgot Password?</div>
                      <a href='./forgotPassword' className='resetText'>
                        Reset
                      </a>
                    </p>
                    <p className='text-muted'>
                      <span className='forgotText mr-4'>
                        Authenticity of certificate?
                      </span>{' '}
                      <a href='./verifyCert' className='resetText'>
                        Verify
                      </a>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;
