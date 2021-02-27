import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type BaseColumns = {
  __typename?: 'BaseColumns';
  id: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};


export type Sub = {
  __typename?: 'Sub';
  id: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  name: Scalars['String'];
  title: Scalars['String'];
  description: Scalars['String'];
  imageUrn?: Maybe<Scalars['String']>;
  bannerUrn?: Maybe<Scalars['String']>;
  username: Scalars['String'];
  imageUrl: Scalars['String'];
  bannerUrl?: Maybe<Scalars['String']>;
  posts: Array<Post>;
};

export type Vote = {
  __typename?: 'Vote';
  id: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  value: Scalars['Int'];
  username: Scalars['String'];
};

export type Comment = {
  __typename?: 'Comment';
  id: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  text: Scalars['String'];
  username: Scalars['String'];
};

export type Post = {
  __typename?: 'Post';
  id: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  identifier: Scalars['String'];
  slug: Scalars['String'];
  title: Scalars['String'];
  body: Scalars['String'];
  url: Scalars['String'];
  commentCount: Scalars['Int'];
  voteScore: Scalars['Int'];
  userVote?: Maybe<Scalars['Int']>;
  username: Scalars['String'];
  subName: Scalars['String'];
  creator: User;
  sub: Sub;
  comments: Array<Comment>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  email: Scalars['String'];
  username: Scalars['String'];
};

export type FieldError = {
  __typename?: 'FieldError';
  path: Scalars['String'];
  message: Scalars['String'];
};

export type DefaultResponse = {
  __typename?: 'DefaultResponse';
  ok: Scalars['Boolean'];
  errors?: Maybe<Array<FieldError>>;
};

export type AddSubImageResponse = {
  __typename?: 'AddSubImageResponse';
  type: Scalars['String'];
  Urn: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  user?: Maybe<User>;
  errors?: Maybe<Array<FieldError>>;
};

export type Query = {
  __typename?: 'Query';
  getPosts: Array<Post>;
  getPost?: Maybe<Post>;
  getSub?: Maybe<Sub>;
  hello: Scalars['String'];
  me?: Maybe<User>;
};


export type QueryGetPostArgs = {
  identifier: Scalars['String'];
  slug: Scalars['String'];
};


export type QueryGetSubArgs = {
  subName: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createPost: DefaultResponse;
  commentPost: Scalars['Boolean'];
  addSubImage: AddSubImageResponse;
  createSub: DefaultResponse;
  register: UserResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
  votePost: Scalars['Boolean'];
  voteComment: Scalars['Boolean'];
};


export type MutationCreatePostArgs = {
  title: Scalars['String'];
  body?: Maybe<Scalars['String']>;
  subName: Scalars['String'];
};


export type MutationCommentPostArgs = {
  text: Scalars['String'];
  identifier: Scalars['String'];
  slug: Scalars['String'];
};


export type MutationAddSubImageArgs = {
  file: Scalars['Upload'];
  type: Scalars['String'];
  subName: Scalars['String'];
};


export type MutationCreateSubArgs = {
  name: Scalars['String'];
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
};


export type MutationRegisterArgs = {
  email: Scalars['String'];
  username: Scalars['String'];
  password: Scalars['String'];
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  usernameOrEmail: Scalars['String'];
};


export type MutationVotePostArgs = {
  value: Scalars['Int'];
  postId: Scalars['String'];
};


export type MutationVoteCommentArgs = {
  value: Scalars['Int'];
  commentId: Scalars['String'];
};


export type ErrorFieldFragment = (
  { __typename?: 'FieldError' }
  & Pick<FieldError, 'path' | 'message'>
);

export type PostFieldFragment = (
  { __typename?: 'Post' }
  & Pick<Post, 'id' | 'slug' | 'identifier' | 'title' | 'body' | 'username' | 'subName' | 'url' | 'commentCount' | 'voteScore' | 'userVote' | 'createdAt' | 'updatedAt'>
);

