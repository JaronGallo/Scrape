// Grab the articles as a json

$.getJSON("/articles", function(data) {
  // For each one
  
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<p id='model1 modal-trigger' class='articleTitle' data-id='" + data[i]._id + "'><b>" + data[i].title + "</b><br />" + data[i].content + "<br />" + data[i].time + "<br />" + "<a href = " + data[i].articleLink + '>' + data[i].articleLink  + '</a>'+ "</p>");
    $("#articles").append("<hr>");

  }

});

$('.modal').modal();

// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
 $('#modal1').modal('open');
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .done(function(data) {
      console.log(data);
      // The title of the article
      // $("#header").text("");
      $(".modal-content").html("<h4 id='header' class='center-align'></h4><div id='para'></div>");
      $(".modal-footer").html("");
      $("#header").append(data.title + "<hr>");

      // An input to enter a new title
      $(".modal-content").append("<input id='titleinput' name='title' placeholder='title'>");
      // A textarea to add a new note body
      $(".modal-content").append("<textarea class='materialize-textarea' id='bodyinput' name='body' placeholder='Type Here!'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      
      $(".modal-footer").append("<button class='modal-action modal-close waves-effect waves-green btn-flat' data-id='" + data._id + "' id='savenote'>Save Note</button>"); 
      
      // If there's a note in the article
      if (data.note) { 
        

        $("#para").append("<h4 class='center-align'><u>" + "Current Note" + "</u></h4>");
        $("#para").append("<h4>"+ 'Title: ' + data.note.title + "</h4>");
      $("#para").append("<h4>" + data.note.body + "</h4>");
      }

    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
      location.reload();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
