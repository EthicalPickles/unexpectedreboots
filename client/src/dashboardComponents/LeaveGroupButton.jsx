class LeaveGroupButton extends React.Component {
  constructor(props) {
    super(props);
  }


  componentDidMount() {
    this.handleGroupLeave();
  }

  handleGroupLeave() {
    var context = this;

    $(document).ready(function() {

      $('.leave').click(function() {
        $.ajax({
          url: SERVER_IP + ':3000/api/groups/edit',
          method: 'POST',
          data: {
            groupID: context.props.groupid,
            username: getUsername()
          },
          success: function(data) {
            if (data === true) {
            //get rid of the modal
              leaveGroup.close();
            //reroute to home page?
              console.log('Server removed you from group');
            } else {
            //get rid of the modal
              leaveGroup.close();
              console.log('Server couldn\'t edit groups!');
            } 
          }
        });
        return false;
      });
    });
  }


  render() {
    return (
    <a href="#group-leave-modal">
      <div className='col-sm-4 user-bttn leave'>
        <div>Leave Group</div>
      </div>
    </a>
    );
  }
}


window.LeaveGroupButton = LeaveGroupButton;