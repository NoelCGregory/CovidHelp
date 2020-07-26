let subject = document.getElementById('subject');
let message = document.getElementById('message');

function submitToDatabase(){
    let email = currentUser.email;
    let name = currentUser.displayName;
    let database = firebase.database();
    let ref = database.ref('contacts');

    let data = {
        name: name,
        email: email,
        subject:subject.value,
        messgae:message.value
    }
    ref.push(data);
    alert('Succesfully Submited');
}