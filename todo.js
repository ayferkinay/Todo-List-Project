// Tüm elementleri seçme

const form = document.querySelector("#todo-form")
const todoInput = document.querySelector("#todo")
const todoList = document.querySelector(".list-group")
const firstCardBody = document.querySelectorAll(".card-body")[0]    // birden fazla cardbody classına sahip element olduğu için all kullandık. Aksi takdirde hata verir.
const secondCardBody = document.querySelectorAll(".card-body")[1]
const filter = document.querySelector("#filter")
const clearButton = document.querySelector("#clear-tasks")


eventListener();

function eventListener() {// tüm event listenerlar
    form.addEventListener("submit", addTodo)
    document.addEventListener("DOMContentLoaded", loadAllTodosToUI)   // Syafa Yüklendiği an oluşacak olan bu event sayesinde localStorage de kayıtılı olan değerler todo olarak arayüze eklenmiş olacak
    secondCardBody.addEventListener("click", deleteTodo) //işaret ettiğimiz alan click olduğunda oluşacak olan event
    filter.addEventListener("keyup", filterTodos) // filtreleme inputuna bir event atadık 
    clearButton.addEventListener("click", clearAllTodos)
}

function clearAllTodos(e) {  
    if (confirm("Press the button")) {
        while (todoList.firstElementChild != null) {

            todoList.firstElementChild.remove();

        }
    }

    localStorage.removeItem("todos");

    e.preventDefault();

}

function filterTodos(e) {
    const filterValue = e.target.value.toLowerCase();  // input içinde girilen yazıalrı küçük harfe dönüştürme
    const listItems = document.querySelectorAll(".list-group-item") //tüm li leri seçebilmek için oluşturduk 

    listItems.forEach(function (listItems) {  // li lerin üzerinde gezinebilmek için. listitems her li ye eşit olacak 
        const text = listItems.textContent.toLowerCase(); // yukarıda list items ı li lere eşitledik . list items ile li lerin textlerini alıp küçük harfe çevirerek text adlı değişkene atadık 

        // artık iki değerimiz var biri filter value olarak belirlediğimiz input içinde girilecek olan küçük harfli değerler. ikincisi ise text ile list items aracılığıyla aldığımız li lerin textleri. şimdi bu ikisni birbiriyle karşılaştırıp arama işlemi gerçekleştiricez

        if (text.indexOf(filterValue) === -1) {  // indexof özelliğinde eğer o değerin indexini alıp ona eşit bi değer bulamazsa -1 değeri döndürür. eğer bulursa 0 değer idöner.
            //bulamadı 

            listItems.setAttribute("style", "display : none !important ")  // listitemslara yanı li lere display none özelliği ekleyerek eğer içinde değer bulamazsa ekranda gözükmemesini sağlayacağız. important yapmamızın sebebi ise li elemanlarının baskın olarak block özellikleri olduğu için bizin none olarak eklediğimiz özelliği görmezden geliyor. bu yüzden important yaparak bunu baskın hale getirdik 
        }
        else {
            listItems.setAttribute("style", "display : block")
        }
    })


}

function deleteTodo(e) {   // Todo silme fonksiyonu
    if (e.target.className === "fas fa-times") {  // tıkladığımız elemaının classı bu isimde mi 
        e.target.parentElement.parentElement.remove();  //mevcut butonun 2 üst elemanı olan li yi sayfadan silmemizi sağlar
        deleteTodoFormStorage(e.target.parentElement.parentElement.textContent) // text ini alarak bu fonksiyondaki deletetodo parametresine gönderdik
        showAlert("success", "Todo Başarıyla Silindi")
    }
}

function deleteTodoFormStorage(deleteTodo) {
    let todos = getTodosFromStorage(); // storage dan bir array olarak todo ları aldık ve todos değişkenine eşitledik 
    todos.forEach(function (todo, index) {
        if (todo === deleteTodo) {
            todos.splice(index, 1) //arraydan değer silme
        }
    })
    localStorage.setItem("todos", JSON.stringify(todos))
}