export type RegularDefaultResponseFragment = (
  { __typename?: 'DefaultResponse' }
  & Pick<DefaultResponse, 'ok'>
  & { errors?: Maybe<Array<(
    { __typename?: 'FieldError' }
    & ErrorFieldFragment
  )>> }
);

export type RegularSubFragment = (
  { __typename?: 'Sub' }
  & Pick<Sub, 'id' | 'title' | 'name' | 'description' | 'username' | 'imageUrl' | 'bannerUrl'>
  & { posts: Array<(
    { __typename?: 'Post' }
    & PostFieldFragment
  )> }
);

export type RegularUserResponseFragment = (
  { __typename?: 'UserResponse' }
  & { user?: Maybe<(
    { __typename?: 'User' }
    & UserFieldFragment
  )>, errors?: Maybe<Array<(
    { __typename?: 'FieldError' }
    & ErrorFieldFragment
  )>> }
);

export type UserFieldFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'username' | 'email'>
);

export type AddSubImageMutationVariables = Exact<{
  file: Scalars['Upload'];
  type: Scalars['String'];
  subName: Scalars['String'];
}>;


export type AddSubImageMutation = (
  { __typename?: 'Mutation' }
  & { addSubImage: (
    { __typename?: 'AddSubImageResponse' }
    & Pick<AddSubImageResponse, 'type' | 'Urn'>
  ) }
);

export type CommentPostMutationVariables = Exact<{
  text: Scalars['String'];
  identifier: Scalars['String'];
  slug: Scalars['String'];
}>;


export type CommentPostMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'commentPost'>
);

export type CreatePostMutationVariables = Exact<{
  title: Scalars['String'];
  body?: Maybe<Scalars['String']>;
  subName: Scalars['String'];
}>;


export type CreatePostMutation = (
  { __typename?: 'Mutation' }
  & { createPost: (
    { __typename?: 'DefaultResponse' }
    & RegularDefaultResponseFragment
  ) }
);

export type CreateSubMutationVariables = Exact<{
  name: Scalars['String'];
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
}>;


export type CreateSubMutation = (
  { __typename?: 'Mutation' }
  & { createSub: (
    { __typename?: 'DefaultResponse' }
    & RegularDefaultResponseFragment
  ) }
);

export type LoginMutationVariables = Exact<{
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & RegularUserResponseFragment
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type RegisterMutationVariables = Exact<{
  email: Scalars['String'];
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'UserResponse' }
    & RegularUserResponseFragment
  ) }
);

export type VoteCommentMutationVariables = Exact<{
  value: Scalars['Int'];
  commentId: Scalars['String'];
}>;


export type VoteCommentMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'voteComment'>
);

export type VotePostMutationVariables = Exact<{
  postId: Scalars['String'];
  value: Scalars['Int'];
}>;


export type VotePostMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'votePost'>
);

export type GetPostQueryVariables = Exact<{
  identifier: Scalars['String'];
  slug: Scalars['String'];
}>;


export type GetPostQuery = (
  { __typename?: 'Query' }
  & { getPost?: Maybe<(
    { __typename?: 'Post' }
    & PostFieldFragment
  )> }
);

export type GetPostsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPostsQuery = (
  { __typename?: 'Query' }
  & { getPosts: Array<(
    { __typename?: 'Post' }
    & PostFieldFragment
  )> }
);

export type GetSubQueryVariables = Exact<{
  subName: Scalars['String'];
}>;


export type GetSubQuery = (
  { __typename?: 'Query' }
  & { getSub?: Maybe<(
    { __typename?: 'Sub' }
    & RegularSubFragment
  )> }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'email' | 'username'>
  )> }
);

export const ErrorFieldFragmentDoc = gql`
    fragment ErrorField on FieldError {
  path
  message
}
    `;
export const RegularDefaultResponseFragmentDoc = gql`
    fragment RegularDefaultResponse on DefaultResponse {
  ok
  errors {
    ...ErrorField
  }
}
    ${ErrorFieldFragmentDoc}`;
export const PostFieldFragmentDoc = gql`
    fragment PostField on Post {
  id
  slug
  identifier
  title
  body
  username
  subName
  url
  commentCount
  voteScore
  userVote
  createdAt
  updatedAt
}
    `;
