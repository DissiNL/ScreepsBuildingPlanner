$.fn.OneClickSelect = function() {
    return $(this).on('click', function() {
        var range, selection;

        if (window.getSelection) {
            selection = window.getSelection();
            range = document.createRange();
            range.selectNodeContents(this);
            selection.removeAllRanges();
            selection.addRange(range);
        } else if (document.body.createTextRange) {
            range = document.body.createTextRange();
            range.moveToElementText(this);
            range.select();
        }
    });
};

function exportData() {
    $.ajax({
        url: "http://short.dissi.me/create",
        type: "GET",
        crossDomain: true,
        dataType: 'json',
        data: {
            "pw": 'test1234',
            "link": window.location.href
        }
    }).done(function(data) {
        console.log(data);
        $('#url_data').val(data.shortURL);

    });
}

var lastClicked;
var selectedElement = 'spawn'
var grid = clickableGrid(50, 50, drawStuff, deleteStuff);

function drawStuff(el) {
    var toGetFrom = el;
    var x = toGetFrom.data('x');
    var y = toGetFrom.data('y');
    var building = toGetFrom.data('building');
    if (building != selectedElement && mayPlaceBuilding(selectedElement)) {
        toGetFrom.data('building', selectedElement);
        toGetFrom.css('background-image', 'url(' + selectedElement + '.png');
        updateBuildingcounts(building, selectedElement);
    }
}

function deleteStuff(el) {
    var toGetFrom = el;
    var x = toGetFrom.data('x');
    var y = toGetFrom.data('y');
    var building = toGetFrom.data('building');
    if (building != undefined) {
        toGetFrom.data('building', null);
        toGetFrom.css('background-image', "");
        updateBuildingcounts(building, undefined);
    }
}

function updateBuildingcounts(oldBuilding, newBuilding) {
    var rcl = $('#rcl').val()
    if (oldBuilding) {
        currentBuildingCounts[oldBuilding] -= 1;
        $('#li-buildingcount-' + oldBuilding).text(currentBuildingCounts[oldBuilding]);
        var pct = 100 - (currentBuildingCounts[oldBuilding] / CONTROLLER_STRUCTURES[oldBuilding][rcl] * 100);
        $('#li-building-' + oldBuilding).css("color", getGreenToRed(pct));
    }
    if (newBuilding) {
        currentBuildingCounts[newBuilding] += 1;
        $('#li-buildingcount-' + newBuilding).text(currentBuildingCounts[newBuilding]);
        var pct = 100 - (currentBuildingCounts[newBuilding] / CONTROLLER_STRUCTURES[newBuilding][rcl] * 100);
        $('#li-building-' + newBuilding).css("color", getGreenToRed(pct));
    }
    updateExport();
}

function getGreenToRed(percent) {
    r = percent < 50 ? 255 : Math.floor(255 - (percent * 2 - 100) * 255 / 100);
    g = percent > 50 ? 255 : Math.floor((percent * 2) * 255 / 100);
    return 'rgb(' + r + ',' + g + ',0)';
}

function mayPlaceBuilding(theBuilding) {
    var rcl = $('#rcl').val()
    return (currentBuildingCounts[theBuilding] < CONTROLLER_STRUCTURES[theBuilding][rcl]);
}

var currentBuildingCounts = {};

