import {romanize, wrapItem} from "./util";

export const HierarchyLevel = Object.freeze({
    ROOT: "ROOT",
    PUBLISHER: "PUBLISHER",
    SERIES: "SERIES",
    ISSUE: "ISSUE"
});

export function getHierarchyLevel(item) {
    if (item.publisher)
        return HierarchyLevel.PUBLISHER;
    else if (item.series)
        return HierarchyLevel.SERIES;
    else if (item.issue)
        return HierarchyLevel.ISSUE;
    else
        return HierarchyLevel.ROOT;
}

export function generateUrl(item, us) {
    if (item.__typename)
        item = wrapItem(item);

    let url = (us ? "/us/" : "/de/");

    if (!item.publisher && !item.series && !item.issue)
        return url;

    if (item.publisher)
        return url + encodeURIComponent(item.publisher.name);

    if (item.series)
        return url
            + encodeURIComponent(item.series.publisher.name.replace(/%/g, '%25'))
            + "/"
            + encodeURIComponent(item.series.title.replace(/%/g, '%25') + "_Vol_" + item.series.volume);

    if (!item.issue.variant || item.issue.variant === "")
        return url
            + encodeURIComponent(item.issue.series.publisher.name.replace(/%/g, '%25'))
            + "/"
            + encodeURIComponent(item.issue.series.title.replace(/%/g, '%25') + "_Vol_" + item.issue.series.volume)
            + "/"
            + encodeURIComponent(item.issue.number.replace(/%/g, '%25'))
            + (item.issue.format ? ("/" + encodeURIComponent(item.issue.format)) : "");

    return url
        + encodeURIComponent(item.issue.series.publisher.name.replace(/%/g, '%25'))
        + "/"
        + encodeURIComponent(item.issue.series.title.replace(/%/g, '%25') + "_Vol_" + item.issue.series.volume)
        + "/"
        + encodeURIComponent(item.issue.number.replace(/%/g, '%25'))
        + "/"
        + encodeURIComponent(item.issue.format + "_" + item.issue.variant);
}

export function getSelected(params, us) {
    let selected = {us: us};

    if (params.publisher) {
        selected.publisher = {};
        selected.publisher.name = decodeURIComponent(params.publisher);
    }
    if (params.series) {
        selected.series = {publisher: {}};
        selected.series.publisher.name = selected.publisher.name;
        selected.publisher = undefined;

        let series = decodeURIComponent(params.series);
        selected.series.title = series.substring(0, series.indexOf("_"));
        selected.series.volume = parseInt(series.substring(series.lastIndexOf("_") + 1, series.length));
    }
    if (params.issue) {
        selected.issue = {series: {publisher: {}}};
        selected.issue.series.volume = selected.series.volume;
        selected.issue.series.title = selected.series.title;
        selected.issue.series.publisher = {};
        selected.issue.series.publisher.name = selected.series.publisher.name;
        selected.series = undefined;
        selected.issue.number = decodeURIComponent(params.issue);
    }
    if (params.variant) {
        let variant = decodeURIComponent(params.variant);
        if(variant.indexOf('_') === -1) {
            selected.issue.format = variant;
        } else {
            selected.issue.format = variant.substring(0, variant.indexOf("_"));
            selected.issue.variant = variant.substring(variant.lastIndexOf("_") + 1, variant.length)
        }
    }

    return selected;
}

export function generateLabel(item) {
    if(!item)
        return '';

    if (item.__typename)
        item = wrapItem(item);

    if (!item.publisher && !item.series && !item.issue)
        return "Shortbox - Das deutsche Archiv für Marvel Comics";

    if (item.publisher)
        return item.publisher.name;

    if (item.series) {
        let year = "";

        if (item.series.startyear) {
            year = ' (' + item.series.startyear + ')';
        }

        return item.series.title + (item.series.publisher ? ' (Vol. ' + romanize(item.series.volume) + ')' + year + '': '');
    }

    if (item.issue) {
        let year = "";

        if (item.issue.series.startyear)
            if(item.issue.series.startyear === item.series.endyear)
                year = ' (' + item.issue.series.startyear + ')';
            else
                year = ' (' + item.issue.series.startyear + ' - ' + ((!item.issue.series.endyear || item.issue.series.endyear === 0) ? '...' : item.issue.series.endyear) + ')';

        return item.issue.series.title + (item.issue.series.publisher ? ' (Vol. ' + romanize(item.issue.series.volume) + ')' : '') + (year ? year : "") + ' #' + item.issue.number;
    }
}
