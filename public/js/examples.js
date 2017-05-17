/**
 * @author zhixin wen <wenzhixin2010@gmail.com>
 * examples for projects
 */

var projects = {
    bootstrap_table: {

        data: function(req, res) {

            var offset = +req.query.offset || 0,
                limit = +req.query.limit || 20,
                search = req.query.search,
                name = req.query.sort,
                order = req.query.order || 'asc',

                i,
                max = offset + limit,
                rows = [],
                result = {
                    total: +req.query.total || 19,
                    rows: []
                };

        var matrix =  [{
            
                week: "week01",
                mon: "12", 
                tue: "11",
                wed: "CALL",
                thur: "",
                fri: "",
                satsun: ""
        }, {
                week: "week02",
                mon: "", 
                tue: "",
                wed: "12",
                thur: "11",
                fri: " Call ",
                satsun: ""
        }, {
                week: "week03",
                mon: "6", 
                tue: "9",
                wed: "8",
                thur: "1",
                fri: "2",
                satsun: ""

        }, {
                week: "week04",
                mon: "9", 
                tue: "1",
                wed: "2",
                thur: "9",
                fri: "1",
                satsun: ""

        }, {
                week: "week05",
                mon: "vfi", 
                tue: "vfi",
                wed: "vfi",
                thur: "vfi",
                fri: "vfi",
                satsun: "vfi"

        }, {
                week: "week06",
                mon: "10", 
                tue: "2",
                wed: "1",
                thur: "6",
                fri: "6",
                satsun: ""

        }, {
                week: "week07",
                mon: "CALL", 
                tue: "",
                wed: "",
                thur: " 12 ",
                fri: " 13 ",
                satsun: ""

        }, {
                week: "week08",
                mon: "", 
                tue: "10",
                wed: "9",
                thur: "10",
                fri: "11",
                satsun: ""

        }, {
                week: "week09",
                mon: "", 
                tue: "10",
                wed: "9",
                thur: "10",
                fri: "11",
                satsun: ""

        }, {
                week: "week10",
                mon: "", 
                tue: "10",
                wed: "9",
                thur: "10",
                fri: "11",
                satsun: ""

        }, {
                week: "week11",
                mon: "", 
                tue: "10",
                wed: "9",
                thur: "10",
                fri: "11",
                satsun: ""

        }, {
                week: "week12",
                mon: "", 
                tue: "10",
                wed: "9",
                thur: "10",
                fri: "11",
                satsun: ""

        }, {
                week: "week13",
                mon: "", 
                tue: "10",
                wed: "9",
                thur: "10",
                fri: "11",
                satsun: ""

        } ,{
                week: "week14",
                mon: "", 
                tue: "10",
                wed: "9",
                thur: "10",
                fri: "11",
                satsun: ""

        } ,{
                week: "week15",
                mon: "", 
                tue: "10",
                wed: "9",
                thur: "10",
                fri: "11",
                satsun: ""

        } ,{
                week: "week16",
                mon: "", 
                tue: "10",
                wed: "9",
                thur: "10",
                fri: "11",
                satsun: ""

        }, {
                week: "week17",
                mon: "", 
                tue: "10",
                wed: "9",
                thur: "10",
                fri: "11",
                satsun: ""
        }, {
                week: "week18",
                mon: "", 
                tue: "10",
                wed: "9",
                thur: "10",
                fri: "11",
                satsun: ""

        }, {
                week: "week19",
                mon: "", 
                tue: "10",
                wed: "9",
                thur: "10",
                fri: "11",
                satsun: ""

        }]; 


            for (i = 0; i < matrix.length; i++) {
                //console.log(matrix.length);
                //console.log(matrix[i].week);
                rows.push({
                    id : i,
                    week: matrix[i].week,
                    mon: matrix[i].mon, 
                    tue: matrix[i].tue,
                    wed: matrix[i].wed,
                    thur: matrix[i].thur,
                    fri: matrix[i].fri,
                    satsun: matrix[i].satsun,
                    order: matrix[i].order
                    //name: 'Item ' + i,
                   // price: '$' + i
                });

            
            }


            if (search) {
                rows = rows.filter(function(item) {
                    return item.week.indexOf(search) !== -1;
                });
            }
            if (['id', 'week', 'price'].indexOf(name) !== -1) {
                rows = rows.sort(function(a, b) {
                    var c = a[name],
                        d = b[name];

                    if (name === 'order') {
                        c = +c.substring(1);
                        d = +d.substring(1);
                    }
                    if (c < d) {
                        return order === 'asc' ? -1 : 1;
                    }
                    if (c > d) {
                        return order === 'asc' ? 1 : -1;
                    }
                    return 0;
                });
            }

            if (max > rows.length) {
                max = rows.length;
            }

            matrix.length = rows.length;
            for (i = offset; i < max; i++) {
                result.rows.push(rows[i]);
            }
            res.json(result);
        }
    }
};

module.exports = function(req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    projects[req.params.project][req.params.func](req, res);
};
