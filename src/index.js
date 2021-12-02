
import { initializeApp } from 'firebase/app'
import {
    getFirestore,
    collection, getDocs, query, where
} from 'firebase/firestore'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBSbQq5W1stHH8pJ3v27Mx85QsN1wu4g8g",
    authDomain: "sherwood-aecb1.firebaseapp.com",
    databaseURL: "https://sherwood-aecb1.firebaseio.com",
    projectId: "sherwood-aecb1",
    storageBucket: "sherwood-aecb1.appspot.com",
    messagingSenderId: "1059507399306",
    appId: "1:1059507399306:web:885aff8152463713e91b73",
    measurementId: "G-8TS3479Y9S"
};
initializeApp(firebaseConfig);

//init firestore
const db = getFirestore();
//collection query


//selectedCategories list
let selectedCategories = []
var selectedCurreny="TRY";
var currencyRate=1;
var baseRate=1;

//sign-up
const multiplyFormDoc = document.querySelector('.multiplyForm');




var rad = document.querySelectorAll("input[type=radio][name=flexRadioDefault]");
var prev = null;
for (var i = 0; i < rad.length; i++) {
    rad[i].addEventListener('change', function(event) {
        (prev) ? console.log(prev.value): null;
        if (this !== prev) {
            prev = this;
        }
        event.preventDefault();
        selectedCurreny=this.value;
        
    });
}

//get products button
/* document.getElementById("getButton").onclick = getProducts; */
 document.getElementById("getButton2").onclick = getProducts; 


//get products button
document.getElementById("clearButton").onclick = clearTable;
// get products from database
function getProducts() {
    baseRate = multiplyFormDoc.baseMultiplyRate.value;
    currencyRate = multiplyFormDoc.currencyRate.value;
    
    if(baseRate==0||baseRate==null||baseRate==""){
        alert("Baz Fiyat Çarpanı Giriniz");
    }else if(currencyRate==0||currencyRate==null||currencyRate==""){
        alert("Kur Çarpanı Giriniz"); 
    }else{
    if (selectedCategories.length > 9) {
        alert('10 veya daha az kategori seçin');
    } else
        if (selectedCategories.length > 0) {
            console.log("enter func");
            const colRef = collection(db, 'products');
            const q = query(colRef, where('collectionId', 'in', selectedCategories));
            getDocs(q).then((snapshots) => {
                console.log("getting products");
                let products = [];
                snapshots.docs.forEach((product) => {
                    products.push({ ...product.data() });

                });
                products.sort(function (a, b) {
                    var textA = a["collectionId"].toUpperCase();
                    var textB = b["collectionId"].toUpperCase();
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                });
                alertAllElements(products);

            }).catch(erro=>{
                console.log(erro);
            })
        }
        else {
            alert('En az bir kategori seçiniz');
        }}

}

// collection names reference
const colRefForCategories = collection(db, 'categories');
// get collection names from database
getDocs(colRefForCategories).then((snapshots) => {
    let collections = [];
    snapshots.docs.forEach((collection) => {
        collections.push({ ...collection.data() });

    });

    collectionNamesList(collections);

});

//Clear table
function clearTable() {
    var myobj = document.getElementById("productTable");
    myobj.remove();
}



