import { gql, ApolloCache } from '@apollo/client';
import cn from 'classnames';
import { useVotePostMutation, VotePostMutation } from '../generated/graphql';

interface VoteSectionProps {
  postId?: string;
  commentId?: string;
  userVote: number;
  voteScore: number;
}

function setPostScore(
  cache: ApolloCache<VotePostMutation>,
  id: string,
  userVote: number | null,
  voteScore: number,
  value: 1 | -1
) {
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
  cache.writeFragment({
    fragment: gql`
      fragment _ on Post {
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
    id: 'Post:' + id,
  });
}

const VoteSection: React.FC<VoteSectionProps> = ({
  postId,
  userVote,
  voteScore,
}) => {
  const [votePost] = useVotePostMutation();

  return (
    <>
      {/* Upvote */}
      <div
        onClick={() => {
          votePost({
            variables: { postId, value: 1 },
            update: (cache, { data }) => {
              if (data.votePost)
                setPostScore(cache, postId, userVote, voteScore, 1);
            },
          });
        }}
        className={cn(
          'w-6 mx-auto text-gray-400 rounded hover:bg-gray-300 hover:text-red-500',
          {
            'text-red-500 bg-gray-300': userVote === 1,
          }
        )}
      >
        <i className='icon-arrow-up'></i>
      </div>

      {/* VoteScore */}
      <span className='text-sm font-bold'>{voteScore}</span>

      {/* Downvote */}
      <div
        onClick={() => {
          votePost({
            variables: { postId, value: -1 },
            update: (cache, { data }) => {
              if (data.votePost)
                setPostScore(cache, postId, userVote, voteScore, -1);
            },
          });
        }}
        className={cn(
          'w-6 mx-auto text-gray-400 rounded hover:bg-gray-300 hover:text-blue-600',
          { 'bg-gray-300 text-blue-600': userVote === -1 }
        )}
      >
        <i className='icon-arrow-down'></i>
      </div>
    </>
  );
};

export default VoteSection;
