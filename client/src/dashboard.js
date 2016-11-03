ReactDOM.render(<App />, document.getElementById('app'));

var askUser = $('[data-remodal-id=add-user-modal]').remodal();
var failUser = $('[data-remodal-id=user-fail-modal]').remodal();
var failAlreadyUser = $('[data-remodal-id=already-user-fail-modal]').remodal();

var askGroup = $('[data-remodal-id=modal]').remodal();
var failGroup = $('[data-remodal-id=group-fail-modal]').remodal();
var leaveGroup = $('[data-remodal-id=group-leave-modal]').remodal();
var deleteGroup = $('[data-remodal-id=group-delete-modal]').remodal();