export const RegularSubFragmentDoc = gql`
    fragment RegularSub on Sub {
  id
  title
  name
  description
  username
  imageUrl
  bannerUrl
  posts {
    ...PostField
  }
}
    ${PostFieldFragmentDoc}`;
export const UserFieldFragmentDoc = gql`
    fragment UserField on User {
  id
  username
  email
}
    `;
export const RegularUserResponseFragmentDoc = gql`
    fragment RegularUserResponse on UserResponse {
  user {
    ...UserField
  }
  errors {
    ...ErrorField
  }
}
    ${UserFieldFragmentDoc}
${ErrorFieldFragmentDoc}`;
export const AddSubImageDocument = gql`
    mutation AddSubImage($file: Upload!, $type: String!, $subName: String!) {
  addSubImage(file: $file, type: $type, subName: $subName) {
    type
    Urn
  }
}
    `;
export type AddSubImageMutationFn = Apollo.MutationFunction<AddSubImageMutation, AddSubImageMutationVariables>;

/**
 * __useAddSubImageMutation__
 *
 * To run a mutation, you first call `useAddSubImageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddSubImageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addSubImageMutation, { data, loading, error }] = useAddSubImageMutation({
 *   variables: {
 *      file: // value for 'file'
 *      type: // value for 'type'
 *      subName: // value for 'subName'
 *   },
 * });
 */
export function useAddSubImageMutation(baseOptions?: Apollo.MutationHookOptions<AddSubImageMutation, AddSubImageMutationVariables>) {
        return Apollo.useMutation<AddSubImageMutation, AddSubImageMutationVariables>(AddSubImageDocument, baseOptions);
      }
export type AddSubImageMutationHookResult = ReturnType<typeof useAddSubImageMutation>;
export type AddSubImageMutationResult = Apollo.MutationResult<AddSubImageMutation>;
export type AddSubImageMutationOptions = Apollo.BaseMutationOptions<AddSubImageMutation, AddSubImageMutationVariables>;
export const CommentPostDocument = gql`
    mutation CommentPost($text: String!, $identifier: String!, $slug: String!) {
  commentPost(text: $text, identifier: $identifier, slug: $slug)
}
    `;
export type CommentPostMutationFn = Apollo.MutationFunction<CommentPostMutation, CommentPostMutationVariables>;

/**
 * __useCommentPostMutation__
 *
 * To run a mutation, you first call `useCommentPostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCommentPostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [commentPostMutation, { data, loading, error }] = useCommentPostMutation({
 *   variables: {
 *      text: // value for 'text'
 *      identifier: // value for 'identifier'
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function useCommentPostMutation(baseOptions?: Apollo.MutationHookOptions<CommentPostMutation, CommentPostMutationVariables>) {
        return Apollo.useMutation<CommentPostMutation, CommentPostMutationVariables>(CommentPostDocument, baseOptions);
      }
export type CommentPostMutationHookResult = ReturnType<typeof useCommentPostMutation>;
export type CommentPostMutationResult = Apollo.MutationResult<CommentPostMutation>;
export type CommentPostMutationOptions = Apollo.BaseMutationOptions<CommentPostMutation, CommentPostMutationVariables>;
export const CreatePostDocument = gql`
    mutation CreatePost($title: String!, $body: String, $subName: String!) {
  createPost(title: $title, body: $body, subName: $subName) {
    ...RegularDefaultResponse
  }
}
    ${RegularDefaultResponseFragmentDoc}`;
export type CreatePostMutationFn = Apollo.MutationFunction<CreatePostMutation, CreatePostMutationVariables>;

/**
 * __useCreatePostMutation__
 *
 * To run a mutation, you first call `useCreatePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPostMutation, { data, loading, error }] = useCreatePostMutation({
 *   variables: {
 *      title: // value for 'title'
 *      body: // value for 'body'
 *      subName: // value for 'subName'
 *   },
 * });
 */
