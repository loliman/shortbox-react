import gql from "graphql-tag";
import {HierarchyLevel} from "../util/hierarchy";

const publishers = gql`query Publishers($us: Boolean!){
    publishers(us: $us) {
        id,
        name,
        us
    }
}`;

const series = gql`query Series($publisher: PublisherInput!){
    series(publisher: $publisher) {
        id,
        title,
        volume,
        startyear,
        endyear,
        publisher {
            id,
            name 
        }
    }
}`;

const issues = gql`query Issues($series: SeriesInput!){
    issues(series: $series) {
        id,
        title,
        number,
        limitation,
        format,
        price,
        currency,
        releasedate,
        cover {
            id,
            url
        },
        series {
            id,
            title,
            startyear,
            endyear,
            volume,
            publisher {
                id,
                name,
                us
            }
        }
    }
}`;

export const lastEdited = gql`query LastEdited {
    lastEdited {
        id,
        number,
        createdAt,
        updatedAt,
        series {
            id,
            title,
            volume,
            publisher {
                id,
                name
            }
        }
    }
}`;

function getListQuery(level) {
    switch (level) {
        case HierarchyLevel.ROOT:
            return publishers;
        case HierarchyLevel.PUBLISHER:
            return series;
        default:
            return issues;
    }
}

const publisher = gql`query Publisher($publisher: PublisherInput!){
    publisher(publisher: $publisher) {
        id,
        name,
        us,
        addinfo
    }
}`;

const seriesd = gql`query Seriesd($series: SeriesInput!){
    seriesd(series: $series) {
        id,
        title,
        volume,
        startyear,
        endyear,
        addinfo,
        publisher {
            id,
            name,
            us
        }
    }
}`;

const issue = gql`query Issue($issue: IssueInput!){
    issue(issue: $issue) {
        id,
        title,
        number,
        format,
        limitation,
        language,
        pages,
        releasedate,
        price,
        currency,
        editors {
            id,
            name
        },
        cover {
            id, 
            url,
            artists {
                id,
                name
            }
        },
        series {
            id,
            title,
            volume,
            publisher {
                id, 
                name,
                us
            }
        },
        features {
            id,
            title,
            addinfo,
            writers {
                id,
                name
            },
            translators {
                id,
                name
            }
        },
        stories {
            id,
            title,
            number,
            addinfo,
            parent {
                id,
                issue {
                    id,
                    number,
                    series {
                        id,
                        title,
                        startyear,
                        endyear,
                        volume,
                        publisher {
                            id,
                            name,
                            us
                        }
                    }   
                },
                number,
                children {
                    id
                },
                pencilers {
                    id,
                    name
                },
                writers {
                    id,
                    name
                },
                inkers {
                    id,
                    name
                },
                colourists {
                    id,
                    name
                },
                letterers {
                    id,
                    name
                },
                editors {
                    id,
                    name
                },
                translators {
                    id,
                    name
                }
            },
            children {
                id,
                issue {
                    id,
                    number,
                    series {
                        id,
                        title,
                        volume,
                        startyear,
                        endyear,
                        publisher {
                            id,
                            name
                        }
                    }
                }
            },
            firstapp,
            pencilers {
                id,
                name
            },
            writers {
                id,
                name
            },
            inkers {
                id,
                name
            },
            colourists {
                id,
                name
            },
            letterers {
                id,
                name
            },
            editors {
                id,
                name
            },
            translators {
                id,
                name
            }
        },
        covers {
            id,
            addinfo,
            number,
            url,
            parent {
                id,
                issue {
                    id,
                    variant,
                    format,
                    issue {
                        number,
                        series {
                            id,
                            title,
                            startyear,
                            endyear,
                            volume,
                            publisher {
                                id,
                                name,
                                us
                            }
                        }   
                    }
                },
                children {
                    id
                },
                artists {
                    id,
                    name
                }
            },
            children {
                id,
                issue {
                    id,
                    issue {
                        number,
                        series {
                            id,
                            title,
                            volume,
                            startyear,
                            endyear,
                            publisher {
                                id,
                                name
                            }
                        }
                    }
                }
            },
            firstapp,
            artists {
                id,
                name
            }
        },
        variants {
            id,
            format,
            price,
            currency,
            releasedate,
            variant,
            cover {
                id,
                url
            },
            limitation,
            verified
        },
        verified,
        addinfo
    }
}`;

export {getListQuery, issue, publisher, seriesd, publishers, series, issues};