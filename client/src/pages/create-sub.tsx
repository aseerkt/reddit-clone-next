import { Formik, Form } from 'formik';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import Button from '../shared/Button';
import FormWrapper from '../components/FormWrapper';
import InputField from '../shared/InputField';
import {
  MeDocument,
  useCreateSubMutation,
  MeQuery,
} from '../generated/graphql';
import { createApolloClient } from '../utils/createApolloClient';
import { getErrorMap } from '../utils/getErrorMap';

const CreateSub = () => {
  const router = useRouter();
  // const { next }: any = router.query;
  const [createSub, { loading }] = useCreateSubMutation();
  return (
    <FormWrapper title='Create Community'>
      <Formik
        initialValues={{ name: '', title: '', description: '' }}
        onSubmit={async (values, action) => {
          console.log(values);
          try {
            const res = await createSub({ variables: values });
            const { errors, ok } = res.data.createSub;

            if (errors) {
              action.setErrors(getErrorMap(errors));
            }
            if (ok) {
              router.push(`/r/${values.name}`);
            }
          } catch (err) {
            console.error(err);
          }
          action.setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form className='mt-10'>
            <InputField
              labelText='Name'
              helperText='Community names including capitalization cannot be changed'
              name='name'
              type='text'
              // placeholder='NAME'
            />
            <InputField
              labelText='Title'
              helperText='Community title represent the topic and you can change it any time'
              name='title'
              type='text'
              // placeholder='TITLE'
            />
            <InputField
              labelText='Description'
              helperText='This is how new members come to understand you community'
              name='description'
              // placeholder='DESCRIPTION'
            />

            <Button
              uppercase={false}
              disabled={isSubmitting}
              type='submit'
              isLoading={loading}
              fullWidth
            >
              Create Community
            </Button>
          </Form>
        )}
      </Formik>
      {/* <small>
        New to Reddit?{' '}
        <Link href='/register'>
          <a className='ml-1 font-bold text-blue-500 uppercase'>Sign up</a>
        </Link>
      </small> */}
    </FormWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  try {
    const cookie = req.headers.cookie;
    if (!cookie) throw new Error('No cookie in headers');
    const res = await createApolloClient().query<MeQuery>({
      query: MeDocument,
      context: {
        headers: { cookie },
      },
    });
    const user = res.data.me;
    if (!user) throw new Error('User not logged in');
    return { props: {} };
  } catch (err) {
    console.log(err);
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
};

export default CreateSub;
