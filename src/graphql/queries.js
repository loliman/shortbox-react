import gql from "graphql-tag";
import {HierarchyLevel} from "../util/hierarchy";

const search = gql`query Nodes($pattern: String!, $us: Boolean!){
    nodes(pattern: $pattern, us: $us) {
        type,
        label,
        url
    }
}`;

const exportQuery = gql`query Export($filter: Filter!){
    export(filter: $filter)
}`;

const publishers = gql`query Publishers($us: Boolean!, $filter: Filter){
    publishers(us: $us, filter: $filter) {
        name,
        us
    }
}`;

const series = gql`query Series($publisher: PublisherInput!, $filter: Filter){
    series(publisher: $publisher, filter: $filter) {
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

const issues = gql`query Issues($series: SeriesInput!, $filter: Filter){
    issues(series: $series, filter: $filter) {
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

const arcs = gql`query Arcs {
    arcs {
        title,
        type
    }
}`;

export const lastEdited = gql`query LastEdited($us: Boolean) {
    lastEdited(us: $us) {
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
        lastEdited {
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
            }
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
        lastEdited {
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
            mainchars {
                name,
                type,
                role
            },
            antagonists {
                name,
                type,
                role
            },
            supchars {
                name,
                type,
                role
            },
            otherchars {
                name,
                type,
                role
            },
            teams {
                name,
                type,
                role
            },
            races {
                name,
                type,
                role
            },
            animals {
                name,
                type,
                role
            },
            items {
                name,
                type,
                role
            },
            vehicles {
                name,
                type,
                role
            },
            places {
                name,
                type,
                role
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
                    variant,
                    arcs {
                        title,
                        type
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
                mainchars {
                    name,
                    type,
                    role
                },
                antagonists {
                    name,
                    type,
                    role
                },
                supchars {
                    name,
                    type,
                    role
                },
                otherchars {
                    name,
                    type,
                    role
                },
                teams {
                    name,
                    type,
                    role
                },
                races {
                    name,
                    type,
                    role
                },
                animals {
                    name,
                    type,
                    role
                },
                items {
                    name,
                    type,
                    role
                },
                vehicles {
                    name,
                    type,
                    role
                },
                places {
                    name,
                    type,
                    role
                }
            },
			translators {
				name
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
    publishers, series, issues, individuals, arcs, exportQuery};