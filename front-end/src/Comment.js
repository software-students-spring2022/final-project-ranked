import React from "react"
import axios from "axios"
import "./css/Comment.css"
import "./css/CommentSection.css"
// import LikeButton from "./Components/likeButton";
// import Button from "react-bootstrap/esm/Button"
import CommentForm from "./CommentSubmitForm"
import _ from 'lodash'


const Comment = props => {
  const [wantReply, setwantReply] = React.useState(false)

  const PreviousComment = props => {
    let prev = props.previous.user_id
    let prevText = props.previous.text
    let id = props.previous._id

    return (
      <section className="previous">
      <pre>
          <p><small>{id}({prev}) ---&gt; {id}({props.user})</small> </p>
          <h4>{prev} Wrote: </h4>
          <p>{prevText}</p>
          <h4>===========================================================================================================================</h4>
      </pre>      

      </section>
    )
  }
  /*
  const indent = num => {
    const i = "|     "
    let ans = ""
    let a = 0
    while (a < num) {
      ans += i
      a++
    }
    return ans
  }
  */
  const indent = "      "

  const handleClick = () => {
    setwantReply(!wantReply)
  }

  const handleDelete = () => {
    axios
      .post(`${process.env.REACT_APP_SERVER_HOSTNAME}/${props.details._id}/comment/delete`, {
        user: props.user
      })
      .then((response) => {
        // success
        console.log(`Deleted comment ${response.data.comment}`)
        props.setNewComment(response.data.comment)
      })
      .catch((err) => {
        // failure
        console.log(`Received server error: ${err}`)
      })
  }

  return (
    <div className="Comment">

      <div className="Comment-body" onClick={handleClick}>

      {props.previous ? <PreviousComment id={props.details.id} user={props.details.user_id} previous={props.previous} /> : <br></br>}

        <section className="user">
          {props.user.username === props.details.user_id && <button onClick={handleDelete}> delete </button>}
          <pre>
            <p>{indent}<a id={props.details._id}>id: {props.details._id}</a></p>
            <p>{indent}user: {props.details.user_id}</p>
            <p>{indent}time: {props.details.time}</p>
          </pre>
        </section>
        
        <section className="body">
          <pre>
            <p>{indent}{props.details.text}</p>
            {/* <p>{indent}<LikeButton props={props}></LikeButton>likes: {props.details.likes}</p> */}
          </pre>
        </section>
      </div>
      <section className="replyform">
            {wantReply && !_.isEmpty(props.user) && <CommentForm user={props.user} replyTo={props.details._id} setNewComment={props.setNewComment}/>}
        </section>

      <section className="replies">
        {props.details.replies && props.details.replies.map(item => (
          <Comment user={props.user} key={item._id} type={props.type + 1} details={item} setNewComment={props.setNewComment} previous={props.details}></Comment>
        ))}
      </section>
    </div>
  )
}


export default Comment
