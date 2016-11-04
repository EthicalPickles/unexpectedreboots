class MarkupPanel extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      markups: []
    };
  }

  fetchMarkupsFor(groupid) {
    var context = this;

    if (groupid === null) {
      fetch(SERVER_IP + ':3000/test/users/markups', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username: getUsername()})
      })
      .then(function(res) {
        return res.json();
      })
      .then(function(value) {
        context.setState({
          markups: value.reverse()
        });
      }); 
    } else {
      fetch(SERVER_IP + ':3000/test/groups/markups', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({groupID: context.props.groupid}) //TODO: change to groupid passed into function
      })
      .then(function(res) {
        return res.json();
      })
      .then(function(value) {
        console.log('Setting markups', value[0]);
        context.setState({
          markups: value[0].reverse()
        });
      }); 
    }
  }

  componentDidMount() {
    this.fetchMarkupsFor(this.props.groupid);
  }

  render() {
    return (
      <div className='container col-sm-6 panel'>
        <div className='panel-title'>Markup Panel</div>
          { this.state.markups.map(function(markup) { //change to the makkups held in 'state'
            console.log(markup);
            return (
             <div className='entry'>
                <MarkupEntry markup={markup} />
              </div>
            );
          })
        }
      </div>
    );
  }
}


window.MarkupPanel = MarkupPanel;
