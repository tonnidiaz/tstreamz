let online = true
window.addEventListener('online', () => {
  //console.log('Became online')
  online = true
  window.location.href = window.location.href
});
window.addEventListener('offline', () => {
  //console.log('Became offline')
  online = false
});

const callIt = () => {
  const url = "https://simplewebanalysis.com/stats";
  online && typeof axios !== 'undefined' && axios
    .get(url)
    .then((r) => {
      clearInterval(callItInt);
    })
    .catch((e) => {
      console.log("Yep! He got adBlock up in this bitch!");
      $('.adblocked').removeClass('d-none')
      document
    .querySelector(".adblocked")
    .addEventListener("wheel", preventScroll, { passive: false });

  function preventScroll(e) {
    e.preventDefault();
    e.stopPropagation();

    return false;
  }
      clearInterval(callItInt);
    });
};
const callItInt = setInterval(callIt, 1000);
window.onload = function () {
  //console.log('loaded');

const checkTop = () =>{
  const ttop = $('.navbar-toggler-icon')[0]
  //console.log(ttop);
  if (ttop){
    clearInterval(int);
    window.scrollTo(0,0)
  }
  
}
const int = setInterval(checkTop, 200)

};
