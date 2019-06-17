import React from "react";
import Chip from "@material-ui/core/Chip";

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

export function toIndividualList(items, props, individualType, filterType, details) {
    if(!items || items.length === 0)
        return <Chip className="chip" variant={"outlined"} label="Unbekannt"/>;

    let list = [];
    items.forEach((item, i) => {
        let filter = {
            story: filterType !== "cover" && filterType !== "feature",
            cover: filterType === "cover",
            feature: filterType === "feature",
            us: props.us
        };
        filter[individualType] = [{name: item.name}];

        list.push(
            <Chip key={i} className="chip partOfChip" label={item.name} onClick={() => props.navigate(props.us ? "/us" : "/de", {filter: JSON.stringify(filter)})}/>
        );

        if(details && i != items.length-1)
            list.push(<br />);
    });

    return list;
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