import gql from "graphql-tag";
import {HierarchyLevel} from "../util/hierarchy";

const publishers = gql`query Publishers($us: Boolean!){
    publishers(us: $us) {
        name,
        us
    }
}`;

const series = gql`query Series($publisher: PublisherInput!){
    series(publisher: $publisher) {
        title,
        volume,
        startyear,
        endyear,
        publisher {
            name,
            us
        }
    }
}`;

const issues = gql`query Issues($series: SeriesInput!){
    issues(series: $series) {
        title,
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

export const lastEdited = gql`query LastEdited($us: Boolean) {
    lastEdited(us: $us) {
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

const issue = gql`query Issue($issue: IssueInput!, $edit: Boolean){
    issue(issue: $issue, edit: $edit) {
        title,
        number,
        format,
        limitation,
        pages,
        releasedate,
        price,
        currency,
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
        features {
            title,
            addinfo,
            number,
            writers {
                name
            }
        },
        stories {
            title,
            addinfo,
            number,
            ,
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
                    },
                    format,
                    variant
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
            },
            parent {
                number,
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
                    },
                    format,
                    variant   
                }
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
			onlyapp,
            firstapp,
            exclusive
        },
        covers {
            url,
            addinfo,
            number,
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
            },
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
                }
                artists {
                    name
                }
            }
            onlyapp,
            firstapp,
            exclusive,
            artists {
                name
            }
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
    publisher, seriesd, issue,
    publishers, series, issues, individuals};