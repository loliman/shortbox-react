



function generateLabel(o) {
    if (!o)
        return "Shortbox";
    else if (o.name)
        return o.name;
    else if (o.volume) {
        let year;

        if (o.startyear)
            year = ' (' + o.startyear + ' - ' + ((o.endyear === 0) ? '...' : o.endyear) + ')';

        return o.title + ' (Vol. ' + romanize(o.volume) + ')' + (year ? year : "");
    } else if (o.series)
        return o.series.title + ' #' + o.number;
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function romanize(num) {
    if (isNaN(num))
        return NaN;
    var digits = String(+num).split(""),
        key = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM",
            "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC",
            "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"],
        roman = "",
        i = 3;
    while (i--)
        roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
}

function getGqlVariables(selected, us) {
    let publisher_name;
    let series_title;
    let series_volume;
    let issue_number;

    if(selected) {
        if (selected.series)
            publisher_name = selected.series.publisher.name;
        else if (selected.publisher)
            publisher_name = selected.publisher.name;
        else
            publisher_name = selected.name;

        if (selected.series)
            series_title = selected.series.title;
        else if (selected.title)
            series_title = selected.title;

        if (selected.series)
            series_volume = selected.series.volume;
        else if (selected.title)
            series_volume = selected.volume;

        if (selected.series)
            issue_number = selected.number;
    }

    return {
        us: us,
        publisher_name: publisher_name,
        series_title: series_title,
        series_volume: series_volume,
        issue_number: issue_number
    };
}

export {generateLabel, capitalize, getGqlVariables}