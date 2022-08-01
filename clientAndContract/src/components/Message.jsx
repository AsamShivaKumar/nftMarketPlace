import React from 'react';
import "../styles/message.css";

function Message(props){
    return (
      <div className='message'>{ props.msg }</div>
    );
}

export default Message;