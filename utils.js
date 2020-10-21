
module.exports = {
  between: function (min, max) {  
    return Math.floor(
      Math.random() * (max - min) + min
    )
  }
}