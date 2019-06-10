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
