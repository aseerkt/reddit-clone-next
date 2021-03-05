import { gql, ApolloCache } from '@apollo/client';
import cn from 'classnames';
import {
  useVoteCommentMutation,
  useVotePostMutation,
  VoteCommentMutation,
  VotePostMutation,
} from '../generated/graphql';

interface VoteSectionProps {
  postId?: string;
  commentId?: string;
  userVote: number;
  voteScore: number;
}

function setVoteScore<MutationType>(
  cache: ApolloCache<MutationType>,
  id: string,
  userVote: number | null,
  voteScore: number,
  value: 1 | -1,
  type: 'post' | 'comment'
) {
  // Calculate Score Change
  let scoreChange = 0;
  if (userVote) {
    if (userVote === value) {
      scoreChange = value === 1 ? -1 : 1;
    } else {
      scoreChange = value === 1 ? 2 : -2;
    }
  } else {
    scoreChange = value;
  }
  console.log('before write fragment');

  // Write Score Change into the cache

  const FragmentName = type === 'post' ? '_P' : '_C';
  const FragmentOnType = type === 'post' ? 'Post' : 'Comment';
  const FragmentId = (type === 'post' ? 'Post:' : 'Comment:') + id;

  cache.writeFragment<{
    id: string;
    userVote: 1 | -1 | null;
    voteScore: number;
  }>({
    id: FragmentId,
    fragment: gql`
      fragment ${FragmentName} on ${FragmentOnType} {
        id
        userVote
        voteScore
      }
    `,
    data: {
      id,
      userVote: userVote === value ? null : value,
      voteScore: voteScore + scoreChange,
    },
  });
}

const VoteSection: React.FC<VoteSectionProps> = ({
  postId,
  commentId,
  userVote,
  voteScore,
}) => {
  const [votePost] = useVotePostMutation();
  const [voteComment] = useVoteCommentMutation();

  const onVoteClickAction = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const value = e.currentTarget.getAttribute('title') === 'upvote' ? 1 : -1;
    console.log(value);
    if (postId) {
      votePost({
        variables: { postId, value },
        update: (cache, { data }) => {
          if (data.votePost)
            setVoteScore<VotePostMutation>(
              cache,
              postId,
              userVote,
              voteScore,
              value,
              'post'
            );
        },
      });
    } else if (commentId) {
      voteComment({
        variables: { commentId, value },
        update: (cache, { data }) => {
          if (data.voteComment)
            setVoteScore<VoteCommentMutation>(
              cache,
              commentId,
              userVote,
              voteScore,
              value,
              'comment'
            );
        },
      });
    }
  };

  return (
    <>
      {/* Upvote */}
      <div
        title='upvote'
        onClick={onVoteClickAction}
        className={cn(
          'w-6 h-6 mx-auto text-center  cursor-pointer text-gray-400 rounded hover:bg-gray-300 hover:text-red-500',
          {
            'text-red-500 bg-gray-300': userVote === 1,
          }
        )}
      >
        <i className='my-auto icon-arrow-up'></i>
      </div>

      {/* VoteScore */}
      <span className='w-6 text-sm font-bold text-center align-middle'>
        {voteScore}
      </span>

      {/* Downvote */}
      <div
        title='downvote'
        onClick={onVoteClickAction}
        className={cn(
          'w-6 h-6 mx-auto cursor-pointer  text-center text-gray-400 rounded hover:bg-gray-300 hover:text-blue-600',
          { 'bg-gray-300 text-blue-600': userVote === -1 }
        )}
      >
        <i className='align-middle icon-arrow-down'></i>
      </div>
    </>
  );
};

export default VoteSection;
