import Head from 'next/head';
import React from 'react';
import Link from 'next/link';
import { Formik, Form } from 'formik';
import InputField from '../components/InputField';
import { useRegisterMutation } from '../generated/graphql';
import { getErrorMap } from '../utils/getErrorMap';
import { useRouter } from 'next/dist/client/router';
import FormWrapper from '../components/FormWrapper';
import Button from '../components/Button';

function Register() {
  const [register] = useRegisterMutation();
  const router = useRouter();

  return (
    <FormWrapper title='Sign Up'>
      <p className='mb-10 text-xs'>
        By continuing, you agree to our User Agreement and Privacy Policy.
      </p>
      <Formik
        initialValues={{ email: '', username: '', password: '' }}
        onSubmit={async (values, action) => {
          console.log(values);
          try {
            const res = await register({ variables: values });
            const { user, errors } = res.data.register;

            if (errors) {
              action.setErrors(getErrorMap(errors));
            } else if (user) {
              router.push('/login');
            }
          } catch (err) {
            console.error(err);
          }
          action.setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name='email' type='email' placeholder='EMAIL' />
            <InputField name='username' type='text' placeholder='USERNAME' />
            <InputField
              name='password'
              type='password'
              placeholder='PASSWORD'
            />
            <Button disabled={isSubmitting} type='submit'>
              sign Up
            </Button>
          </Form>
        )}
      </Formik>
      <small>
        Already a redditor?{' '}
        <Link href='/login'>
          <a className='ml-1 font-bold text-blue-500 uppercase'>Log In</a>
        </Link>
      </small>
    </FormWrapper>
  );
}

export default Register;
