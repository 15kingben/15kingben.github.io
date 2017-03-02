lp = -1


var sortTable = function(colindex, lastPressIndex){
  var rows = $('#mytable tbody tr').get();
  console.log(colindex);
  rows.sort(function(a, b) {

  var A = $(a).children('td').eq(colindex).text(); //.toUpperCase();
  var B = $(b).children('td').eq(colindex).text(); //.toUpperCase();

  if(colindex>0){
    A = parseInt(A);
    B = parseInt(B);
  }

  console.log(A + " " + B);
  var rev = 1;
  if (lastPressIndex == colindex){
    rev = -1;
  }else{

  }
  console.log(rev);

  if(rev == 1){
    if(A < B) {
      return -1;
    }
    if(A > B) {
      return 1;
    }
    return 0;
  }else{
    if(A > B) {
      return -1;
    }
    if(A < B) {
      return 1;
    }
    return 0;
  }

  });

  $.each(rows, function(index, row) {
    $('#mytable').children('tbody').append(row);
    // console.log("blah")

  });
}



$(document).ready(function(){
  $("#col0").click(function(){
    sortTable(0, lp);
    if(lp == 0){
      lp = -1;
    }else{
    lp = 0;
  }
  } );
  $("#col1").click(function(){
    sortTable(1, lp);
    if(lp == 1){
      lp = -1;
    }else{
    lp = 1;
  }
  } );
  $("#col2").click(function(){
    sortTable(2, lp);
    if(lp == 2){
      lp = -1;
    }else{
        lp = 2;
      }
  } );
  $("#col3").click(function(){
    sortTable(3, lp);
    if(lp == 3){
        lp = -1;
    }else{
    lp = 3;
  }
  } );

});