/* beautify preserve:start */
var CONTROLLER_STRUCTURES =
{
        "spawn": { 0: 0, 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 2, 8: 3 },
        "extension": { 0: 0, 1: 0, 2: 5, 3: 10, 4: 20, 5: 30, 6: 40, 7: 50, 8: 60 },
        "link": { 1: 0, 2: 0, 3: 0, 4: 0, 5: 2, 6: 3, 7: 4, 8: 6 },
        "road": { 0: 2500, 1: 2500, 2: 2500, 3: 2500, 4: 2500, 5: 2500, 6: 2500, 7: 2500, 8: 2500 },
        "constructedWall": { 1: 0, 2: 2500, 3: 2500, 4: 2500, 5: 2500, 6: 2500, 7: 2500, 8: 2500 },
        "rampart": { 1: 0, 2: 2500, 3: 2500, 4: 2500, 5: 2500, 6: 2500, 7: 2500, 8: 2500 },
        "storage": { 1: 0, 2: 0, 3: 0, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1 },
        "tower": { 1: 0, 2: 0, 3: 1, 4: 1, 5: 2, 6: 2, 7: 3, 8: 6 },
        "observer": { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 1 },
        "powerSpawn": { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 1 },
        "extractor": { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 1, 7: 1, 8: 1 },
        "terminal": { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 1, 7: 1, 8: 1 },
        "lab": { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 3, 7: 6, 8: 10 },
        "container": { 0: 5, 1: 5, 2: 5, 3: 5, 4: 5, 5: 5, 6: 5, 7: 5, 8: 5 },
        "nuker": { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 1 }
};
/* beautify preserve:end */

$('#gridlock').append(grid.grid);

var rcl = $('#rcl').val()

for (var building in CONTROLLER_STRUCTURES) {
    var selectedClass = '';
    if (selectedElement == building) {
        selectedClass = ' ui-selectee ui-selected'
    }
    currentBuildingCounts[building] = 0;
    $('<li />', {
        'id': 'li-building-' + building,
        'css': {
            'background-image': 'url(' + building + '.png',
            "color": getGreenToRed(100)
        },
        'data-building': building,
        'html': building + ' <span style="float:right"><span id="li-buildingcount-' + building + '">0</span> / <span id="li-buildingtotal-' + building + '">' + CONTROLLER_STRUCTURES[building][rcl] + '</span></span>',
        'class': 'ui-widget-content' + selectedClass,
    }).appendTo('#screeps-element-box');
}

function clearGrid() {

    for (var building in CONTROLLER_STRUCTURES) {
        currentBuildingCounts[building] = 0;
        $('#li-buildingcount-' + building).text(0);
        var pct = 100 - (currentBuildingCounts[building] / CONTROLLER_STRUCTURES[building][8] * 100);
        $('#li-building-' + building).css("color", getGreenToRed(pct));
    }
    var elements = grid.elements;
    for (var y = 0; y < 50; y++) {
        for (var x = 0; x < 50; x++) {
            elements[y][x].data('building', null);
            elements[y][x].css('background-image', "");
            elements[y][x].css('background-color', "");
        }
    }
}

function processImport(theData) {
    var backupSelectedelement = selectedElement;
    try {

        var imports = JSON.parse(theData);

        var elements = grid.elements;

        if (imports.name) {
            $('#room-name').val(imports.name)
            getTerrain()
        }
        if (imports.rcl) {
            $('#rcl').val(imports.rcl)
        }

        if (imports.buildings) {
            clearGrid();
            for (var building in imports.buildings) {
                if (!CONTROLLER_STRUCTURES[building] || !imports.buildings[building].pos) {
                    continue;
                }
                selectNewtool(building);
                var positionsToPlace = imports.buildings[building].pos;
                for (var index = 0; index < positionsToPlace.length; index++) {
                    var x = positionsToPlace[index].x;
                    var y = positionsToPlace[index].y;
                    drawStuff(elements[y][x]);
                }
            }
        }

    } catch (e) {
        alert('Could not import due to error: ' + e.stack);
    }

    selectNewtool(selectedElement);
}

function updateExport() {
    var roomName = ($('#room-name').val() || 'textExport')
    var rcl = $('#rcl').val()
    var exportData = {
        name: roomName,
        rcl: rcl,
        buildings: {}
    };
    var elements = grid.elements;
    for (var y = 0; y < 50; y++) {
        for (var x = 0; x < 50; x++) {
            var bld = elements[y][x].data('building');
            if (bld) {
                if (!exportData.buildings[bld]) {
                    exportData.buildings[bld] = {
                        pos: []
                    };
                }
                exportData.buildings[bld].pos.push({
                    x: x,
                    y: y
                });
            }
        }
    }
    $('#export').val(JSON.stringify(exportData));
    location.hash = LZString.compressToEncodedURIComponent(JSON.stringify(exportData))
}

