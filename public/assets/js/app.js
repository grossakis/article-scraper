// $.getJSON("/articles", function(data) {
//     // For each one
//     for (var i = 0; i < data.length; i++) {
//       var singleArticle = $('<div>').attr('data-id', data[i]._id).addClass('single-article-div');
//       var textDiv = $('<div>').addClass('article-text-div')
//       var articleTitle = $('<h2>').text(data[i].title);
//       var articleLink = $('<a>').attr('href', data[i].link).text(data[i].link);
//       var articleImage = $('<img>').attr('src', data[i].image);
//       var articleDescription = $('<p>');
//       if(data[i].description === ''){
//         articleDescription.text('No Description Available')
//       }else{
//         articleDescription.text(data[i].description)
//       }
//       textDiv.append(articleTitle, articleDescription, articleLink);
//       singleArticle.append(articleImage, textDiv);
//       $("#articles").append(singleArticle, "<br>");
//     }
//   });
var savedArticleLinks = []
$.getJSON("/articles", function(data) {
  // console.log(data)
  for (var i = 0; i < data.length; i++) {
    savedArticleLinks.push(data[i].link);
  }
})
var articleCheck = function(scrapeLink){
  for (var x = 0; x < savedArticleLinks.length; x++) {
    if(scrapeLink === savedArticleLinks[x]){
      return true
    }
  }
  return false
}

$('#scrape-button').on('click', function(){

  $.getJSON("/scrape", function(data) {
    // For each one
    // console.log(data)
    for (var i = 0; i < data.length; i++) {
      var singleArticle = $('<div>').addClass('single-article-div');
      var textDiv = $('<div>').addClass('article-text-div')
      var articleTitle = $('<h2>').text(data[i].title);
      var articleLink = $('<a>').attr('href', data[i].link).text(data[i].link);
      var articleImage = $('<img>').attr('src', data[i].image);
      var articleDescription = $('<p>');
      if(data[i].description === ''){
        articleDescription.text('No Description Available')
      }else{
        articleDescription.text(data[i].description)
      }
      var saveButton = $('<button>').text('Save Article').addClass('save-button')
      if (articleCheck(data[i].link)){
        saveButton.prop("disabled", true)
          .addClass('disabled-button')
          .text('Saved');
      }
      textDiv.append(articleTitle, articleDescription, articleLink, "<br>", saveButton);
      singleArticle.append(articleImage, textDiv);
      $("#articles").append(singleArticle, "<br>");
    }
  });

})
  
$(document).on("click", ".save-button", function() {
  $(this).prop("disabled", true)
    .addClass('disabled-button')
    .text('Saved');
  $.ajax({
    method: "POST",
    url: "/articles",
    data: {
      title: $(this).parent().find("h2").text(),
      link: $(this).parent().find("a").attr("href"),
      image: $(this).parent().parent().find("img").attr("src"),
      description: $(this).parent().find("p").text()
    }
  })
  .then(function(data) {
    console.log(data);
  });
});