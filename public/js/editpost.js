const saveFormHandler = async (event) => {
    event.preventDefault();

    const title = document.querySelector('postTitle').value.trim();
    const content = document.querySelector('#postContent').value.trim();
    const  id = window.location.toString().split('/')
    [
        window.location.toString().split('/').length -1
    ];
    const response = await fetch (`api/post/${id}`, {
        method: 'PUT',
        body: JSON.stringify ({title, content}),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (response.ok) {
        alert("You have saved your post!")
        document.location.replace('/dashboard');
    }else 
    alert(response.statusText);
}

document.querySelector('.save-post-btn').addEventListener('click', saveFormHandler);