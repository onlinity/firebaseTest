// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore,  doc, setDoc , getDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDjqxHW3in6kBjRXiy6NKDop0iaSydEcqs",
    authDomain: "fir-html-test-2845e.firebaseapp.com",
    projectId: "fir-html-test-2845e",
    storageBucket: "fir-html-test-2845e.appspot.com",
    messagingSenderId: "71298528141",
    appId: "1:71298528141:web:e38a74d77383c0faf8c3c4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

const db = getFirestore(app);


onAuthStateChanged(auth, (user) => {
    var notLoggedIn = document.getElementById('not-logged-in')
    var loggedIn = document.getElementById('logged-in')
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        loggedIn.style.display = 'block'
        notLoggedIn.style.display = 'none'
        allowContentChange()
    } else {
        // User is signed out
        // ...
        loggedIn.style.display = 'none'
        notLoggedIn.style.display = 'block'
        applySavedData()
    }
});


function allowContentChange(){
    const changableContent = document.getElementsByClassName('change')
    for (let index = 0; index < changableContent.length; index++) {
        var element = changableContent[index];

        var inputElement = document.createElement('input')
        inputElement.type = 'text'
        inputElement.value = element.innerHTML
        inputElement.id = element.id + '-inputElement'
        inputElement.classList = element.classList
        inputElement.style.display = 'block'

        const styles = window.getComputedStyle(element)
        let cssText = styles.cssText;
        if (!cssText) {
            cssText = Array.from(styles).reduce((str, property) => {
              return `${str}${property}:${styles.getPropertyValue(property)};`;
            }, '');
        }
        inputElement.style.cssText = cssText

        element.parentElement.replaceChild(inputElement, element)
        
    }
}




function login(event){
    event.preventDefault()
    var email = document.getElementById('email').value
    var password = document.getElementById('password').value
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        // ...
        console.log('Logged in!')
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('fail')
        console.log(errorMessage)
        console.log(errorCode)
        console.log('')
    });
}
window.login = login


function testFunction(event){
    event.preventDefault()
    var testData = document.getElementById('testInput').value

    const cityRef = doc(db, 'data', 'AosHIjnkZbhKcAwPRBPD');
    setDoc(cityRef, { thisIsData: testData }, { merge: true });

    getData()
}

window.testFunction = testFunction

async function getData(){

    const docRef = doc(db, 'data', 'AosHIjnkZbhKcAwPRBPD');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        document.getElementById('testText').innerText = docSnap.data().thisIsData
    } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
    }
}


function saveChanges(){
    let content = document.getElementsByClassName('change')
    for (let index = 0; index < content.length; index++) {
        var element = content[index];
        var elementID = element.id.replace('-inputElement', '')
        var elementData = element.value

        let object = {}
        object[elementID] = elementData

        const cityRef = doc(db, 'data', 'AosHIjnkZbhKcAwPRBPD');
        setDoc(cityRef, object, { merge: true });

    }
}

window.saveChanges = saveChanges








async function getThisDataFromFirestore(){
    const docRef = doc(db, 'data', 'AosHIjnkZbhKcAwPRBPD');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data()
    }
}


function applySavedData(){
    let elements = document.getElementsByClassName('change')

    getThisDataFromFirestore().then((e) => {
        for (let index = 0; index < elements.length; index++) {
            var element = elements[index];
            element.innerHTML = e[element.id]
        }
    })
}







function logout(){
    console.log('logout')
    location.reload()
    const auth = getAuth();
    signOut(auth).then(() => {
    // Sign-out successful.
    }).catch((error) => {
    // An error happened.
    });
}

window.logout = logout