import gql from "graphql-tag";
import {HierarchyLevel} from "../util/hierarchy";

const search = gql`query Nodes($pattern: String!, $us: Boolean!, $offset: Int){
    nodes(pattern: $pattern, us: $us, offset: $offset) {
        type,
        label,
        url
    }
}`;

const exportQuery = gql`query Export($filter: Filter!, $type: String!){
    export(filter: $filter, type: $type)
}`;

const publishers = gql`query Publishers($pattern: String, $us: Boolean!, $offset: Int, $filter: Filter){
    publishers(pattern: $pattern, us: $us, offset: $offset, filter: $filter) {
        name,
        us
    }
}`;

const series = gql`query Series($pattern: String, $publisher: PublisherInput!, $offset: Int, $filter: Filter){
    series(pattern: $pattern, publisher: $publisher, offset: $offset, filter: $filter) {
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

const issues = gql`query Issues($pattern: String, $series: SeriesInput!, $filter: Filter){
    issues(pattern: $pattern, series: $series, filter: $filter) {
        title,
        number,
        comicguideid,
        collected,
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
        format,
        variant,
        variants {
            collected,
            variant
        }
    }
}`;

const individuals = gql`query Individuals($pattern: String, $offset: Int) {
    individuals(pattern: $pattern, offset: $offset) {
        name
    }
}`;

const apps = gql`query Apps($pattern: String, $type: String, $offset: Int) {
    apps(pattern: $pattern, type: $type, offset: $offset) {
        name,
        type
    }
}`;

const arcs = gql`query Arcs($pattern: String, $type: String, $offset: Int) {
    arcs(pattern: $pattern, type: $type, offset: $offset) {
        title,
        type
    }
}`;

export const lastEdited = gql`query LastEdited($filter: Filter, $offset: Int, $order: String, $direction: String) {
    lastEdited(filter: $filter, offset: $offset, order: $order, direction: $direction) {
        number,
        format,
        variant,
        verified,
        collected,
        title,
        createdAt,
        updatedAt,
        comicguideid,
        cover {
            url
        },
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
        stories {
            onlyapp,
            firstapp,
            onlytb,
            exclusive,
            otheronlytb,
            onlyoneprint,
            collectedmultipletimes, collected, ,
            number,
            children {
                issue { 
                    collected 
                },
                number
            },
            reprintOf {
                number
            },
            reprints {
                number
            },
            parent {
                collectedmultipletimes, collected, ,
                children {
                    issue { 
                        collected 
                    },
                    number
                }
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
            cover {
                url
            },
            comicguideid,
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
            releasedate,
            stories {
                onlyapp,
                firstapp,
                onlytb,
                exclusive,
                otheronlytb,
                onlyoneprint,
                collectedmultipletimes, collected, ,
                number,
                children {
                    parent {
                        collectedmultipletimes, collected, 
                    },
                    issue { 
                        collected 
                    },
                    number
                }  
                reprintOf {
                    number
                },
                reprints {
                    number
                },
                parent {
                    number,
                    collectedmultipletimes, collected, ,
                    children {
issue { collected },
                        number
                    }
                }
            }  
        },
        lastIssue {
            number,
            format,
            variant,
            createdAt,
            updatedAt,
            cover {
                url
            },
            comicguideid,
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
            releasedate,
            stories {
                onlyapp,
                firstapp,
                onlytb,
                exclusive,
                otheronlytb,
                onlyoneprint,
collectedmultipletimes, collected, ,
                number,
                children {
                                   parent {
                        collectedmultipletimes, collected, 
                    },
issue { collected },
                    number
                }  
                reprintOf {
                    number
                },
                reprints {
                    number
                },
                parent {
                collectedmultipletimes, collected, ,
                    number,
                    children {
issue { collected },
                        number
                    }  
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
            cover {
                url
            },
            comicguideid,
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
            releasedate,
            stories {
                onlyapp,
                firstapp,
                onlytb,
                exclusive,
                otheronlytb,
                onlyoneprint,
collectedmultipletimes, collected, ,
                number,
                children {
                                    parent {
                        collectedmultipletimes, collected, 
                    },
issue { collected },
                    number,
                }  
                reprintOf {
                    number
                },
                reprints {
                    number
                },
                parent {
                collectedmultipletimes, collected, ,
                    number,
                    children {
issue { collected },
                        number,
                    }  
                }
            }  
        },
        lastIssue {
            number,
            format,
            variant,
            createdAt,
            updatedAt,
            cover {
                url
            },
            comicguideid,
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
            releasedate,
            stories {
                onlyapp,
                firstapp,
                onlytb,
                exclusive,
                otheronlytb,
                onlyoneprint,
collectedmultipletimes, collected, ,
                number,
                children {
                                    parent {
                        collectedmultipletimes, collected, 
                    },
issue { collected },
                    number,
                }  
                reprintOf {
                    number
                },
                reprints {
                    number
                },
                parent {
                collectedmultipletimes, collected, ,
                    number,
                    children {
issue { collected },
                        number,
                    }  
                }
            }  
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
        comicguideid,
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
            part
            number,
            reprints {
                number,
                addinfo,
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
                    variant,
                    collected
                }
            },
            children {
                issue { collected },
                part,
                number,
                parent {
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
                        collected
                    }
                }
                number,
                addinfo,
                part,
                issue {
                    number,
                    title,
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
                    variant,
                    collected
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
            reprintOf {
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
                    collected,
                },
            },                                                                                         
            parent {
                title,
                number,
                collectedmultipletimes, collected, ,
                reprintOf {
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
                        collected
                    },
                },  
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
                    stories {
                        number,
                        children {
issue { collected },
                            number
                        }  
                    },
                    arcs {
                        title,
                        type
                    },
                    collected   
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
            otheronlytb,
            onlytb,
            onlyoneprint,
collectedmultipletimes, collected, ,
            exclusive
        },
        covers {
            url,
            addinfo,
            number,
            children {
issue { collected },
                number,
                addinfo,
                issue {
                    number,
                    format,
                    variant,
                    collected,
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
                    collected,
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
            stories {
                number
            },
            format,
            variant,
            number,
            comicguideid,
            collected,
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
        collected,
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

export {
    getListQuery,
    publisher, seriesd, issue, search,
    publishers, series, issues, individuals, apps, arcs, exportQuery
};