function loadAllTodosToUI() {   // todo ları localstorage e eklememiz için oluşan function.
    let todos = getTodosFromStorage();  // Anlamadım valla hoca ne yazdıysaa onu yazdım ben de ......
    todos.forEach(function (todo) {
        addTodoToUI(todo)
    })

}

function addTodo(e) {

    const newTodo = todoInput.value.trim(); // input alanına girilen değeri yeni todo olarak alma.     trim girilen değerin başındaki ve sonundaki gereksiz boşlukaları siler

    if (newTodo === "") {   //eğer boş değer eklenmeye çalışırsa oluşacak alert 
        showAlert("danger", "Lütfen bir Todo girin");  //function da verdiğimiz parametrelere göre biz burada ne yazarsak o şekilde alert oluşacak. info yazsak mavi alert oluşur
    }
    else {
        addTodoToUI(newTodo);
        showAlert("success", "Todo Başarıyla Eklendi")
        addTodoToStorage(newTodo);
    }



    e.preventDefault();  //buttona basıldığında sayfayı default olarak yenilemesin diye

}

function getTodosFromStorage() {    // bu fonksiyonun açılma sebebi daha global olması ve dilediğimiz yerde karışıklık olmadan kullanabilmemiz
    let todos;
    if (localStorage.getItem("todos") === null) {   // localstorage değerleri kontrol edilerek todos adında key var mı ona bakılır
        todos = [];   // Eğer yoksa todos adında bir dizi oluşturulur
    }

    else {
        todos = JSON.parse(localStorage.getItem("todos"))
    }

    return todos;  //dış dünyaya döndürüp diğer fonksiyonlarda onu kullandık (soru cevap dan bulduğum bi yorum )
}

function addTodoToStorage(newTodo) {  //Todo ları local storage de depolama işlemi
    let todos = getTodosFromStorage();
    todos.push(newTodo);
    localStorage.setItem("todos", JSON.stringify(todos))
}
function showAlert(type, message) {    //Alert mesajının element özellikleri oluşturuldu
    const alert = document.createElement("div")
    alert.className = `alert alert-${type} mb-3`   // burada normal tek tırnak değilde altgr + 2 x virgül yapıldı. 
    alert.textContent = message;

    firstCardBody.appendChild(alert);    // ilk cardbody nin altına child oalrak alert yerleştirildi 

    //Settimeout function içindeki oalyı 2. parametrede girilen süre aralığında devreye sokar

    setTimeout(function () {
        alert.remove(); // alert 2 saniye gözüktükten sonra silinsin
    }, 2000)



}

function addTodoToUI(newTodo) {  //string değeri arayüze ekleme

    // <li class=" a list-group-item d-flex justify-content-between">
    //                         ToDo 1
    //                         <a href="#" class="delete-item">
    //                             <i class="fas fa-times"></i>
    //                         </a>
    //                     </li> 


    // List İtem oluşturma 
    const listItem = document.createElement("li")  // yukarıdaki li elemanınn aynısı oluşturulmaya çalışıldı 



    // Link oluşturma
    const link = document.createElement("a")
    link.href = "#"
    link.className = "delete-item"
    link.innerHTML = "<i class='fas fa-times'></i>"

    listItem.className = "list-group-item d-flex justify-content-between"

    // text Node ekleme
    listItem.appendChild(document.createTextNode(newTodo))   //todo nun ismi input kısmından girilen yazı olsun diye text node oluşturduk 


    listItem.appendChild(link)  // a elemanını li elemaının içinde yerleştirdik 



    // Yukarıda li elementinin aynısı oluştu bunu da ul elementine child olarak ekleyeceğiz. En üstte zaten ul yi todoList olarak çağırmıştık. onu kullanacağız. 
    todoList.appendChild(listItem);  // oluşturuğumuz li elemaının ul elemaının içinde ekledik 


    todoInput.value = null; // yeni todo arayüze eklendikten sonra input içindeki yazıyı temizler.

}

