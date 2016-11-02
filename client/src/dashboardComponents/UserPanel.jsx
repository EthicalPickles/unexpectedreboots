class UserPanel extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      users: []
    };
  }

  fetchUsers() {
    var context = this;

    fetch(SERVER_IP + ':3000/test/groups/users', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({groupID: this.props.groupid})
    })
    .then(function(res) {
      return res.json();
    })
    .then(function(value) {
      context.setState({
        users: value
      });
    });
  }

  handleUserAddition() {
    var context = this;

    $(document).ready(function() {
      

     $('button.user').click(function() {
        $.ajax({
          url: SERVER_IP + ':3000/test/groups/add',
          method: 'POST',
          data: {
            groupID: context.props.groupid, 
            username: getUsername(),
            newMember: $('.newMember').val()
          },
          success: function(data) {
            console.log(data);
            if (data === true) {
              askUser.close();
              context.fetchUsers();
            } else if (data === 'cannot add a user that is already a member of the group') {
              askUser.close();
              failAlreadyUser.open();
            } else {
              askUser.close();
              failUser.open();
            }
          }
        });
        return false;
      });
    });

  }

  componentDidMount() {
    this.fetchUsers();
    this.handleUserAddition();
  }


  render() {
    var context = this;
    return (
      <div className='row col-sm-12 user-panel'>
        { this.state.users.map(function(user) {
          return (
            <div>
              <User user={user} />
            </div>
          ); })
        }
        {function() {
          if (context.state.users.length < 6 && context.props.owner) {
            return (
              <div>
                <AddUser />
              </div>
            );
          }
        }()}
      </div>
    );
  }

}


window.UserPanel = UserPanel;

//cannot add a user that is already a member of the group
 //user is already part of a group called ''...
