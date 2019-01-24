function generateIssueSubHeader(i) {
    let header = i.title;
    if (i.format) {
        header += " [" + i.format;
        if (i.variant)
            header += " " + i.variant;
        header += "]"
    }

    return header;
}


function generateStoryTitle(s) {
    if (s.title)
        return s.title;
    else
        return "ohne Titel";
}

function generateLabel(o) {
    if (!o)
        return "Shortbox";
    else if (o.name)
        return o.name;
    else if (o.publisher) {
        let endyear = (o.endyear === 0) ? '...' : o.endyear;
        return o.title + ' (Vol. ' + romanize(o.volume) + ') (' + o.startyear + ' - ' + endyear + ')';
    } else if (o.series)
        return o.series.title + ' #' + o.number;
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

function getHierarchyLevel(o) {
    if (!o)
        return HierarchyLevel.PUBLISHER;
    else if (o.name)
        return HierarchyLevel.SERIES;
    else if (o.publisher)
        return HierarchyLevel.ISSUE;
    else if (o.series)
        if (o.series.publisher.us)
            return HierarchyLevel.ISSUE_DETAILS_US;
        else
            return HierarchyLevel.ISSUE_DETAILS;
}

const HierarchyLevel = Object.freeze({
    PUBLISHER: "publishers",
    SERIES: "series",
    ISSUE: "issues",
    ISSUE_DETAILS: "issue_details",
    ISSUE_DETAILS_US: "issue_details_us"
});

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getHierarchyLevelFromUrl(url) {
    if (url.length === 0)
        return HierarchyLevel.PUBLISHER;
    else if (url.length === 1)
        return HierarchyLevel.SERIES;
    else if (url.length === 2)
        return HierarchyLevel.ISSUE;
}

function getSelected(url) {
    if(url.startsWith("/"))
        url = url.substring(1, url.length);

    if(url.endsWith("/"))
        url = url.substring(0, url.length-1);

    let urls = [];
    if(url === "")
        return urls;

    url.split("/").forEach((u) => urls.push(decodeURIComponent(u)));

    return urls;
}

function generateUrl(item) {
    if(item.name)
        return encodeURIComponent(item.name);

    if(item.publisher)
        return encodeURIComponent(item.publisher.name)
            + "/"
            + encodeURIComponent(item.title + "_Vol_" + item.volume);

    return encodeURIComponent(item.series.title + "_Vol_" + item.series.volume)
        + "/"
        + encodeURIComponent(item.number);
}

export {generateLabel, getHierarchyLevel, generateIssueSubHeader, generateStoryTitle, HierarchyLevel, capitalize,
    getSelected, getHierarchyLevelFromUrl, generateUrl}