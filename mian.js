
var elDiv = document.querySelector(".wrap")
var elcountr = document.querySelector(".countr")
var eltemplate = document.querySelector("#template").content
var elBookmarktTemplate=document.querySelector(".bookmakt-tempalate").content
var elCategorSelict = document.querySelector("#Categor_Selict")
var elForm = document.querySelector(".form")
var elbtn = document.querySelector(".btn")
var btn = document.querySelector(".btn")
var elRating=document.querySelector(".RatingInput")
var elsearchInput=document.querySelector(".searchInput")
var elsort=document.querySelector("#reating_sort")
var elImg=document.querySelector(".img")
var elBookmarkWrap=document.querySelector(".bookmark_tem-wrap")





//moviesdan kesib oldim va yangi array hosil qilib boshqa key berib chiqdim
var mov = movies.slice(0, 2000)

var movArray = mov.map(function (item , index) {
    
    return {
        movie_Id:++index,
        title: item.Title.toString(),
        categories: item.Categories,
        rating: item.imdb_rating,
        year: item.movie_year,
        imgLink: `https://img.youtube.com/vi/${item.ytid}/1.jpg`,
        youtubeLink: `https://www.youtube.com/watch?v=${item.ytid}`
    }
    
})


// cardlarni render qilib ekranga chiqardim
function render(moviesArray, Wrapperr) {
    
    let elFragmet = document.createDocumentFragment();
    
    
    
    moviesArray.forEach(item => {
        
        
        var TemplateDiv = eltemplate.cloneNode(true)
        TemplateDiv.querySelector(".imgs").src = item.imgLink
        TemplateDiv.querySelector(".Title").textContent = item.title
        TemplateDiv.querySelector(".Year").textContent = `${item.year} Year`
        TemplateDiv.querySelector(".Rating").textContent = `Rating: ${item.rating}`
        TemplateDiv.querySelector(".img").href = item.youtubeLink
        TemplateDiv.querySelector(".link").href = item.youtubeLink
        TemplateDiv.querySelector(".categors").textContent = item.categories.split("|")
        TemplateDiv.querySelector(".btn-bookmark").dataset.movieId=item.movie_Id
        
        
        
        elFragmet.appendChild(TemplateDiv)
        
        
        elcountr.textContent = `Kinolar soni: ${moviesArray.length}`
    });
    
    Wrapperr.appendChild(elFragmet)
    
    
}
render(movArray, elDiv)


// kesib olgan arraylarimni catigoryasini 1ta 1ta aylanib chiqib hammasidan 1tadan oldim
// borini yana qayta olmadim va optionlarga render qilib quydim
function selectMoveis(Arrayslect) {
    
    var ArrayCatigories = []
    var Categor = []
    
    
    var CategoriesMovies = Arrayslect.forEach(function (item) {
        var arrays = item.Categories.split("|")
        
        ArrayCatigories.push(...arrays)
        
        
        ArrayCatigories.forEach(function (item) {
            if (ArrayCatigories.includes(item)) {
                Categor.push(item)
            }
        })
    })
    
    
    
    
    var arr = [];
    Categor.forEach(function (item) {
        if (!arr.includes(item)) {
            arr.push(item)
        }
    })
    var CategorSelict = arr.sort();
    
    
    CategorSelict.forEach(function (item) {
        var SelectOption = document.createElement("option");
        SelectOption.value = item;
        SelectOption.textContent = item;
        elCategorSelict.appendChild(SelectOption);
    })
}
selectMoveis(mov);


//render categorlar
elForm.addEventListener("submit", function (evt) {
    evt.preventDefault();    
    elDiv.innerHTML = null;
    
    var SelictOptionValue = elCategorSelict.value;
    
    var Categor = [];
    
    if (SelictOptionValue === "all") {
        Categor = movArray;   
    } else {
        Categor = movArray.filter(function (item) {
            
            return item.categories.split("|").includes(SelictOptionValue); 
        })
    }
    
    
    render(Categor, elDiv);
    
})



// bir vaqtda 3ta shartni bajarish un yozildi FinMovies
var finMovies=function (movie_title,minRating,genre) {
    return movArray.filter(function (movie) {
        
        var doseMatchcategory=genre==='All'||movie.categories.split("|").includes(genre);
        
        return movie.title.match(movie_title)&&movie.rating>=minRating&&doseMatchcategory
        
    })    
}
//FindMoviesga berilgan qiymatlar input opshinlardan olingan
elForm.addEventListener("input",function (evt) {
    evt.preventDefault();
    elDiv.innerHTML=null;
    let RitingInput=elRating.value.trim();
    let SearchInput=elsearchInput.value.trim();
    let selectOption=elCategorSelict.value;
    let sortingType=elsort.value;
    let elkino=document.querySelector(".kion")
    
    let pattern=new RegExp(SearchInput,"gi");
    let resultarray=finMovies(pattern,RitingInput,selectOption);
    
    if (sortingType==="high") {
        resultarray.sort(function (b,a) {
            return a.rating-b.rating;
        })
    }
    if (sortingType==="low") {
        resultarray.sort(function (a,b) {
            return a.rating-b.rating;
        })
    }
    if (resultarray==0) {
        elkino.textContent="kino yo'q"
    }
    
    render(resultarray,elDiv);
})




let zuko=window.localStorage
let BookMark=JSON.parse(zuko.getItem("a"))||[]

elDiv.addEventListener("click",function (item) {
    
    
    let movID=item.target.dataset.movieId;
    
    if (movID) {
        
        let  newBokmark = movArray.find(function (item) {
            return item.movie_Id==movID
            
        })
        
        
        let dosIndex=BookMark.findIndex(function (item) {
            return item.movie_Id===newBokmark.movie_Id
        })
        if (dosIndex===-1) {
            BookMark.push(newBokmark)
            zuko.setItem("a",JSON.stringify(BookMark))
            BookmarkRender(BookMark,elBookmarkWrap)
        }
        
    }    
})



function BookmarkRender(array,Bookmark__Wrap) {
    Bookmark__Wrap.innerHTML=null
    
    let fragmetBookmark=document.createDocumentFragment();
    array.forEach(function (item) {
        var BookmarktTemplate = elBookmarktTemplate.cloneNode(true);
        
        BookmarktTemplate.querySelector(".bookmark_title").textContent=item.title
        BookmarktTemplate.querySelector(".remove").dataset.bookId=item.movie_Id
        fragmetBookmark.appendChild(BookmarktTemplate)
    })
    Bookmark__Wrap.appendChild(fragmetBookmark)                                                                                                                                                                                                                                                                                                                                     
    
}
BookmarkRender(BookMark,elBookmarkWrap);

elBookmarkWrap.addEventListener("click",function (item) {
    let BookId=item.target.dataset.bookId;
    let BookMarkArray=[]
    if (BookId) {
        let  RemovArrayIndex = BookMark.findIndex(function (item) {
            return item.movie_Id==BookId
        })
        BookMark.splice(RemovArrayIndex,1)
        zuko.setItem("a",JSON.stringify(BookMark))
        BookmarkRender(BookMark,elBookmarkWrap)
    }
})

// Tepaga chiqish uchun tugma

elbtn.addEventListener("click", function (evt) {
    
    evt.preventDefault();
    window.scrollTo(0, 0);
    
})


window.addEventListener("scroll", () => {
    if (window.scrollY) {
        btn.style.display = "block";
    }else{
        btn.style.display = "none";
    } 
})




























//sanoagency.ru