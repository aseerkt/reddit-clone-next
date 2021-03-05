import Link from 'next/link';
import FormWrapper from '../components/FormWrapper';
import InputField from '../components/InputField';
import { Formik, Form } from 'formik';
import { useRouter } from 'next/dist/client/router';
import { MeDocument, useLoginMutation } from '../generated/graphql';
import Button from '../components/Button';

const Login = () => {
  const router = useRouter();
  const { next }: any = router.query;
  const [login] = useLoginMutation({
    update: (cache, { data }) => {
      const user = data.login.user;
      if (user) {
        cache.writeQuery({ query: MeDocument, data: { me: user } });
        if (next) {
          next === 'back' ? router.back() : router.push(next);
        } else {
          router.push('/');
        }
      }
    },
  });
  return (
    <FormWrapper title='Log In'>
      <p className='mb-10 text-xs'>
        By continuing, you agree to our User Agreement and Privacy Policy.
      </p>
      <Formik
        initialValues={{ usernameOrEmail: '', password: '' }}
        onSubmit={async (values, action) => {
          console.log(values);
          try {
            const res = await login({ variables: values });
            const { errors } = res.data.login;

            if (errors) {
              errors.forEach(({ path, message }) => {
                if (path === 'unknown') {
                  action.setFieldError('usernameOrEmail', message);
                  action.setFieldError('password', ' ');
                } else {
                  action.setFieldError(path, message);
                }
              });
              // action.setErrors(getErrorMap(errors));
            }
          } catch (err) {
            console.error(err);
          }
          action.setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name='usernameOrEmail'
              type='text'
              placeholder='USERNAME / EMAIL'
            />
            <InputField
              name='password'
              type='password'
              placeholder='PASSWORD'
            />

            <Button disabled={isSubmitting} type='submit' fullWidth>
              log in
            </Button>
          </Form>
        )}
      </Formik>
      <small>
        New to Reddit?{' '}
        <Link href='/register'>
          <a className='ml-1 font-bold text-blue-500 uppercase'>Sign up</a>
        </Link>
      </small>
    </FormWrapper>
  );
};

export default Login;
