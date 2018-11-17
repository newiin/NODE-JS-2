const more =document.getElementById('more');
let initialItem=0;

const allItem=document.getElementsByClassName('item')
const numberOfItem=document.getElementsByClassName('item').length;
more.addEventListener('click',function(){
  let index=3;
  let init=0;
  let slice=3
  
    $('.item').hide().slice(init, slice).show();
  
})

console.log(numberOfItem);
console.log(allItem);
$(window).scroll(function () { 
	// console.log($(window).scrollTop());
	console.log($(document).height());
	console.log($(window).height());
   // if ($(window).scrollTop() >= $(document).height() - $(window).height() - 10) {
    
   // }
});


