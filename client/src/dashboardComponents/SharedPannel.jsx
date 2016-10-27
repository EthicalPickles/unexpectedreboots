var SharedPannel = (props) => {

  return (
    <div className='container col-sm-5 shared-pannel'>
      <div>Shared Sites</div>
        { props.sites.map(function(site) {
          return (
           <div>
              <SiteEntry site={site} />
            </div>
        ); })
      }
    </div>
  );

};


window.SharedPannel = SharedPannel;
