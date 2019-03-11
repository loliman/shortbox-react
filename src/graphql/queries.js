import gql from "graphql-tag";
import {HierarchyLevel} from "../util/hierarchy";

const publishers = gql`query Publishers($us: Boolean!){
    publishers(us: $us) {
        name
    }
}`;

const series = gql`query Series($publisher: PublisherInput!){
    series(publisher: $publisher) {
        title,
        volume,
        startyear,
        endyear,
        publisher {
            name
        }
    }
}`;

const issues = gql`query Issues($series: SeriesInput!){
    issues(series: $series) {
        number,
        series {
            title,
            volume,
            publisher {
                name
            }
        },
        format,
        variant
    }
}`;

const individuals = gql`query Individuals {
    individuals {
        name
    }
}`;

export const lastEdited = gql`query LastEdited {
    lastEdited {
        number,
        createdAt,
        updatedAt,
        series {
            title,
            volume,
            publisher {
                name
            }
        }
    }
}`;

const publisher = gql`query Publisher($publisher: PublisherInput!){
    publisher(publisher: $publisher) {
        name,
        us,
        addinfo
    }
}`;

const seriesd = gql`query Seriesd($series: SeriesInput!){
    seriesd(series: $series) {
        title,
        volume,
        startyear,
        endyear,
        addinfo,
        publisher {
            name,
            us
        }
    }
}`;

const issue = gql`query Issue($issue: IssueInput!){
    issue(issue: $issue) {
        title,
        number,
        format,
        limitation,
        pages,
        releasedate,
        price,
        currency
        cover {
            url
        },
        series {
            title,
            volume,
            publisher {
                name,
                us
            }
        },
        features {
            title,
            addinfo,
            number,
            writers {
                name
            },
            translators {
                name
            }
        },
        stories {
            title,
            addinfo,
            number,
            parent {
                issue {
                    number,
                    series {
                        title,
                        startyear,
                        endyear,
                        volume,
                        publisher {
                            name,
                            us
                        }
                    }   
                },
                children {
                    id
                },
                pencilers {
                    name
                },
                writers {
                    name
                },
                inkers {
                    name
                },
                colourists {
                    name
                },
                letterers {
                    name
                },
                editors {
                    name
                }
            },
			translators {
				name
			},
            firstapp,
            exclusive
        },
        covers {
            url,
            addinfo,
            number,
            parent {
                issue {
                    variant,
                    format,
                    number,
                    series {
                        title,
                        startyear,
                        endyear,
                        volume,
                        publisher {
                            name,
                            us
                        }
                    }   
                },
                children {
                    id
                },
                artists {
                    name
                }
            }
            firstapp,
            exclusive
        },
        variants {
            format,
            variant,
            number,
            series {
                title,
                volume,
                publisher {
                    name,
                    us
                }
            },
            cover {
                url
            }
        },
        variant,
        verified,
        addinfo
    }
}`;

const issue_us = gql`query Issue($issue: IssueInput!){
    issue(issue: $issue) {
        title,
        number,
        releasedate,
        editors {
            name
        },
        cover {
            url,
            artists {
                name
            }
        },
        series {
            title,
            volume,
            publisher {
                name,
                us
            }
        },
        stories {
            title,
            number,
            addinfo,
            children {
                issue {
                    number,
                    series {
                        title,
                        volume,
                        startyear,
                        endyear,
                        publisher {
                            name,
							us
                        }
                    }
                }
            },
            pencilers {
                name
            },
            writers {
                name
            },
            inkers {
                name
            },
            colourists {
                name
            },
            letterers {
                name
            },
            editors {
                name
            }
        },
        covers {
            children {
                issue {
                    number,
                    format,
                    variant,
                    series {
                        title,
                        volume,
                        startyear,
                        endyear,
                        publisher {
                            name,
                            us
                        }
                    }
                } 
            }
        },
        variants {
            format,
            variant,
            cover {
                url
            }
        },
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

export {getListQuery,
    publisher, seriesd, issue, issue_us,
    publishers, series, issues, individuals};