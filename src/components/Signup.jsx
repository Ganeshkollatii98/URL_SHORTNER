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
import {  signUp } from '@/db/apiAuth'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { UrlState } from '@/context/context'

const Signup = () => {
  let [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    profile_pic: ''
  })

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const longLink = searchParams.get('createNew')

  let [errors, setErrors] = useState([]);

  const handleInputChange = (event) => {
    const { name, value, files } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value
    }))
  }

  let { fetchUser } = UrlState();

  const { data, error, loading, fn: signupFn } = useFetch(signUp, formData);

  useEffect(() => {
    if (error==null && data) {
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`)
      fetchUser();
    }
  }, [ error,loading])

  const handleSignup = async () => {
    setErrors([])
    try {
      const formSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid Email').required('Email is required'),
        profile_pic: Yup.mixed().required('Profile picture required'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
      })
      await formSchema.validate(formData, { abortEarly: false })
      signupFn();
    } catch (error) {
      const newErrors = {};
      error?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      })
      setErrors(newErrors)
    }
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Signup</CardTitle>
        <CardDescription>Create a new account if you haven&rsquo;t already</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className='space-y-1'>
          <Input type="text" name="name" placeholder='Enter Name' onChange={handleInputChange} />
          {errors.name && <Error message={errors.name} />}
        </div>
        <div className='space-y-1'>
          <Input type="email" name="email" placeholder='Enter email' onChange={handleInputChange} />
          {errors.email && <Error message={errors.email} />}
        </div>
        <div className='space-y-1'>
          <Input type="password" name="password" placeholder='Enter password' onChange={handleInputChange} />
          {errors.password && <Error message={errors.password} />}
        </div>
        <div className='space-y-1'>
          <Input type="file" name="profile_pic" accept='image/*' onChange={handleInputChange} />
          {errors.profile_pic && <Error message={errors.profile_pic} />}
        </div>

      </CardContent>
      <CardFooter>
        <Button onClick={handleSignup}>{loading ?
          <BeatLoader size={10} color="#36d7b7" /> : 'Create Account'}</Button>
      </CardFooter>
    </Card>

  )
}

export default Signup