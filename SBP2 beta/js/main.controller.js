APP.controller('MainController', function () {
    this.grid = [];
    this.hover = {
        x: undefined,
        y: undefined
    };

    //Initialize grid
    for (var x = 0; x < 50; x++) {
        this.grid[x] = [];
        for (var y = 0; y < 50; y++) {
            this.grid[x][y] = {
                x: x,
                y: y,
                structures: []
            };
        }
    }

    this.processCellClick = function (cell) {
        console.log('Clicked cell ' + cell.x + ', ' + cell.y);
    };

    this.processCellMouseover = function (cell) {
        this.hover.x = cell.x;
        this.hover.y = cell.y;
    };
});