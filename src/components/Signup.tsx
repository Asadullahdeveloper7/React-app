import React from 'react';
import { useFormik } from 'formik';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as Yup from 'yup';
import type { SignupCredentials } from '../types/auth.types';

interface SignupFormValues extends SignupCredentials {
  submit?: string;
}

const validationSchema = Yup.object({
  username: Yup.string().required('Username required').min(3, 'At least 3 characters'),
  email: Yup.string().email('Invalid email').required('Email required'),
  password: Yup.string().required('Password required').min(6, 'At least 6 characters'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
    .required('Confirm password required'),
  firstName: Yup.string().required('First name required'),
  lastName: Yup.string().required('Last name required'),
});

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const formik = useFormik<SignupFormValues>({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      const result = await signup(values);
      if (result.success) {
        navigate('/dashboard');
      } else {
        formik.setErrors({ submit: result.error || 'Signup failed' });
      }
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
          <p className="text-gray-600">Sign up to get started</p>
        </div>
        
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.firstName}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {formik.touched.firstName && formik.errors.firstName && (
                <p className="mt-1 text-xs text-red-600">{formik.errors.firstName}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.lastName}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {formik.touched.lastName && formik.errors.lastName && (
                <p className="mt-1 text-xs text-red-600">{formik.errors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {formik.touched.username && formik.errors.username && (
              <p className="mt-1 text-xs text-red-600">{formik.errors.username}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="mt-1 text-xs text-red-600">{formik.errors.email}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="mt-1 text-xs text-red-600">{formik.errors.password}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">{formik.errors.confirmPassword}</p>
            )}
          </div>

          {formik.errors.submit && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-2 rounded-lg text-sm">
              {formik.errors.submit}
            </div>
          )}

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            {formik.isSubmitting ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;