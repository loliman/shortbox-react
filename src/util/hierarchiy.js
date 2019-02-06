export const HierarchyLevel = Object.freeze({
    PUBLISHER: "publishers",
    SERIES: "series",
    ISSUE: "issues",
    ISSUE_DETAILS: "issue_details"
});

export function getHierarchyLevel(o, edit) {
    if (!o || (o.name && edit))
        return HierarchyLevel.PUBLISHER;
    else if (o.name || (o.publisher && edit))
        return HierarchyLevel.SERIES;
    else if (o.publisher || (o.series && edit))
        return HierarchyLevel.ISSUE;
    else if (o.series)
        return HierarchyLevel.ISSUE_DETAILS;
}

export function generateUrl(item, us) {
    let url = (us ? "/us/" : "/de/");

    if (!item)
        return url;

    if (item.name || item.name === "")
        return url + encodeURIComponent(item.name);

    if (item.publisher)
        return url
            + encodeURIComponent(item.publisher.name.replace(/%/g, '%25'))
            + "/"
            + encodeURIComponent(item.title.replace(/%/g, '%25') + "_Vol_" + item.volume);

    if (!item.variant || item.variant === "")
        return url
            + encodeURIComponent(item.series.publisher.name.replace(/%/g, '%25'))
            + "/"
            + encodeURIComponent(item.series.title.replace(/%/g, '%25') + "_Vol_" + item.series.volume)
            + "/"
            + encodeURIComponent(item.number.replace(/%/g, '%25'));

    return url
        + encodeURIComponent(item.series.publisher.name.replace(/%/g, '%25'))
        + "/"
        + encodeURIComponent(item.series.title.replace(/%/g, '%25') + "_Vol_" + item.series.volume)
        + "/"
        + encodeURIComponent(item.number.replace(/%/g, '%25'))
        + "/"
        + encodeURIComponent(item.format + "_" + item.variant);
}

export function getSelected(params) {
    let selected;

    if (params.publisher) {
        selected = {};
        selected.name = decodeURIComponent(params.publisher);
    }
    if (params.series) {
        selected.publisher = {};
        selected.publisher.name = selected.name;
        selected.name = undefined;

        let series = decodeURIComponent(params.series);
        selected.title = series.substring(0, series.indexOf("_"));
        selected.volume = parseInt(series.substring(series.lastIndexOf("_") + 1, series.length));
    }
    if (params.issue) {
        selected.series = {};
        selected.series.volume = selected.volume;
        selected.series.title = selected.title;
        selected.series.publisher = {};
        selected.series.publisher.name = selected.publisher.name;
        selected.volume = undefined;
        selected.title = undefined;
        selected.publisher = undefined;

        let number = decodeURIComponent(params.issue);
        selected.number = number;
    }
    if (params.variant) {
        let variant = decodeURIComponent(params.variant);
        selected.format = variant.substring(0, variant.indexOf("_"));
        selected.variant = variant.substring(variant.lastIndexOf("_") + 1, variant.length)
    }

    return selected;
}