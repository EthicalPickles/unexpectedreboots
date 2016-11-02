var Views = (props) => {

  if (props.viewType === 'home') {
    return (
      <div className='container'>
        <Heading title={'Dashboard'} changeViewCb={props.changeViewCb} logoutCb={props.logoutCb}/>
        <MarkupPanel groupid={props.groupid} markups={[1, 2, 3, 4, 5, 6, 7, 8]} />
        <GroupPanel changeViewCb={props.changeViewCb} />
      </div>
    );
  } else {
  //make this the callback to a get request for the user's group data and pass it into the three panels
  // but what if someone makes a group named 'home' ????
    return (
      <div className='container'>
        <Heading title={props.viewType} changeViewCb={props.changeViewCb} logoutCb={props.logoutCb} />        
        <UserPanel owner={props.owner} groupid={props.groupid} />
        <MarkupPanel groupid={props.groupid} markups={[1, 2]} />
        <SharedPanel groupid={props.groupid} sites={[1, 2, 3]} />
        <LeaveGroupButton groupid={props.groupid} />
      </div>
    ); 
  }


};

window.Views = Views;
