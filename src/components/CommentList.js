import { ctx } from '@/biz/context'
import { Comment } from '@/components'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import './CommentList.scss'

function CommentListFn(props) {
  const comments = props.comments.filter((c) => c.postKey === props.postKey)

  useEffect(() => {
    // 댓글 목록 로드
    if (comments.length === 0 && props.commentCnt > 0) {
      ctx.api.getComments(props.postKey).then((res) => {
        props.addComments(res.comments)
      })
    }
  }, [])

  return (
    <div className="CommentList">
      {comments.map((comment) => (
        <Comment
          history={props.history}
          key={comment.key}
          comment={comment}
          context={props.context}
        />
      ))}
    </div>
  )
}

export const CommentList = connect(
  (state) => ({
    comments: state.data.comments,
  }),
  { addComments: ctx.action.addComments },
)(CommentListFn)
