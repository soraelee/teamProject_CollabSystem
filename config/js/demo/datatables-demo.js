// // Call the dataTables jQuery plugin
$('#dataTable').DataTable({
  
  "aaSorting": [[0,'desc']],
  "lengthMenu": [[3, 5, 10, 25, 50, -1], [3, 5, 10, 25, 50, "All"]],
  "language": {
    "lengthMenu": 'Display <select>'+
      '<option value="3">3</option>'+
      '<option value="5">5</option>'+
      '<option value="10">10</option>'+
      '<option value="25">25</option>'+
      '<option value="50">50</option>'+
      '<option value="-1">All</option>'+
      '</select> records'
  },
  
});
