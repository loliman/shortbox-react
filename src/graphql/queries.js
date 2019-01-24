import gql from "graphql-tag";

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
        coverurl,
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

function getListQuery(s) {
    switch (s.length) {
        case 0:
            return publishers;
        case 1:
            return series;
        default:
            return issues;
    }
}

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
        coverurl,
        series {
            id,
            title,
            publisher {
                id, 
                us
            }
        },
        stories {
            id,
            title,
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
            firstapp
        },
        variants {
            id,
            format,
            price,
            currency,
            releasedate,
            variant,
            coverurl,
            limitation
        }
    }
}`;

export {getListQuery, issue, publishers};