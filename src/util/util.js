export function wrapItem(item) {
    if (item.__typename === "Publisher")
        return {us: (item.us ? item.us : false), publisher: item};

    if (item.__typename === "Series")
        return {us: (item.publisher && item.publisher.us ? item.publisher.us : false), series: item};

    return {us: (item.series.publisher.us ? item.series.publisher.us : false), issue: item};
}

export function unwrapItem(item) {
    if (item.__typename === "Publisher")
        return item.publisher;

    if (item.__typename === "Series")
        return item.series;

    return item.issue;
}

export function stripItem(item) {
    let stripped = JSON.parse(JSON.stringify(item));

    stripped.__resolveType = undefined;
    stripped.__typename = undefined;

    if (stripped.series) {
        stripped.series.id = undefined;
        stripped.series.__resolveType = undefined;
        stripped.series.__typename = undefined;
        stripped.series.publisher.id = undefined;
        stripped.series.publisher.__resolveType = undefined;
        stripped.series.publisher.__typename = undefined;
    }

    if (stripped.publisher) {
        stripped.publisher.id = undefined;
        stripped.publisher.__typename = undefined;
        stripped.publisher.__resolveType = undefined;
    }

    return stripped;
}

export function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function decapitalize(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}

export function romanize(num) {
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

export function today() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }

    return dd + "." + mm + "." + yyyy;
}

export function pagesStringToArray(pages) {
    if(!pages || pages.length === 0)
        return [];

    let res = [];

    let splitAtComma = pages.split(",");
    splitAtComma.forEach(comma => {
        let splitAtDash = comma.split("-");

        let currentDash = +splitAtDash[0];
        let nextDash = currentDash;
        if(splitAtDash.length > 1)
            nextDash = +splitAtDash[1];

        while(currentDash <= nextDash)
            res.push(currentDash++);
    });

    return res;
}

export function pagesArrayToString(pages) {
    if(pages.length === 0)
        return "";

    let res = "";

    for(let i = 0; i < pages.length; i++) {
        let current = pages[i];
        let next = 0;
        if(i < pages.length)
            next = pages[i+1];

        if(current+1 === next) {
            if(res.endsWith("-"))
                continue;
            else {
                if(res.length > 0)
                    res+= ", ";
                res += current + "-";
            }
        }
        else {
            if(res.length > 0 && !res.endsWith("-"))
                res+= ", ";
            res += current;
        }
    }

    return res;
}