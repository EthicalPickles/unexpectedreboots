class App extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      view: 'home',
      groupid: null
    };

  }
  
  
  componentDidMount() {
    
  }

  changeView(event, state, groupid, owner) {
    this.setState({
      view: state, 
      groupid: groupid,
      owner: owner || false
    });
  }


  logoutCb() {
    // document.cookies = '';
    window.close();
  }

  
  render() {
    return (
      <Views owner={this.state.owner} groupid={this.state.groupid} viewType={this.state.view} changeViewCb={this.changeView.bind(this)} logoutCb={this.logoutCb.bind(this)}/>
    );
  }
}

window.App = App;
