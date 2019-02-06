import {generateLabel} from "./util";

export function generateItemTitle(s) {
    if (s.title)
        return s.title;
    else if (s.parent) {
        let title = generateLabel(s.parent.issue.series) + " #" + s.parent.issue.number;
        return title + (s.parent.variant ? " [" + s.parent.format + "/" + s.parent.variant + "]" : "");
    }
    else if (s.series)
        return generateLabel(s.series) + " #" + s.number;
    else
        return "Ohne Titel";
}

export function generateIssueSubHeader(i) {
    let header = i.title;
    if (i.format) {
        header += " [" + i.format;
        if (i.variant)
            header += " " + i.variant;
        header += "]"
    }
    return header;
}