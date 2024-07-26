import React, { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from './ui/input'
import { Button } from './ui/button'
import { BeatLoader } from 'react-spinners'
import Error from './error'
import * as Yup from 'yup';
import useFetch from '@/hooks/use-fetch'
import { login } from '@/db/apiAuth'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { UrlState } from '@/context/context'

const Login = () => {
  let [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const longLink = searchParams.get('createNew')

  let [errors, setErrors] = useState([]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  // url State which is created in context
  let { fetchUser } = UrlState();

  const { data, error, loading, fn: loginFn } = useFetch(login, formData);

  useEffect(() => {
    if (error === null && data) {
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`)
      fetchUser();
    }
  }, [data, error])

  const handleLogin = async () => {
    setErrors([])
    try {
      const formSchema = Yup.object().shape({
        email: Yup.string().email('Invalid Email').required('Email is required'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required')
      })

      await formSchema.validate(formData, { abortEarly: false })
      loginFn();
    } catch (error) {
      const newErrors = {};
      // it give all errors triggered
      console.log('error.inner', error.inner)
      error?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      })
      setErrors(newErrors)
    }
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>to your accont if you already have one</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className='space-y-1'>
          <Input type="email" name="email" placeholder='Enter email' onChange={handleInputChange} />
          {errors.email && <Error message={errors.email} />}
        </div>
        <div className='space-y-1'>
          <Input type="password" name="password" placeholder='Enter password' onChange={handleInputChange} />
          {errors.email && <Error message={errors.password} />}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleLogin}>{loading ? <BeatLoader size={10} color="#36d7b7" /> : 'Login'}</Button>
      </CardFooter>
    </Card>

  )
}

export default Login