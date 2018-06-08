import React from 'react';

import SidebarUser from './sidebar_user';

class ChatSidebar extends React.Component{

  renderUsers(){
    return this.props.users.map(user => <SidebarUser userName={user} />)
  }

  render(){
    return(
      <div className="chat__sidebar">
        <h3>Users</h3>
        <div id="users">
          <ul>{this.renderUsers()}</ul>
        </div>
      </div>
    )
  }

}

export default ChatSidebar