
$.getJSON("/articles", function(data) {
  
  for (var i = 0; i < data.length; i++) {
    $("#articles").append("<p id='model1 modal-trigger' class='articleTitle' data-id='" + data[i]._id + "'><b>" + data[i].title + "</b><br />" + data[i].content + "<br />" + data[i].time + "<br />" + "<a href = " + data[i].articleLink + '>' + data[i].articleLink  + '</a>'+ "</p>");
    $("#articles").append("<hr>");

  }

});

$('.modal').modal();

$(document).on("click", "p", function() {
 $('#modal1').modal('open');
  $("#notes").empty();
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    .done(function(data) {
      console.log(data);
      $(".modal-content").html("<h4 id='header' class='center-align'></h4><div id='para'></div>");
      $(".modal-footer").html("");
      $("#header").append(data.title + "<hr>");

      $(".modal-content").append("<input id='titleinput' name='title' placeholder='title'>");
      $(".modal-content").append("<textarea class='materialize-textarea' id='bodyinput' name='body' placeholder='Type Here!'></textarea>");
      
      $(".modal-footer").append("<button class='modal-action modal-close waves-effect waves-green btn-flat' data-id='" + data._id + "' id='savenote'>Save Note</button>"); 
      
      if (data.note) { 
        

        $("#para").append("<h4 class='center-align'><u>" + "Current Note" + "</u></h4>");
        $("#para").append("<h4>"+ 'Title: ' + data.note.title + "</h4>");
      $("#para").append("<h4>" + data.note.body + "</h4>");
      }

    });
});

$(document).on("click", "#savenote", function() {
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })
    .done(function(data) {
      console.log(data);
      $("#notes").empty();
      location.reload();
    });

  $("#titleinput").val("");
  $("#bodyinput").val("");
});
