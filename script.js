var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("URL CHANGED: " + request.data.url);
    const url = request.data.url;
    var disliked = '';
    console.log(url);
    function youtube_parser(url){
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        var match = url.match(regExp);
        return (match&&match[7].length==11)? match[7] : false;
    }
    const id = youtube_parser(url);
    console.log(id);
    const api_key = 'AIzaSyCyI7DS56MsC7ZJwlQ4vf-59rm-rstKpD4';
    const stream = `https://www.googleapis.com/youtube/v3/videos?id=${id}&key=${api_key}&part=statistics`
    response = fetch(stream,requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log(result);
            let json = JSON.parse(result);
            disliked = json.items[0].statistics.dislikeCount;
            console.log(disliked);
            disliked =Number(disliked);
            if (disliked>=1000000000){
                disliked = disliked/1000000000;
                disliked = disliked.toFixed(2);
                disliked = disliked + "B";
            }
            else if(disliked>=1000000){
                disliked = disliked/1000000;
                disliked = disliked.toFixed(1);
                disliked = disliked + "M";
            }
            else if(disliked>=1000){
                disliked = Math.round(disliked/1000);
                disliked = disliked + "K";
            }
            console.log(disliked);
            setTimeout(function(){
                console.log("I am the third log after 5 seconds");
            },5000);
            const timer = setInterval(() => {
                const arraypro = document.getElementsByClassName('style-scope ytd-toggle-button-renderer style-text');

                if(arraypro.length>0) {
                  clearTimeout(timer);
                  processMyElement(arraypro);
                }
              }, 150);
            
            function processMyElement(arraypro) {

        
                
                arraypro[3].innerHTML = `<span class="style-text">${disliked}</span>`;
                arraypro[arraypro.length-1].innerHTML = `<span class="style-text">${disliked}</span>`;
                console.log(arraypro[3].innerHTML);
                console.log(arraypro[arraypro.length-1]);
                console.log(arraypro)
                for(var i=0; i<arraypro.length; i++){
                    console.log(arraypro.innerHTML)
                    if(arraypro[i].innerHTML=="Dislike"){
                        console.log(true)
                        console.log(arraypro[i].innerHTML);
                        arraypro[i].innerHTML = `<span class="style-text">${disliked}</span>`;
                    }
                }
            }
            
        })
        .catch(error => console.log('error', error));
});