export function useCreatePostMutation(baseOptions?: Apollo.MutationHookOptions<CreatePostMutation, CreatePostMutationVariables>) {
        return Apollo.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument, baseOptions);
      }
export type CreatePostMutationHookResult = ReturnType<typeof useCreatePostMutation>;
export type CreatePostMutationResult = Apollo.MutationResult<CreatePostMutation>;
export type CreatePostMutationOptions = Apollo.BaseMutationOptions<CreatePostMutation, CreatePostMutationVariables>;
export const CreateSubDocument = gql`
    mutation CreateSub($name: String!, $title: String!, $description: String) {
  createSub(name: $name, title: $title, description: $description) {
    ...RegularDefaultResponse
  }
}
    ${RegularDefaultResponseFragmentDoc}`;
export type CreateSubMutationFn = Apollo.MutationFunction<CreateSubMutation, CreateSubMutationVariables>;

/**
 * __useCreateSubMutation__
 *
 * To run a mutation, you first call `useCreateSubMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSubMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSubMutation, { data, loading, error }] = useCreateSubMutation({
 *   variables: {
 *      name: // value for 'name'
 *      title: // value for 'title'
 *      description: // value for 'description'
 *   },
 * });
 */
export function useCreateSubMutation(baseOptions?: Apollo.MutationHookOptions<CreateSubMutation, CreateSubMutationVariables>) {
        return Apollo.useMutation<CreateSubMutation, CreateSubMutationVariables>(CreateSubDocument, baseOptions);
      }
export type CreateSubMutationHookResult = ReturnType<typeof useCreateSubMutation>;
export type CreateSubMutationResult = Apollo.MutationResult<CreateSubMutation>;
export type CreateSubMutationOptions = Apollo.BaseMutationOptions<CreateSubMutation, CreateSubMutationVariables>;
export const LoginDocument = gql`
    mutation Login($usernameOrEmail: String!, $password: String!) {
  login(usernameOrEmail: $usernameOrEmail, password: $password) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      usernameOrEmail: // value for 'usernameOrEmail'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, baseOptions);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, baseOptions);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($email: String!, $username: String!, $password: String!) {
  register(email: $email, username: $username, password: $password) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      email: // value for 'email'
 *      username: // value for 'username'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, baseOptions);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const VoteCommentDocument = gql`
    mutation VoteComment($value: Int!, $commentId: String!) {
  voteComment(value: $value, commentId: $commentId)
}
    `;
export type VoteCommentMutationFn = Apollo.MutationFunction<VoteCommentMutation, VoteCommentMutationVariables>;

/**
 * __useVoteCommentMutation__
 *
 * To run a mutation, you first call `useVoteCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVoteCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [voteCommentMutation, { data, loading, error }] = useVoteCommentMutation({
 *   variables: {
 *      value: // value for 'value'
 *      commentId: // value for 'commentId'
 *   },
 * });
 */
export function useVoteCommentMutation(baseOptions?: Apollo.MutationHookOptions<VoteCommentMutation, VoteCommentMutationVariables>) {
        return Apollo.useMutation<VoteCommentMutation, VoteCommentMutationVariables>(VoteCommentDocument, baseOptions);
      }
export type VoteCommentMutationHookResult = ReturnType<typeof useVoteCommentMutation>;
export type VoteCommentMutationResult = Apollo.MutationResult<VoteCommentMutation>;
export type VoteCommentMutationOptions = Apollo.BaseMutationOptions<VoteCommentMutation, VoteCommentMutationVariables>;
export const VotePostDocument = gql`
    mutation VotePost($postId: String!, $value: Int!) {
  votePost(postId: $postId, value: $value)
}
    `;
export type VotePostMutationFn = Apollo.MutationFunction<VotePostMutation, VotePostMutationVariables>;

/**
 * __useVotePostMutation__
 *
 * To run a mutation, you first call `useVotePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVotePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [votePostMutation, { data, loading, error }] = useVotePostMutation({
 *   variables: {
 *      postId: // value for 'postId'
 *      value: // value for 'value'
 *   },
 * });
 */
