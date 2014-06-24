'use strict';

var _students, _selectedStudents;
var _courses;

$(document).ready(function() {
  //alert('Hooray, everything runs ok. You can remove this annoying alert from the code.');

  $.getJSON('https://hackbulgaria.com/api/students/', function(students, textStatus) {
    if (textStatus != 'success') {
      alert(textStatus);
    }

    _selectedStudents = _students = _.filter(students, function(student) {
      var regex = /\s/;
      return regex.test(student.name);
    });

    _courses = _(_students).flatten('courses').flatten('name').uniq().value();

    initOtherStuff();
    populateTable($('.table'), _selectedStudents);
  });
});

function populateTable($table, students) {
  $table.empty();
  $table.append('<tr>\
    <th>Name</th>\
    <th>GitHub</th>\
    <th>Courses</th>\
    <th>Available</th>\
  </tr>');

  var trTemplate = $('#trTemplate').html();
  var parsedHtml = _.template(trTemplate, {
    students: students
  });
  $table.append(parsedHtml);
}

function initOtherStuff() {
  var template = $('#courses-select-template').html();
  var parsedHtml = _.template(template, {
    courses: _courses
  });
  $('#courses').append(parsedHtml);

  $('#filter-btn').on('click', filterHandler);
}

function filterHandler() {
  var selectedCourse = $('#courses').val();
  var selectedGroup = $('#course-group').val();

  console.log(selectedCourse + ' ' + selectedGroup);

  _selectedStudents = _.filter(_students, function(student) {
    var result = _.find(student.courses, function(course) {
      console.log(course.name + ' ' + course.group);
      return (selectedCourse == '0' || course.name == selectedCourse) &&
        (selectedGroup == '0' || course.group == selectedGroup);
    });
    console.log(!!result);
    return !!result;
  });
  console.log(_selectedStudents);
  populateTable($('.table'), _selectedStudents);
}
