console.log("hello");
document
  .getElementById("timeframes")
  .addEventListener("change", ({ target }) => target.form.submit());
