import gql from "graphql-tag";
import {HierarchyLevel} from "../util/hierarchiy";

const publishers = gql`query Publishers($us: Boolean!){
    publishers(us: $us) {
        id,
        name,
        us
    }
}`;

const series = gql`query Series($publisher_name: String!){
    series(publisher_name: $publisher_name) {
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

const issues = gql`query Issues($series_title: String!, $series_volume: Int!, $publisher_name: String!){
    issues(series_title: $series_title, series_volume: $series_volume, publisher_name: $publisher_name) {
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

function getListQuery(level) {
    switch (level) {
        case HierarchyLevel.PUBLISHER:
            return publishers;
        case HierarchyLevel.SERIES:
            return series;
        default:
            return issues;
    }
}

const publisher = gql`query Publisher($publisher_name: String!){
    publisher(publisher_name: $publisher_name) {
        id,
        name,
        us
    }
}`;

const seriesd = gql`query Seriesd($series_title: String!, $series_volume: Int!, $publisher_name: String!){
    seriesd(series_title: $series_title, series_volume: $series_volume, publisher_name: $publisher_name) {
        id,
        title,
        volume,
        startyear,
        endyear,
        publisher {
            id,
            name,
            us
        }
    }
}`;

const issue = gql`query Issue($issue_number: String!, $series_title: String!, $series_volume: Int!, $publisher_name: String!){
    issue(issue_number: $issue_number, series_title: $series_title, series_volume: $series_volume, publisher_name: $publisher_name) {
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
        verified
    }
}`;

export {getListQuery, issue, publisher, seriesd, publishers, series};