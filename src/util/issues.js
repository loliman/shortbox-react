import {romanize} from "./util";
import {generateLabel} from "./hierarchy";

export function generateItemTitle(item, us) {
    let titleFromStory = "";
    if (item.title)
        titleFromStory = " - " + item.title;

    if (item.parent) {
        let title = generateLabel(item.parent.issue.series) + " #" + item.parent.issue.number;
        title += ((item.__typename !== "Cover" && item.parent.number > 0 && item.parent.issue.stories.length > 1) ? " [" + romanize(item.parent.number) + "]" : "");
        title += (item.parent.variant ? " [" + item.parent.format + "/" + item.parent.variant + "]" : "");
        return title + titleFromStory ;
    } else if (item.series)
        return generateLabel(item.series) + " #" + item.number;
    else if(titleFromStory !== "")
        return titleFromStory.substring(3);
    else
        return us ? "Untitled" : "Exklusiv hier erschienen";
}

export function generateIssueSubHeader(item) {
    let header = '';

    if(item.title)
        header += item.title;

    if (item.format) {
        header += " " + item.format;
        if (item.variant)
            header += " (" + item.variant + " Variant)";
    }
    return header;
}