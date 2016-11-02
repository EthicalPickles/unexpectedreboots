class GroupPanel extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      groups: []
    };
  }

  
  fetchGroups() {
    var context = this;

    fetch(SERVER_IP + ':3000/test/users/groups', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username: getUsername()})
    })
    .then(function(res) {
      return res.json();
    })
    .then(function(value) {
      context.setState({
        groups: value
      });
    });

  }


  handleGroupCreation() {
    var context = this;

    $(document).ready(function() {

      $('.group').click(function() {
        $.ajax({
          url: SERVER_IP + ':3000/test/groups/create',
          method: 'POST',
          data: {
            groupName: $('.groupName').val(),
            owner: getUsername() 
          },
          success: function(data) {
            if (data === true) {
            //get rid of the modal
              askGroup.close();
            //rerender the GroupPanel controller
              context.fetchGroups();
            } else {
            //get rid of the modal
              askGroup.close();
            //show a 'duplicate group modal'
              failGroup.open();
            } 
          }
        });
        return false;
      });
    });
  }

  
  componentDidMount() {
    this.fetchGroups();
    this.handleGroupCreation();
  }

  



  render() {
  

    return (
      <div>
        <AddGroup />
        { this.state.groups.filter((group) => {
          return (group.userid === group.groupowner);
        }).map((group) => {
          return (
            <div>
              <Group group={group} changeViewCb={this.props.changeViewCb} />
            </div>
        ); }) }

        { this.state.groups.filter((group) => {
          return (group.userid !== group.groupowner);
        }).map((group) => {
          return (
            <div>
              <Group group={group} changeViewCb={this.props.changeViewCb} />
            </div>
        ); }) }
      </div>
    );
  }
}


window.GroupPanel = GroupPanel;