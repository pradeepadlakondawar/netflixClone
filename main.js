const apiKey="6155e50bc72453b057e56569e98e6dc2";
const apiEndpoint="https://api.themoviedb.org/3";
const imgPath="https://image.tmdb.org/t/p/original";
const googleYTapiKey ="AIzaSyDvX9UTmalqkuTSeXIMwYpwrC6nFlY2JrY"
const googleYTapiEndpoint="https://youtube.googleapis.com/youtube/v3";


const apiPath={
    fetchAllCategories : `${apiEndpoint}/genre/movie/list?api_key=${apiKey}`,
    fetchMoviesList:(id)=> `${apiEndpoint}/discover/movie?api_key=${apiKey}&with_genres=${id}`,
    fetchTrending: `${apiEndpoint}/trending/all/day?api_key=${apiKey}&language=en-US`,
    searchOnYoutube: (query)=> `${googleYTapiEndpoint}/search?part=snippet&q=${query}&key=${googleYTapiKey}`
}

// boots up the app
function init() {
    // alert("hello")
    fetchTrendingMovies();
    fetchAndBuildAllSections();

}

function fetchTrendingMovies(){
    fetchAndBuildMovieSection(apiPath.fetchTrending,'Trendin Now')
    .then(list =>{
        const randomIndex =parseInt(Math.random()*list.length)
        buildBannerSection(list[randomIndex])
    }).catch(err=>{
        console.error(err)
    })
}

function buildBannerSection(movie){
    console.log(`${imgPath}${movie.backdrop_path}`)
    // console.alert(movie.backdrop_path)
    const bannerCont= document.querySelector("#banner-section");
    bannerCont.style.backgroundImage=`url("${imgPath}${movie.backdrop_path}")`

    const div = document.createElement('div');
    div.innerHTML=`
    
            <h2 class="banner__title">${movie.title}</h2>
            <p class="banner__info">Trending in movies | Released on ${movie.release_date}</p>
            <p class="banner__overview">${movie.overview && movie.overview.length>200 ? movie.overview.slice(0,200).trim()+'...': movie.overview}</p>
            <div class="action-buttons-cont">
                <button class="action-button"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="ltr-4z3qvp e1svuwfo1" data-name="Play" aria-hidden="true"><path d="M5 2.69127C5 1.93067 5.81547 1.44851 6.48192 1.81506L23.4069 11.1238C24.0977 11.5037 24.0977 12.4963 23.4069 12.8762L6.48192 22.1849C5.81546 22.5515 5 22.0693 5 21.3087V2.69127Z" fill="currentColor"></path></svg> Play</button>
                <button class="action-button"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="ltr-4z3qvp e1svuwfo1" data-name="CircleI" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12ZM13 10V18H11V10H13ZM12 8.5C12.8284 8.5 13.5 7.82843 13.5 7C13.5 6.17157 12.8284 5.5 12 5.5C11.1716 5.5 10.5 6.17157 10.5 7C10.5 7.82843 11.1716 8.5 12 8.5Z" fill="currentColor"></path></svg> More Info</button>

            </div>
        
    `
    div.className="banner-content"

    bannerCont.append(div);
}   

function fetchAndBuildAllSections() {
    fetch(apiPath.fetchAllCategories)
    .then(res=>res.json())
    .then(res=>{
        const categories = res.genres;
        if (Array.isArray(categories) && categories.length) {
            // buildMovieSection();
            // categories.forEach(category => {
            //     fetchAndBuildMovieSection(category);
            // });
             categories.forEach(category => {
                fetchAndBuildMovieSection(
                    apiPath.fetchMoviesList(category.id),category.name
                );
            });
            
        }
        // console.table(categories);

    })
    .catch(err=>console.log(err))
    
}
function fetchAndBuildMovieSection(fetchUrl,categoryName) {
    console.log(fetchUrl,categoryName)
    return fetch(fetchUrl)
    .then(res=>res.json())
    .then(res=>{
        console.table(res.results)
        const movies = res.results;
        if (Array.isArray(movies) && movies.length) {
            buildMoviesSection(movies,categoryName)
        }
        return movies;
    })
    .catch(err=>console.error(err))
}

function buildMoviesSection(lists, categoryName){
    console.log(lists ,categoryName)
    const moviesCont = document.querySelector("#movies-cont");
    const movieslistHTMl =lists.map(item=>{
        return `
        <div class="movie-item" onmouseover="searchMovieTraier('${item.title}', 'yt${item.id}')">
        <img src="${imgPath}${item.backdrop_path}" alt="${item.title}" class="movie-item-img" >
        <iframe class="move-item-iframe" id="yt${item.id}" width="245" height="150"src=""></iframe>
        </div>

        `;
    }).slice(0,2).join('');
    const movieSectionHTML = `
    
            <h2 class="movie-section-heading">${categoryName} <span class="explore-nudge">Explore Now</span> </h2>
            <div class="movies-row">
            ${movieslistHTMl}
                </div>
       
    `
    console.log(movieSectionHTML)

    const div = document.createElement('div');
    div.className="movies-section"
    div.innerHTML=movieSectionHTML;


    // appemd html into movies contianer
    moviesCont.append(div);
}

function searchMovieTraier(movieName, iframeId){
    if(!movieName) return;

    fetch(apiPath.searchOnYoutube(movieName))
    .then(res => res.json())
    .then(res =>{
        // console.log(res.items[0]);
        const bestResult =res.items[0];
        const youtubeUrl = `https://www.youtube.com/watch?v=${bestResult.id.videoId}`
        console.log(youtubeUrl);

        // opwning new window for video to play
        // window.open(youtubeUrl,'_blank');
        document.getElementById(iframeId).src=`https://www.youtube.com/embed/${bestResult.id.videoId}?autoplay=1&mute=1`
    })
    .catch(err =>console.error(err))
}


window.addEventListener('load',function(){
    init();
    window.addEventListener('scroll',function(){
        const header = document.querySelector(".header-container");

        if(window.scrollY>5)header.classList.add('black-bg')
        else header.classList.remove("black-bg")
    })
})