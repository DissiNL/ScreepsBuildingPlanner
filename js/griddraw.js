
function clickableGrid( rows, cols, callbackLeftButton, callbackRightButton ){
	var elementGrid = [];
    var grid = document.createElement('table');
    grid.className = 'grid';
	grid.id = 'grid';
    for (var r=0;r<rows;++r){
		elementGrid[r] = [];
        var tr = grid.appendChild(document.createElement('tr'));
        for (var c=0;c<cols;++c){
            var cell = tr.appendChild(document.createElement('td'));
			elementGrid[r][c] = $(cell);
			elementGrid[r][c].data('x', c);
			elementGrid[r][c].data('y', r);
			cell.addEventListener('dragstart', function(event) { event.preventDefault(); });
            cell.addEventListener('mousedown',(function(el){
                el = $(el);
                return function(event){
					if(event.which == 1 || (event.button & 1) == 1)
						callbackLeftButton(el);
					else if(event.which  == 3 || (event.button & 3) == 3)
						callbackRightButton(el);
						
                }
            })(cell,r,c),false);
			
			cell.addEventListener("mousemove",(function(el){
                el = $(el);
                return function(event){
					if((event.buttons & 1) == 1)
						callbackLeftButton(el);
					else if((event.buttons & 2) == 2)
						callbackRightButton(el);
                }
            })(cell,r,c),false);


        }
    }
    return {grid:grid, elements: elementGrid};
}