import gql from "graphql-tag";
import {HierarchyLevel} from "../util/hierarchy";

const login = gql`mutation Login($user: UserInput!){
    login(user: $user) {
        id,
        sessionid
    }
}`;

const logout = gql`mutation Logout($user: UserInput!){
    logout(user: $user)
}`;

const deleteIssue = gql`mutation DeleteIssue($item: IssueInput!){
    deleteIssue(item: $item)
}`;

const deleteSeries = gql`mutation DeleteSeries($item: SeriesInput!){
    deleteSeries(item: $item)
}`;

const deletePublisher = gql`mutation DeletePublisher($item: PublisherInput!){
    deletePublisher(item: $item)
}`;

const createPublisher = gql`mutation CreatePublisher($item: PublisherInput!){
   createPublisher(item: $item) {
        id,
        name,
        startyear,
        endyear,
        addinfo,
        us
   }
}`;

const createSeries = gql`mutation CreateSeries($item: SeriesInput!){
   createSeries(item: $item) {
        id,
        title,
        startyear,
        endyear,
        volume,
        addinfo,
        publisher {
            id,
            name,
            us
        }
   }
}`;

const createIssue = gql`mutation CreateIssue($item: IssueInput!){
   createIssue(item: $item) {
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
        },
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
                individuals {
                    name,
                    type
                }
            },
			individuals {
                name,
                type
            },
            onlyapp,
            firstapp,
            onlytb,
            onlyoneprint,
            exclusive,
            firstcomplete,
            firstpartly,
            firstmonochrome,
            firstcoloured,
            onlypartly,
            onlymonochrome,
            pages,
            coloured,
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
                individuals {
                    name,
                    type
                }
            }
            onlyapp,
            firstapp,
            onlytb,
            onlyoneprint,
            exclusive,
            firstcomplete,
            firstpartly,
            firstmonochrome,
            firstcoloured,
            onlypartly,
            onlymonochrome,
            individuals {
                name,
                type
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

const editIssue = gql`mutation EditIssue($old: IssueInput!, $item: IssueInput!){
   editIssue(old: $old, item: $item) {
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
            pages,
            coloured,
            children {
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
                coloured,
                pages,
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
                        number
                    },
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
            onlyoneprint,
            exclusive,
            firstcomplete,
            firstpartly,
            firstmonochrome,
            firstcoloured,
            onlypartly,
            onlymonochrome
        },
        covers {
            url,
            addinfo,
            number,
            fullsize, 
            coloured,
            children {
                addinfo,
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
            onlytb,
            onlyoneprint,
            exclusive,
            firstcomplete,
            firstpartly,
            firstmonochrome,
            firstcoloured,
            onlypartly,
            onlymonochrome,
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

const verifyIssue = gql`mutation VerifyIssue($item: IssueInput!){
   verifyIssue(item: $item) {
        id,
        number,
        series {
            id,
            title,
            startyear,
            endyear,
            volume,
            addinfo,
            publisher {
                id,
                name,
                us
            } 
        }  
   }
}`;

const editSeries = gql`mutation EditSeries($old: SeriesInput!, $item: SeriesInput!){
   editSeries(old: $old, item: $item) {
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

const editPublisher = gql`mutation EditPublisher($old: PublisherInput!, $item: PublisherInput!){
   editPublisher(old: $old, item: $item) {
        id,
        name,
        us,
        addinfo,
   }
}`;

function getDeleteMutation(level) {
    switch (level) {
        case HierarchyLevel.PUBLISHER:
            return deletePublisher;
        case HierarchyLevel.SERIES:
            return deleteSeries;
        default:
            return deleteIssue;
    }
}

export {login, logout, getDeleteMutation,
    createIssue, createSeries, createPublisher,
    editIssue, editSeries, editPublisher,
    verifyIssue}
