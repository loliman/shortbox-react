import gql from "graphql-tag";
import {HierarchyLevel} from "../util/hierarchy";

const search = gql`query Nodes($pattern: String!, $us: Boolean!, $offset: Int){
    nodes(pattern: $pattern, us: $us, offset: $offset) {
        type,
        label,
        url
    }
}`;

const exportQuery = gql`query Export($filter: Filter!){
    export(filter: $filter)
}`;

const publishers = gql`query Publishers($us: Boolean!, $offset: Int, $filter: Filter){
    publishers(us: $us, offset: $offset, filter: $filter) {
        name,
        us
    }
}`;

const series = gql`query Series($publisher: PublisherInput!, $offset: Int, $filter: Filter){
    series(publisher: $publisher, offset: $offset, filter: $filter) {
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

const issues = gql`query Issues($series: SeriesInput!, $offset: Int, $filter: Filter){
    issues(series: $series, offset: $offset, filter: $filter) {
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

const apps = gql`query Apps {
    apps {
        name,
        type
    }
}`;

const arcs = gql`query Arcs {
    arcs {
        title,
        type
    }
}`;

export const lastEdited = gql`query LastEdited($filter: Filter, $offset: Int) {
    lastEdited(filter: $filter, offset: $offset) {
        number,
        format,
        variant,
        title,
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
        startyear,
        endyear,
        seriesCount,
        issueCount,
        firstIssue {
            number,
            format,
            variant,
            createdAt,
            updatedAt,
            series {
                title,
                volume,
                publisher {
                    name
                }
            },
            releasedate
        },
        lastIssue {
            number,
            format,
            variant,
            createdAt,
            updatedAt,
            series {
                title,
                volume,
                publisher {
                    name
                }
            },
            releasedate
        },
        active,
        addinfo,
    }
}`;

const seriesd = gql`query Seriesd($series: SeriesInput!){
    seriesd(series: $series) {
        title,
        volume,
        startyear,
        endyear,
        issueCount,
        firstIssue {
            number,
            format,
            variant,
            createdAt,
            updatedAt,
            series {
                title,
                volume,
                publisher {
                    name
                }
            },
            releasedate
        },
        lastIssue {
            number,
            format,
            variant,
            createdAt,
            updatedAt,
            series {
                title,
                volume,
                publisher {
                    name
                }
            },
            releasedate
        },
        active,
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
        individuals {
            name,
            type
        }
        cover {
            url,
            individuals {
                name,
                type
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
            individuals {
                name,
                type
            }
        },
        stories {
            title,
            addinfo,
            number,
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
            individuals {
                name,
                type
            },
            appearances {
                name,
                type,
                role
            },                                                                                           
            parent {
                title,
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
                    variant,
                    arcs {
                        title,
                        type
                    }   
                },
                individuals {
                    name,
                    type
                },
                appearances {
                    name,
                    type,
                    role
                }   
            },
			onlyapp,
            firstapp,
            onlytb,
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
                },
                individuals {
                    name,
                    type
                }
            }
            onlyapp,
            firstapp,
            exclusive,
            individuals {
                name,
                type
            },
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
        arcs {
            title,
            type
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
    publisher, seriesd, issue, search,
    publishers, series, issues, individuals, apps, arcs, exportQuery};
