import React from 'react';

import SidebarUser from './sidebar_user';

const users = [{userName: "Admin"}, {userName: "User"}]

class ChatSidebar extends React.Component{

  renderUsers(){
    return users.map(user => <SidebarUser userName={user.userName} />)
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