$(grid.grid).on("contextmenu", function() {
    return false;
});

function selectNewtool(theTool) {

    selectedElement = theTool;
}

function initiateImport() {
    var data = prompt("Please paste your previous export", "{}");
    if (data)
        processImport(data);
}

function initiateImportFromTextarea() {
    var data = $("#export").val();
    if (data)
        processImport(data);
}

$(function() {

    $("#import_textarea").click(initiateImportFromTextarea);
    $('#export_textarea').click(exportData);
    $("#screeps-element-box").selectable({
        filter: "li",
        selected: function(event, ui) {
            var building = $(ui.selected).data('building');
            selectNewtool(building);
        },
        selecting: function(event, ui) {
            if ($(".ui-selected, .ui-selecting").length > 1) {
                $(ui.selecting).removeClass("ui-selecting");
            }
        },
    });
    if (location.hash) {
        var data = LZString.decompressFromEncodedURIComponent(location.hash.slice(1))
        if (data)
            processImport(data)
    }
});

$('#rcl').on('change', function() {
    var rcl = $('#rcl').val()

    for (var building in CONTROLLER_STRUCTURES) {
        $('#li-buildingtotal-' + building).html(CONTROLLER_STRUCTURES[building][rcl])
    }

    updateExport()
})

$('#room-name').on('change', function(){
  updateExport()

  getTerrain()
})

function getTerrain(){
  var roomName = $('#room-name').val()

  $.ajax({
    url: 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20htmlstring%20where%20url%3D\'https%3A%2F%2Fscreeps.com%2Fapi%2Fgame%2Froom-terrain%3Froom%3D' + roomName + '%26encoded%3D1\'&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=',
    dataType: 'json',
    success: function(data){
      var elements = grid.elements;
      for (var y = 0; y < 50; y++) {
          for (var x = 0; x < 50; x++) {
              elements[y][x].css('background-color', "");
          }
      }

      var regex = /<body>(.*?)<\/body>/gm

      var match = regex.exec(data.query.results.result)
      var data = JSON.parse(match[1])

      if(!data.error){
        var terrain = data.terrain[0].terrain

        for(var y=0; y<50; y++) {
          for(var x=0; x<50; x++) {
            var code = terrain.charAt(y*50+x)
            var el = $(grid.elements[y][x])

            if(code & 1) {
              el.css('background-color', '#000')
            }else if(code & 2) {
              el.css('background-color', '#292b18')
            }
          }
        }
      }
    }
  })
}

$('#save_room').on('click', function(){
  var roomName = $('#room-name').val()
  var rcl = $('#rcl').val()

  if(roomName){
    localStorage.setItem(roomName + '-rcl' + rcl, window.location.hash)

    $('#saved_rooms').html('')
    for(var name in localStorage){
      $('#saved_rooms').append('<option value="' + name + '">' + name + '</option>')
    }
  }else{
    alert('Please set the room name before saving.')
  }
})

for(var name in localStorage){
  $('#saved_rooms').append('<option value="' + name + '">' + name + '</option>')
}

$('#load_room').on('click', function(){
  console.log('clicked')
  var key = $('#saved_rooms').val()

  var data = LZString.decompressFromEncodedURIComponent(localStorage.getItem(key).slice(1))

  if (data)
      processImport(data)
})

$('#delete_room').on('click', function(){
  var key = $('#saved_rooms').val()

  localStorage.removeItem(key)

  $('#saved_rooms').html('')
  for(var name in localStorage){
    $('#saved_rooms').append('<option value="' + name + '">' + name + '</option>')
  }
})