export function useVotePostMutation(baseOptions?: Apollo.MutationHookOptions<VotePostMutation, VotePostMutationVariables>) {
        return Apollo.useMutation<VotePostMutation, VotePostMutationVariables>(VotePostDocument, baseOptions);
      }
export type VotePostMutationHookResult = ReturnType<typeof useVotePostMutation>;
export type VotePostMutationResult = Apollo.MutationResult<VotePostMutation>;
export type VotePostMutationOptions = Apollo.BaseMutationOptions<VotePostMutation, VotePostMutationVariables>;
export const GetPostDocument = gql`
    query GetPost($identifier: String!, $slug: String!) {
  getPost(identifier: $identifier, slug: $slug) {
    ...PostField
  }
}
    ${PostFieldFragmentDoc}`;

/**
 * __useGetPostQuery__
 *
 * To run a query within a React component, call `useGetPostQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPostQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPostQuery({
 *   variables: {
 *      identifier: // value for 'identifier'
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function useGetPostQuery(baseOptions: Apollo.QueryHookOptions<GetPostQuery, GetPostQueryVariables>) {
        return Apollo.useQuery<GetPostQuery, GetPostQueryVariables>(GetPostDocument, baseOptions);
      }
export function useGetPostLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPostQuery, GetPostQueryVariables>) {
          return Apollo.useLazyQuery<GetPostQuery, GetPostQueryVariables>(GetPostDocument, baseOptions);
        }
export type GetPostQueryHookResult = ReturnType<typeof useGetPostQuery>;
export type GetPostLazyQueryHookResult = ReturnType<typeof useGetPostLazyQuery>;
export type GetPostQueryResult = Apollo.QueryResult<GetPostQuery, GetPostQueryVariables>;
export const GetPostsDocument = gql`
    query GetPosts {
  getPosts {
    ...PostField
  }
}
    ${PostFieldFragmentDoc}`;

/**
 * __useGetPostsQuery__
 *
 * To run a query within a React component, call `useGetPostsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPostsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPostsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPostsQuery(baseOptions?: Apollo.QueryHookOptions<GetPostsQuery, GetPostsQueryVariables>) {
        return Apollo.useQuery<GetPostsQuery, GetPostsQueryVariables>(GetPostsDocument, baseOptions);
      }
export function useGetPostsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPostsQuery, GetPostsQueryVariables>) {
          return Apollo.useLazyQuery<GetPostsQuery, GetPostsQueryVariables>(GetPostsDocument, baseOptions);
        }
export type GetPostsQueryHookResult = ReturnType<typeof useGetPostsQuery>;
export type GetPostsLazyQueryHookResult = ReturnType<typeof useGetPostsLazyQuery>;
export type GetPostsQueryResult = Apollo.QueryResult<GetPostsQuery, GetPostsQueryVariables>;
export const GetSubDocument = gql`
    query GetSub($subName: String!) {
  getSub(subName: $subName) {
    ...RegularSub
  }
}
    ${RegularSubFragmentDoc}`;

/**
 * __useGetSubQuery__
 *
 * To run a query within a React component, call `useGetSubQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSubQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSubQuery({
 *   variables: {
 *      subName: // value for 'subName'
 *   },
 * });
 */
export function useGetSubQuery(baseOptions: Apollo.QueryHookOptions<GetSubQuery, GetSubQueryVariables>) {
        return Apollo.useQuery<GetSubQuery, GetSubQueryVariables>(GetSubDocument, baseOptions);
      }
export function useGetSubLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSubQuery, GetSubQueryVariables>) {
          return Apollo.useLazyQuery<GetSubQuery, GetSubQueryVariables>(GetSubDocument, baseOptions);
        }
export type GetSubQueryHookResult = ReturnType<typeof useGetSubQuery>;
export type GetSubLazyQueryHookResult = ReturnType<typeof useGetSubLazyQuery>;
export type GetSubQueryResult = Apollo.QueryResult<GetSubQuery, GetSubQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
    email
    username
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;