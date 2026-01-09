// CLASS BLOGPOST
class BlogPost{
    constructor(title, image, content){
        this.title=title;
        this.image=image;
        this.content=content;
    }
}
// CLASS UI
class UI{
    static displayPosts(){    //method to display posts, go to the localstorage and get the list
        const posts = Store.getPosts();
        posts.forEach((post) => UI.addPostToList(post)); //loop through the list, for each post, run the "builder" function
    }
    static addPostToList(post){
        const list = document.querySelector('#blog-list'); //will select the blog list div. this is where the cards will go
        const card = document.createElement('div');  //create a div for each blog post with js
        card.classList.add('blog-card', 'col-md-4', 'mb-3');    //add a class to the card
        // we will take the empty white box and inject html text inside it
        // in first line- create an image tag, for the source URL, dont use a hard text, look inside the post object and grab the image link, pasting it here
        // in second line- create an h3 tag, grab the title from the post object and paste it here
        // in third line- create a p tag, grab the content from the post object and paste it here
        card.innerHTML=`       
        <img src="${post.image}" alt="Blog Image" style="width:100%; height:200px; object-fit:cover; border-radius: 5px 5px 0 0;">
        <div class="card-body">
            <h3 class="card-title">${post.title}</h3>
            <p class="card-text">${post.content}</p>
            <button class="btn btn-danger btn-sm delete">X</button>
        </div>
        `;     //here we inserted the blog post details into the card using template literals
        list.appendChild(card);     //adds the card containing the blog post to the blog list div
    }
    static deletePost(el){ 
        //we check: did the thing that was clicked have a class of delete?
        if(el.classList.contains('delete')){  // making sure that the class delete is included, if it contains delete, remove that
            // EL = the button that was clicked (X)
            // we want to remove the whole card, so we go up two levels in the DOM tree to get the card div and remove it
            el.parentElement.parentElement.remove();
        }
    }
    static clearFields(){
        //find the input fields and set their values to empty strings, if we dont do this, the old values will remain in the box after submission
        document.querySelector('#title').value=''; //clears the title input field
        document.querySelector('#image').value='';  //clears the image input field
        document.querySelector('#content').value='';  //clears the content input field
    }

}
// Store Class: Handles Storage (The "Memory")
class Store { //the browsers local storage
  static getPosts() {
    let posts; // creating an empty variable to hold our list
    // check if the storage shelf labeled 'posts' is empty
    if(localStorage.getItem('posts') === null) {
      posts = []; // if empty, create a brand new empty list
    } else {
      posts = JSON.parse(localStorage.getItem('posts')); // if not empty, grab the text string, unpack it back into a real list, and save it to 'posts'
      // when you get your data pack, its just a long string of text, JSON.parse "un-stringifies" it, inflating that text into real js code 
    }
    return posts; // hand the list back to whoever asked for it
  }

  static addPost(post) { // this function takes a new blog post and saves it forever
    const posts = Store.getPosts();
    posts.push(post); // add the new item to the end of the list
    localStorage.setItem('posts', JSON.stringify(posts)); // save the whole updated list back to the shelf, then pack it (stringify) because local storage only speaks text, not arrays
    // JSON.stringify (the packer)- the command squashes your "object" into a long text string so it fits in the storage
  }

  static removePost(title) { // we pass in the title of the post we want to delete
    const posts = Store.getPosts(); // get the current list again
    posts.forEach((post, index) => { // loop through every single post in the list to find the match
      if(post.title === title) { // check: Does this post's title match the one we want to delete? if yes, cut it out
        posts.splice(index, 1); // means go to this index number, and remove 1 item
      }
    });
    localStorage.setItem('posts', JSON.stringify(posts)); // save the new, shorter list back to storage (pack it up again)
  }
}
// event: display posts (load from the storage when page opens)
document.addEventListener('DOMContentLoaded', UI.displayPosts);
// event: add a post
document.querySelector('#blog-form').addEventListener('submit', (e) => {
    e.preventDefault(); // stop the page from reloading
    // get values from specific inputs
    const title = document.querySelector('#title').value;
    const content = document.querySelector('#content').value;
    const imageInput = document.querySelector('#image');
    if(title === '' || content === ''){
        alert('Please fill in all fields');
        return;
    }
    // handling the image file
    // We check if a file was selected
    if(imageInput.files && imageInput.files[0]){
        const reader = new FileReader();
        // This code waits for the image to finish loading
        reader.onload = function(e){
            const imageBase64 = e.target.result; // the image is converted to text
            const post = new BlogPost(title, imageBase64, content); //creating the object (inside waiting function)
            UI.addPostToList(post); //add post to UI
            Store.addPost(post); //add to memory
            UI.clearFields();  //clear fields
        };
        reader.readAsDataURL(imageInput.files[0]); 
    }else{
        alert('Please upload an image');
    }
});
// Event: Remove a Post
document.querySelector('#blog-list').addEventListener('click', (e) => {
  // We pass the thing that was clicked (e.target) to our UI class 
  UI.deletePost(e.target); // removes it from the screen
  if(e.target.classList.contains('delete')){
    const title = e.target.parentElement.querySelector('h3').textContent;
    Store.removePost(title);
  }
});