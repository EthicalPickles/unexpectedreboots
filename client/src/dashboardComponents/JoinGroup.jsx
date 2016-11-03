var JoinGroup = (props) => {



  return (
    <div >
      <div className='col-sm-2 col-sm-offset-1 join-group-bttn'>
        <div className="dropdown">
          <button className="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown" onClick={props.toggleDropdownCb}>Join Group
            <span className="caret"></span>
          </button>
          <ul className="dropdown-menu" role="menu" aria-labelledby="menu1">
            {
              props.allGroups.map( (group) => {
                return (
                  <li role="presentation" key={group.id} onClick={props.joinGroupCb}><a role="menuitem" href="#">{group.name}</a></li>
                )
              })
            }
          </ul>
        </div>
      </div>
    </div>
  );

};


window.JoinGroup = JoinGroup;