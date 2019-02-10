import {generateLabel, romanize} from "./util";

export function generateItemTitle(s) {
    if (s.title)
        return s.title;
    else if (s.parent) {
        let title = generateLabel(s.parent.issue.series) + " #" + s.parent.issue.number;
        title += ((s.__typename !== "Cover" && s.parent.number > 0) ? " [" + romanize(s.parent.number) + "]" : "");
        title += (s.parent.variant ? " [" + s.parent.format + "/" + s.parent.variant + "]" : "");
        return title ;
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