var alertAllElements = function tableCreate(theArray) {
  
    var myWindow = window.open();
    myWindow.document.write("<html> <head> <link rel='stylesheet' href='/css/style.css'> </head><body> </body></html> ");
    const body =myWindow.document.body,
        tbl = document.createElement('table');

        var divNode = myWindow.document.createElement("div");
        
        var img = myWindow.document.createElement("img");
        img.src = "/assets/images/logo.png";
        img.style.paddingLeft="40vw";
       

        divNode.appendChild(img);
        body.appendChild(divNode);
       
    tbl.id = 'productTable';
    tbl.style.width = '90vw';
    tbl.style.marginTop = "5vh";
    tbl.style.marginLeft = "5vw";
    tbl.style.marginRight = "5vw";
    tbl.style.verticalAlign = "center";


    let labels = ["#", "Code", "Product", "Collection", "Width", "Height", "Depth", "Image", "Price"]
    const labelRow = tbl.insertRow();
    labelRow.style.fontWeight = "bold";

    for (let i = 0; i < labels.length; i++) {

        const labelRoww = labelRow.insertCell();
        var divNode = document.createElement("div");
        divNode.classList = "labels-cl";


        divNode.appendChild(document.createTextNode(labels[i]));

        labelRoww.appendChild(divNode);



    }// Create our number formatter.
    var formatterTRY = new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'TRY',

        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });

    // Create our number formatter.
    var formatterUSD = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',

        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });

    var formatterEUR = new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',

        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });



    for (let i = 0; i < theArray.length; i++) {

        const tr = tbl.insertRow();


        if (i === (theArray.length - 1)) {
            break;
        } else {
            const numberCol = tr.insertCell();
            numberCol.style.alignContent = "center";
            numberCol.appendChild(document.createTextNode(i + 1));

            const idCol = tr.insertCell();
            idCol.appendChild(document.createTextNode(theArray[i]["productId"]));

            const nameCol = tr.insertCell();
            nameCol.appendChild(document.createTextNode(theArray[i]["productName"]));

            const collectionIdCol = tr.insertCell();
            collectionIdCol.appendChild(document.createTextNode(theArray[i]["collectionId"]));


            const widthCol = tr.insertCell();
            if (theArray[i]["width"] === null || theArray[i]["width"] === '') {
                widthCol.appendChild(document.createTextNode("-"));
            } else {
                widthCol.appendChild(document.createTextNode(theArray[i]["width"]));
            }


            const heightCol = tr.insertCell();
            if (theArray[i]["height"] === null || theArray[i]["height"] === '') {
                heightCol.appendChild(document.createTextNode(""));
            } else {
                heightCol.appendChild(document.createTextNode(theArray[i]["height"]));
            }


            const depthCol = tr.insertCell();
            if (theArray[i]["depth"] === null || theArray[i]["depth"] === '') {
                depthCol.appendChild(document.createTextNode(""));
            } else {
                depthCol.appendChild(document.createTextNode(theArray[i]["depth"]));
            }


            try {

                const imageCol = tr.insertCell();
                var divNode = document.createElement("div");
                divNode.classList = "productImage";
                var img = document.createElement("img");
                img.src = theArray[i]["photoUrl"];
                img.style.width = "10vw";
                img.style.height = "10vw";
                divNode.appendChild(img);
                imageCol.appendChild(divNode);
            } catch (error) {
                console.log(error);
                const imageCol = tr.insertCell();
                var divNode = document.createElement("div");
                divNode.classList = "productImage";

                imageCol.appendChild(divNode);

            }

            const priceCol = tr.insertCell();
            var price = "0";
            if (theArray[i]["istanbulPrice"] === null || theArray[i]["istanbulPrice"] === '') {
                price = 0;
            } else {
                price = theArray[i]["istanbulPrice"];
            }

            var mystring = price;
            mystring = mystring.replace('.', '');
            mystring = mystring.replace(',00 TL', '');
            mystring = mystring.replace(',', '.');
            var priceInDouble = parseFloat(mystring);
            priceInDouble = (priceInDouble * baseRate)/currencyRate;
            var formattedPrice ="";
            console.log(selectedCurreny);
            if(selectedCurreny=="TRY"){
              
                formattedPrice = formatterTRY.format(priceInDouble); /* $2,500.00 */
            }else if(selectedCurreny=="EUR"){
                formattedPrice = formatterEUR.format(priceInDouble); /* $2,500.00 */

            }else if(selectedCurreny=="USD"){
                formattedPrice = formatterUSD.format(priceInDouble); /* $2,500.00 */
            }

            priceCol.appendChild(document.createTextNode(formattedPrice));


        }

    }
    body.appendChild(tbl);
}

var collectionNamesList = function addItems(collectionNamesListForDropdown) {

    for (var i = 0; i < collectionNamesListForDropdown.length; i++) {

        var node = document.createElement("li");



        var ele = document.createElement("a");
        ele.classList = "dropdown-item";
        ele.href = "#";

        node.appendChild(ele);
        var divNode = document.createElement('div');
        divNode.classList = 'form-check';
        var inputNode = document.createElement('input');
        inputNode.classList = 'form-check-input';
        inputNode.type = 'checkbox';
        inputNode.value = collectionNamesListForDropdown[i]["name"];
        inputNode.name = 'settings';
        inputNode.id = "flexCheckDefault";
        var labelNode = document.createElement('label');
        labelNode.classList = 'form-check-label';
        labelNode.for = 'flexCheckDefault';
        labelNode.innerText = collectionNamesListForDropdown[i]["name"];
        divNode.append(inputNode);
        divNode.append(labelNode);
        ele.append(divNode);
        node.append(ele);


        document.getElementById("collectionList").appendChild(node);
    }


    // Select categories for products
    var checkboxes = document.querySelectorAll("input[type=checkbox][name=settings]");


    /*
    For IE11 support, replace arrow functions with normal functions and
    use a polyfill for Array.forEach:
    https://vanillajstoolkit.com/polyfills/arrayforeach/
    */

    // Use Array.forEach to add an event listener to each checkbox.
    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener('change', function (event) {
            selectedCategories =
                Array.from(checkboxes) // Convert checkboxes to an array to use filter and map.
                    .filter(i => i.checked) // Use Array.filter to remove unchecked checkboxes.
                    .map(i => i.value) // Use Array.map to extract only the checkbox values from the array of objects.
                    event.preventDefault();
            console.log(selectedCategories)
        })
    });
}



//tableCreate();

console.log('hello');