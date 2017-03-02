var kbuttons = document.querySelectorAll(".kill-below-button");
for (let x of kbuttons) {
    x.addEventListener("click", () => {
      console.log('wat');
      var siblingBelow = x.nextElementSibling;
      console.log(siblingBelow);
      siblingBelow.innerHTML = "";
      x.parentElement.removeChild(siblingBelow);
      x.parentElement.removeChild(x);
    });
};