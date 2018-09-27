$.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
        var notesDiv = $('<div>').addClass("note-div").css('display', "none");
        notesDiv.html(
            '<span>New Note: </span>'+
            '<input type="text" placeholder="Type New Note Here..."/>'+
            '<button class="save-note-button">Save Note</button>'+
            '<div class=note-holder></div>'
        );
        // notesDiv.append("<br><p>"+ data[i].note+"</p>")
        var singleArticle = $('<div>').attr('data-id', data[i]._id).addClass('single-article-div');
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
        var removeButton = $('<button>').text('Remove Article').addClass('remove-button');
        var notesButton = $('<button>').text('View Notes').addClass('notes-button');
        textDiv.append(articleTitle, articleDescription, articleLink, "<br>", removeButton, notesButton);
        singleArticle.append(articleImage, textDiv, notesDiv);
        $("#articles").append(singleArticle, "<br>");
    }
  });


$(document).on("click", ".remove-button", function() {
    var deletionRef = $(this).parent().parent().attr("data-id");
    $(this).parent().parent().remove();
    $.ajax({
        method: "DELETE",
        url: "/articles/"+ deletionRef
        })
        .then(function(data) {
        console.log(data);
        });
});

$(document).on("click", ".notes-button", function() {
    $(this).parent().parent().find(".note-div").toggle('display')
    if($(this).text() === 'View Notes'){
        $(this).text('Hide Notes')
    }else{
        $(this).text('View Notes')
    }
    var refForNote = $(this).parent().parent().attr('data-id');
    var noteHolder = $(this).parent().parent().find('.note-holder');
    $.getJSON("/articles/"+refForNote, function(data) {
        noteHolder.empty();
        noteHolder.append(
            "<p class='p-note'>Current Note: "+data.note.body+"</p>"+
            "<button class='remove-note'>Delete Note</button>"
        );
    })
});

$(document).on("click", ".save-note-button", function() {
    var articleRef = $(this).parent().parent().attr("data-id");
    var inputRef = $(this).parent().find('input');
    var noteHolder = $(this).parents(".single-article-div").find('.note-holder');
    noteHolder.empty();
    // currentNote.text("Current Note: "+inputRef.val());
    noteHolder.append(
        "<p class='p-note'>Current Note: "+inputRef.val()+"</p>"+
        "<button class='remove-note'>Delete Note</button>"
    );
    // console.log(articleRef)
    $.ajax({
        method: "POST",
        url: "/articles/"+ articleRef,
        data: {
            body:inputRef.val()
            // body:'what is this doing'
        }
    })
    .then(function(data) {
        console.log(data);
    });
});

$(document).on("click", ".remove-note", function() {
    var deletionRef = $(this).parents(".single-article-div").attr("data-id");
    var noteHolder = $(this).parents(".single-article-div").find('.note-holder');
    noteHolder.empty();
    $.ajax({
        method: "DELETE",
        url: "/article-note/"+ deletionRef
    })
    .then(function(data) {
        console.log(data);
    });
});