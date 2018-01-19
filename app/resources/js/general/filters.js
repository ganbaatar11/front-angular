(function (Filters, undefined) {
    FAN.Modules.FAN
        .filter("asDate", function () {
            return function (input) {
                return (new Date(input)).getTime();
            }
        })
        .filter('range', function () {
            return function (input, total) {
                total = parseInt(total);

                for (var i = 0; i < total; i++) {
                    input.push(i);
                }

                return input;
            };
        })
        .filter('asDollar', function () {
            return function (number) {
                if (number < 0) {
                    return '-$' + Math.abs(number);
                } else {
                    return '$' + number;
                }
            }
        })
        .filter('head2head', function () {
            return function (number) {
                if (number == 2) {
                    return number + ' (Head to Head)';
                }
                return number;
            }
        })
        .filter('range1', function () {
            return function (input, min, max) {
                min = parseInt(min);
                max = parseInt(max);
                for (var i = min; i < max; i++)
                    input.push(i);
                return input;
            }
        });
}(FAN.Filters = FAN.Filters || {}));