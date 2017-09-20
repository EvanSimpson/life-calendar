(function(){
  function getCurrentYearWeeksDiff(dob, lastDob) {
    // To get the current year's week diff:
    // Take the dob, set year to this year.
    // Check if this year dob has passed.
    // If no, get last dob, get week of last dob and
    // (52 - that week) will be how many to add to
    // this year's current week.
    // (Special case really late birthday's where week > 52, default 0)
    // If this year dob has passed, get week of dob
    // and current week, diff is what to color
    var thisYearDob = moment(dob.toISOString()).year(moment().year());
    var addWeeks;
    if (thisYearDob.isAfter(moment())) {
      addWeeks = Math.max(52 - lastDob.week(), 0) + moment().week();
    } else {
      addWeeks = moment().week() - thisYearDob.week();
    }
    return addWeeks;
  }

  function getAllYearWeeksDiff(dob) {
    var lastDob = moment(dob.toISOString()).year(moment().year() - 1);
    return (Math.max(lastDob.diff(dob, 'years'), 0) * 52) +
      getCurrentYearWeeksDiff(dob, lastDob);
  }

  function udpateCalendar(start) {
    var insert = document.getElementById("page-insert");
    var diff = getAllYearWeeksDiff(start);
    for(var i=0; i<91; i++){
      var row = document.createElement("div");
      row.setAttribute("class", "row");
      if ( i % 5 == 0 ) {
        var number = document.createElement("div");
        number.setAttribute("class", "year");
        number.innerHTML = i;
        row.appendChild(number);
      }
      for (var j=0; j<52; j++){
        var box = document.createElement("div");
        if ( (i * 52) + j < diff) {
          box.setAttribute("class", "box-colored");
        } else {
          box.setAttribute("class", "box");
        }
        row.appendChild(box);
      }
      insert.appendChild(row);
    }
  }

  function parseQuery() {
    if (window.location.search && window.location.search.length) {
      var split = window.location.search.replace('?', '').split('=');
      if (split[0] === 'd') {
        try {
          var startDate = moment(split[1]);
          if (startDate.isValid()) return startDate.toISOString();
        } catch (e) {}
      }
    }
    return null;
  }

  var initialDate = parseQuery();

  flatpickr('#date-picker', {
    defaultDate: initialDate || new Date(),
    altInput: true,
    onChange: function(_, newDate) {
      var momentDate = moment(newDate);
      window.location.search = 'd=' + momentDate.toISOString();
    }
  });

  if (initialDate) {
    udpateCalendar(moment(initialDate));
  }
})()
